import { createClient } from '@supabase/supabase-js';
import { Lead } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveLead(lead: Lead): Promise<{ error: string | null }> {
  const { error } = await supabase.from('leads').insert([
    {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      score: lead.score,
      segment: lead.segment,
      avatar: lead.avatar,
    },
  ]);

  if (error) {
    // If duplicate email, not a hard failure — user already exists
    if (error.code === '23505') {
      return { error: null };
    }
    return { error: error.message };
  }

  return { error: null };
}
