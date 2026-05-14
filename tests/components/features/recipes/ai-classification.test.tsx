import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AiClassification } from '@/features/recipes/components/ai-classification';
import type { ParsedClassification } from '@/features/recipes/types/recipe-form.types';

const mockClassification: ParsedClassification = {
  primaryGroup: 'CARBOIDRATOS',
  mainCategories: ['bolo'],
  nutritionTags: ['rico em açúcar'],
  courseTypes: ['sobremesa'],
  typeSuggestions: ['Bolo', 'Torta'], // ← adicione
};

describe('AiClassification', () => {
  it('mostra mensagem quando classification é null', () => {
    render(<AiClassification classification={null} />);
    expect(screen.getByText(/gere a análise/i)).toBeDefined();
  });

  it('renderiza grupo principal', () => {
    render(<AiClassification classification={mockClassification} />);
    expect(screen.getByText('CARBOIDRATOS')).toBeDefined();
  });

  it('renderiza todas as categorias', () => {
    render(<AiClassification classification={mockClassification} />);
    expect(screen.getByText('bolo')).toBeDefined();
    expect(screen.getByText('sobremesa')).toBeDefined();
  });

  it('renderiza tags de nutrição', () => {
    render(<AiClassification classification={mockClassification} />);
    expect(screen.getByText('rico em açúcar')).toBeDefined();
  });

  it('renderiza ocasiões', () => {
    render(<AiClassification classification={mockClassification} />);
    expect(screen.getByText('sobremesa')).toBeInTheDocument();
  });
});
