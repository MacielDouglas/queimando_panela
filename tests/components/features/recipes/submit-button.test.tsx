import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmitButton } from '@/features/recipes/components/submit-button';

vi.mock('react-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-dom')>();
  return {
    ...original,
    useFormStatus: vi.fn(() => ({ pending: false })),
  };
});

describe('SubmitButton', () => {
  it('renderiza botão com texto padrão quando não está enviando', () => {
    render(<SubmitButton />);
    expect(screen.getByRole('button', { name: /salvar receita/i })).toBeDefined();
  });

  it('botão não está desabilitado por padrão', () => {
    render(<SubmitButton />);
    const button = screen.getByRole('button');
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it('mostra texto de loading e desabilita quando pending=true', async () => {
    const { useFormStatus } = await import('react-dom');
    vi.mocked(useFormStatus).mockReturnValue({ pending: true } as never);
    render(<SubmitButton />);
    const button = screen.getByRole('button');
    expect(button.textContent).toMatch(/salvando/i);
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });
});
