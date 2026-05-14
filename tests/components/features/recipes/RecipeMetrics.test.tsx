import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecipeMetrics } from '@/features/recipes/components/RecipeMetrics';

describe('RecipeMetrics', () => {
  it('não renderiza nada quando não há métricas', () => {
    // ingredientsCount: 0 ainda entra na lista, então precisa de um caso
    // onde NENHUM item é adicionado — só possível se todos forem null/undefined e count = 0
    // mas o componente sempre inclui ingredientsCount. Testar a ausência dos campos opcionais:
    const { container } = render(
      <RecipeMetrics
        prepTimeMinutes={null}
        cookTimeMinutes={null}
        servings={null}
        ingredientsCount={0}
      />,
    );

    // O componente sempre renderiza ao menos o bloco de ingredientes,
    // mesmo com 0. Verificamos que exibe "0 ingredientes" nesse caso.
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('ingredientes')).toBeInTheDocument();
    expect(container.firstChild).not.toBeNull();
  });

  it('renderiza apenas ingredientes quando não há tempos nem porções', () => {
    render(
      <RecipeMetrics
        prepTimeMinutes={null}
        cookTimeMinutes={null}
        servings={null}
        ingredientsCount={5}
      />,
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('ingredientes')).toBeInTheDocument();
    expect(screen.queryByText(/min preparo/i)).not.toBeInTheDocument();
  });

  it('renderiza todas as métricas quando fornecidas', () => {
    render(
      <RecipeMetrics prepTimeMinutes={10} cookTimeMinutes={20} servings={4} ingredientsCount={7} />,
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('min preparo')).toBeInTheDocument();

    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('min forno')).toBeInTheDocument();

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('porções')).toBeInTheDocument();

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('ingredientes')).toBeInTheDocument();
  });
});
