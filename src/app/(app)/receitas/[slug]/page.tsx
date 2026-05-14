import { notFound } from 'next/navigation';
import { getRecipeBySlug } from '@/features/recipes/actions/get-recipe';
import { RecipeDetailView } from '@/features/recipes/components/recipe-detail-view';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.summary ?? `Receita de ${recipe.title}`,
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();
  return <RecipeDetailView recipe={recipe} />;
}
