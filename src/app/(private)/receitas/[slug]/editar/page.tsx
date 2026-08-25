import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getEditableRecipeBySlug } from '@/features/recipes/actions/get-editable-recipe-by-slug';
import { RecipeEditorLayout } from '@/features/recipes/components/recipe-editor/RecipeEditorLayout';
import { RecipeFormShell } from '@/features/recipes/components/recipe-form/RecipeFormShell';
import { auth } from '@/lib/auth';

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: 'Editar receita',
  description: 'Edite sua receita com segurança antes de publicar.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditRecipePage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const { slug } = await params;
  const recipe = await getEditableRecipeBySlug(slug, session.user.id);

  if (!recipe) notFound();

  return (
    <RecipeEditorLayout
      eyebrow="Editar receita"
      title={`Editar: ${recipe.title}`}
      description="Ajuste conteúdo, estrutura e dados sugeridos antes de salvar a nova versão."
    >
      <RecipeFormShell mode="edit" initialData={recipe} />
    </RecipeEditorLayout>
  );
}
