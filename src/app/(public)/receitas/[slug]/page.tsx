import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { getRecipeBySlug } from '@/features/recipes/actions/get-recipe-by-slug';
import { RecipeDetailHero } from '@/features/recipes/components/recipe-detail/RecipeDetailHero';
import { RecipeIngredients } from '@/features/recipes/components/recipe-detail/RecipeIngredients';
import { RecipeNutrition } from '@/features/recipes/components/recipe-detail/RecipeNutrition';
import { RecipeSteps } from '@/features/recipes/components/recipe-detail/RecipeSteps';
import { auth } from '@/lib/auth';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: 'Receita não encontrada',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const cover = recipe.images.find((img) => img.isCover) ?? recipe.images[0];
  const title = `${recipe.title} | Queimando Panela`;
  const description =
    recipe.summary?.slice(0, 160) ||
    `Veja a receita de ${recipe.title} no Queimando Panela.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/receitas/${recipe.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/receitas/${recipe.slug}`,
      images: cover?.url
        ? [
            {
              url: cover.url,
              alt: recipe.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: cover?.url ? [cover.url] : [],
    },
    robots: {
      index: recipe.isPublished,
      follow: recipe.isPublished,
    },
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const isAuthor = session?.user?.id === recipe.authorId;

  const types = recipe.recipeTypes.map((rt) => rt.recipeType.name);

  const cover = recipe.images.find((img) => img.isCover) ?? recipe.images[0];
  const utensils = recipe.utensils.map((u) => u.utensil.name);
  const nutritionPer100g = recipe.nutritionPer100g as
    | { nutrient: string; quantity: string }[]
    | null;

  const hasSections = recipe.sections.length > 0;

  const displaySections = hasSections
    ? recipe.sections.map((section) => ({
        name: section.name,
        ingredients: section.ingredients,
        modeOfPreparation: section.modeOfPreparation,
      }))
    : [
        {
          name: 'Receita',
          ingredients: recipe.ingredients,
          modeOfPreparation: recipe.modeOfPreparation ?? '',
        },
      ];

  return (
    <main style={{ background: 'var(--cream)' }} className="pb-0">
      {/* Breadcrumb editorial */}
      <div className="editorial-container pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs"
        >
          <Link
            href="/"
            className="transition-colors hover:opacity-80"
            style={{ color: 'var(--ink-muted)' }}
          >
            Home
          </Link>
          <span style={{ color: 'var(--line)' }}>/</span>
          <Link
            href="/receitas"
            className="transition-colors hover:opacity-80"
            style={{ color: 'var(--ink-muted)' }}
          >
            Receitas
          </Link>
          <span style={{ color: 'var(--line)' }}>/</span>
          <span className="font-bold" style={{ color: 'var(--cocoa)' }}>
            {recipe.title}
          </span>
        </nav>
      </div>

      <RecipeDetailHero
        title={recipe.title}
        summary={recipe.summary}
        types={types}
        difficulty={recipe.difficulty}
        prepTimeMinutes={recipe.prepTimeMinutes}
        cookTimeMinutes={recipe.cookTimeMinutes}
        servings={recipe.servings}
        coverUrl={cover?.url ?? null}
        authorName={recipe.author.name}
        story={recipe.story}
        isAuthor={isAuthor}
        editHref={`/receitas/${recipe.slug}/editar`}
        slug={recipe.slug}
      />

      <section className="editorial-container py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-10">
          <aside className="space-y-6 lg:sticky lg:top-[96px] lg:self-start">
            <div className="qp-reveal">
              <RecipeIngredients
                sections={displaySections}
                utensils={utensils}
              />
            </div>

            {/* Card de confiança — só aparece no desktop sticky */}
            <div
              className="hidden rounded-[var(--radius-md)] p-5 lg:block"
              style={{ background: 'var(--cocoa)', color: 'white' }}
            >
              <p
                className="text-[0.78rem] font-bold uppercase"
                style={{ color: 'var(--food-accent)', letterSpacing: '0.08em' }}
              >
                Cozinhou?
              </p>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                Publique sua versão, conte a história e deixe a IA conferir. Sua
                panela também merece memória.
              </p>
              <Link
                href="/receitas/new"
                className="button-queimando-panela button-primary-queimando-panela mt-4 w-full"
              >
                Publicar minha versão
              </Link>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="qp-reveal">
              <RecipeSteps sections={displaySections} />
            </div>
            <RecipeNutrition
              summary={recipe.nutritionSummary}
              per100g={nutritionPer100g}
              suggestions={recipe.suggestions}
            />
          </div>
        </div>
      </section>

      {/* CTA final — SUA VEZ: delight + bolder + layout + colorize */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--line)', background: 'white' }}
      >
        <div className="editorial-container py-12 lg:py-16">
          <div
            className="group relative grid overflow-hidden lg:grid-cols-[1.38fr_0.62fr]"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
              background: 'var(--food-accent)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* delight: leve textura radial pontual, sem stripes/grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                background:
                  'radial-gradient(circle at 18% 22%, var(--cocoa) 0 1px, transparent 1.2px), radial-gradient(circle at 72% 78%, var(--cocoa) 0 1px, transparent 1.2px)',
                backgroundSize: '28px 28px',
              }}
              aria-hidden="true"
            />

            {/* Left — bolder hierarchy + layout rhythm */}
            <div className="relative flex flex-col gap-5 p-[clamp(24px,5vw,48px)] lg:p-[clamp(28px,4vw,56px)] lg:pr-10">
              <p
                className="inline-flex items-center gap-2.5 text-[0.72rem] font-bold uppercase"
                style={{ color: 'var(--cocoa)', letterSpacing: '0.14em' }}
              >
                <span
                  className="grid size-7 place-items-center rounded-full bg-white"
                  style={{
                    border: '1px solid var(--line)',
                    color: 'var(--cocoa)',
                  }}
                  aria-hidden="true"
                >
                  <span className="text-[0.7rem] leading-none transition-transform duration-300 group-hover:rotate-12">
                    ✦
                  </span>
                </span>
                Sua vez
                <span
                  className="h-px w-8"
                  style={{ background: 'var(--cocoa)', opacity: 0.2 }}
                  aria-hidden="true"
                />
                <span
                  className="hidden rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-extrabold uppercase sm:inline-flex"
                  style={{
                    border: '1px solid var(--line)',
                    color: 'var(--ink-muted)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Panela &gt; perfeição
                </span>
              </p>

              <h2
                className="max-w-[14ch] font-display font-extrabold leading-[0.85] tracking-[-0.045em] text-balance"
                style={{
                  color: 'var(--cocoa)',
                  fontSize: 'clamp(2.6rem, 5.2vw, 3.9rem)',
                }}
              >
                Queimou
                <br />a panela?
                <br />
                <em
                  className="font-display font-normal italic"
                  style={{ color: 'var(--cocoa)', letterSpacing: '-0.03em' }}
                >
                  Ótimo.
                </em>
              </h2>

              <p
                className="max-w-[46ch] text-[1.04rem] leading-[1.65]"
                style={{ color: 'rgba(58,36,24,0.78)', textWrap: 'pretty' }}
              >
                Toda mancha de molho guarda história. Compartilhe a sua com
                medidas de olhômetro — a IA confere utensílios, tempo e nutrição
                antes de publicar.
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Link
                  href="/receitas/new"
                  className="button-queimando-panela group/btn"
                  style={{ background: 'var(--cocoa)', color: 'white' }}
                >
                  Publicar receita
                  <span
                    className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href="/receitas"
                  className="inline-flex min-h-11 items-center gap-1.5 px-4 text-sm font-bold"
                  style={{ color: 'var(--cocoa)' }}
                >
                  Explorar receitas
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>

              <p
                className="inline-flex items-center gap-2 text-xs"
                style={{ color: 'rgba(58,36,24,0.6)' }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: 'var(--cocoa)' }}
                  aria-hidden="true"
                />
                Leva 2 min • rascunho editável • IA co-piloto
              </p>
            </div>

            {/* Right — layout dedicado + colorize committed + delight artifact */}
            <div
              className="relative hidden min-h-[380px] flex-col justify-between overflow-hidden p-6 lg:flex"
              style={{ background: 'var(--cocoa)', color: 'white' }}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-[0.08]"
                style={{ background: 'var(--food-accent)' }}
                aria-hidden="true"
              />

              {/* Polaroid delight artifact */}
              <div className="relative mx-auto w-full max-w-[280px] flex-1 content-center">
                <div
                  className="relative rotate-[-1.5deg] bg-white p-3 pb-8 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:rotate-[-0.5deg] group-hover:shadow-lg"
                  style={{
                    borderRadius: '14px',
                    border: '1px solid var(--line)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                  }}
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{
                      borderRadius: '10px',
                      background: 'var(--muted)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div className="absolute inset-0 grid place-items-center gap-2 p-4 text-center">
                      <span
                        className="rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-extrabold uppercase"
                        style={{
                          border: '1px solid var(--line)',
                          color: 'var(--cocoa)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Arroz da Dona Cida
                      </span>
                      <p
                        className="font-display text-sm font-bold leading-tight"
                        style={{ color: 'var(--cocoa)' }}
                      >
                        2 xícaras de
                        <br />
                        colher de pau
                      </p>
                      <span
                        className="text-[0.7rem]"
                        style={{ color: 'var(--ink-muted)' }}
                      >
                        + 1 pitada de história
                      </span>
                    </div>
                  </div>
                  <p
                    className="mt-3 text-center font-display text-[0.82rem] font-semibold italic leading-tight"
                    style={{ color: 'var(--cocoa)' }}
                  >
                    “Minha mãe media no olho — e sempre dava certo.”
                  </p>
                  <span
                    className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full text-[0.7rem] font-bold shadow-sm"
                    style={{
                      background: 'var(--food-accent)',
                      color: 'var(--cocoa)',
                      border: '1px solid var(--line)',
                    }}
                    aria-hidden="true"
                  >
                    ♡
                  </span>
                </div>

                {/* delight: floating badge — committed yellow + cocoa */}
                <div
                  className="qp-badge-float absolute -right-1 bottom-2 hidden rotate-[9deg] items-center gap-1 rounded-full border bg-white px-3 py-1.5 text-xs font-bold shadow-sm lg:inline-flex"
                  style={{
                    borderColor: 'var(--line)',
                    color: 'var(--cocoa)',
                  }}
                  aria-hidden="true"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: 'var(--food-accent)' }}
                  />
                  olhômetro aprovado
                </div>
              </div>

              <div
                className="relative mt-4 flex items-center justify-between gap-3 border-t pt-4 text-xs"
                style={{ borderColor: 'rgba(255,255,255,0.14)' }}
              >
                <p
                  className="font-display text-sm font-bold leading-tight"
                  style={{ color: 'white' }}
                >
                  Olhômetro vale
                  <br />
                  tanto quanto gramas.
                </p>
                <span
                  className="shrink-0 rounded-full bg-white px-3 py-1 text-[0.7rem] font-extrabold uppercase"
                  style={{
                    color: 'var(--cocoa)',
                    letterSpacing: '0.06em',
                  }}
                >
                  100% histórias reais
                </span>
              </div>
            </div>
          </div>

          {/* Mobile delight fallback — layout rhythm keeps meaning when right col hidden */}
          <p
            className="flex items-center justify-center gap-2 border-t py-4 text-center text-xs font-bold uppercase lg:hidden"
            style={{
              borderColor: 'rgba(58,36,24,0.12)',
              color: 'var(--cocoa)',
              letterSpacing: '0.08em',
            }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ background: 'var(--cocoa)' }}
              aria-hidden="true"
            />
            Olhômetro vale tanto quanto gramas
          </p>
        </div>
      </section>
    </main>
  );
}
