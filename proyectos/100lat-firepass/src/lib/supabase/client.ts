import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env, isConfigured } from '@/lib/env';

let supabaseClient: SupabaseClient | null = null;

// Cliente browser — solo anon key, nunca service_role.
export function getSupabase(): SupabaseClient | null {
  if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL') || !isConfigured('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }

  return supabaseClient;
}
