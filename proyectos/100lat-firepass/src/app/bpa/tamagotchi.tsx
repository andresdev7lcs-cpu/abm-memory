import Link from 'next/link';

export default function Tamagotchi() {
  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col justify-center gap-4">
        <h1 className="fire-h1 text-3xl font-black">Tu tablero está listo</h1>
        <p className="text-white/75">Aquí vive el flujo principal de BPA. El onboarding ya deja la ciudad y la rutina diaria guardadas.</p>
        <Link href="/bpa" className="btn-glow-green inline-flex w-fit rounded-2xl px-4 py-3 font-extrabold text-[#08111d]">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
