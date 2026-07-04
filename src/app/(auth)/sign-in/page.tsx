import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

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
