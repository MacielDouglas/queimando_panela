import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateRecipeAction } from '@/features/recipes/actions/update-recipe';
import { initialUpdateRecipeState } from '@/features/recipes/types/recipe-form.types';
import { prisma } from '@/lib/__mocks__/prisma';
import { auth } from '@/lib/auth';
import {
  safeDeleteRecipeImage,
  uploadRecipeCoverImage,
} from '@/features/recipes/server/recipe-image.service';
import { Prisma } from '../../../../../generated/prisma/client';

vi.mock('@/lib/prisma');
vi.mock('@/lib/auth');
vi.mock('@/lib/slugify', () => ({
  slugify: vi.fn((title: string) => title.toLowerCase().replace(/\s+/g, '-')),
}));
vi.mock('@/features/recipes/server/recipe-image.service', () => ({
  uploadRecipeCoverImage: vi.fn(),
  safeDeleteRecipeImage: vi.fn(),
}));

const mockSession = {
  user: { id: 'user-123', email: 'test@queimandopanela.com', name: 'Tester' },
  session: { id: 'session-abc' },
};

const mockExistingRecipe = {
  id: 'recipe-123',
  authorId: 'user-123',
  slug: 'bolo-de-banana',
  title: 'Bolo de Banana',
  images: [],
};

const mockUpdatedRecipe = {
  id: 'recipe-123',
  slug: 'bolo-de-banana',
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);

  vi.mocked(uploadRecipeCoverImage).mockResolvedValue(null as never);
  vi.mocked(safeDeleteRecipeImage).mockResolvedValue(undefined as never);
  prisma.recipeImage.create.mockResolvedValue({ id: 'img-1' } as never);
  prisma.recipeImage.delete.mockResolvedValue({ id: 'img-1' } as never);

  prisma.recipe.findUnique.mockResolvedValue(mockExistingRecipe as never);
  prisma.recipe.count.mockResolvedValue(0 as never);
  prisma.recipe.update.mockResolvedValue(mockUpdatedRecipe as never);

  prisma.ingredient.deleteMany.mockResolvedValue({ count: 0 } as never);
  prisma.ingredient.createMany.mockResolvedValue({ count: 0 } as never);

  prisma.utensilOnRecipe.deleteMany.mockResolvedValue({ count: 0 } as never);
  prisma.utensil.upsert.mockResolvedValue({ id: 'utensil-1', name: 'tigela' } as never);
  prisma.utensilOnRecipe.create.mockResolvedValue({} as never);

  prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) =>
    fn(prisma),
  );
});

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const defaults: Record<string, string> = {
    recipeId: 'recipe-123',
    title: 'Bolo de Banana',
    summary: 'Receita gostosa e fácil',
    story: '',
    modeOfPreparation:
      'Amasse as bananas. Misture com ovos e açúcar. Leve ao forno por 40 minutos.',
    difficulty: 'EASY',
    type: 'SWEET',
    prepTimeMinutes: '10',
    cookTimeMinutes: '40',
    servings: '8',
    suggestions: '',
    notesAuthor: '',
    notesPublic: '',
    aiIngredients: '[]',
    aiUtensils: '[]',
    nutritionSummary: '',
    nutritionTable: '[]',
    ...overrides,
  };
  Object.entries(defaults).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);
  prisma.recipe.findUnique.mockResolvedValue(mockExistingRecipe as never);
  prisma.recipe.count.mockResolvedValue(0 as never);
  prisma.recipe.update.mockResolvedValue(mockUpdatedRecipe as never);
  prisma.ingredient.deleteMany.mockResolvedValue({ count: 0 } as never);
  prisma.ingredient.createMany.mockResolvedValue({ count: 0 } as never);
  prisma.utensilOnRecipe.deleteMany.mockResolvedValue({ count: 0 } as never);
  prisma.utensil.upsert.mockResolvedValue({ id: 'utensil-1', name: 'tigela' } as never);
  prisma.utensilOnRecipe.create.mockResolvedValue({} as never);
  prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) =>
    fn(prisma),
  );
});

// ─── Autenticação ─────────────────────────────────────────────────────────────

describe('updateRecipeAction — autenticação', () => {
  it('retorna erro se sessão não existe', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
    const result = await updateRecipeAction(initialUpdateRecipeState, makeFormData());
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/sessão expirada/i);
  });

  it('não chama Prisma se não houver sessão', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
    await updateRecipeAction(initialUpdateRecipeState, makeFormData());
    expect(prisma.recipe.update).not.toHaveBeenCalled();
  });
});

// ─── Validação ────────────────────────────────────────────────────────────────

