import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NewRecipePage from '@/app/(private)/receitas/new/page';

const redirectMock = vi.fn();
const getSessionMock = vi.fn();
const headersMock = vi.fn();

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

vi.mock('@/features/recipes/components/recipe-form/RecipeFormShell', () => ({
  RecipeFormShell: () => (
    <div data-testid="recipe-form-shell">Recipe form shell</div>
  ),
}));

describe('NewRecipePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it('redireciona para login quando não há usuário na sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    await NewRecipePage();

    expect(redirectMock).toHaveBeenCalledWith('/login');
  });

  it('renderiza o formulário quando há usuário autenticado', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1', name: 'Douglas' },
    });

    const ui = await NewRecipePage();
    render(ui);

    expect(screen.getByText('Nova receita')).toBeInTheDocument();
    expect(screen.getByText('Compartilhe sua receita')).toBeInTheDocument();
    expect(
      screen.getByText(
        /A IA vai revisar, corrigir e enriquecer sua receita antes de publicar/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('recipe-form-shell')).toBeInTheDocument();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
