import Link from 'next/link';
import Image from 'next/image';

import { Clock3, Flame, Soup, ChefHat, Search, Plus } from 'lucide-react';

import { getServerSession } from '@/lib/get-server-session';

const recipes = [
  {
    id: 1,
    title: 'Lasanha cremosa de queijo',
    category: 'Massas',
    time: '45 min',
    difficulty: 'Fácil',
    image:
      'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Frango assado com ervas',
    category: 'Carnes',
    time: '1h 10min',
    difficulty: 'Médio',
    image:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Bolo fofinho de cenoura',
    category: 'Sobremesas',
    time: '50 min',
    difficulty: 'Fácil',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Risoto de cogumelos',
    category: 'Italiano',
    time: '35 min',
    difficulty: 'Médio',
    image:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Panquecas americanas',
    category: 'Café da manhã',
    time: '20 min',
    difficulty: 'Fácil',
    image:
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Macarrão ao molho rústico',
    category: 'Massas',
    time: '30 min',
    difficulty: 'Fácil',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
  },
];

export default async function RecipesPage() {
  const session = await getServerSession();
  return (
    <main className="relative overflow-hidden pb-20">
      {/* HERO */}
      <section className="editorial-container relative pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <ChefHat className="h-4 w-4" />
                Receitas feitas por apaixonados por cozinha
              </div>

              {session?.user && (
                <Link
                  href="/receitas/nova"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-neutral-900 shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-400"
                >
                  <Plus className="h-4 w-4" />
                  Enviar nova receita
                </Link>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl leading-none font-black tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
                Receitas para aquecer a alma e a cozinha.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-neutral-600">
                Descubra pratos criados por cozinheiros amadores, receitas
                afetivas, sabores regionais e experiências gastronômicas
                compartilhadas pela comunidade.
              </p>
            </div>

            {/* search */}
            <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
              <Search className="h-5 w-5 text-amber-500" />

              <input
                type="text"
                placeholder="Busque por massas, bolos, carnes..."
                className="h-full w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* featured image */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur">
              <div className="relative aspect-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80"
                  alt="Mesa gastronômica"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* categories */}
      <section className="editorial-container mt-20">
        <div className="flex flex-wrap gap-3">
          {[
            'Massas',
            'Sobremesas',
            'Carnes',
            'Vegano',
            'Café da manhã',
            'Bolos',
            'Brasileira',
          ].map((category) => (
            <button
              key={category}
              className="rounded-full border border-amber-100 bg-white/80 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* recipes grid */}
      <section className="editorial-container mt-14">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-amber-600 uppercase">
              Receitas da comunidade
            </p>

            <h2 className="mt-3 text-4xl font-black text-neutral-900">
              Receitas em destaque
            </h2>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-neutral-600 shadow-sm backdrop-blur md:flex">
            <Flame className="h-4 w-4 text-amber-500" />
            Novas receitas toda semana
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="group overflow-hidden rounded-4xl border border-white/50 bg-white/75 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 uppercase">
                    {recipe.category}
                  </span>

                  <span className="text-sm text-neutral-500">
                    {recipe.difficulty}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl leading-tight font-black text-neutral-900 transition-colors duration-200 group-hover:text-amber-600">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {recipe.time}
                    </div>

                    <div className="flex items-center gap-2">
                      <Soup className="h-4 w-4" />
                      Receita afetiva
                    </div>
                  </div>
                </div>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition-colors hover:text-amber-500"
                >
                  Ver receita →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
