import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRecipe } from '@/features/recipes/actions/create-recipe';

const redirectMock = vi.fn();
const headersMock = vi.fn();
const getSessionMock = vi.fn();
const createMock = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (path: string) => redirectMock(path),
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
      create: (args: unknown) => createMock(args),
    },
  },
}));

describe('createRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, 'now').mockReturnValue(1710000000000);
    headersMock.mockResolvedValue(new Headers());
  });

  it('retorna erro quando não há usuário autenticado', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await createRecipe({
      title: 'Bolo de Cenoura',
      summary: 'Fofo',
      difficulty: 'EASY',
      type: 'Bolo',
      prepTimeMinutes: 15,
      cookTimeMinutes: 40,
      suggestions: 'Use menos açúcar',
      nutritionSummary: 'Resumo nutricional',
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
      utensils: ['Tigela'],
      sections: [
        {
          name: 'Receita',
          ingredients: ['2 ovos'],
          modeOfPreparation: 'Misture tudo.',
        },
      ],
    } as any);

    expect(result).toEqual({ error: 'Não autorizado.' });
    expect(createMock).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('salva a receita e redireciona em caso de sucesso', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1' },
    });
    createMock.mockResolvedValue({ id: 'recipe-1' });

    await createRecipe(
      {
        title: 'Bolo de Cenoura',
        summary: 'Fofo',
        difficulty: 'EASY',
        type: 'Bolo',
        prepTimeMinutes: 15,
        cookTimeMinutes: 40,
        suggestions: 'Use menos açúcar',
        nutritionSummary: 'Resumo nutricional',
        nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
        utensils: ['Tigela', 'Forma'],
        sections: [
          {
            name: 'Receita',
            ingredients: ['2 ovos'],
            modeOfPreparation: 'Misture tudo.',
          },
          {
            name: 'Cobertura',
            ingredients: ['Chocolate'],
            modeOfPreparation: 'Cubra o bolo.',
          },
        ],
      } as any,
      'História da receita',
    );

    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        slug: 'bolo-de-cenoura-1710000000000',
        title: 'Bolo de Cenoura',
        story: 'História da receita',
        difficulty: 'EASY',
        authorId: 'user-1',
        isPublished: false,
        sections: {
          create: [
            {
              name: 'Receita',
              modeOfPreparation: 'Misture tudo.',
              order: 0,
            },
            {
              name: 'Cobertura',
              modeOfPreparation: 'Cubra o bolo.',
              order: 1,
            },
          ],
        },
        utensils: {
          create: [
            {
              utensil: {
                connectOrCreate: {
                  where: { name: 'Tigela' },
                  create: { name: 'Tigela' },
                },
              },
            },
            {
              utensil: {
                connectOrCreate: {
                  where: { name: 'Forma' },
                  create: { name: 'Forma' },
                },
              },
            },
          ],
        },
      }),
    });

    expect(redirectMock).toHaveBeenCalledWith('/receitas');
  });

  it('retorna erro amigável quando o prisma falha', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1' },
    });
    createMock.mockRejectedValue(new Error('db error'));

    const result = await createRecipe({
      title: 'Bolo de Cenoura',
      summary: 'Fofo',
      difficulty: 'EASY',
      type: 'Bolo',
      prepTimeMinutes: 15,
      cookTimeMinutes: 40,
      suggestions: null,
      nutritionSummary: null,
      nutritionPer100g: null,
      utensils: [],
      sections: [],
    } as any);

    expect(result).toEqual({
      error: 'Erro ao salvar a receita. Tente novamente.',
    });
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