describe('updateRecipeAction — validação', () => {
  it('retorna erro se título tiver menos de 3 caracteres', async () => {
    const result = await updateRecipeAction(
      initialUpdateRecipeState,
      makeFormData({ title: 'AB' }),
    );
    expect(result.status).toBe('error');
  });

  it('retorna erro se modo de preparo for muito curto', async () => {
    const result = await updateRecipeAction(
      initialUpdateRecipeState,
      makeFormData({ modeOfPreparation: 'Curto demais.' }),
    );
    expect(result.status).toBe('error');
  });

  it('retorna erro se difficulty for inválida', async () => {
    const result = await updateRecipeAction(
      initialUpdateRecipeState,
      makeFormData({ difficulty: 'SUPER_HARD' }),
    );
    expect(result.status).toBe('error');
  });

  it('retorna erro se type estiver vazio', async () => {
    const result = await updateRecipeAction(initialUpdateRecipeState, makeFormData({ type: '' }));
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/tipo|receita/i);
  });

  it('retorna erro se aiIngredients não for JSON válido', async () => {
    const result = await updateRecipeAction(
      initialUpdateRecipeState,
      makeFormData({ aiIngredients: 'INVALIDO' }),
    );
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/inválidos/i);
  });
});

// ─── Autorização ──────────────────────────────────────────────────────────────

describe('updateRecipeAction — autorização', () => {
  it('retorna erro se receita não existe', async () => {
    prisma.recipe.findUnique.mockResolvedValue(null as never);
    const result = await updateRecipeAction(initialUpdateRecipeState, makeFormData());
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/não encontrada/i);
  });

  it('retorna erro se receita pertence a outro usuário', async () => {
    prisma.recipe.findUnique.mockResolvedValue({
      ...mockExistingRecipe,
      authorId: 'outro-user',
    } as never);
    const result = await updateRecipeAction(initialUpdateRecipeState, makeFormData());
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/permissão/i);
  });
});

// ─── Atualização ──────────────────────────────────────────────────────────────

describe('updateRecipeAction — atualização', () => {
  it('redireciona para slug correto após atualização', async () => {
    await expect(updateRecipeAction(initialUpdateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:/receitas/bolo-de-banana',
    );
  });

  it('chama prisma.recipe.update exatamente uma vez', async () => {
    await expect(updateRecipeAction(initialUpdateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:',
    );
    expect(prisma.recipe.update).toHaveBeenCalledOnce();
  });

  it('mantém slug existente quando o título não muda', async () => {
    await expect(updateRecipeAction(initialUpdateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:',
    );

    const callArgs = prisma.recipe.update.mock.calls[0]?.[0] as {
      data: { slug: string };
    };
    expect(callArgs.data.slug).toBe('bolo-de-banana');
    expect(prisma.recipe.count).not.toHaveBeenCalled();
  });

  it('gera novo slug quando título muda', async () => {
    prisma.recipe.count.mockResolvedValue(0 as never);

    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ title: 'Bolo de Cenoura' })),
    ).rejects.toThrow('NEXT_REDIRECT:/receitas/bolo-de-cenoura');
  });

  it('adiciona sufixo numérico ao novo slug quando já existem receitas com mesmo nome', async () => {
    prisma.recipe.count.mockResolvedValue(2 as never);

    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ title: 'Bolo de Cenoura' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.update.mock.calls[0]?.[0] as {
      data: { slug: string };
    };
    expect(callArgs.data.slug).toMatch(/-3$/);
  });

  it('deleta e recria ingredientes na transação', async () => {
    const aiIngredients = JSON.stringify([
      { name: 'banana', amount: '3', unit: 'unidades', originalText: '3 bananas' },
    ]);

    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ aiIngredients })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.ingredient.deleteMany).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-123' },
    });
    expect(prisma.ingredient.createMany).toHaveBeenCalledOnce();
  });

  it('deleta e recria utensílios na transação', async () => {
    const aiUtensils = JSON.stringify([{ name: 'tigela' }, { name: 'panela' }]);

    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ aiUtensils })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.utensilOnRecipe.deleteMany).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-123' },
    });
    expect(prisma.utensil.upsert).toHaveBeenCalledTimes(2);
  });

  it('deduplica utensílios (case-insensitive)', async () => {
    const aiUtensils = JSON.stringify([{ name: 'Tigela' }, { name: 'tigela' }, { name: 'TIGELA' }]);

    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ aiUtensils })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.utensil.upsert).toHaveBeenCalledOnce();
  });

  it('não chama createMany quando ingredientes estão vazios', async () => {
    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ aiIngredients: '[]' })),
    ).rejects.toThrow('NEXT_REDIRECT:');
    expect(prisma.ingredient.createMany).not.toHaveBeenCalled();
  });

  it('converte prepTimeMinutes vazio para null', async () => {
    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ prepTimeMinutes: '' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.update.mock.calls[0]?.[0] as {
      data: { prepTimeMinutes: number | null };
    };
    expect(callArgs.data.prepTimeMinutes).toBeNull();
  });

  it('converte summary vazio para null', async () => {
    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ summary: '' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.update.mock.calls[0]?.[0] as {
      data: { summary: string | null };
    };
    expect(callArgs.data.summary).toBeNull();
  });

  it('salva nutritionTable como array quando fornecida', async () => {
    const nutritionTable = JSON.stringify([
      { nutrient: 'Calorias', amount: '200', unit: 'kcal', dailyValue: '10%' },
    ]);

    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ nutritionTable })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.update.mock.calls[0]?.[0] as {
      data: { nutritionPer100g: unknown };
    };
    expect(Array.isArray(callArgs.data.nutritionPer100g)).toBe(true);
  });
});

