import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SignUpPage from '@/app/(auth)/criar-conta/page';

vi.mock('@/features/auth/components/SignUpForm', () => ({
  SignUpForm: () => <div data-testid="sign-up-form">SignUpForm</div>,
}));

describe('SignUpPage', () => {
  it('renderiza o título principal e os textos da página', () => {
    render(<SignUpPage />);

    expect(
      screen.getByRole('heading', {
        name: /Crie sua conta no Queimando Panela/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/A cozinha está aberta/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Entre para uma comunidade apaixonada por receitas/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Sua próxima receita começa aqui/i),
    ).toBeInTheDocument();
  });

  it('renderiza o card de cadastro com formulário', () => {
    render(<SignUpPage />);

    expect(
      screen.getByRole('heading', { name: /^Criar conta$/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Comece sua jornada culinária no Queimando Panela/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
  });
});