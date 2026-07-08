import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

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
