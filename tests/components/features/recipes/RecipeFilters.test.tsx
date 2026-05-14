import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeFilters } from '@/features/recipes/components/recipe-filters';

describe('RecipeFilters', () => {
  it('renderiza todos os filtros de tipo', () => {
    render(<RecipeFilters />);
    expect(screen.getByText('Todos os tipos')).toBeInTheDocument();
    expect(screen.getByText('Doce')).toBeInTheDocument();
    expect(screen.getByText('Salgada')).toBeInTheDocument();
    expect(screen.getByText('Bebida')).toBeInTheDocument();
    expect(screen.getByText('Outro')).toBeInTheDocument();
  });

  it('renderiza todos os filtros de dificuldade', () => {
    render(<RecipeFilters />);
    expect(screen.getByText('Todas as dificuldades')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Difícil')).toBeInTheDocument();
  });

  it('destaca o tipo ativo', () => {
    render(<RecipeFilters activeType="SWEET" />);
    const sweetLink = screen.getByText('Doce');
    expect(sweetLink).toHaveClass('bg-amber-500');
  });

  it('destaca a dificuldade ativa', () => {
    render(<RecipeFilters activeDifficulty="EASY" />);
    const easyLink = screen.getByText('Fácil');
    expect(easyLink).toHaveClass('bg-stone-700');
  });

  it('link "Todos os tipos" inclui difficulty quando ativa', () => {
    render(<RecipeFilters activeDifficulty="EASY" />);
    const link = screen.getByText('Todos os tipos');
    expect(link).toHaveAttribute('href', '/receitas?difficulty=EASY');
  });

  it('link de tipo inclui difficulty quando ativa', () => {
    render(<RecipeFilters activeDifficulty="HARD" />);
    const link = screen.getByText('Doce');
    expect(link).toHaveAttribute('href', '/receitas?type=SWEET&difficulty=HARD');
  });
});
