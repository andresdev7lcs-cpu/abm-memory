import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseServer } from '@/lib/supabase/server';
import { isServerConfigured } from '@/lib/env.server';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const supabase = supabaseServer();
  if (!supabase || !isServerConfigured('SUPABASE_SERVICE_ROLE_KEY')) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  if (!body.email) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  const unlockedAt = new Date().toISOString();

  await supabase.from('leads').update({ guide_unlocked_at: unlockedAt, guide_access_token: token }).eq('email', body.email);

  const response = NextResponse.json({ ok: true, guide_access_token: token, guide_unlocked_at: unlockedAt });
  response.cookies.set('fp_guide', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
  return response;
}
