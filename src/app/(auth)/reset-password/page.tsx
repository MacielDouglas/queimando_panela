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
      <ResetPasswordForm />
    </AuthShell>
  );
}
