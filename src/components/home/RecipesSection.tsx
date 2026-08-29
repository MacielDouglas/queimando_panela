import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

interface ClassicRecipeRow {
  type: string;
  recipes: RecipeCardData[];
}

interface RecipesSectionProps {
  rows: ClassicRecipeRow[];
}

export function RecipesSection({ rows }: RecipesSectionProps) {
  if (rows.length === 0) {
    return (
      <section className="py-[112px]">
        <div className="editorial-container">
          <div className="text-center">
            <h2 className="section-title-queimando-panela mx-auto">
              Receitas para compartilhar sem pressa.
            </h2>
            <p className="section-copy mx-auto">
              Assim que houver receitas publicadas, elas aparecem aqui com foto
              grande e leitura leve.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[112px]">
      <div className="editorial-container">
        <h2 className="section-title-queimando-panela">
          Receitas para compartilhar sem pressa.
        </h2>
        <p className="section-copy">
          Ideias práticas e cheias de sabor para aproveitar melhor cada
          ingrediente.
        </p>

        <div className="mt-[52px] grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) =>
            row.recipes.map((recipe) => (
              <article
                key={`${row.type}-${recipe.id}`}
                className="group overflow-hidden bg-white"
                style={{
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 30px rgba(24, 58, 55, 0.06)',
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '1.15 / 1' }}
                >
                  {recipe.coverUrl ? (
                    <Image
                      src={recipe.coverUrl}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{ background: 'var(--muted)' }}
                    >
                      <span
                        className="text-[0.78rem] font-bold uppercase"
                        style={{ color: 'var(--ink-muted)' }}
                      >
                        Sem foto
                      </span>
                    </div>
                  )}
                  <span
                    className="absolute left-4 top-4 px-[11px] py-[7px] text-[0.73rem] font-extrabold uppercase"
                    style={{
                      borderRadius: '999px',
                      background: 'var(--accent-e)',
                      color: 'var(--ink)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {row.type}
                  </span>
                </div>
                <div className="p-[22px]">
                  <Link href={`/receitas/${recipe.slug}`}>
                    <h3
                      className="font-display text-[1.55rem] font-bold leading-[1.1] tracking-[-0.025em]"
                      style={{ color: 'var(--forest)' }}
                    >
                      {recipe.title}
                    </h3>
                  </Link>
                  {recipe.summary && (
                    <p
                      className="mt-2 line-clamp-2 text-[0.94rem]"
                      style={{ color: 'var(--ink-muted)' }}
                    >
                      {recipe.summary}
                    </p>
                  )}
                </div>
              </article>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
