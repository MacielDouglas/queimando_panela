import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { AuthShell } from '@/components/auth/auth-shell';

describe('AuthShell', () => {
  it('renderiza o título', () => {
    render(
      <AuthShell
        title="Entrar"
        description="Acesse sua conta"
        footerText="Não tem conta?"
        footerLinkHref="/sign-up"
        footerLinkLabel="Criar conta"
      >
        <div>Form</div>
      </AuthShell>,
    );

    expect(
      screen.getByRole('heading', { name: /entrar/i }),
    ).toBeInTheDocument();
  });

  it('renderiza a descrição', () => {
    render(
      <AuthShell
        title="Entrar"
        description="Acesse sua conta"
        footerText="Não tem conta?"
        footerLinkHref="/sign-up"
        footerLinkLabel="Criar conta"
      >
        <div>Form</div>
      </AuthShell>,
    );

    expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
  });

  it('renderiza os children', () => {
    render(
      <AuthShell
        title="Entrar"
        description="Acesse sua conta"
        footerText="Não tem conta?"
        footerLinkHref="/sign-up"
        footerLinkLabel="Criar conta"
      >
        <div>Form content</div>
      </AuthShell>,
    );

    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('renderiza o link do footer', () => {
    render(
      <AuthShell
        title="Entrar"
        description="Acesse sua conta"
        footerText="Não tem conta?"
        footerLinkHref="/sign-up"
        footerLinkLabel="Criar conta"
      >
        <div>Form</div>
      </AuthShell>,
    );

    const link = screen.getByRole('link', { name: /criar conta/i });
    expect(link).toHaveAttribute('href', '/sign-up');
  });

  it('renderiza o texto do footer', () => {
    render(
      <AuthShell
        title="Entrar"
        description="Acesse sua conta"
        footerText="Não tem conta?"
        footerLinkHref="/sign-up"
        footerLinkLabel="Criar conta"
      >
        <div>Form</div>
      </AuthShell>,
    );

    expect(screen.getByText('Não tem conta?')).toBeInTheDocument();
  });

  it('renderiza o eyebrow "Queimando Panela"', () => {
    const { container } = render(
      <AuthShell
        title="Entrar"
        description="Acesse sua conta"
        footerText="Não tem conta?"
        footerLinkHref="/sign-up"
        footerLinkLabel="Criar conta"
      >
        <div>Form</div>
      </AuthShell>,
    );

    const eyebrow = container.querySelector('.eyebrow-queimando-panela');
    expect(eyebrow).toBeInTheDocument();
  });
});
