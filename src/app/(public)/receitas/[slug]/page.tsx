import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { RecipeDetailHero } from '@/features/recipes/components/recipe-detail/RecipeDetailHero';
import { RecipeIngredients } from '@/features/recipes/components/recipe-detail/RecipeIngredients';
import { RecipeSteps } from '@/features/recipes/components/recipe-detail/RecipeSteps';
import { RecipeNutrition } from '@/features/recipes/components/recipe-detail/RecipeNutrition';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getRecipe(slug: string) {
  return prisma.recipe.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      images: { orderBy: { order: 'asc' } },
      sections: {
        orderBy: { order: 'asc' },
        include: {
          ingredients: { orderBy: { order: 'asc' } },
        },
      },
      ingredients: {
        where: { sectionId: null },
        orderBy: { order: 'asc' },
      },
      utensils: {
        include: { utensil: true },
      },
    },
  });
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) notFound();

  const cover = recipe.images.find((img) => img.isCover) ?? recipe.images[0];
  const utensils = recipe.utensils.map((u) => u.utensil.name);

  // Monta seções para exibição
  const hasSections = recipe.sections.length > 0;

  const displaySections = hasSections
    ? recipe.sections.map((s) => ({
        name: s.name,
        ingredients: s.ingredients,
        modeOfPreparation: s.modeOfPreparation,
      }))
    : [
        {
          name: 'Receita',
          ingredients: recipe.ingredients,
          modeOfPreparation: recipe.modeOfPreparation ?? '',
        },
      ];

  const nutritionPer100g = recipe.nutritionPer100g as
    | { nutrient: string; quantity: string }[]
    | null;

  return (
    <main className="pb-32">
      <RecipeDetailHero
        title={recipe.title}
        summary={recipe.summary}
        type={recipe.type}
        difficulty={recipe.difficulty}
        prepTimeMinutes={recipe.prepTimeMinutes}
        cookTimeMinutes={recipe.cookTimeMinutes}
        servings={recipe.servings}
        coverUrl={cover?.url ?? null}
        authorName={recipe.author.name}
      />

      <section className="editorial-container mt-16">
        <div className="grid gap-12 lg:grid-cols-[340px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-8">
            <RecipeIngredients sections={displaySections} utensils={utensils} />
            <RecipeNutrition
              summary={recipe.nutritionSummary}
              per100g={nutritionPer100g}
              suggestions={recipe.suggestions}
            />
          </aside>

          {/* Conteúdo principal */}
          <div>
            <RecipeSteps sections={displaySections} story={recipe.story} />
          </div>
        </div>
      </section>
    </main>
  );
}
