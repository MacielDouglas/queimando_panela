import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IngredientsEditor } from '@/features/recipes/components/ingredients-editor';
import type { ParsedIngredient } from '@/features/recipes/types/recipe-form.types';

const mockIngredient: ParsedIngredient = {
  name: 'banana',
  amount: '3',
  unit: 'unidades',
  originalText: '3 bananas',
};

describe('IngredientsEditor', () => {
  it('mostra mensagem quando lista está vazia', () => {
    render(<IngredientsEditor ingredients={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/nenhum ingrediente/i)).toBeDefined();
  });

  it('renderiza inputs para cada ingrediente', () => {
    render(<IngredientsEditor ingredients={[mockIngredient]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('banana')).toBeDefined();
    expect(screen.getByDisplayValue('3')).toBeDefined();
    expect(screen.getByDisplayValue('unidades')).toBeDefined();
  });

  it('chama onChange ao editar nome do ingrediente', async () => {
    const onChange = vi.fn();
    render(<IngredientsEditor ingredients={[mockIngredient]} onChange={onChange} />);
    const input = screen.getByDisplayValue('banana');
    await userEvent.clear(input);
    await userEvent.type(input, 'maçã');
    expect(onChange).toHaveBeenCalled();
  });

  it('mostra sugestões quando inferred=true', () => {
    const ingredient: ParsedIngredient = {
      ...mockIngredient,
      inferred: true,
      suggestions: ['1 colher de banana', '2 colheres de banana'],
    };
    render(<IngredientsEditor ingredients={[ingredient]} onChange={vi.fn()} />);
    expect(screen.getByText(/sugestões/i)).toBeDefined();
  });

  it("edita o campo 'amount' do ingrediente", async () => {
    const onChange = vi.fn();
    render(<IngredientsEditor ingredients={[mockIngredient]} onChange={onChange} />);
    const amountInput = screen.getByDisplayValue('3');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '5');
    expect(onChange).toHaveBeenCalled();
  });

  it("edita o campo 'unit' do ingrediente", async () => {
    const onChange = vi.fn();
    render(<IngredientsEditor ingredients={[mockIngredient]} onChange={onChange} />);
    const unitInput = screen.getByDisplayValue('unidades');
    await userEvent.clear(unitInput);
    await userEvent.type(unitInput, 'kg');
    expect(onChange).toHaveBeenCalled();
  });

  it("edita o campo 'name' do ingrediente", async () => {
    const onChange = vi.fn();
    render(<IngredientsEditor ingredients={[mockIngredient]} onChange={onChange} />);
    const nameInput = screen.getByPlaceholderText('Ingrediente');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'maçã');
    expect(onChange).toHaveBeenCalled();
  });

  it('converte amount vazio para null ao editar', async () => {
    const onChange = vi.fn();
    render(<IngredientsEditor ingredients={[mockIngredient]} onChange={onChange} />);
    const amountInput = screen.getByPlaceholderText('Qtd.');
    await userEvent.clear(amountInput);
    // Ao limpar o campo, onChange é chamado com amount: null
    const lastCall = onChange.mock.calls.at(-1)?.[0] as ParsedIngredient[];
    expect(lastCall?.[0]?.amount).toBeNull();
  });
});
