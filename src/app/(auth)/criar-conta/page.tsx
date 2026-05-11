import type { Metadata } from 'next';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
  title: 'Criar conta | Queimando Panela',
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Criar conta</h1>
        <SignUpForm />
      </div>
    </main>
  );
}
