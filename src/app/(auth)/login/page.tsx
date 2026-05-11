import type { Metadata } from 'next';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Entrar | Queimando Panela',
};

export default function SignInPage() {
  // Server Component: só estrutura e sem lógica de auth
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Entrar no Queimando Panela</h1>
        <SignInForm />
      </div>
    </main>
  );
}
