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
import { useSignIn } from "../hooks/use-sign-in";
import { GoogleAuthButton } from "./google-auth-button";

export function SignInForm() {
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const { signIn, signInWithGoogle, isSubmitting, error } = useSignIn();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    signIn({
      email: form.get("email") as string,

      password: form.get("password") as string,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-describedby={error ? errorId : undefined}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={emailId}>E-mail</FieldLabel>

          <FieldContent>
            <Input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="voce@email.com"
              className="h-12 rounded-none border-neutral-300 bg-white text-sm placeholder:text-neutral-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
            />
          </FieldContent>
        </Field>

        <Field>
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel htmlFor={passwordId}>Senha</FieldLabel>

            <Link
              href="/recuperar-senha"
              className="text-sm text-neutral-500 transition-colors hover:text-amber-600"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <FieldContent>
            <Input
              id={passwordId}
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12  rounded-none border-neutral-300  bg-white text-sm placeholder:text-neutral-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
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
        aria-busy={isSubmitting}
        className="h-12 w-full rounded-none bg-amber-500 font-medium text-black transition-colors hover:bg-amber-400 disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      <div className="flex items-center gap-4" aria-hidden="true">
        <div className="h-px flex-1 bg-neutral-200" />

        <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
          ou
        </span>

        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <GoogleAuthButton onClick={signInWithGoogle} />

      <p className="text-center text-sm text-neutral-500">
        Não possui conta?
        <Link
          href="/criar-conta"
          className={`ml-1 font-medium text-neutral-900 hover:text-amber-600`}
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}
