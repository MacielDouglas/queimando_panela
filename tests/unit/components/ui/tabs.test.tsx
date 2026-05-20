import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

vi.mock('radix-ui', () => {
  const TabsContext = React.createContext<{
    value: string;
    setValue: (value: string) => void;
  } | null>(null);

  return {
    Tabs: {
      Root: ({
        children,
        value,
        defaultValue,
      }: {
        children: React.ReactNode;
        value?: string;
        defaultValue?: string;
      }) => {
        const [current, setCurrent] = React.useState(
          value ?? defaultValue ?? '',
        );

        return (
          <TabsContext.Provider
            value={{ value: current, setValue: setCurrent }}
          >
            <div>{children}</div>
          </TabsContext.Provider>
        );
      },

      List: ({ children, ...props }: React.ComponentProps<'div'>) => (
        <div {...props}>{children}</div>
      ),

      Trigger: ({
        children,
        value,
        ...props
      }: React.ComponentProps<'button'> & { value: string }) => {
        const ctx = React.useContext(TabsContext)!;
        const active = ctx.value === value;

        return (
          <button
            type="button"
            data-active={active ? 'true' : undefined}
            onClick={() => ctx.setValue(value)}
            {...props}
          >
            {children}
          </button>
        );
      },

      Content: ({
        children,
        value,
        ...props
      }: React.ComponentProps<'div'> & { value: string }) => {
        const ctx = React.useContext(TabsContext)!;

        if (ctx.value !== value) return null;

        return <div {...props}>{children}</div>;
      },
    },
  };
});

describe('Tabs', () => {
  it('renderiza e alterna conteúdo entre abas', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="ingredientes">
        <TabsList>
          <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
          <TabsTrigger value="preparo">Preparo</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredientes">Conteúdo ingredientes</TabsContent>
        <TabsContent value="preparo">Conteúdo preparo</TabsContent>
      </Tabs>,
    );

    expect(screen.getByText('Conteúdo ingredientes')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo preparo')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Preparo' }));

    expect(screen.getByText('Conteúdo preparo')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo ingredientes')).not.toBeInTheDocument();
  });

  it('aplica orientação e variante line', () => {
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <TabsList variant="line">
          <TabsTrigger value="a">Aba A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Conteúdo A</TabsContent>
      </Tabs>,
    );

    expect(
      screen.getByText('Aba A').closest('[data-slot="tabs-list"]'),
    ).toHaveAttribute('data-variant', 'line');
  });
});
