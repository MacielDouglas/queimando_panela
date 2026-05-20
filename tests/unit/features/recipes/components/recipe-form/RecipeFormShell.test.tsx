import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecipeFormShell } from '@/features/recipes/components/recipe-form/RecipeFormShell';

vi.mock('@/features/recipes/actions/create-recipe', () => ({
  createRecipe: vi.fn(),
}));

describe('RecipeFormShell', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('não analisa quando o formulário é inválido', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    render(<RecipeFormShell />);

    fireEvent.click(
      screen.getByRole('button', { name: /analisar receita com ia/i }),
    );

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  it('analisa receita válida e renderiza painel de revisão', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          title: 'Estrogonofe',
          summary: 'Cremoso e saboroso.',
          difficulty: 'MEDIUM',
          difficultyLabel: 'Fácil a Médio',
          type: 'Prato principal',
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          suggestions: 'Troque por frango.',
          nutritionSummary: 'Resumo nutricional.',
          nutritionPer100g: [{ nutrient: 'Calorias', quantity: '250 kcal' }],
          utensils: ['Frigideira'],
          sections: [
            {
              name: 'Receita',
              ingredients: ['300g de filé'],
              modeOfPreparation: '1. Refogue.',
            },
          ],
        },
      }),
    } as Response);

    render(<RecipeFormShell />);

    fireEvent.change(screen.getByLabelText(/título da receita/i), {
      target: { value: 'Estrogonofe' },
    });

    fireEvent.change(screen.getByLabelText(/história da receita/i), {
      target: { value: 'Receita clássica da família do domingo' },
    });

    fireEvent.change(screen.getByLabelText(/^ingredientes$/i), {
      target: { value: '300g de filé\n200ml de creme de leite' },
    });

    fireEvent.change(screen.getByLabelText(/modo de preparo/i), {
      target: {
        value:
          'Refogue a cebola.\nAdicione a carne.\nFinalize com creme de leite.',
      },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /analisar receita com ia/i }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Fácil a Médio')).toBeInTheDocument();
    });

    expect(screen.getByText('Estrogonofe')).toBeInTheDocument();
  });
});
