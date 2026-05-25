import { render, screen } from '@testing-library/react';
import RecipesPage from '@/app/(public)/receitas/page';
import { vi } from 'vitest';

import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill: _fill, priority: _priority, ...props }: any) => (
    <div data-testid="next-image" {...props} />
  ),
}));

vi.mock('@/lib/get-server-session', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/features/recipes/actions/get-all-recipes', () => ({
  getAllRecipes: vi.fn(),
}));

vi.mock('@/features/recipes/actions/get-latest-recipe', () => ({
  getLatestRecipe: vi.fn(),
}));

vi.mock('@/features/recipes/actions/get-recipes-by-category', () => ({
  getRecipesByCategory: vi.fn(),
}));

vi.mock('@/features/recipes/actions/get-recipe-by-utensil', () => ({
  getRecipesByUtensil: vi.fn(),
}));

import { getServerSession } from '@/lib/get-server-session';
import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';
import { getLatestRecipe } from '@/features/recipes/actions/get-latest-recipe';
import { getRecipesByCategory } from '@/features/recipes/actions/get-recipes-by-category';
import { getRecipesByUtensil } from '@/features/recipes/actions/get-recipe-by-utensil';

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetAllRecipes = vi.mocked(getAllRecipes);
const mockGetLatestRecipe = vi.mocked(getLatestRecipe);
const mockGetRecipesByCategory = vi.mocked(getRecipesByCategory);
const mockGetRecipesByUtensil = vi.mocked(getRecipesByUtensil);

const recipeList: RecipeCardData[] = [
  {
    id: '1',
    slug: 'bolo-de-cenoura',
    title: 'Bolo de cenoura',
    summary: 'Fofo e simples',
    types: ['Bolo'],
    difficulty: 'EASY',
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    createdAt: new Date('2025-01-01'),
    coverUrl: '/images/bolo.jpg',
    authorName: 'Douglas',
  },
  {
    id: '2',
    slug: 'lasanha',
    title: 'Lasanha',
    summary: 'Molho rico e massa perfeita',
    types: ['Prato principal'],
    difficulty: 'MEDIUM',
    prepTimeMinutes: 30,
    cookTimeMinutes: 40,
    createdAt: new Date('2025-01-02'),
    coverUrl: '/images/lasanha.jpg',
    authorName: 'Douglas',
  },
];

function renderPage(searchParams?: {
  q?: string | string[];
  tipo?: string | string[];
  dificuldade?: 'EASY' | 'MEDIUM' | 'HARD' | Array<'EASY' | 'MEDIUM' | 'HARD'>;
  utensilio?: string | string[];
  page?: string | string[];
}) {
  return RecipesPage({
    searchParams: Promise.resolve(searchParams ?? {}),
  });
}

describe('RecipesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAllRecipes.mockResolvedValue({
      recipes: recipeList,
      total: recipeList.length,
    });

    mockGetLatestRecipe.mockResolvedValue(recipeList[0]);
    mockGetRecipesByCategory.mockResolvedValue([]);
    mockGetRecipesByUtensil.mockResolvedValue([]);
  });

  it('renderiza o hero com título e descrição', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await renderPage());

    expect(
      screen.getByRole('heading', {
        name: /Receitas para aquecer o coração e a cozinha\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Descubra pratos criados por cozinheiros amadores/i),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /Pesquise por ingrediente, prato ou categoria/i,
      ),
    ).toBeInTheDocument();
  });

  it('não mostra o botão "Enviar nova receita" quando não há sessão', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await renderPage());

    expect(
      screen.queryByRole('link', { name: /Enviar nova receita/i }),
    ).not.toBeInTheDocument();
  });

  it('mostra o botão "Enviar nova receita" quando há usuário logado', async () => {
    mockGetServerSession.mockResolvedValueOnce({
      user: { id: '1', name: 'Douglas', email: 'douglas@example.com' },
    } as any);

    render(await renderPage());

    expect(
      screen.getByRole('link', { name: /Enviar nova receita/i }),
    ).toBeInTheDocument();
  });

  it('renderiza os cards de receitas retornados pela action', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await renderPage());

    expect(
      screen.getAllByRole('heading', { name: 'Bolo de cenoura' }).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByRole('heading', { name: 'Lasanha', level: 3 }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('quando filtrada, não tenta carregar blocos editoriais', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await renderPage({ q: 'Frango' }));

    expect(mockGetLatestRecipe).not.toHaveBeenCalled();
    expect(mockGetRecipesByCategory).not.toHaveBeenCalled();
    expect(mockGetRecipesByUtensil).not.toHaveBeenCalled();

    expect(mockGetAllRecipes).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'Frango',
      }),
    );
  });
});
