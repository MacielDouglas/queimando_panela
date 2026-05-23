'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteRecipeImagesByKeys } from '@/features/recipes/server/recipe-image.service';

export async function deleteRecipe(slug: string): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Não autorizado.' };

  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        slug,
        authorId: session.user.id,
      },
      include: {
        images: true,
      },
    });

    if (!recipe) {
      return { error: 'Receita não encontrada ou sem permissão para excluir.' };
    }

    const keys = recipe.images.map((image) => image.key);

    await prisma.recipe.delete({
      where: { id: recipe.id },
    });

    if (keys.length > 0) {
      await deleteRecipeImagesByKeys(keys);
    }
  } catch (error) {
    console.error('Delete recipe error:', error);
    return { error: 'Erro ao excluir a receita. Tente novamente.' };
  }

  redirect('/receitas');
}