describe('updateRecipeAction — imagem e nutrition', () => {
  it('salva nutritionPer100g como Prisma.JsonNull quando nutritionTable é array vazio', async () => {
    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ nutritionTable: '[]' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.update.mock.calls[0]?.[0] as {
      data: { nutritionPer100g: unknown };
    };

    expect(callArgs.data.nutritionPer100g).toBe(Prisma.JsonNull);
  });

  it('salva nutritionPer100g como Prisma.JsonNull quando nutritionTable é JSON inválido', async () => {
    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ nutritionTable: '{invalido' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.update.mock.calls[0]?.[0] as {
      data: { nutritionPer100g: unknown };
    };

    expect(callArgs.data.nutritionPer100g).toBe(Prisma.JsonNull);
  });

  it('não chama uploadRecipeCoverImage quando nenhum arquivo é enviado', async () => {
    await expect(updateRecipeAction(initialUpdateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:',
    );

    expect(uploadRecipeCoverImage).not.toHaveBeenCalled();
  });

  it('faz upload e cria novo recipeImage sem capa anterior', async () => {
    const formData = makeFormData();
    const file = new File(['data'], 'cover.webp', { type: 'image/webp' });
    formData.append('image', file);

    vi.mocked(uploadRecipeCoverImage).mockResolvedValue({
      key: 'recipes/recipe-123/cover.webp',
      url: 'https://cdn.exemplo.com/cover.webp',
      alt: 'Capa da receita Bolo de Banana',
      contentType: 'image/webp',
      sizeBytes: 12345,
      width: 1200,
      height: 900,
      isCover: true,
      order: 0,
    } as never);

    await expect(updateRecipeAction(initialUpdateRecipeState, formData)).rejects.toThrow(
      'NEXT_REDIRECT:',
    );

    expect(uploadRecipeCoverImage).toHaveBeenCalledOnce();
    expect(prisma.recipeImage.delete).not.toHaveBeenCalled();
    expect(prisma.recipeImage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          recipeId: 'recipe-123',
          isCover: true,
        }),
      }),
    );
  });

  it('deleta capa anterior antes de criar nova quando recipe já tem imagem', async () => {
    prisma.recipe.findUnique.mockResolvedValue({
      ...mockExistingRecipe,
      images: [{ id: 'img-old', key: 'recipes/recipe-123/old.webp' }],
    } as never);

    const formData = makeFormData();
    const file = new File(['data'], 'new-cover.webp', { type: 'image/webp' });
    formData.append('image', file);

    vi.mocked(uploadRecipeCoverImage).mockResolvedValue({
      key: 'recipes/recipe-123/new.webp',
      url: 'https://cdn.exemplo.com/new.webp',
      alt: 'Capa da receita Bolo de Banana',
      contentType: 'image/webp',
      sizeBytes: 12345,
      width: 1200,
      height: 900,
      isCover: true,
      order: 0,
    } as never);

    await expect(updateRecipeAction(initialUpdateRecipeState, formData)).rejects.toThrow(
      'NEXT_REDIRECT:',
    );

    expect(prisma.recipeImage.delete).toHaveBeenCalledWith({
      where: { id: 'img-old' },
    });
    expect(safeDeleteRecipeImage).toHaveBeenCalledWith('recipes/recipe-123/old.webp');
    expect(prisma.recipeImage.create).toHaveBeenCalledOnce();
  });

  it('remove capa atual quando removeCoverImage=true e não há novo upload', async () => {
    prisma.recipe.findUnique.mockResolvedValue({
      ...mockExistingRecipe,
      images: [{ id: 'img-cover', key: 'recipes/recipe-123/cover.webp' }],
    } as never);

    await expect(
      updateRecipeAction(initialUpdateRecipeState, makeFormData({ removeCoverImage: 'true' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.recipeImage.delete).toHaveBeenCalledWith({
      where: { id: 'img-cover' },
    });
    expect(safeDeleteRecipeImage).toHaveBeenCalledWith('recipes/recipe-123/cover.webp');
  });

  it('retorna erro e chama safeDelete quando a transação falha após upload', async () => {
    const formData = makeFormData();
    const file = new File(['data'], 'cover.webp', { type: 'image/webp' });
    formData.append('image', file);

    vi.mocked(uploadRecipeCoverImage).mockResolvedValue({
      key: 'recipes/recipe-123/cover.webp',
      url: 'https://cdn.exemplo.com/cover.webp',
      alt: 'Capa da receita Bolo de Banana',
      contentType: 'image/webp',
      sizeBytes: 12345,
      width: 1200,
      height: 900,
      isCover: true,
      order: 0,
    } as never);

    prisma.$transaction.mockRejectedValueOnce(new Error('db fail') as never);

    const result = await updateRecipeAction(initialUpdateRecipeState, formData);

    expect(result.status).toBe('error');
    expect(result.message).toMatch(/não foi possível atualizar/i);
    expect(safeDeleteRecipeImage).toHaveBeenCalledWith('recipes/recipe-123/cover.webp');
  });
});
