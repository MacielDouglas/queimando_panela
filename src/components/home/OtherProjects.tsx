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
    <section className="bg-white">
      <div className="editorial-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-block bg-[#0a0a0a] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Estapar Panelinha
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] sm:text-4xl">
              A cozinha é
              <br />
              <span className="bg-[#ffb900] px-1">de todo mundo.</span>
            </h2>
            <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-[#6b6b6b]">
              Caderno de receitas vivo — gente real compartilhando pratos que
              merecem ser lembrados.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center border-2 border-[#0a0a0a] bg-[#ffb900] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
              >
                Compartilhar receita
              </Link>
              <Link
                href="/receitas"
                className="inline-flex h-12 items-center border border-[#e5e5e5] bg-white px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:border-[#0a0a0a]"
              >
                Explorar
              </Link>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {pillars.map((p) => (
                <li
                  key={p.title}
                  className="border border-[#e5e5e5] bg-white p-4 hover:border-[#0a0a0a]"
                >
                  <h3 className="font-display text-sm font-extrabold uppercase leading-tight text-[#0a0a0a]">
                    {p.title}
                  </h3>
                  <p className="mt-2 font-sans text-xs leading-5 text-[#6b6b6b]">
                    {p.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="border-2 border-[#0a0a0a] bg-white p-0">
            <div className="border-b-2 border-[#0a0a0a] bg-[#0a0a0a] px-4 py-3">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffb900]">
                Categorias
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
                    className="flex items-center justify-between gap-3 px-4 py-4 hover:bg-[#ffb900]"
                  >
                    <div>
                      <p className="font-display text-sm font-extrabold uppercase text-[#0a0a0a]">
                        {cat.name}
                      </p>
                      <p className="font-sans text-xs text-[#6b6b6b]">
                        {cat.desc}
                      </p>
                    </div>
                    <span className="size-8 border border-[#0a0a0a] bg-white grid place-items-center font-display text-xs font-extrabold">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-[#ffb900] px-4 py-3">
              <p className="font-display text-xs font-extrabold uppercase text-[#0a0a0a]">
                Toda receita passa por análise
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
