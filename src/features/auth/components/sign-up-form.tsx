"use client";

import Link from "next/link";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useSignUp } from "../hooks/use-sign-up";

import { GoogleAuthButton } from "./google-auth-button";

export function SignUpForm() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const {
    signUp,

    signUpWithGoogle,

    isSubmitting,

    error,
  } = useSignUp();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    signUp({
      name: form.get("name") as string,

      email: form.get("email") as string,

      password: form.get("password") as string,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor={nameId}
            className="mb-2 text-xs font-semibold uppercase tracking-wide"
          >
            Nome
          </FieldLabel>

          <FieldContent>
            <Input
              id={nameId}
              name="name"
              required
              placeholder="João Silva"
              className="
h-13
border-zinc-300
bg-white
focus-visible:border-amber-500
focus-visible:ring-0
"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel
            htmlFor={emailId}
            className="mb-2 text-xs font-semibold uppercase tracking-wide"
          >
            Email
          </FieldLabel>

          <FieldContent>
            <Input
              id={emailId}
              name="email"
              type="email"
              required
              placeholder="voce@email.com"
              className="
h-13
border-zinc-300
focus-visible:border-amber-500
focus-visible:ring-0
"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel
            htmlFor={passwordId}
            className="mb-2 text-xs font-semibold uppercase tracking-wide"
          >
            Senha
          </FieldLabel>

          <FieldContent>
            <Input
              id={passwordId}
              name="password"
              type="password"
              required
              placeholder="Mínimo 8 caracteres"
              className="
h-13
border-zinc-300
focus-visible:border-amber-500
focus-visible:ring-0
"
            />
          </FieldContent>
        </Field>

        {error && (
          <FieldError id={errorId} role="alert">
            {error}
          </FieldError>
        )}
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="
h-13
w-full
bg-amber-500
text-black
hover:bg-amber-400
"
      >
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>

      <GoogleAuthButton
        onClick={signUpWithGoogle}
        label="Continuar com Google"
      />

      <p
        className="
text-center
text-sm
text-zinc-500
"
      >
        Já possui conta?
        <Link
          href="/login"
          className="
ml-1
font-medium
text-zinc-900
hover:text-amber-500
"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
