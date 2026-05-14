import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TypeSelector } from '@/features/recipes/components/type-selector';

describe('TypeSelector', () => {
  it('renderiza campo de input', () => {
    render(<TypeSelector value="" suggestions={[]} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('não renderiza chips quando suggestions está vazio', () => {
    render(<TypeSelector value="" suggestions={[]} onChange={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renderiza chips de sugestão quando fornecidos', () => {
    render(<TypeSelector value="" suggestions={['Bolo', 'Torta']} onChange={vi.fn()} />);
    expect(screen.getByText('Bolo')).toBeInTheDocument();
    expect(screen.getByText('Torta')).toBeInTheDocument();
  });

  it('destaca chip quando value corresponde à sugestão', () => {
    render(<TypeSelector value="Bolo" suggestions={['Bolo', 'Torta']} onChange={vi.fn()} />);
    expect(screen.getByText('Bolo')).toHaveClass('bg-amber-500');
    expect(screen.getByText('Torta')).not.toHaveClass('bg-amber-500');
  });

  it('chama onChange ao clicar em chip', () => {
    const onChange = vi.fn();
    render(<TypeSelector value="" suggestions={['Bolo', 'Torta']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Bolo'));
    expect(onChange).toHaveBeenCalledWith('Bolo');
  });

  it('chama onChange ao digitar no input', () => {
    const onChange = vi.fn();
    render(<TypeSelector value="" suggestions={[]} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Salada' } });
    expect(onChange).toHaveBeenCalledWith('Salada');
  });

  it('usa placeholder diferente quando há sugestões', () => {
    render(<TypeSelector value="" suggestions={['Bolo']} onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Selecione acima ou digite...')).toBeInTheDocument();
  });
});
