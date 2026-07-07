import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAsGuest = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    return { data, error };
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const isGuest = user?.is_anonymous === true;
  const metadata = {
    ...(user?.app_metadata ?? {}),
    ...(user?.user_metadata ?? {}),
  } as Record<string, unknown>;
  const roles = Array.isArray(metadata.roles) ? metadata.roles : [];
  const isAdmin =
    metadata.role === 'admin' ||
    metadata.is_admin === true ||
    roles.includes('admin');
  const isApproved =
    isAdmin ||
    metadata.status === 'approved' ||
    metadata.approved === true ||
    metadata.is_approved === true;

  return {
    user,
    session,
    loading,
    isGuest,
    isAdmin,
    isApproved,
    signInAsGuest,
    signInWithPassword,
    signUp,
    signOut,
  };
}
