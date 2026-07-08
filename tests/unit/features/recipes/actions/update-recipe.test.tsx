import { beforeEach, describe, expect, it, vi } from 'vitest';

const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const headersMock = vi.fn();
const getSessionMock = vi.fn();

const findFirstMock = vi.fn();
const transactionMock = vi.fn();

const txIngredientDeleteManyMock = vi.fn();
const txUtensilOnRecipeDeleteManyMock = vi.fn();
const txRecipeSectionDeleteManyMock = vi.fn();
const txRecipeUpdateMock = vi.fn();
const txIngredientCreateManyMock = vi.fn();
const txRecipeImageDeleteManyMock = vi.fn();
const txRecipeImageUpdateMock = vi.fn();
const txRecipeImageCreateMock = vi.fn();

const deleteRecipeImagesByKeysMock = vi.fn();
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
      findFirst: (...args: unknown[]) => findFirstMock(...args),
    },
    $transaction: (...args: unknown[]) => transactionMock(...args),
  },
}));

vi.mock('@/features/recipes/server/recipe-image.service', () => ({
  deleteRecipeImagesByKeys: (...args: unknown[]) =>
    deleteRecipeImagesByKeysMock(...args),
  uploadRecipeImage: (...args: unknown[]) => uploadRecipeImageMock(...args),
}));

import { updateRecipe } from '@/features/recipes/actions/update-recipe';

