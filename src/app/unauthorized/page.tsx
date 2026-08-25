import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-dvh bg-white grid place-items-center p-6">
      <div className="w-full max-w-xl border-2 border-[#0a0a0a] bg-white">
        <div className="p-8">
          <p className="inline-block bg-[#0a0a0a] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#ffb900]">
            Acesso restrito
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#0a0a0a]">
            Sem permissão para acessar.
          </h1>
          <p className="mt-3 max-w-lg border-l border-[#e5e5e5] pl-3 font-sans text-sm leading-6 text-[#6b6b6b]">
            Faça login com conta válida ou volte para as receitas públicas —
            quadrado e amarelo.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/sign-in"
              className="grid h-12 place-items-center border-2 border-[#0a0a0a] bg-[#ffb900] font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="/"
              className="grid h-12 place-items-center border-2 border-[#0a0a0a] bg-white font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
