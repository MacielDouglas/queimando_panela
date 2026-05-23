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
    recipeImage: {
      createMany: vi.fn(),
    },
  },
}));

describe('createRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  function makeFormData() {
    const analysis = {
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
    };

    const formData = new FormData();
    formData.set('analysis', JSON.stringify(analysis));
    formData.set('story', 'História da receita');
    return formData;
  }

  it('retorna erro quando não há sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await createRecipe(makeFormData());

    expect(result).toEqual({ error: 'Não autorizado.' });
  });
});
