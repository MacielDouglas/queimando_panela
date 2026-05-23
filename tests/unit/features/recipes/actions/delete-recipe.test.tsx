import { beforeEach, describe, expect, it, vi } from 'vitest';

const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const headersMock = vi.fn();
const getSessionMock = vi.fn();

const findFirstMock = vi.fn();
const deleteMock = vi.fn();
const deleteRecipeImagesByKeysMock = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirectMock(url),
}));

vi.mock('next/headers', () => ({
  headers: () => headersMock(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (args: unknown) => getSessionMock(args),
    },
  },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findFirst: (...args: unknown[]) => findFirstMock(...args),
      delete: (...args: unknown[]) => deleteMock(...args),
    },
  },
}));

vi.mock('@/features/recipes/server/recipe-image.service', () => ({
  deleteRecipeImagesByKeys: (...args: unknown[]) =>
    deleteRecipeImagesByKeysMock(...args),
}));

import { deleteRecipe } from '@/features/recipes/actions/delete-recipe';

describe('deleteRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it('retorna erro quando não há sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await deleteRecipe('bolo-de-milho');

    expect(result).toEqual({ error: 'Não autorizado.' });
  });

  it('retorna erro quando a receita não existe', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    findFirstMock.mockResolvedValue(null);

    const result = await deleteRecipe('bolo-de-milho');

    expect(result).toEqual({
      error: 'Receita não encontrada ou sem permissão para excluir.',
    });
  });

  it('exclui receita sem imagens e redireciona', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    findFirstMock.mockResolvedValue({
      id: 'recipe-1',
      images: [],
    });
    deleteMock.mockResolvedValue({});

    await expect(deleteRecipe('bolo-de-milho')).rejects.toThrow(
      'NEXT_REDIRECT:/receitas',
    );

    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 'recipe-1' },
    });
    expect(deleteRecipeImagesByKeysMock).not.toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith('/receitas');
  });

  it('exclui imagens do storage quando existirem keys', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    findFirstMock.mockResolvedValue({
      id: 'recipe-1',
      images: [{ key: 'a.webp' }, { key: 'b.webp' }],
    });
    deleteMock.mockResolvedValue({});

    await expect(deleteRecipe('bolo-de-milho')).rejects.toThrow(
      'NEXT_REDIRECT:/receitas',
    );

    expect(deleteRecipeImagesByKeysMock).toHaveBeenCalledWith([
      'a.webp',
      'b.webp',
    ]);
  });

  it('retorna erro quando ocorre exceção', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    findFirstMock.mockRejectedValue(new Error('db error'));

    const result = await deleteRecipe('bolo-de-milho');

    expect(result).toEqual({
      error: 'Erro ao excluir a receita. Tente novamente.',
    });
  });
});
