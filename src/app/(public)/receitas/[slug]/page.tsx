import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

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

  console.log(recipe);

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
    <main className="bg-neutral-50 pt-24 pb-20 text-neutral-900">
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
      <section className="editorial-container py-8 sm:py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <RecipeIngredients sections={displaySections} utensils={utensils} />
          </aside>

          <div className="space-y-8">
            <RecipeSteps sections={displaySections} />
            <RecipeNutrition
              summary={recipe.nutritionSummary}
              per100g={nutritionPer100g}
              suggestions={recipe.suggestions}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
