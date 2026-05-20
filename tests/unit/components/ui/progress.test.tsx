import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from '@/components/ui/progress';

describe('Progress', () => {
  it('renderiza a barra de progresso com valor informado', () => {
    const { container } = render(<Progress value={30} />);

    const root = screen.getByRole('progressbar');
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]',
    );

    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('data-slot', 'progress');
    expect(indicator).not.toBeNull();
    expect(indicator).toHaveStyle('transform: translateX(-70%)');
  });

  it('usa 0 quando value não é informado', () => {
    const { container } = render(<Progress />);

    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]',
    );

    expect(indicator).not.toBeNull();
    expect(indicator).toHaveStyle('transform: translateX(-100%)');
  });
});
