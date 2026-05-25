import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import EditRecipePage, {
  metadata,
} from '@/app/(private)/receitas/[slug]/editar/page';

const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});

const headersMock = vi.fn();
const getSessionMock = vi.fn();
const getEditableRecipeBySlugMock = vi.fn();
const recipeEditorLayoutMock = vi.fn();
const recipeFormShellMock = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirectMock(url),
  notFound: () => notFoundMock(),
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

vi.mock('@/features/recipes/actions/get-editable-recipe-by-slug', () => ({
  getEditableRecipeBySlug: (...args: any[]) =>
    getEditableRecipeBySlugMock(...args),
}));

vi.mock(
  '@/features/recipes/components/recipe-editor/RecipeEditorLayout',
  () => ({
    RecipeEditorLayout: ({ children, ...props }: any) => {
      recipeEditorLayoutMock(props);
      return <div data-testid="recipe-editor-layout">{children}</div>;
    },
  }),
);

vi.mock('@/features/recipes/components/recipe-form/RecipeFormShell', () => ({
  RecipeFormShell: (props: any) => {
    recipeFormShellMock(props);
    return <div data-testid="recipe-form-shell" />;
  },
}));

describe('EditRecipePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it('exporta os metadados esperados', () => {
    expect(metadata).toEqual({
      title: 'Editar receita',
      description: 'Edite sua receita com segurança antes de publicar.',
      robots: {
        index: false,
        follow: false,
      },
    });
  });

  it('redireciona para /login quando não há sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    await expect(
      EditRecipePage({
        params: Promise.resolve({ slug: 'bolo-de-milho' }),
      }),
    ).rejects.toThrow('NEXT_REDIRECT:/login');

    expect(getEditableRecipeBySlugMock).not.toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith('/login');
  });

  it('chama notFound quando a receita não existe para o autor', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1', name: 'Douglas' },
    });
    getEditableRecipeBySlugMock.mockResolvedValue(null);

    await expect(
      EditRecipePage({
        params: Promise.resolve({ slug: 'bolo-inexistente' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(getEditableRecipeBySlugMock).toHaveBeenCalledWith(
      'bolo-inexistente',
      'user-1',
    );
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('renderiza layout e form shell com os dados corretos no modo edit', async () => {
    const recipe = {
      id: 'recipe-1',
      slug: 'bolo-de-milho',
      title: 'Bolo de milho',
      story: 'Receita de família',
      summary: 'Fofo e cremoso',
      difficulty: 'EASY',
      difficultyLabel: 'Fácil',
      types: ['Bolo'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 45,
      suggestions: 'Use milho fresco.',
      nutritionSummary: 'Resumo nutricional',
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
      utensils: ['Forma'],
      sections: [
        {
          name: 'Massa',
          ingredients: ['2 ovos', '1 xícara de leite'],
          modeOfPreparation: 'Misture tudo.',
        },
      ],
      images: [],
    };

    getSessionMock.mockResolvedValue({
      user: { id: 'user-1', name: 'Douglas' },
    });
    getEditableRecipeBySlugMock.mockResolvedValue(recipe);

    render(
      await EditRecipePage({
        params: Promise.resolve({ slug: 'bolo-de-milho' }),
      }),
    );

    expect(screen.getByTestId('recipe-editor-layout')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-form-shell')).toBeInTheDocument();

    expect(getEditableRecipeBySlugMock).toHaveBeenCalledWith(
      'bolo-de-milho',
      'user-1',
    );

    expect(recipeEditorLayoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eyebrow: 'Editar receita',
        title: 'Editar: Bolo de milho',
        description:
          'Ajuste conteúdo, estrutura e dados sugeridos antes de salvar a nova versão.',
      }),
    );

    expect(recipeFormShellMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'edit',
        initialData: recipe,
      }),
    );
  });
});
