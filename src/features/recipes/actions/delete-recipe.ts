'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/get-server-session';
import { redirect } from 'next/navigation';
import { safeDeleteRecipeImage } from '@/features/recipes/server/recipe-image.service';

export async function deleteRecipeAction(recipeId: string) {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Sua sessão expirou. Entre novamente.');
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { images: true },
  });

  if (!recipe) {
    throw new Error('Receita não encontrada.');
  }

  if (recipe.authorId !== session.user.id) {
    throw new Error('Você não tem permissão para excluir esta receita.');
  }

  const imageKeys = recipe.images.map((image) => image.key);

  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  await Promise.all(imageKeys.map((key) => safeDeleteRecipeImage(key)));

  redirect('/receitas');
}
