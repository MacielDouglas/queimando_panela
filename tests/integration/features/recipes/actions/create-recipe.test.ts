import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRecipeAction } from '@/features/recipes/actions/create-recipe';
import { initialCreateRecipeState } from '@/features/recipes/types/recipe-form.types';
import { prisma } from '@/lib/__mocks__/prisma';
import { auth } from '@/lib/auth';

vi.mock('@/lib/prisma');
vi.mock('@/lib/auth');
vi.mock('@/lib/slugify', () => ({
  slugify: vi.fn((title: string) => title.toLowerCase().replace(/\s+/g, '-')),
}));

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const mockSession = {
  user: { id: 'user-123', email: 'test@queimandopanela.com', name: 'Tester' },
  session: { id: 'session-abc' },
};

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const defaults: Record<string, string> = {
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
    ...overrides,
  };
  Object.entries(defaults).forEach(([key, value]) => fd.append(key, value));
  return fd;
}

const mockCreatedRecipe = {
  id: 'recipe-123',
  slug: 'bolo-de-banana',
};

// ─── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);
  prisma.recipe.count.mockResolvedValue(0);
  prisma.recipe.create.mockResolvedValue(mockCreatedRecipe as never);
  prisma.ingredient.createMany.mockResolvedValue({ count: 0 });
  prisma.utensil.upsert.mockResolvedValue({
    id: 'utensil-1',
    name: 'tigela',
  } as never);
  prisma.utensilOnRecipe.create.mockResolvedValue({} as never);
  prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) =>
    fn(prisma),
  );
});

// ─── Autenticação ──────────────────────────────────────────────────────────────

describe('createRecipeAction — autenticação', () => {
  it('retorna erro se sessão não existe', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
    const result = await createRecipeAction(initialCreateRecipeState, makeFormData());
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/sessão expirada/i);
  });

  it('não chama Prisma se não houver sessão', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
    await createRecipeAction(initialCreateRecipeState, makeFormData());
    expect(prisma.recipe.create).not.toHaveBeenCalled();
  });
});

// ─── Validação ─────────────────────────────────────────────────────────────────

describe('createRecipeAction — validação', () => {
  it('retorna erro se título tiver menos de 3 caracteres', async () => {
    const result = await createRecipeAction(
      initialCreateRecipeState,
      makeFormData({ title: 'AB' }),
    );
    expect(result.status).toBe('error');
  });

  it('retorna erro se modo de preparo for muito curto', async () => {
    const result = await createRecipeAction(
      initialCreateRecipeState,
      makeFormData({ modeOfPreparation: 'Curto demais.' }),
    );
    expect(result.status).toBe('error');
  });

  it('retorna erro se difficulty for inválida', async () => {
    const result = await createRecipeAction(
      initialCreateRecipeState,
      makeFormData({ difficulty: 'SUPER_HARD' }),
    );
    expect(result.status).toBe('error');
  });

  it('retorna erro se type estiver vazio', async () => {
    const result = await createRecipeAction(initialCreateRecipeState, makeFormData({ type: '' }));
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/tipo|receita/i);
  });

  it('retorna erro se aiIngredients não for JSON válido', async () => {
    const result = await createRecipeAction(
      initialCreateRecipeState,
      makeFormData({ aiIngredients: 'INVALIDO' }),
    );
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/inválidos/i);
  });

  it('retorna erro se aiUtensils não for JSON válido', async () => {
    const result = await createRecipeAction(
      initialCreateRecipeState,
      makeFormData({ aiUtensils: '{broken' }),
    );
    expect(result.status).toBe('error');
  });
});

// ─── Criação ───────────────────────────────────────────────────────────────────

