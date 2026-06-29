import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ADMIN_EMAILS = [
  'roeyretner1@gmail.com',
  'landl.accessability@gmail.com',
]

interface ResetPasswordRequest {
  userId?: string
  email?: string
  newPassword?: string
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const authHeader = request.headers.get('Authorization')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase environment variables are missing')
    }

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim()

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Missing access token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const {
      data: { user },
      error: userError,
    } = await adminClient.auth.getUser(accessToken)

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let isAdmin = Boolean(user.email && ADMIN_EMAILS.includes(user.email))

    if (!isAdmin) {
      const { data: adminRecord, error: adminError } = await adminClient
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (adminError) {
        throw adminError
      }

      isAdmin = Boolean(adminRecord)
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await request.json()) as ResetPasswordRequest
    const targetUserId = body.userId?.trim()
    const targetEmail = body.email?.trim().toLowerCase()
    const newPassword = body.newPassword?.trim()

    if (!targetUserId && !targetEmail) {
      return new Response(JSON.stringify({ error: 'Missing target user' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!newPassword || newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let resolvedUserId = targetUserId

    if (!resolvedUserId && targetEmail) {
      const { data: profiles, error: profileError } = await adminClient
        .from('user_profiles')
        .select('id')
        .eq('email', targetEmail)
        .limit(1)

      if (profileError) {
        throw profileError
      }

      resolvedUserId = profiles?.[0]?.id
    }

    if (!resolvedUserId) {
      return new Response(JSON.stringify({ error: 'Target user not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error: updateError } = await adminClient.auth.admin.updateUserById(resolvedUserId, {
      password: newPassword,
    })

    if (updateError) {
      throw updateError
    }

    return new Response(JSON.stringify({ success: true, userId: resolvedUserId }), {
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