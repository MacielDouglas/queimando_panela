import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UtensilsEditor } from '@/features/recipes/components/utensils-editor';
import type { ParsedUtensil } from '@/features/recipes/types/recipe-form.types';

const mockUtensils: ParsedUtensil[] = [{ name: 'tigela' }, { name: 'liquidificador' }];

describe('UtensilsEditor', () => {
  it('mostra mensagem quando lista está vazia', () => {
    render(<UtensilsEditor utensils={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/nenhum utensílio/i)).toBeDefined();
  });

  it('renderiza input para cada utensílio', () => {
    render(<UtensilsEditor utensils={mockUtensils} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('tigela')).toBeDefined();
    expect(screen.getByDisplayValue('liquidificador')).toBeDefined();
  });

  it('chama onChange ao editar utensílio', async () => {
    const onChange = vi.fn();
    render(<UtensilsEditor utensils={mockUtensils} onChange={onChange} />);
    const input = screen.getByDisplayValue('tigela');
    await userEvent.clear(input);
    await userEvent.type(input, 'panela');
    expect(onChange).toHaveBeenCalled();
  });
});
