import { beforeEach, describe, expect, it, vi } from 'vitest';

const findFirstMock = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    recipe: {
      findFirst: (...args: any[]) => findFirstMock(...args),
    },
  },
}));

import { getEditableRecipeBySlug } from '@/features/recipes/actions/get-editable-recipe-by-slug';

describe('getEditableRecipeBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna null quando não encontra receita', async () => {
    findFirstMock.mockResolvedValue(null);

    const result = await getEditableRecipeBySlug('inexistente', 'user-1');

    expect(result).toBeNull();
    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        slug: 'inexistente',
        authorId: 'user-1',
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            ingredients: { orderBy: { order: 'asc' } },
          },
        },
        utensils: {
          include: { utensil: true },
        },
      },
    });
  });

  it('mapeia a receita para o formato editável', async () => {
    findFirstMock.mockResolvedValue({
      id: 'recipe-1',
      slug: 'bolo-de-milho',
      title: 'Bolo de milho',
      story: null,
      summary: 'Resumo',
      difficulty: 'MEDIUM',
      types: ['Bolo'],
      prepTimeMinutes: null,
      cookTimeMinutes: 20,
      suggestions: null,
      nutritionSummary: null,
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
      utensils: [
        { utensil: { name: 'Forma' } },
        { utensil: { name: 'Batedeira' } },
      ],
      sections: [
        {
          name: 'Massa',
          modeOfPreparation: 'Misture.',
          ingredients: [
            { originalText: '2 ovos', order: 0 },
            { originalText: '1 xícara de leite', order: 1 },
          ],
        },
      ],
      images: [],
    });

    const result = await getEditableRecipeBySlug('bolo-de-milho', 'user-1');

    expect(result).toEqual({
      id: 'recipe-1',
      slug: 'bolo-de-milho',
      title: 'Bolo de milho',
      story: '',
      summary: 'Resumo',
      difficulty: 'MEDIUM',
      difficultyLabel: 'Médio',
      types: ['Bolo'],
      prepTimeMinutes: 0,
      cookTimeMinutes: 20,
      suggestions: '',
      nutritionSummary: '',
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
      utensils: ['Forma', 'Batedeira'],
      sections: [
        {
          name: 'Massa',
          ingredients: ['2 ovos', '1 xícara de leite'],
          modeOfPreparation: 'Misture.',
        },
      ],
      images: [],
    });
  });

  it('retorna nutritionPer100g vazio quando o campo não é array', async () => {
    findFirstMock.mockResolvedValue({
      id: 'recipe-1',
      slug: 'bolo-de-milho',
      title: 'Bolo de milho',
      story: 'História',
      summary: 'Resumo',
      difficulty: 'HARD',
      types: ['Bolo'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      suggestions: 'Dica',
      nutritionSummary: 'Resumo nutricional',
      nutritionPer100g: null,
      utensils: [],
      sections: [],
      images: [],
    });

    const result = await getEditableRecipeBySlug('bolo-de-milho', 'user-1');

    expect(result?.nutritionPer100g).toEqual([]);
    expect(result?.difficultyLabel).toBe('Difícil');
  });
});
