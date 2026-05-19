'use client';

import { type SyntheticEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { GoogleAuthButton } from '@/components/auth/google-auth-button';

export function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();

    setFormError(null);

    if (password.length < 8) {
      setFormError(
        'A senha deve ter pelo menos 8 caracteres.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await authClient.signIn.email({
          email,
          password,
          callbackURL: '/',
        });

      if (result.error) {
        setFormError(
          result.error.message ??
            'Não foi possível entrar.',
        );

        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setFormError(
        'Erro inesperado ao tentar entrar.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await authClient.signIn.social({
        provider: 'google',
      });
    } catch {
      setFormError(
        'Erro inesperado ao entrar com Google.',
      );
    }
  }

  return (
     
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <FieldGroup>
          <Field>
            <FieldLabel>E-mail</FieldLabel>

            <FieldContent>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="voce@email.com"
                className="
                  border-neutral-200
                  bg-white/70
                  focus-visible:border-amber-500
                  focus-visible:ring-amber-500/20
                "
              />
            </FieldContent>

            <FieldDescription>
              Utilize o e-mail cadastrado.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Senha</FieldLabel>

            <FieldContent>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="
                  border-neutral-200
                  bg-white/70
                  focus-visible:border-amber-500
                  focus-visible:ring-amber-500/20
                "
              />
            </FieldContent>
          </Field>

          {formError && (
            <FieldError>
              {formError}
            </FieldError>
          )}
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            h-11 w-full
            bg-amber-500
            font-semibold
            text-neutral-950
            transition-all duration-300
            hover:bg-amber-400
          "
        >
          {isSubmitting
            ? 'Entrando...'
            : 'Entrar'}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          ou
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <GoogleAuthButton
        onClick={handleGoogleSignIn}
      />

      <p className="text-center text-sm text-neutral-600">
        Não tem conta?{' '}
        <Link
          href="/criar-conta"
          className="
            font-semibold text-amber-700
            hover:text-amber-500
          "
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
