import { beforeEach, describe, expect, it, vi } from 'vitest';

const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const headersMock = vi.fn();
const getSessionMock = vi.fn();

const findFirstMock = vi.fn();
const deleteIngredientManyMock = vi.fn();
const deleteUtensilManyMock = vi.fn();
const deleteSectionManyMock = vi.fn();
const recipeUpdateMock = vi.fn();
const createManyMock = vi.fn();
const transactionMock = vi.fn();

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
      findFirst: (...args: any[]) => findFirstMock(...args),
    },
    $transaction: (...args: any[]) => transactionMock(...args),
  },
}));

import { updateRecipe } from '@/features/recipes/actions/update-recipe';

describe('updateRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
    transactionMock.mockImplementation(async (fn: any) =>
      fn({
        ingredient: {
          deleteMany: deleteIngredientManyMock,
          createMany: createManyMock,
        },
        utensilOnRecipe: { deleteMany: deleteUtensilManyMock },
        recipeSection: { deleteMany: deleteSectionManyMock },
        recipe: { update: recipeUpdateMock },
      }),
    );
  });

  it('retorna erro quando não há sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await updateRecipe('bolo-de-milho', {} as any);

    expect(result).toEqual({ error: 'Não autorizado.' });
  });

  it('retorna erro quando a receita não existe', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    findFirstMock.mockResolvedValue(null);

    const result = await updateRecipe('bolo-de-milho', {
      title: 'Novo',
    } as any);

    expect(result).toEqual({
      error: 'Receita não encontrada ou sem permissão de edição.',
    });
  });

  it('atualiza a receita e redireciona', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });

    findFirstMock.mockResolvedValue({
      id: 'recipe-1',
      sections: [{ id: 'old-section-1' }],
    });

    recipeUpdateMock.mockResolvedValue({
      id: 'recipe-1',
      sections: [{ id: 'section-1' }],
    });

    const analysis = {
      title: 'Bolo de milho',
      summary: 'Resumo',
      difficulty: 'EASY',
      type: 'Bolo',
      prepTimeMinutes: 15,
      cookTimeMinutes: 45,
      suggestions: 'Dica',
      nutritionSummary: 'Nutri',
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
      sections: [
        {
          name: 'Massa',
          ingredients: ['2 ovos'],
          modeOfPreparation: 'Misture.',
        },
      ],
      utensils: ['Forma'],
    };

    await expect(
      updateRecipe('bolo-de-milho', analysis as any, 'História'),
    ).rejects.toThrow('NEXT_REDIRECT:/receitas/bolo-de-milho');

    expect(deleteIngredientManyMock).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-1' },
    });

    expect(deleteUtensilManyMock).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-1' },
    });

    expect(deleteSectionManyMock).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-1' },
    });

    expect(recipeUpdateMock).toHaveBeenCalled();

    expect(createManyMock).toHaveBeenCalledWith({
      data: [
        {
          recipeId: 'recipe-1',
          sectionId: 'section-1',
          originalText: '2 ovos',
          name: '2 ovos',
          amount: null,
          unit: null,
          order: 0,
        },
      ],
    });

    expect(redirectMock).toHaveBeenCalledWith('/receitas/bolo-de-milho');
  });
});
