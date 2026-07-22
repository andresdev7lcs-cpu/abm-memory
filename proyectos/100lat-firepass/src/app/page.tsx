'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Charlie from '@/components/avatars/Charlie';
import ClientOnly from '@/components/guards/ClientOnly';
import { useGameStore } from '@/store/gameStore';
import { readUtmParams } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase/client';

function HomeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { email, name, setEmail, setName, setUTMs, utmSource, utmMedium, utmCampaign, utmContent } = useGameStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const utms = readUtmParams(new URLSearchParams(params.toString()));
    if (utms.source || utms.medium || utms.campaign || utms.content) setUTMs(utms);
  }, [params, setUTMs]);

  const canContinue = Boolean(email.trim() && name.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canContinue || submitting) return;
    setSubmitting(true);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('leads').upsert(
        {
          name,
          email,
          source: 'tof_entry',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
        },
        { onConflict: 'email' }
      );
    }

    router.push('/game/screen2');
  }

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-6">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Charlie />
          <p className="mt-4 text-xs font-bold tracking-[0.3em] text-[#ffd166] uppercase">FIRE PASS™</p>
          <h1 className="fire-h1 mt-3 text-3xl font-black leading-tight">100 Latinos en USA dijeron…</h1>
          <p className="fire-body mt-2 text-sm text-white/75">¿Estás dentro del promedio… o dentro del 1%?</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="fire-card p-5"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-white/60">Nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 outline-none fire-body"
                placeholder="Tu nombre"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-white/60">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 outline-none fire-body"
                placeholder="correo@ejemplo.com"
              />
            </label>
            <button
              type="submit"
              disabled={!canContinue || submitting}
              className="btn-glow-green w-full rounded-2xl px-4 py-3 font-extrabold text-[#08111d] disabled:opacity-40"
            >
              JUGAR AHORA
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <ClientOnly>
      <HomeContent />
    </ClientOnly>
  );
}
