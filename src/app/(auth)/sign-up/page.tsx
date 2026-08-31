import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata: Metadata = {
  title: 'Criar conta',
  description:
    'Crie sua conta no Queimando Panela e compartilhe receitas com história.',
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Criar conta"
      description="Cadastre-se para compartilhar receitas e montar sua coleção."
      footerText="Já tem conta?"
      footerLinkHref="/sign-in"
      footerLinkLabel="Entrar"
    >
      <SignUpForm />
    </AuthShell>
  );
}
