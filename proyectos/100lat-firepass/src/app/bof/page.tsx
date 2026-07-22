'use client';

import { motion } from 'framer-motion';

export default function BofPage() {
  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="fire-h1 text-4xl font-black">Tu llamada de asesoría financiera gratuita</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {['Muy claro el proceso.', 'El acompañamiento fue directo.', 'Entendí mis siguientes pasos.'].map((t) => (
            <motion.div key={t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="fire-card p-5">
              <p className="text-sm text-white/75">{t}</p>
            </motion.div>
          ))}
        </div>
        <button className="btn-glow-green rounded-2xl px-4 py-3 font-extrabold text-[#08111d]">Agendar llamada</button>
        <p className="text-xs text-white/40">Placeholder legal footer.</p>
      </div>
    </main>
  );
}
