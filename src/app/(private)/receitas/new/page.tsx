import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { RecipeEditorLayout } from '@/features/recipes/components/recipe-editor/RecipeEditorLayout';
import { RecipeFormShell } from '@/features/recipes/components/recipe-form/RecipeFormShell';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Nova receita',
  description: 'Crie uma nova receita e revise os dados antes de salvar.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewRecipePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect('/login');

  return (
    <RecipeEditorLayout
      eyebrow="Nova receita"
      title="Compartilhe sua receita"
      description="Escreva sua receita, revise a sugestão da IA e ajuste tudo antes de salvar."
    >
      <RecipeFormShell mode="create" />
    </RecipeEditorLayout>
  );
}
