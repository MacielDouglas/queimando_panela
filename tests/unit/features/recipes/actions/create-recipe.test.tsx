import { beforeEach, describe, expect, it, vi } from 'vitest';

const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const headersMock = vi.fn();
const getSessionMock = vi.fn();

const recipeCreateMock = vi.fn();
const ingredientCreateManyMock = vi.fn();
const recipeImageCreateManyMock = vi.fn();
const uploadRecipeImageMock = vi.fn();

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
      create: (...args: unknown[]) => recipeCreateMock(...args),
    },
    ingredient: {
      createMany: (...args: unknown[]) => ingredientCreateManyMock(...args),
    },
    recipeImage: {
      createMany: (...args: unknown[]) => recipeImageCreateManyMock(...args),
    },
  },
}));

vi.mock('@/features/recipes/server/recipe-image.service', () => ({
  uploadRecipeImage: (...args: unknown[]) => uploadRecipeImageMock(...args),
}));

import { createRecipe } from '@/features/recipes/actions/create-recipe';

function makeAnalysis() {
  return {
    title: 'Bolo de Milho',
    summary: 'Fofo e cremoso',
    difficulty: 'EASY',
    difficultyLabel: 'Fácil',
    types: ['Bolo'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    suggestions: 'Sirva com café.',
    nutritionSummary: 'Resumo nutricional',
    nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
    utensils: ['Forma'],
    sections: [
      {
        name: 'Receita',
        ingredients: [
          {
            originalText: '2 xícaras de milho',
            name: 'milho',
            generalName: 'milho',
          },
          {
            originalText: '1 xícara de leite',
            name: 'leite',
            generalName: 'leite',
          },
        ],
        modeOfPreparation: '1. Bata.\n2. Asse.',
      },
    ],
  };
}

function makeFormData(params?: {
  analysis?: unknown;
  story?: string;
  images?: File[];
}) {
  const formData = new FormData();

  if (params?.analysis !== undefined) {
    formData.set('analysis', JSON.stringify(params.analysis));
  }

  if (params?.story !== undefined) {
    formData.set('story', params.story);
  }

  for (const image of params?.images ?? []) {
    formData.append('images', image);
  }

  return formData;
}

describe('createRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it('retorna erro quando não há sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await createRecipe(
      makeFormData({
        analysis: makeAnalysis(),
      }),
    );

    expect(result).toEqual({ error: 'Não autorizado.' });
  });

  it('retorna erro quando analysis não existe', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });

    const result = await createRecipe(makeFormData());

    expect(result).toEqual({ error: 'Dados da receita inválidos.' });
  });

  it('cria receita, ingredientes e redireciona sem imagens', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });

    recipeCreateMock.mockResolvedValue({
      id: 'recipe-1',
      sections: [{ id: 'section-1' }],
    });

    const formData = makeFormData({
      analysis: makeAnalysis(),
      story: 'Receita da família',
    });

    await expect(createRecipe(formData)).rejects.toThrow(
      'NEXT_REDIRECT:/receitas',
    );

    expect(recipeCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: 'bolo-de-milho',
          title: 'Bolo de Milho',
          story: 'Receita da família',
          authorId: 'user-1',
          isPublished: true,
        }),
        include: {
          sections: { orderBy: { order: 'asc' } },
        },
      }),
    );

    expect(ingredientCreateManyMock).toHaveBeenCalledWith({
      data: [
        {
          recipeId: 'recipe-1',
          sectionId: 'section-1',
          originalText: '2 xícaras de milho',
          name: 'milho',
          amount: '2',
          unit: 'xícaras',
          order: 0,
        },
        {
          recipeId: 'recipe-1',
          sectionId: 'section-1',
          originalText: '1 xícara de leite',
          name: 'leite',
          amount: '1',
          unit: 'xícara',
          order: 1,
        },
      ],
    });

    expect(uploadRecipeImageMock).not.toHaveBeenCalled();
    expect(recipeImageCreateManyMock).not.toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith('/receitas');
  });

  it('faz upload de até 3 imagens e salva no banco', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });

    recipeCreateMock.mockResolvedValue({
      id: 'recipe-1',
      sections: [{ id: 'section-1' }],
    });

    uploadRecipeImageMock
      .mockResolvedValueOnce({
        key: 'recipes/1.webp',
        url: 'https://cdn.test/1.webp',
        alt: 'Bolo de Milho - foto 1',
        contentType: 'image/webp',
        sizeBytes: 111,
        width: 800,
        height: 600,
        order: 0,
        isCover: true,
      })
      .mockResolvedValueOnce({
        key: 'recipes/2.webp',
        url: 'https://cdn.test/2.webp',
        alt: 'Bolo de Milho - foto 2',
        contentType: 'image/webp',
        sizeBytes: 222,
        width: 800,
        height: 600,
        order: 1,
        isCover: false,
      })
      .mockResolvedValueOnce({
        key: 'recipes/3.webp',
        url: 'https://cdn.test/3.webp',
        alt: 'Bolo de Milho - foto 3',
        contentType: 'image/webp',
        sizeBytes: 333,
        width: 800,
        height: 600,
        order: 2,
        isCover: false,
      });

    const images = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
      new File(['c'], 'c.png', { type: 'image/png' }),
      new File(['d'], 'd.png', { type: 'image/png' }),
    ];

    const formData = makeFormData({
      analysis: makeAnalysis(),
      images,
    });

    await expect(createRecipe(formData)).rejects.toThrow(
      'NEXT_REDIRECT:/receitas',
    );

    expect(uploadRecipeImageMock).toHaveBeenCalledTimes(3);
    expect(recipeImageCreateManyMock).toHaveBeenCalledWith({
      data: [
        {
          recipeId: 'recipe-1',
          key: 'recipes/1.webp',
          url: 'https://cdn.test/1.webp',
          alt: 'Bolo de Milho - foto 1',
          contentType: 'image/webp',
          sizeBytes: 111,
          width: 800,
          height: 600,
          order: 0,
          isCover: true,
        },
        {
          recipeId: 'recipe-1',
          key: 'recipes/2.webp',
          url: 'https://cdn.test/2.webp',
          alt: 'Bolo de Milho - foto 2',
          contentType: 'image/webp',
          sizeBytes: 222,
          width: 800,
          height: 600,
          order: 1,
          isCover: false,
        },
        {
          recipeId: 'recipe-1',
          key: 'recipes/3.webp',
          url: 'https://cdn.test/3.webp',
          alt: 'Bolo de Milho - foto 3',
          contentType: 'image/webp',
          sizeBytes: 333,
          width: 800,
          height: 600,
          order: 2,
          isCover: false,
        },
      ],
    });
  });

  it('retorna erro quando ocorre exceção ao salvar', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    recipeCreateMock.mockRejectedValue(new Error('db error'));

    const result = await createRecipe(
      makeFormData({
        analysis: makeAnalysis(),
      }),
    );

    expect(result).toEqual({
      error: 'Erro ao salvar a receita. Tente novamente.',
    });
  });
});
