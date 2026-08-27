'use client';

import Link from 'next/link';

const pillars = [
  {
    title: 'Panela no fogo',
    desc: 'Receitas testadas na cozinha de casa. Ingredientes acessíveis.',
  },
  {
    title: 'História à mesa',
    desc: 'Cada receita carrega uma memória que merece ser lembrada.',
  },
  {
    title: 'Comunidade',
    desc: 'Sua receita pode ser o que alguém procura hoje.',
  },
];

const categories = [
  { name: 'Prato principal', desc: 'O que sustenta a família' },
  { name: 'Sobremesa', desc: 'Doce com chave de ouro' },
  { name: 'Café da manhã', desc: 'Gosto de caseiro' },
  { name: 'Acompanhamento', desc: 'O extra que faz diferença' },
];

export default function OtherProjects() {
  return (
    <section className="border-t border-[#e5e5e5] bg-[#f5f5f5]">
      <div className="editorial-container py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.85fr]">
          <div>
            <p className="inline-flex items-center gap-2 bg-white px-2.5 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a] ring-1 ring-[#e5e5e5]">
              <span className="size-1.5 bg-[#ffb900]" aria-hidden />
              Queimando Panela
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[#0a0a0a] sm:text-4xl text-wrap-balance">
              A cozinha é
              <br />
              <span className="bg-[#ffb900] px-1">de todo mundo.</span>
            </h2>
            <p className="mt-4 max-w-[56ch] font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
              Caderno de receitas vivo — gente real compartilhando pratos que
              merecem ser lembrados. Sem algoritmo, sem anúncio no meio da
              frase.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="inline-flex min-h-12 items-center justify-center rounded-none border-2 border-[#0a0a0a] bg-[#ffb900] px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
              >
                Compartilhar receita
              </Link>
              <Link
                href="/receitas"
                className="inline-flex min-h-12 items-center justify-center rounded-none border border-[#e5e5e5] bg-white px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900]"
              >
                Explorar receitas
              </Link>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {pillars.map((p) => (
                <li
                  key={p.title}
                  className="group rounded-[12px] border border-[#e5e5e5] bg-white p-4 transition-colors hover:border-[#0a0a0a] hover:shadow-sm"
                >
                  <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a]">
                    {p.title}
                  </h3>
                  <p className="mt-2 font-sans text-xs leading-5 text-[#6b6b6b] text-wrap-pretty">
                    {p.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white">
            <div className="border-b border-[#e5e5e5] bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 bg-[#ffb900]" aria-hidden />
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                  Categorias
                </p>
              </div>
              <p className="mt-2 font-sans text-xs leading-5 text-[#6b6b6b]">
                Quatro entradas rápidas para começar com gosto.
              </p>
            </div>
            <ul>
              {categories.map((cat) => (
                <li
                  key={cat.name}
                  className="border-b border-[#e5e5e5] last:border-0"
                >
                  <Link
                    href={`/receitas?categoria=${encodeURIComponent(cat.name)}`}
                    className="group flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:bg-[#f5f5f5]"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-sm font-extrabold uppercase tracking-[-0.01em] text-[#0a0a0a]">
                        {cat.name}
                      </p>
                      <p className="font-sans text-xs leading-5 text-[#6b6b6b] text-wrap-pretty">
                        {cat.desc}
                      </p>
                    </div>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#e5e5e5] bg-white font-display text-xs font-extrabold text-[#0a0a0a] transition-colors group-hover:border-[#0a0a0a] group-hover:bg-[#ffb900]">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-[#0a0a0a] px-5 py-3">
              <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-white">
                Toda receita passa por análise{' '}
                <span className="text-[#ffb900]">
                  — utensílios, tempo, nutrição
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
