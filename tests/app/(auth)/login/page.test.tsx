import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SignInPage from '@/app/(auth)/login/page';

vi.mock('@/features/auth/components/SignInForm', () => ({
  SignInForm: () => <div data-testid="sign-in-form">SignInForm</div>,
}));

describe('SignInPage', () => {
  it('renderiza o título principal e os textos da página', () => {
    render(<SignInPage />);

    expect(
      screen.getByRole('heading', { name: /Entre no Queimando Panela/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Bem-vindo de volta/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Receitas autorais, histórias culinárias/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/A cozinha já está quente/i)).toBeInTheDocument();
  });

  it('renderiza o card de login com formulário', () => {
    render(<SignInPage />);

    expect(
      screen.getByRole('heading', { name: /^Entrar$/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Continue cozinhando experiências no Queimando Panela/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
  });
});
