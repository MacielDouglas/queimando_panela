import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeForm } from '@/features/recipes/components/recipe-form';

describe('RecipeForm', () => {
  it('renderiza o formulário sem quebrar', () => {
    render(<RecipeForm />);
    expect(screen.getByRole('button', { name: /gerar com ia/i })).toBeInTheDocument();
  });

  it('contém campo de título', () => {
    render(<RecipeForm />);
    expect(screen.getByLabelText('Título')).toBeDefined();
  });

  it('contém botão de submit', () => {
    render(<RecipeForm />);
    expect(screen.getByRole('button', { name: /salvar receita/i })).toBeDefined();
  });

  it('contém campo de modo de preparo', () => {
    render(<RecipeForm />);
    // Nome exato do label conforme o DOM
    expect(screen.getByLabelText('Modo de preparo')).toBeDefined();
  });

  it('contém selects de dificuldade e tipo', () => {
    render(<RecipeForm />);
    expect(screen.getByText('Dificuldade')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
  });

  it('contém campos de tempo e porções', () => {
    render(<RecipeForm />);
    expect(screen.getByLabelText('Preparo (min)')).toBeDefined();
    expect(screen.getByLabelText('Porções')).toBeDefined();
  });

  it('contém botão de gerar com IA', () => {
    render(<RecipeForm />);
    expect(screen.getByRole('button', { name: /gerar com ia/i })).toBeDefined();
  });
});
