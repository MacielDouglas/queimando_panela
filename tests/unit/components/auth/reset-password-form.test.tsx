import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    resetPassword: vi.fn(),
  },
}));

import { ResetPasswordForm } from '@/components/auth/reset-password-form';

describe('ResetPasswordForm', () => {
  it('exibe mensagem de link inválido quando não há token', () => {
    render(<ResetPasswordForm />);

    expect(
      screen.getByText(/link de redefinição é inválido/i),
    ).toBeInTheDocument();
  });

  it('tem link para solicitar novo link', () => {
    render(<ResetPasswordForm />);

    const link = screen.getByRole('link', { name: /solicitar novo link/i });
    expect(link).toHaveAttribute('href', '/forgot-password');
  });
});
