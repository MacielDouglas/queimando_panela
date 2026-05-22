import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RecipeEditorLayout } from '@/features/recipes/components/recipe-editor/RecipeEditorLayout';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('RecipeEditorLayout', () => {
  it('renderiza cabeçalho, descrição, conteúdo e orientações laterais', () => {
    render(
      <RecipeEditorLayout
        eyebrow="Nova receita"
        title="Compartilhe sua receita"
        description="Escreva sua receita, revise a sugestão da IA e ajuste tudo antes de salvar."
      >
        <div data-testid="layout-children">Conteúdo interno</div>
      </RecipeEditorLayout>,
    );

    expect(screen.getByText('Nova receita')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Compartilhe sua receita' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Escreva sua receita, revise a sugestão da IA e ajuste tudo antes de salvar\./i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Voltar para receitas/i }),
    ).toHaveAttribute('href', '/receitas');

    expect(screen.getByTestId('layout-children')).toBeInTheDocument();

    expect(screen.getByText('Antes de salvar')).toBeInTheDocument();
    expect(
      screen.getByText(/Revise título, ingredientes e modo de preparo\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Use a análise da IA como rascunho editável, não como resposta final\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Receitas salvas ficam como não publicadas até sua revisão final\./i,
      ),
    ).toBeInTheDocument();
  });
});
