'use client';

import Link from 'next/link';

export default function SignUpSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="editorial-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-[520px]">
            <p className="inline-flex items-center gap-2 border border-[#0a0a0a] bg-[#ffb900] px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
              <span className="size-1.5 bg-[#0a0a0a]" aria-hidden />
              Queimando Panela
            </p>
            <h2 className="mt-5 font-display text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[#0a0a0a] text-wrap-balance">
              Sua receita
              <br />
              merece existir
              <br />
              <span className="bg-[#ffb900] px-1">aqui.</span>
            </h2>
            <p className="mt-5 max-w-[48ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
              Compartilhe as receitas de família, as criativas e até as que você
              jurava que não dariam certo — mas deram. A IA confere utensílios,
              tempo e tabela por 100g; você publica com confiança.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/receitas/new"
                className="inline-flex min-h-14 items-center justify-center rounded-none border-2 border-[#0a0a0a] bg-[#0a0a0a] px-8 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ffb900] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
              >
                Quero entrar na cozinha
              </Link>
              <Link
                href="/receitas"
                className="inline-flex min-h-14 items-center justify-center rounded-none border border-[#e5e5e5] bg-white px-8 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a]"
              >
                Ver receitas
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] p-4">
            <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-5 transition-colors hover:border-[#0a0a0a]">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
                Resumo apetitoso
              </p>
              <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] text-wrap-balance">
                Cheiro, sabor e textura em palavras.
              </p>
            </div>
            <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-5 transition-colors hover:border-[#0a0a0a]">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
                Utensílios
              </p>
              <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] text-wrap-balance">
                O que você vai precisar.
              </p>
            </div>
            <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-5 transition-colors hover:border-[#0a0a0a]">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
                Tabela nutricional
              </p>
              <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] text-wrap-balance">
                Calorias por 100g.
              </p>
            </div>
            <div className="rounded-[8px] border-2 border-[#0a0a0a] bg-[#0a0a0a] p-5 text-white">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#ffb900]">
                Grátis
              </p>
              <p className="mt-2 font-display text-sm font-bold uppercase leading-tight tracking-[-0.01em] text-white text-wrap-balance">
                Sem frescura. Só receita boa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
