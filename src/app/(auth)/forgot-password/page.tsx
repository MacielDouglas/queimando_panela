import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      description="Informe seu e-mail para receber as instruções de acesso."
      footerText="Lembrou sua senha?"
      footerLinkHref="/sign-in"
      footerLinkLabel="Entrar"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
