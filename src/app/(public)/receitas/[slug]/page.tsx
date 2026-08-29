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

      {/* CTA final — editorial, mesma linguagem da Home */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--line)', background: 'white' }}
      >
        <div className="editorial-container py-12 lg:py-16">
          <div
            className="grid items-center overflow-hidden lg:grid-cols-[1.15fr_0.85fr]"
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'var(--food-accent)',
            }}
          >
            <div className="p-8 lg:p-10">
              <p
                className="mb-3 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase"
                style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
              >
                <span
                  className="h-[2px] w-7"
                  style={{ background: 'var(--cocoa)' }}
                  aria-hidden="true"
                />
                Sua vez
              </p>
              <h2
                className="max-w-[20ch] font-display text-[clamp(2rem,4vw,2.8rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-balance"
                style={{ color: 'var(--cocoa)' }}
              >
                Queimou a panela? Ótimo.
              </h2>
              <p
                className="mt-3 max-w-[52ch] text-[1.05rem] leading-6"
                style={{ color: 'rgba(31,41,51,0.82)' }}
              >
                Toda receita boa tem uma história. Compartilhe a sua e deixe a
                IA conferir antes de ir ao ar.
              </p>
              <Link
                href="/receitas/new"
                className="button-queimando-panela mt-6 inline-flex"
                style={{ background: 'var(--cocoa)', color: 'white' }}
              >
                Publicar receita
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div
              className="hidden min-h-[280px] bg-white/40 lg:block"
              style={{ background: 'var(--muted)' }}
            >
              <div className="grid h-full place-items-center p-8 text-center">
                <p
                  className="max-w-[20ch] font-display text-lg font-bold leading-tight"
                  style={{ color: 'var(--cocoa)' }}
                >
                  Olhômetro vale
                  <br />
                  tanto quanto
                  <br />
                  gramas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
