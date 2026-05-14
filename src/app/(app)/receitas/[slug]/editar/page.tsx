import { notFound } from 'next/navigation';
import { getRecipeBySlug } from '@/features/recipes/actions/get-recipe';
import { RecipeForm } from '@/features/recipes/components/recipe-form';

type Props = { params: Promise<{ slug: string }> };

export default async function EditRecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const initialData = {
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary,
    story: recipe.story,
    modeOfPreparation: recipe.modeOfPreparation,
    difficulty: recipe.difficulty,
    type: recipe.type,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    suggestions: recipe.suggestions,
    notesAuthor: recipe.notesAuthor,
    notesPublic: recipe.notesPublic,
    ingredients: recipe.ingredients.map((ing) => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      originalText: ing.originalText,
    })),
    utensils: recipe.utensils.map(({ utensil }) => ({
      name: utensil.name,
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Editar receita</h1>
        <p className="mt-1 text-sm text-stone-500">{recipe.title}</p>
      </div>
      <RecipeForm mode="edit" initialData={initialData} />
    </div>
  );
}
