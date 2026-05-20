import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

describe('Card', () => {
  it('renderiza estrutura completa do card', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
          <CardDescription>Descrição</CardDescription>
          <CardAction>Ação</CardAction>
        </CardHeader>
        <CardContent>Conteúdo</CardContent>
        <CardFooter>Rodapé</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Ação')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Rodapé')).toBeInTheDocument();
  });

  it('aplica o tamanho sm', () => {
    render(<Card size="sm">Card pequeno</Card>);

    const card = screen.getByText('Card pequeno');
    expect(card.closest('[data-slot="card"]')).toHaveAttribute(
      'data-size',
      'sm',
    );
  });
});
