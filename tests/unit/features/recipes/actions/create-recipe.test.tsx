import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRecipe } from '@/features/recipes/actions/create-recipe';

const redirectMock = vi.fn();
const headersMock = vi.fn();
const getSessionMock = vi.fn();
const createMock = vi.fn();
const createManyMock = vi.fn();

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
    ingredient: {
      createMany: (args: unknown) => createManyMock(args),
    },
  },
}));

describe('createRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it('retorna erro quando não há sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await createRecipe(
      {
        title: 'Bolo de Cenoura',
        summary: 'Fofo',
        difficulty: 'EASY',
        difficultyLabel: 'Fácil',
        type: 'Bolo',
        prepTimeMinutes: 15,
        cookTimeMinutes: 40,
        suggestions: 'Use menos açúcar',
        nutritionSummary: 'Resumo nutricional',
        nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
        utensils: ['Forma'],
        sections: [
          {
            name: 'Receita',
            ingredients: ['2 xícaras de farinha'],
            modeOfPreparation: 'Misture tudo.',
          },
        ],
      },
      'História da receita',
    );

    expect(result).toEqual({ error: 'Não autorizado.' });
  });

  it('salva a receita e redireciona em caso de sucesso', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1', name: 'Douglas' },
    });

    createMock.mockResolvedValue({
      id: 'recipe-1',
      sections: [
        { id: 'section-1', order: 0 },
        { id: 'section-2', order: 1 },
      ],
    });

    await createRecipe(
      {
        title: 'Bolo de Cenoura',
        summary: 'Fofo',
        difficulty: 'EASY',
        difficultyLabel: 'Fácil',
        type: 'Bolo',
        prepTimeMinutes: 15,
        cookTimeMinutes: 40,
        suggestions: 'Use menos açúcar',
        nutritionSummary: 'Resumo nutricional',
        nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
        utensils: ['Forma', 'Colher'],
        sections: [
          {
            name: 'Receita',
            ingredients: ['2 xícaras de farinha', '1 xícara de açúcar'],
            modeOfPreparation: 'Misture tudo.',
          },
          {
            name: 'Cobertura',
            ingredients: ['1 colher de chocolate'],
            modeOfPreparation: 'Finalize por cima.',
          },
        ],
      },
      'História da receita',
    );

    expect(getSessionMock).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });

    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        slug: 'bolo-de-cenoura',
        title: 'Bolo de Cenoura',
        summary: 'Fofo',
        story: 'História da receita',
        difficulty: 'EASY',
        type: 'Bolo',
        prepTimeMinutes: 15,
        cookTimeMinutes: 40,
        suggestions: 'Use menos açúcar',
        nutritionSummary: 'Resumo nutricional',
        nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
        isPublished: true,
        authorId: 'user-1',
        sections: {
          create: [
            {
              name: 'Receita',
              modeOfPreparation: 'Misture tudo.',
              order: 0,
            },
            {
              name: 'Cobertura',
              modeOfPreparation: 'Finalize por cima.',
              order: 1,
            },
          ],
        },
        utensils: {
          create: [
            {
              utensil: {
                connectOrCreate: {
                  where: { name: 'Forma' },
                  create: { name: 'Forma' },
                },
              },
            },
            {
              utensil: {
                connectOrCreate: {
                  where: { name: 'Colher' },
                  create: { name: 'Colher' },
                },
              },
            },
          ],
        },
      }),
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    expect(createManyMock).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          recipeId: 'recipe-1',
          sectionId: 'section-1',
          originalText: '2 xícaras de farinha',
          order: 0,
        }),
        expect.objectContaining({
          recipeId: 'recipe-1',
          sectionId: 'section-2',
          originalText: '1 colher de chocolate',
          order: 0,
        }),
      ]),
    });

    expect(redirectMock).toHaveBeenCalledWith('/receitas');
  });

  it('retorna erro quando o prisma falha', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1', name: 'Douglas' },
    });

    createMock.mockRejectedValue(new Error('boom'));

    const result = await createRecipe(
      {
        title: 'Bolo de Cenoura',
        summary: 'Fofo',
        difficulty: 'EASY',
        difficultyLabel: 'Fácil',
        type: 'Bolo',
        prepTimeMinutes: 15,
        cookTimeMinutes: 40,
        suggestions: 'Use menos açúcar',
        nutritionSummary: 'Resumo nutricional',
        nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
        utensils: ['Forma'],
        sections: [
          {
            name: 'Receita',
            ingredients: ['2 xícaras de farinha'],
            modeOfPreparation: 'Misture tudo.',
          },
        ],
      },
      'História da receita',
    );

    expect(result).toEqual({
      error: 'Erro ao salvar a receita. Tente novamente.',
    });
  });
});
