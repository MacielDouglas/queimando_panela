import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RecipesPage from '@/app/(public)/receitas/page';

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

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
}));

const useSessionMock = vi.fn();

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    get useSession() {
      return useSessionMock;
    },
  },
}));

vi.mock('@/features/recipes/actions/get-all-recipes', () => ({
  getAllRecipes: vi.fn(),
}));

vi.mock('@/features/recipes/actions/get-recipe-category-counts', () => ({
  getRecipeCategoryCounts: vi.fn(),
}));

vi.mock('@/features/recipes/actions/get-recipe-filter-options', () => ({
  getRecipeFilterOptions: vi.fn().mockResolvedValue({
    categories: [],
    types: [],
    utensils: [],
    ingredients: [],
  }),
}));

import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';
import { getRecipeCategoryCounts } from '@/features/recipes/actions/get-recipe-category-counts';
import { getRecipeFilterOptions } from '@/features/recipes/actions/get-recipe-filter-options';

const mockGetAllRecipes = vi.mocked(getAllRecipes);
const mockGetRecipeCategoryCounts = vi.mocked(getRecipeCategoryCounts);
const mockGetRecipeFilterOptions = vi.mocked(getRecipeFilterOptions);

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

    useSessionMock.mockReturnValue({ data: null, isPending: false });

    mockGetAllRecipes.mockResolvedValue({
      recipes: recipeList,
      total: recipeList.length,
    });

    mockGetRecipeCategoryCounts.mockResolvedValue([]);
    mockGetRecipeFilterOptions.mockResolvedValue({
      categories: [],
      types: [],
      utensils: [],
      ingredients: [],
    });
  });

  it('renderiza o hero com título e descrição', async () => {
    render(await renderPage());

    expect(
      screen.getByRole('heading', {
        name: /Receitas para aquecer/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Ingrediente, prato ou categoria/i),
    ).toBeInTheDocument();
  });

  it('não mostra o botão "Publicar receita" quando não há sessão', async () => {
    useSessionMock.mockReturnValue({ data: null, isPending: false });

    render(await renderPage());

    expect(
      screen.queryByRole('link', { name: /Publicar receita/i }),
    ).not.toBeInTheDocument();
  });

  it('mostra o botão "Publicar receita" quando há usuário logado', async () => {
    useSessionMock.mockReturnValue({
      data: {
        user: { id: '1', name: 'Douglas', email: 'douglas@example.com' },
      },
      isPending: false,
    });

    render(await renderPage());

    expect(
      screen.getByRole('link', { name: /Publicar receita/i }),
    ).toBeInTheDocument();
  });

  it('renderiza os cards de receitas retornados pela action', async () => {
    render(await renderPage());

    expect(
      screen.getAllByRole('heading', { name: 'Bolo de cenoura' }).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByRole('heading', { name: 'Lasanha', level: 3 }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('quando filtrada, busca só a grade e pula contadores', async () => {
    render(await renderPage({ q: 'Frango' }));

    expect(mockGetRecipeCategoryCounts).not.toHaveBeenCalled();

    expect(mockGetAllRecipes).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'Frango',
      }),
    );
  });
});
