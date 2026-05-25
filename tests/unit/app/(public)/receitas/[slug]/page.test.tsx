import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RecipeDetailPage from '@/app/(public)/receitas/[slug]/page';

const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
const headersMock = vi.fn();
const getSessionMock = vi.fn();
const getRecipeBySlugMock = vi.fn();

vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

vi.mock('next/headers', () => ({
  headers: () => headersMock(),
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', async () => {
  const React = await import('react');

  return {
    __esModule: true,
    default: React.forwardRef(function MockNextImage(props: any, ref) {
      const { alt, src, fill, priority, ...rest } = props;
      return (
        <span
          ref={ref as any}
          role="img"
          aria-label={alt ?? ''}
          data-src={typeof src === 'string' ? src : ''}
          data-fill={fill ? 'true' : 'false'}
          data-priority={priority ? 'true' : 'false'}
          {...rest}
        />
      );
    }),
  };
});

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (args: unknown) => getSessionMock(args),
    },
  },
}));

vi.mock('@/features/recipes/actions/get-recipe-by-slug', () => ({
  getRecipeBySlug: (slug: string) => getRecipeBySlugMock(slug),
}));

const recipeBase = {
  id: 'recipe-1',
  slug: 'bolo-de-milho',
  title: 'Bolo de milho',
  summary: 'Fofo e cremoso',
  story: 'Receita de família',
  types: ['Bolo'],
  difficulty: 'EASY' as const,
  prepTimeMinutes: 15,
  cookTimeMinutes: 45,
  servings: 8,
  authorId: 'user-1',
  author: { id: 'user-1', name: 'Douglas' },
  nutritionSummary: 'Resumo nutricional',
  nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
  suggestions: 'Troque leite integral por desnatado.',
  images: [{ url: '/bolo.jpg', alt: 'Bolo de milho', isCover: true }],
  utensils: [{ utensil: { name: 'Forma' } }],
  sections: [
    {
      id: 'section-1',
      name: 'Massa',
      modeOfPreparation: 'Misture os ingredientes e asse.',
      ingredients: [
        { id: 'i1', originalText: '2 xícaras de milho', order: 0 },
        { id: 'i2', originalText: '1 xícara de leite', order: 1 },
      ],
    },
  ],
};

describe('RecipeDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers());
    getSessionMock.mockResolvedValue(null);
    getRecipeBySlugMock.mockResolvedValue(recipeBase);
  });

  it('renderiza a página com dados da receita e seções existentes', async () => {
    render(
      await RecipeDetailPage({
        params: Promise.resolve({ slug: 'bolo-de-milho' }),
      }),
    );

    expect(screen.getByText('Bolo de milho')).toBeInTheDocument();
    expect(screen.getByText('Fofo e cremoso')).toBeInTheDocument();
    expect(screen.getByText('Receita de família')).toBeInTheDocument();

    expect(
      screen.getAllByText(/Misture os ingredientes e asse\./i).length,
    ).toBeGreaterThan(0);
  });

  it('usa fallback de seção única quando não há sections', async () => {
    getRecipeBySlugMock.mockResolvedValueOnce({
      ...recipeBase,
      sections: [],
      ingredients: ['2 xícaras de milho', '1 xícara de leite'],
      modeOfPreparation: 'Misture tudo e asse.',
    });

    render(
      await RecipeDetailPage({
        params: Promise.resolve({ slug: 'bolo-de-milho' }),
      }),
    );

    expect(screen.getByText(/Ingredientes/i)).toBeInTheDocument();
    expect(screen.getByText(/Modo de preparo/i)).toBeInTheDocument();
    expect(screen.getByText('Misture tudo e asse.')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('mostra botão de edição quando o usuário é o autor', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1', name: 'Douglas' },
    });

    const ui = await RecipeDetailPage({
      params: Promise.resolve({ slug: 'bolo-de-milho' }),
    });

    render(ui);

    expect(
      screen.getByRole('link', { name: /Editar receita/i }),
    ).toBeInTheDocument();
  });

  it('chama notFound quando a receita não existe', async () => {
    getRecipeBySlugMock.mockResolvedValueOnce(null);

    await expect(
      RecipeDetailPage({ params: Promise.resolve({ slug: 'inexistente' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalled();
  });
});
