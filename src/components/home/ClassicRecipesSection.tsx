import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

interface ClassicRecipeRow {
  type: string;
  recipes: RecipeCardData[];
}

interface ClassicRecipesSectionProps {
  rows: ClassicRecipeRow[];
}

export function ClassicRecipesSection({ rows }: ClassicRecipesSectionProps) {
  if (rows.length === 0) {
    return (
      <section className="bg-[#f5f5f5] py-16 lg:py-24">
        <div className="editorial-container">
          <div className="text-center">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
              Clássicos
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
              Clássicos que nunca saem de moda
            </h2>
            <p className="mt-4 mx-auto max-w-[48ch] font-sans text-[15px] leading-7 text-[#6b6b6b]">
              Assim que houver tipos com receitas publicadas, as categorias
              aparecem aqui.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f5f5f5] py-16 lg:py-24">
      <div className="editorial-container">
        <div className="max-w-[62ch] border-t-2 border-[#ffb900] pt-6">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
            Receitas tradicionais
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
            Sabores da nossa terra
          </h2>
          <p className="mt-3 max-w-[52ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
            Receitas que passam de geração em geração, guardando memórias e
            sabores que marcaram épocas.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((row) =>
            row.recipes.map((recipe, index) => (
              <li key={`${row.type}-${recipe.id}`}>
                <Link
                  href={`/receitas/${recipe.slug}`}
                  className="group block overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white transition-[border-color,box-shadow] hover:border-[#0a0a0a] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
                  aria-label={`Ver receita: ${recipe.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                    {recipe.coverUrl ? (
                      <Image
                        src={recipe.coverUrl}
                        alt={recipe.title}
                        fill
                        priority={index < 2}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5]">
                        <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                          Sem foto
                        </span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 bg-[#ffb900] px-2.5 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                      {row.type}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] decoration-[#ffb900] decoration-2 underline-offset-4 group-hover:underline text-wrap-balance">
                      {recipe.title}
                    </h3>
                    {recipe.summary && (
                      <p className="mt-2 line-clamp-2 font-sans text-xs leading-5 text-[#6b6b6b] text-wrap-pretty">
                        {recipe.summary}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
