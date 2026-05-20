import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

describe('Alert', () => {
  it('renderiza com role alert e conteúdo interno', () => {
    render(
      <Alert>
        <AlertTitle>Título do alerta</AlertTitle>
        <AlertDescription>Descrição do alerta</AlertDescription>
        <AlertAction>Ação</AlertAction>
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('data-slot', 'alert');
    expect(screen.getByText('Título do alerta')).toBeInTheDocument();
    expect(screen.getByText('Descrição do alerta')).toBeInTheDocument();
    expect(screen.getByText('Ação')).toBeInTheDocument();
  });

  it('aplica a variante destructive', () => {
    render(<Alert variant="destructive">Erro crítico</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Erro crítico');
    expect(alert.className).toContain('text-destructive');
  });

  it('aceita className adicional nos subcomponentes', () => {
    render(
      <AlertTitle className="custom-title">Título customizado</AlertTitle>,
    );

    expect(screen.getByText('Título customizado').className).toContain(
      'custom-title',
    );
  });
});
