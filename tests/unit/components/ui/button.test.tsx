import Link from 'next/link';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button, buttonVariants } from '@/components/ui/button';

describe('Button', () => {
  it('renderiza como button por padrão', () => {
    render(<Button>Salvar</Button>);

    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('renderiza com variant e size customizados', () => {
    render(
      <Button variant="secondary" size="lg">
        Enviar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Enviar' });
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('renderiza com asChild usando link', () => {
    render(
      <Button asChild>
        <Link href="/receitas">Receitas</Link>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Receitas' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/receitas');
    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link).toHaveAttribute('data-variant', 'default');
    expect(link).toHaveAttribute('data-size', 'default');
  });

  it('buttonVariants retorna classes para variant e size', () => {
    const classes = buttonVariants({ variant: 'ghost', size: 'icon' });

    expect(classes).toContain('hover:bg-muted');
    expect(classes).toContain('size-7');
  });
});
