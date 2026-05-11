'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignInForm() {
  const router = useRouter();
  const session = authClient.useSession(); // hook do client do Better Auth[web:132]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session.data) {
    // Já logado, redireciona
    router.replace('/');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      }); // fluxo recomendado na doc para email/senha[web:134][web:147]

      if (result.error) {
        setError(result.error.message ?? 'Não foi possível entrar.');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch (err) {
      setError('Erro inesperado ao tentar entrar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    try {
      // inicia fluxo OAuth Google no cliente[web:134][web:143][web:149]
      const result = await authClient.signIn.social({
        provider: 'google',
      });

      if (result.error) {
        setError(result.error.message ?? 'Não foi possível entrar com Google.');
      }
      // Better Auth cuida do redirect; router.refresh é útil após retorno
    } catch {
      setError('Erro inesperado ao entrar com Google.');
    }
  }

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
            autoComplete="current-password"
            required
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
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs uppercase tracking-wide text-neutral-500">ou</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50"
      >
        {/* Aqui depois encaixamos ícone do Google (Lucide/custom) */}
        Entrar com Google
      </button>
    </div>
  );
}
