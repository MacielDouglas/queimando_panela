'use client';

import Link from 'next/link';

export default function SignUpSection() {
  return (
    <section className="border-y border-[#e5e5e5] bg-white">
      <div className="editorial-container grid items-center gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div className="max-w-[62ch]">
          <p className="inline-flex items-center gap-2 border border-[#0a0a0a] bg-[#ffb900] px-2.5 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
            <span className="size-1.5 bg-[#0a0a0a]" aria-hidden />
            Queimando Panela — IA co-piloto
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[#0a0a0a] sm:text-4xl text-wrap-balance">
            Sua receita
            <br />
            merece existir
            <br />
            <span className="bg-[#ffb900] px-1">aqui.</span>
          </h2>
          <p className="mt-4 max-w-[56ch] font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
            Compartilhe as receitas de família, as criativas e até as que você
            jurava que não dariam certo — mas deram. A IA confere utensílios,
            tempo e tabela por 100g; você publica com confiança.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="inline-flex min-h-12 items-center justify-center rounded-none border-2 border-[#0a0a0a] bg-[#0a0a0a] px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
            >
              Quero entrar na cozinha
            </Link>
            <Link
              href="/receitas"
              className="inline-flex min-h-12 items-center justify-center rounded-none border border-[#e5e5e5] bg-white px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a]"
            >
              Ver receitas
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] p-3">
          <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-4 transition-colors hover:border-[#0a0a0a]">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Resumo apetitoso
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] text-wrap-balance">
              Cheiro, sabor e textura em palavras.
            </p>
          </div>
          <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-4 transition-colors hover:border-[#0a0a0a]">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Utensílios
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] text-wrap-balance">
              O que você vai precisar.
            </p>
          </div>
          <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-4 transition-colors hover:border-[#0a0a0a]">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Tabela nutricional
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] text-wrap-balance">
              Calorias por 100g.
            </p>
          </div>
          <div className="rounded-[8px] border-2 border-[#0a0a0a] bg-[#0a0a0a] p-4 text-white">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#ffb900]">
              Grátis
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-white text-wrap-balance">
              Sem frescura. Só receita boa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