describe('createRecipeAction — criação', () => {
  it('redireciona para slug correto após criação', async () => {
    await expect(createRecipeAction(initialCreateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:/receitas/bolo-de-banana',
    );
  });

  it('chama prisma.recipe.create exatamente uma vez', async () => {
    await expect(createRecipeAction(initialCreateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:',
    );
    expect(prisma.recipe.create).toHaveBeenCalledOnce();
  });

  it('adiciona sufixo numérico ao slug quando já existem receitas com mesmo nome', async () => {
    prisma.recipe.count.mockResolvedValue(2);

    await expect(createRecipeAction(initialCreateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:',
    );

    const callArgs = prisma.recipe.create.mock.calls[0]?.[0] as {
      data: { slug: string };
    };
    expect(callArgs.data.slug).toMatch(/-3$/);
  });

  it('cria ingredientes quando aiIngredients tiver dados válidos', async () => {
    const aiIngredients = JSON.stringify([
      {
        name: 'banana',
        amount: '3',
        unit: 'unidades',
        originalText: '3 bananas',
      },
    ]);

    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ aiIngredients })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.ingredient.createMany).toHaveBeenCalledOnce();
  });

  it('ignora ingredientes com nome vazio', async () => {
    const aiIngredients = JSON.stringify([
      { name: '', amount: '1', unit: 'xícara', originalText: '' },
      { name: 'banana', amount: '3', unit: 'un', originalText: '3 bananas' },
    ]);

    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ aiIngredients })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.ingredient.createMany.mock.calls[0]?.[0] as {
      data: Array<{ name: string }>;
    };
    expect(callArgs.data).toHaveLength(1);
    expect(callArgs.data[0]?.name).toBe('banana');
  });

  it('cria utensílios sem duplicatas (case-insensitive)', async () => {
    const aiUtensils = JSON.stringify([{ name: 'Tigela' }, { name: 'tigela' }, { name: 'TIGELA' }]);

    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ aiUtensils })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.utensil.upsert).toHaveBeenCalledOnce();
  });

  it('salva authorId corretamente na receita', async () => {
    await expect(createRecipeAction(initialCreateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:',
    );

    const callArgs = prisma.recipe.create.mock.calls[0]?.[0] as {
      data: { authorId: string };
    };
    expect(callArgs.data.authorId).toBe('user-123');
  });

  it('cria receita com isPublished true por padrão', async () => {
    await expect(createRecipeAction(initialCreateRecipeState, makeFormData())).rejects.toThrow(
      'NEXT_REDIRECT:',
    );

    const callArgs = prisma.recipe.create.mock.calls[0]?.[0] as {
      data: { isPublished: boolean; publishedAt?: Date | null };
    };
    expect(callArgs.data.isPublished).toBe(true);
    expect(callArgs.data.publishedAt).toBeInstanceOf(Date);
  });

  it('converte prepTimeMinutes vazio para null', async () => {
    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ prepTimeMinutes: '' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.create.mock.calls[0]?.[0] as {
      data: { prepTimeMinutes: number | null };
    };
    expect(callArgs.data.prepTimeMinutes).toBeNull();
  });

  it('converte prepTimeMinutes válido para número', async () => {
    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ prepTimeMinutes: '30' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.create.mock.calls[0]?.[0] as {
      data: { prepTimeMinutes: number | null };
    };
    expect(callArgs.data.prepTimeMinutes).toBe(30);
  });

  it('converte summary vazio para null', async () => {
    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ summary: '' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    const callArgs = prisma.recipe.create.mock.calls[0]?.[0] as {
      data: { summary: string | null };
    };
    expect(callArgs.data.summary).toBeNull();
  });

  it('não cria ingredientes quando lista está vazia', async () => {
    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ aiIngredients: '[]' })),
    ).rejects.toThrow('NEXT_REDIRECT:');
    expect(prisma.ingredient.createMany).not.toHaveBeenCalled();
  });

  it('cria utensílios quando lista não está vazia', async () => {
    await expect(
      createRecipeAction(
        initialCreateRecipeState,
        makeFormData({
          aiUtensils: JSON.stringify([{ name: 'tigela' }, { name: 'panela' }]),
        }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT:');

    // O código usa upsert por utensílio, não createMany
    expect(prisma.utensil.upsert).toHaveBeenCalledTimes(2);
    expect(prisma.utensil.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ name: 'tigela' }),
      }),
    );
  });

  it('não cria utensílios quando lista está vazia', async () => {
    await expect(
      createRecipeAction(initialCreateRecipeState, makeFormData({ aiUtensils: '[]' })),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.utensil.createMany).not.toHaveBeenCalled();
  });

  it('vincula utensílios à receita criada', async () => {
    await expect(
      createRecipeAction(
        initialCreateRecipeState,
        makeFormData({
          aiUtensils: JSON.stringify([{ name: 'tigela' }]),
        }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT:');

    expect(prisma.utensilOnRecipe.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          recipeId: 'recipe-123',
        }),
      }),
    );
  });
});
