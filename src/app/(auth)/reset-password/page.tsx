import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Nova senha',
  description: 'Defina uma nova senha para voltar ao Queimando Panela.',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Nova senha"
      description="Defina uma nova senha para voltar ao seu acesso."
      footerText="Lembrou sua senha?"
      footerLinkHref="/sign-in"
      footerLinkLabel="Entrar"
    >
      <Suspense fallback={<ResetPasswordFormFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}

function ResetPasswordFormFallback() {
  return (
    <div className="space-y-5">
      <div className="h-11 w-full animate-pulse rounded-none bg-stone-100" />
      <div className="h-11 w-full animate-pulse rounded-none bg-stone-100" />
      <div className="h-11 w-full animate-pulse rounded-none bg-[var(--paper-strong)]" />
    </div>
  );
}
