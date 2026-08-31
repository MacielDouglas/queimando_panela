import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata: Metadata = {
  title: 'Entrar',
  description:
    'Entre na sua conta do Queimando Panela para salvar favoritas e enviar receitas.',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Entrar"
      description="Acesse sua conta para salvar favoritas e enviar receitas."
      footerText="Ainda não tem conta?"
      footerLinkHref="/sign-up"
      footerLinkLabel="Criar conta"
    >
      <SignInForm />
    </AuthShell>
  );
}
