import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

vi.mock('radix-ui', () => ({
  Dialog: {
    Root: ({ children, ...props }: React.ComponentProps<'div'>) => (
      <div data-testid="dialog-root" {...props}>
        {children}
      </div>
    ),
    Trigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
    Portal: ({ children, ...props }: React.ComponentProps<'div'>) => (
      <div data-testid="dialog-portal" {...props}>
        {children}
      </div>
    ),
    Close: ({
      children,
      asChild,
      ...props
    }: React.ComponentProps<'button'> & { asChild?: boolean }) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, props);
      }

      return (
        <button type="button" {...props}>
          {children}
        </button>
      );
    },
    Overlay: (props: React.ComponentProps<'div'>) => <div {...props} />,
    Content: (props: React.ComponentProps<'div'>) => <div {...props} />,
    Title: (props: React.ComponentProps<'div'>) => <div {...props} />,
    Description: (props: React.ComponentProps<'div'>) => <div {...props} />,
  },
}));

describe('Dialog', () => {
  it('renderiza conteúdo e botão de fechar por padrão', () => {
    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título</DialogTitle>
            <DialogDescription>Descrição</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Abrir')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('não renderiza o botão de fechar quando showCloseButton é false', () => {
    render(
      <Dialog>
        <DialogContent showCloseButton={false}>Conteúdo</DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('renderiza footer com botão close opcional', () => {
    render(
      <DialogFooter showCloseButton>
        <span>Ação principal</span>
      </DialogFooter>,
    );

    expect(screen.getByText('Ação principal')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renderiza slots auxiliares', () => {
    render(
      <>
        <DialogPortal>Portal</DialogPortal>
        <DialogOverlay>Overlay</DialogOverlay>
        <DialogClose>Fechar</DialogClose>
      </>,
    );

    expect(screen.getByText('Portal')).toBeInTheDocument();
    expect(screen.getByText('Overlay')).toBeInTheDocument();
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });
});
