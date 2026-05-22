import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RecipeGrid } from '@/features/recipes/components/recipe-list/RecipeGrid';

const recipeCardMock = vi.fn();

vi.mock('@/features/recipes/components/recipe-list/RecipeCard', () => ({
  RecipeCard: (props: any) => {
    recipeCardMock(props);
    return <article data-testid="recipe-card">{props.recipe.title}</article>;
  },
}));

const recipes = [
  {
    id: '1',
    slug: 'bolo-de-milho',
    title: 'Bolo de milho',
    summary: 'Fofo',
    type: 'Bolo',
    difficulty: 'EASY' as const,
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    createdAt: new Date('2026-05-22T12:00:00.000Z'),
    coverUrl: '/bolo.jpg',
    authorName: 'Douglas',
  },
  {
    id: '2',
    slug: 'coxinha',
    title: 'Coxinha',
    summary: 'Crocante',
    type: 'Salgado',
    difficulty: 'MEDIUM' as const,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    createdAt: new Date('2026-05-21T12:00:00.000Z'),
    coverUrl: '/coxinha.jpg',
    authorName: 'Douglas',
  },
];

describe('RecipeGrid', () => {
  it('renderiza heading padrão, total e os cards recebidos', () => {
    render(
      <RecipeGrid recipes={recipes} total={2} currentPage={1} totalPages={1} />,
    );

    expect(
      screen.getByRole('heading', { name: /Todas as receitas/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('2 receitas')).toBeInTheDocument();
    expect(screen.getAllByTestId('recipe-card')).toHaveLength(2);

    expect(recipeCardMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        recipe: recipes[0],
      }),
    );

    expect(recipeCardMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        recipe: recipes[1],
      }),
    );
  });

  it('renderiza heading com termo de busca quando q está preenchido', () => {
    render(
      <RecipeGrid
        recipes={recipes}
        total={2}
        currentPage={1}
        totalPages={1}
        q="milho"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Resultados para "milho"' }),
    ).toBeInTheDocument();
  });

  it('renderiza estado vazio quando não há receitas', () => {
    render(
      <RecipeGrid recipes={[]} total={0} currentPage={1} totalPages={0} />,
    );

    expect(screen.getByText('Nenhuma receita')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma receita encontrada.')).toBeInTheDocument();
    expect(
      screen.getByText(/Tente outro termo ou remova algum filtro/i),
    ).toBeInTheDocument();

    expect(screen.queryByTestId('recipe-card')).not.toBeInTheDocument();
  });

  it('renderiza contador singular quando total é 1', () => {
    render(
      <RecipeGrid
        recipes={[recipes[0]]}
        total={1}
        currentPage={1}
        totalPages={1}
      />,
    );

    expect(screen.getByText('1 receita')).toBeInTheDocument();
  });

  it('renderiza paginação com links e preserva filtros na query string', () => {
    render(
      <RecipeGrid
        recipes={recipes}
        total={10}
        currentPage={2}
        totalPages={4}
        q="milho"
        tipo="Bolo"
        dificuldade="EASY"
        utensilio="Forma"
      />,
    );

    expect(
      screen.getByRole('navigation', { name: /Paginação/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('2 / 4')).toBeInTheDocument();

    const prevLink = screen.getByRole('link', { name: /← Anterior/i });
    const nextLink = screen.getByRole('link', { name: /Próxima →/i });

    expect(prevLink).toHaveAttribute(
      'href',
      '/receitas?q=milho&tipo=Bolo&dificuldade=EASY&utensilio=Forma',
    );

    expect(nextLink).toHaveAttribute(
      'href',
      '/receitas?page=3&q=milho&tipo=Bolo&dificuldade=EASY&utensilio=Forma',
    );
  });

  it('renderiza paginação desabilitada no início e omite page=1', () => {
    render(
      <RecipeGrid
        recipes={recipes}
        total={10}
        currentPage={1}
        totalPages={3}
        q="bolo"
      />,
    );

    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    expect(screen.getByText('← Anterior')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /← Anterior/i }),
    ).not.toBeInTheDocument();

    const nextLink = screen.getByRole('link', { name: /Próxima →/i });
    expect(nextLink).toHaveAttribute('href', '/receitas?page=2&q=bolo');
  });

  it('renderiza paginação desabilitada no fim', () => {
    render(
      <RecipeGrid
        recipes={recipes}
        total={10}
        currentPage={3}
        totalPages={3}
      />,
    );

    expect(screen.getByText('3 / 3')).toBeInTheDocument();

    const prevLink = screen.getByRole('link', { name: /← Anterior/i });
    expect(prevLink).toHaveAttribute('href', '/receitas?page=2');

    expect(screen.getByText('Próxima →')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /Próxima →/i }),
    ).not.toBeInTheDocument();
  });

  it('não renderiza navegação de paginação quando totalPages é 1', () => {
    render(
      <RecipeGrid recipes={recipes} total={2} currentPage={1} totalPages={1} />,
    );

    expect(
      screen.queryByRole('navigation', { name: /Paginação/i }),
    ).not.toBeInTheDocument();
  });
});
