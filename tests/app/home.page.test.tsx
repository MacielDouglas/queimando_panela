import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Home from '@/app/page';

const { mockRecipes, mockClassicRows } = vi.hoisted(() => {
  const recipes = [
    {
      id: '1',
      slug: 'bolo-de-cenoura',
      title: 'Bolo de Cenoura',
      summary: 'Fofo e delicioso',
      types: ['Bolo'],
      difficulty: 'EASY' as const,
      prepTimeMinutes: 15,
      cookTimeMinutes: 35,
      createdAt: new Date(),
      coverUrl: '/bolo.jpg',
      authorName: 'Maria',
    },
    {
      id: '2',
      slug: 'feijoada',
      title: 'Feijoada Completa',
      summary: 'Tradicional',
      types: ['Prato Principal'],
      difficulty: 'MEDIUM' as const,
      prepTimeMinutes: 30,
      cookTimeMinutes: 120,
      createdAt: new Date(),
      coverUrl: '/feijoada.jpg',
      authorName: 'João',
    },
    {
      id: '3',
      slug: 'pao-de-queijo',
      title: 'Pão de Queijo',
      summary: 'Minas Gerais',
      types: ['Lanche'],
      difficulty: 'EASY' as const,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      createdAt: new Date(),
      coverUrl: '/pao.jpg',
      authorName: 'Ana',
    },
  ];

  const classicRows = [
    { type: 'Bolo', recipes: [recipes[0]] },
    { type: 'Prato Principal', recipes: [recipes[1]] },
    { type: 'Lanche', recipes: [recipes[2]] },
    { type: 'Sobremesa', recipes: [recipes[0]] },
  ];

  return { mockRecipes: recipes, mockClassicRows: classicRows };
});

vi.mock('@/features/recipes/actions/get-latest-recipes', () => ({
  getLatestRecipes: vi.fn().mockResolvedValue(mockRecipes),
}));

vi.mock('@/features/recipes/actions/get-classic-recipes', () => ({
  getClassicRecipes: vi.fn().mockResolvedValue(mockClassicRows),
}));

describe('Home', () => {
  it('renderiza o título principal "Queimando Panela"', async () => {
    render(await Home());

    expect(
      screen.getByRole('heading', { name: /Queimando Panela/i }),
    ).toBeInTheDocument();
  });

  it('renderiza o subtítulo convidando a ver receitas', async () => {
    render(await Home());

    expect(
      screen.getByText(/Descubra pratos criados por cozinheiros amadores/i),
    ).toBeInTheDocument();
  });

  it('renderiza botões de ação principal', async () => {
    render(await Home());

    expect(
      screen.getByRole('link', { name: /Ver todas as receitas/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Enviar minha receita/i }),
    ).toBeInTheDocument();
  });

  it('renderiza seção de últimas receitas', async () => {
    render(await Home());

    expect(
      screen.getByRole('heading', { name: /O que acabou de sair do forno/i }),
    ).toBeInTheDocument();
  });

  it('renderiza seção de receitas clássicas', async () => {
    render(await Home());

    expect(
      screen.getByRole('heading', { name: /Receitas que nunca saem de moda/i }),
    ).toBeInTheDocument();
  });
});
