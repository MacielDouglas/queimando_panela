import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteRecipeAction } from '@/features/recipes/actions/delete-recipe';
import { prisma } from '@/lib/__mocks__/prisma';
import { getServerSession } from '@/lib/get-server-session';
import { safeDeleteRecipeImage } from '@/features/recipes/server/recipe-image.service';

vi.mock('@/lib/prisma');
vi.mock('@/lib/get-server-session');
vi.mock('@/features/recipes/server/recipe-image.service', () => ({
  safeDeleteRecipeImage: vi.fn(),
}));

const mockSession = {
  user: { id: 'user-123', email: 'test@queimandopanela.com', name: 'Tester' },
};

const mockRecipe = {
  id: 'recipe-123',
  authorId: 'user-123',
  images: [
    { id: 'img-1', key: 'recipes/recipe-123/cover-1.webp' },
    { id: 'img-2', key: 'recipes/recipe-123/cover-2.webp' },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getServerSession).mockResolvedValue(mockSession as never);
  prisma.recipe.findUnique.mockResolvedValue(mockRecipe as never);
  prisma.recipe.delete.mockResolvedValue({ id: 'recipe-123' } as never);
});

describe('deleteRecipeAction', () => {
  it('lança erro se sessão não existir', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null as never);

    await expect(deleteRecipeAction('recipe-123')).rejects.toThrow(
      'Sua sessão expirou. Entre novamente.',
    );

    expect(prisma.recipe.delete).not.toHaveBeenCalled();
  });

  it('lança erro se receita não existir', async () => {
    prisma.recipe.findUnique.mockResolvedValue(null as never);

    await expect(deleteRecipeAction('recipe-123')).rejects.toThrow('Receita não encontrada.');
  });

  it('lança erro se usuário não for autor', async () => {
    prisma.recipe.findUnique.mockResolvedValue({
      ...mockRecipe,
      authorId: 'other-user',
    } as never);

    await expect(deleteRecipeAction('recipe-123')).rejects.toThrow(
      'Você não tem permissão para excluir esta receita.',
    );
  });

  it('deleta a receita e remove imagens do storage', async () => {
    await expect(deleteRecipeAction('recipe-123')).rejects.toThrow('NEXT_REDIRECT:/receitas');

    expect(prisma.recipe.delete).toHaveBeenCalledWith({
      where: { id: 'recipe-123' },
    });

    expect(safeDeleteRecipeImage).toHaveBeenCalledTimes(2);
    expect(safeDeleteRecipeImage).toHaveBeenNthCalledWith(1, 'recipes/recipe-123/cover-1.webp');
    expect(safeDeleteRecipeImage).toHaveBeenNthCalledWith(2, 'recipes/recipe-123/cover-2.webp');
  });

  it('redireciona mesmo quando não há imagens', async () => {
    prisma.recipe.findUnique.mockResolvedValue({
      ...mockRecipe,
      images: [],
    } as never);

    await expect(deleteRecipeAction('recipe-123')).rejects.toThrow('NEXT_REDIRECT:/receitas');

    expect(safeDeleteRecipeImage).not.toHaveBeenCalled();
  });
});
