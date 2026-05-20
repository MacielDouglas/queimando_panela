import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

vi.mock('radix-ui', () => ({
  Tooltip: {
    Provider: ({
      children,
      delayDuration: _delayDuration,
      ...props
    }: React.ComponentProps<'div'> & { delayDuration?: number }) => (
      <div data-testid="tooltip-provider" {...props}>
        {children}
      </div>
    ),
    Root: ({ children, ...props }: React.ComponentProps<'div'>) => (
      <div data-testid="tooltip-root" {...props}>
        {children}
      </div>
    ),
    Trigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Content: ({
      children,
      sideOffset: _sideOffset,
      ...props
    }: React.ComponentProps<'div'> & { sideOffset?: number }) => (
      <div {...props}>{children}</div>
    ),
    Arrow: (props: React.ComponentProps<'div'>) => (
      <div data-testid="tooltip-arrow" {...props} />
    ),
  },
}));

describe('Tooltip', () => {
  it('renderiza provider com delayDuration padrão igual a 0', () => {
    render(<TooltipProvider>Conteúdo</TooltipProvider>);

    const provider = screen.getByTestId('tooltip-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveAttribute('data-slot', 'tooltip-provider');
  });

  it('renderiza trigger e content', () => {
    render(
      <Tooltip>
        <TooltipTrigger>Dica</TooltipTrigger>
        <TooltipContent sideOffset={8}>Conteúdo da dica</TooltipContent>
      </Tooltip>,
    );

    expect(screen.getByText('Dica')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo da dica')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-arrow')).toBeInTheDocument();
  });

  it('aplica className extra no content', () => {
    render(<TooltipContent className="custom-tooltip">Texto</TooltipContent>);

    expect(screen.getByText('Texto').className).toContain('custom-tooltip');
  });
});