function makeAnalysis() {
  return {
    title: 'Bolo de Milho Cremoso',
    summary: 'Resumo',
    difficulty: 'EASY',
    difficultyLabel: 'Fácil',
    types: ['Bolo'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 40,
    suggestions: 'Sirva com café.',
    nutritionSummary: 'Resumo nutricional',
    nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
    utensils: ['Forma', 'Liquidificador'],
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
  existingImages?: unknown;
  images?: File[];
}) {
  const formData = new FormData();

  if (params?.analysis !== undefined) {
    formData.set('analysis', JSON.stringify(params.analysis));
  }

  if (params?.story !== undefined) {
    formData.set('story', params.story);
  }

  if (params?.existingImages !== undefined) {
    formData.set('existingImages', JSON.stringify(params.existingImages));
  }

  for (const image of params?.images ?? []) {
    formData.append('images', image);
  }

  return formData;
}

describe('updateRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());

    transactionMock.mockImplementation(async (callback: any) => {
      return callback({
        ingredient: {
          deleteMany: txIngredientDeleteManyMock,
          createMany: txIngredientCreateManyMock,
        },
        utensilOnRecipe: {
          deleteMany: txUtensilOnRecipeDeleteManyMock,
        },
        recipeSection: {
          deleteMany: txRecipeSectionDeleteManyMock,
        },
        recipe: {
          update: txRecipeUpdateMock,
        },
        recipeImage: {
          deleteMany: txRecipeImageDeleteManyMock,
          update: txRecipeImageUpdateMock,
          create: txRecipeImageCreateMock,
        },
      });
    });
  });

  it('retorna erro quando não há sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    const result = await updateRecipe(
      'bolo-de-milho',
      makeFormData({ analysis: makeAnalysis() }),
    );
    expect(result).toEqual({ error: 'Não autorizado.' });
  });

  it('retorna erro quando analysis é inválido', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });

    const result = await updateRecipe('bolo-de-milho', new FormData());

    expect(result).toEqual({ error: 'Dados da receita inválidos.' });
  });

  it('retorna erro quando a receita não existe', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    findFirstMock.mockResolvedValue(null);

    const result = await updateRecipe(
      'bolo-de-milho',
      makeFormData({ analysis: makeAnalysis() }),
    );

    expect(result).toEqual({
      error: 'Receita não encontrada ou sem permissão de edição.',
    });
  });

  it('atualiza receita, remove imagens excluídas, mantém existentes e cria novas', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });

    findFirstMock.mockResolvedValue({
      id: 'recipe-1',
      slug: 'bolo-de-milho',
      images: [
        {
          id: 'img-1',
          key: 'recipes/1.webp',
          url: 'https://cdn.test/1.webp',
          alt: 'Imagem 1',
          order: 0,
        },
        {
          id: 'img-2',
          key: 'recipes/2.webp',
          url: 'https://cdn.test/2.webp',
          alt: 'Imagem 2',
          order: 1,
        },
      ],
      sections: [{ id: 'old-section-1', order: 0 }],
    });

    txRecipeUpdateMock.mockResolvedValue({
      id: 'recipe-1',
      sections: [{ id: 'new-section-1' }],
    });

    uploadRecipeImageMock.mockResolvedValue({
      key: 'recipes/new-1.webp',
      url: 'https://cdn.test/new-1.webp',
      alt: 'Bolo de Milho Cremoso - foto nova 1',
      contentType: 'image/webp',
      sizeBytes: 123,
      width: 800,
      height: 600,
      order: 0,
      isCover: false,
    });

    const formData = makeFormData({
      analysis: makeAnalysis(),
      story: 'Nova história',
      existingImages: [
        {
          id: 'img-2',
          key: 'recipes/2.webp',
          url: 'https://cdn.test/2.webp',
          alt: 'Imagem 2 atualizada',
        },
      ],
      images: [new File(['abc'], 'nova.png', { type: 'image/png' })],
    });

    await expect(updateRecipe('bolo-de-milho', formData)).rejects.toThrow(
      'NEXT_REDIRECT:/receitas/bolo-de-milho',
    );

    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        slug: 'bolo-de-milho',
        authorId: 'user-1',
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    expect(txIngredientDeleteManyMock).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-1' },
    });
    expect(txUtensilOnRecipeDeleteManyMock).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-1' },
    });
    expect(txRecipeSectionDeleteManyMock).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-1' },
    });

    expect(txRecipeUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'recipe-1' },
        data: expect.objectContaining({
          title: 'Bolo de Milho Cremoso',
          story: 'Nova história',
          utensils: expect.any(Object),
          sections: expect.any(Object),
        }),
      }),
    );

    expect(txIngredientCreateManyMock).toHaveBeenCalledWith({
      data: [
        {
          recipeId: 'recipe-1',
          sectionId: 'new-section-1',
          originalText: '2 xícaras de milho',
          name: 'milho',
          amount: '2',
          unit: 'xícaras',
          order: 0,
        },
        {
          recipeId: 'recipe-1',
          sectionId: 'new-section-1',
          originalText: '1 xícara de leite',
          name: 'leite',
          amount: '1',
          unit: 'xícara',
          order: 1,
        },
      ],
    });

    expect(txRecipeImageDeleteManyMock).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['img-1'],
        },
      },
    });

    expect(uploadRecipeImageMock).toHaveBeenCalledTimes(1);

    expect(txRecipeImageUpdateMock).toHaveBeenCalledWith({
      where: { id: 'img-2' },
      data: {
        order: 0,
        isCover: true,
        alt: 'Imagem 2 atualizada',
      },
    });

    expect(txRecipeImageCreateMock).toHaveBeenCalledWith({
      data: {
        recipeId: 'recipe-1',
        key: 'recipes/new-1.webp',
        url: 'https://cdn.test/new-1.webp',
        alt: 'Bolo de Milho Cremoso - foto nova 1',
        contentType: 'image/webp',
        sizeBytes: 123,
        width: 800,
        height: 600,
        order: 1,
        isCover: false,
      },
    });

    expect(deleteRecipeImagesByKeysMock).toHaveBeenCalledWith([
      'recipes/1.webp',
    ]);
    expect(redirectMock).toHaveBeenCalledWith('/receitas/bolo-de-milho');
  });

  it('retorna erro quando ocorre exceção no fluxo', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    findFirstMock.mockRejectedValue(new Error('db error'));

    const result = await updateRecipe(
      'bolo-de-milho',
      makeFormData({ analysis: makeAnalysis() }),
    );

    expect(result).toEqual({
      error: 'Erro ao atualizar a receita. Tente novamente.',
    });
  });
});
