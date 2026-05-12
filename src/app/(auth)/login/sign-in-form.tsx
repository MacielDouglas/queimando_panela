'use client';

import { type SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/',
      });

      if (result.error) {
        setFormError(result.error.message ?? 'Não foi possível entrar.');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setFormError('Erro inesperado ao tentar entrar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setFormError(null);
    try {
      const result = await authClient.signIn.social({ provider: 'google' });

      if (result?.error) {
        setFormError(result.error.message ?? 'Não foi possível entrar com Google.');
      }
    } catch {
      setFormError('Erro inesperado ao entrar com Google.');
    }
  }

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-800">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-800 focus:ring-neutral-800"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-800">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-800 focus:ring-neutral-800"
          />
        </div>

        {formError && (
          <p className="text-sm text-red-600" role="alert" aria-live="assertive">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
        <span className="text-xs uppercase tracking-wide text-neutral-500">ou</span>
        <div className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50"
      >
        Entrar com Google
      </button>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Não tem conta?{' '}
        <a
          href="/criar-conta"
          className="font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          Criar conta
        </a>
      </p>
    </div>
  );
}
