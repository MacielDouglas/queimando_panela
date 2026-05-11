'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignUpForm() {
  const router = useRouter();
  const session = authClient.useSession(); // hook client do Better Auth[web:132]
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session.data) {
    // se já estiver logado, não faz sentido mostrar o form
    router.replace('/');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      }); // fluxo recomendado para signUp.email[web:134][web:147]

      if (result.error) {
        setError(result.error.message ?? 'Não foi possível criar a conta.');
        return;
      }

      // Por padrão o Better Auth já faz sign-in após signUp.email[web:134]
      router.replace('/');
      router.refresh();
    } catch {
      setError('Erro inesperado ao criar conta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignUp() {
    setError(null);

    try {
      // Social login Google: Better Auth cuida se é sign up ou sign in[web:134][web:143][web:149]
      const result = await authClient.signIn.social({
        provider: 'google',
      });

      if (result.error) {
        setError(result.error.message ?? 'Não foi possível criar conta com Google.');
      }
    } catch {
      setError('Erro inesperado ao usar login com Google.');
    }
  }

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-800">Nome</label>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-800 focus:ring-neutral-800"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-800">E-mail</label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-800 focus:ring-neutral-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-800">Senha</label>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-800 focus:ring-neutral-800"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs uppercase tracking-wide text-neutral-500">ou</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50"
      >
        Continuar com Google
      </button>

      <p className="mt-2 text-center text-sm text-neutral-600">
        Já tem conta?{' '}
        <a
          href="/entrar"
          className="font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          Entrar
        </a>
      </p>
    </div>
  );
}
