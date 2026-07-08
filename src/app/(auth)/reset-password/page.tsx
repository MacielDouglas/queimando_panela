import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

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
      <div className="h-11 w-full animate-pulse rounded-none bg-amber-100" />
    </div>
  );
}
