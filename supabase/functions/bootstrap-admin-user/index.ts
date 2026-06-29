import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BOOTSTRAP_TOKEN = 'bootstrap-admin-2026-06-23-v2'

interface BootstrapRequest {
  token?: string
  email?: string
  password?: string
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase environment variables are missing')
    }

    const body = (await request.json()) as BootstrapRequest
    const token = body.token?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password?.trim()

    if (token !== BOOTSTRAP_TOKEN) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!email || !password || password.length < 6) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: userList, error: listError } = await adminClient.auth.admin.listUsers()

    if (listError) {
      throw listError
    }

    const existingUser = userList.users.find((candidate) => candidate.email?.toLowerCase() === email)

    let userId = existingUser?.id

    if (existingUser) {
      const { error: updateError } = await adminClient.auth.admin.updateUserById(existingUser.id, {
        password,
        email_confirm: true,
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User',
          full_name: 'Admin User',
        },
      })

      if (updateError) {
        throw updateError
      }
    } else {
      const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User',
          full_name: 'Admin User',
        },
      })

      if (createError || !createdUser.user) {
        throw createError ?? new Error('Failed to create admin user')
      }

      userId = createdUser.user.id
    }

    if (!userId) {
      throw new Error('Could not resolve user id')
    }

    const { error: profileError } = await adminClient
      .from('user_profiles')
      .upsert({
        id: userId,
        email,
        first_name: 'Admin',
        last_name: 'User',
        status: 'approved',
        approved_at: new Date().toISOString(),
      })

    if (profileError) {
      throw profileError
    }

    const { error: adminError } = await adminClient
      .from('admins')
      .upsert({
        id: userId,
        email,
      })

    if (adminError) {
      throw adminError
    }

    return new Response(JSON.stringify({ success: true, email, userId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})