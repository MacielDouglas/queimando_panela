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

export function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();

    setFormError(null);

    if (password.length < 8) {
      setFormError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setFormError(result.error.message ?? 'Não foi possível criar a conta.');

        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setFormError('Erro inesperado ao criar conta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignUp() {
    setFormError(null);

    try {
      const result = await authClient.signIn.social({
        provider: 'google',
      });

      if (result?.error) {
        setFormError(
          result.error.message ?? 'Não foi possível criar conta com Google.',
        );
      }
    } catch {
      setFormError('Erro inesperado ao usar login com Google.');
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FieldGroup>
          <Field>
            <FieldLabel>Nome</FieldLabel>

            <FieldContent>
              <Input
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                className="border-neutral-200 bg-white/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
              />
            </FieldContent>

            <FieldDescription>
              Esse nome será exibido no seu perfil.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>E-mail</FieldLabel>

            <FieldContent>
              <Input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                className="border-neutral-200 bg-white/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Senha</FieldLabel>

            <FieldContent>
              <Input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="border-neutral-200 bg-white/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
              />
            </FieldContent>

            <FieldDescription>
              Utilize pelo menos 8 caracteres.
            </FieldDescription>
          </Field>

          {formError && <FieldError>{formError}</FieldError>}
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-amber-500 font-semibold text-neutral-950 transition-all duration-300 hover:bg-amber-400"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />

        <span className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
          ou
        </span>

        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <GoogleAuthButton onClick={handleGoogleSignUp} />

      <p className="text-center text-sm text-neutral-600">
        Já tem conta?{' '}
        <Link
          href="/login"
          className="font-semibold text-amber-700 hover:text-amber-500"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
