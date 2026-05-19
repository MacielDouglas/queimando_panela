import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="editorial-container flex min-h-screen items-center justify-center py-20">
      <div className="glass-card warm-shadow max-w-2xl rounded-[2.5rem] p-10 text-center">
        <div className="mb-6 text-7xl">🍳</div>

        <p className="text-2xl leading-relaxed font-bold text-neutral-800 sm:text-3xl">
          😅 Opa! Esse cheirinho não tava no cardápio… acho que a panela passou
          do ponto! 🍳🔥 Dá um pulo lá e depois aterrissa de volta na página
          principal! 🚀
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-4 text-sm font-bold text-neutral-900 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-400"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}
