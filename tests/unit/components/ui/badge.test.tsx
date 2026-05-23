import Link from 'next/link';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renderiza com variant default por padrão', () => {
    render(<Badge>Nova</Badge>);

    const badge = screen.getByText('Nova');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge).toHaveAttribute('data-variant', 'default');
  });

  it('renderiza com variant custom', () => {
    render(<Badge variant="destructive">Erro</Badge>);

    const badge = screen.getByText('Erro');
    expect(badge).toHaveAttribute('data-variant', 'destructive');
  });

  it('mescla className customizada', () => {
    render(<Badge className="minha-classe">Texto</Badge>);

    expect(screen.getByText('Texto')).toHaveClass('minha-classe');
  });

  it('renderiza como child quando asChild=true', () => {
    render(
      <Badge asChild>
        <Link href="/receitas">Receitas</Link>
      </Badge>,
    );

    const link = screen.getByRole('link', { name: 'Receitas' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/receitas');
    expect(link).toHaveAttribute('data-slot', 'badge');
  });
});
