import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NewRecipePage from '@/app/(private)/receitas/new/page';

const redirectMock = vi.fn();
const getSessionMock = vi.fn();
const headersMock = vi.fn();
const recipeFormShellMock = vi.fn();

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
  RecipeFormShell: (props: { mode: 'create' | 'edit' }) => {
    recipeFormShellMock(props);
    return <div data-testid="recipe-form-shell">Recipe form shell</div>;
  },
}));

describe('NewRecipePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it('redireciona para login quando não há usuário na sessão', async () => {
    getSessionMock.mockResolvedValue(null);

    await NewRecipePage();

    expect(headersMock).toHaveBeenCalled();
    expect(getSessionMock).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });
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
        /Escreva sua receita, revise a sugestão da IA e ajuste tudo antes de salvar\./i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Voltar para receitas/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Use a análise da IA como rascunho editável/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId('recipe-form-shell')).toBeInTheDocument();
    expect(recipeFormShellMock).toHaveBeenCalledWith({ mode: 'create' });
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('solicita a sessão com os headers da requisição', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1', name: 'Douglas' },
    });

    await NewRecipePage();

    expect(headersMock).toHaveBeenCalledTimes(1);
    expect(getSessionMock).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });
  });
});
