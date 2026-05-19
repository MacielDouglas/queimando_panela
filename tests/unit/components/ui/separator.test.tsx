import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('renderiza separator com orientação padrão', () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });

  it('renderiza separator vertical', () => {
    render(<Separator data-testid="separator" orientation="vertical" />);
    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });
});
