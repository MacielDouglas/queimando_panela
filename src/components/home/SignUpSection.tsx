'use client';

import Link from 'next/link';

export default function SignUpSection() {
  return (
    <section className="border-y-2 border-[#0a0a0a] bg-[#ffb900]">
      <div className="editorial-container grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-16 items-center">
        <div>
          <p className="inline-block border border-[#0a0a0a] bg-white px-3 py-1 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#0a0a0a]">
            Queimando Panela do dia
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] sm:text-4xl">
            Sua receita
            <br />
            merece existir
            <br />
            aqui.
          </h2>
          <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-[#0a0a0a]/80">
            Compartilhe as receitas de família, as criativas e até as que você
            jurava que não dariam certo — mas deram. Quadrado, amarelo, sem
            frescura.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center border border-[#0a0a0a] bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-[#0a0a0a]"
            >
              Quero entrar na cozinha
            </Link>
            <Link
              href="/receitas"
              className="inline-flex h-12 items-center border border-[#0a0a0a] bg-white px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
            >
              Ver receitas
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border-2 border-[#0a0a0a] bg-white p-4">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Resumo apetitoso
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight text-[#0a0a0a]">
              Cheiro, sabor e textura em palavras.
            </p>
          </div>
          <div className="border-2 border-[#0a0a0a] bg-white p-4">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Utensílios
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight text-[#0a0a0a]">
              O que você vai precisar.
            </p>
          </div>
          <div className="border-2 border-[#0a0a0a] bg-white p-4">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Tabela nutricional
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight text-[#0a0a0a]">
              Calorias por 100g.
            </p>
          </div>
          <div className="border-2 border-[#0a0a0a] bg-[#0a0a0a] p-4 text-white">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#ffb900]">
              Grátis
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase leading-tight">
              Sem frescura. Só receita boa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
