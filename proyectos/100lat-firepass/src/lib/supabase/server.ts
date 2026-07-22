import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { serverEnv } from '@/lib/env.server';

let supabaseServerClient: SupabaseClient | null = null;

// Cliente server-only — service_role, jamás importar desde componentes cliente.
// Usar únicamente en route handlers / server components.
export function supabaseServer(): SupabaseClient | null {
  if (!serverEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  if (!supabaseServerClient) {
    supabaseServerClient = createClient(serverEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return supabaseServerClient;
}
