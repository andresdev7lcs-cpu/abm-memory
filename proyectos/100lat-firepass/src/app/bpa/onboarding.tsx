'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import George from '@/components/avatars/George';
import { useGameStore } from '@/store/gameStore';

const cities = ['Miami', 'Los Angeles', 'Houston', 'Chicago', 'New York', 'Dallas', 'Phoenix', 'Atlanta', 'Orlando', 'San Diego'];

export default function BpaOnboarding() {
  const router = useRouter();
  const { setBPACity, setBPACheckIns } = useGameStore();
  const [city, setCity] = useState('');
  const [daily, setDaily] = useState(true);
  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto max-w-xl space-y-5">
        <George />
        <h1 className="fire-h1 text-3xl font-black">¿En qué ciudad estás?</h1>
        <select className="fire-card w-full p-3" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Selecciona una ciudad</option>
          {cities.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <label className="fire-card-soft flex items-center gap-3 p-4">
          <input type="checkbox" checked={daily} onChange={(e) => setDaily(e.target.checked)} />
          <span>Quiero chequeos diarios</span>
        </label>
        <button
          onClick={() => {
            if (!city) return;
            setBPACity(city);
            setBPACheckIns(daily);
            router.push('/bpa/tamagotchi');
          }}
          className="btn-glow-green rounded-2xl px-4 py-3 font-extrabold text-[#08111d]"
        >
          Seguir
        </button>
      </div>
    </main>
  );
}
