import { render, screen } from '@testing-library/react';
import RecipesPage from '@/app/(public)/receitas/page';
import { vi } from 'vitest';

// Mock básico de next/link e next/image para RTL
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

// Mock do getServerSession
vi.mock('@/lib/get-server-session', () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from '@/lib/get-server-session';

const mockGetServerSession = getServerSession as unknown as ReturnType<
  typeof vi.fn
>;

describe('RecipesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o hero com título e descrição', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await RecipesPage());

    expect(
      screen.getByRole('heading', {
        name: /Receitas para aquecer a alma e a cozinha\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Descubra pratos criados por cozinheiros amadores/i),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Busque por massas, bolos, carnes/i),
    ).toBeInTheDocument();
  });

  it('não mostra o botão "Enviar nova receita" quando não há sessão', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await RecipesPage());

    expect(
      screen.queryByRole('link', { name: /Enviar nova receita/i }),
    ).not.toBeInTheDocument();
  });

  it('mostra o botão "Enviar nova receita" quando há usuário logado', async () => {
    mockGetServerSession.mockResolvedValueOnce({
      user: { id: '1', name: 'Douglas', email: 'douglas@example.com' },
    });

    render(await RecipesPage());

    expect(
      screen.getByRole('link', { name: /Enviar nova receita/i }),
    ).toBeInTheDocument();
  });

  it('renderiza as categorias de receitas', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await RecipesPage());

    const categorias = [
      'Massas',
      'Sobremesas',
      'Carnes',
      'Vegano',
      'Café da manhã',
      'Bolos',
      'Brasileira',
    ];

    for (const categoria of categorias) {
      expect(
        screen.getByRole('button', { name: categoria }),
      ).toBeInTheDocument();
    }
  });

  it('renderiza todos os cards de receitas em destaque', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    render(await RecipesPage());

    // títulos do array estático `recipes`
    const titles = [
      'Lasanha cremosa de queijo',
      'Frango assado com ervas',
      'Bolo fofinho de cenoura',
      'Risoto de cogumelos',
      'Panquecas americanas',
      'Macarrão ao molho rústico',
    ];

    for (const title of titles) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }

    expect(screen.getAllByRole('article')).toHaveLength(titles.length);
  });
});
