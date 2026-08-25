'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { type SignInInput, signInSchema } from '@/lib/validations/auth';

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: SignInInput) {
    setServerError(null);
    const result = await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onError(context) {
          setServerError(context.error.message || 'Não foi possível entrar.');
        },
      },
    );
    if (result?.error?.message) {
      setServerError(result.error.message);
    }
  }

  return (
    <div className="space-y-8">
      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#e5e5e5]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#6b6b6b]">
            ou entre com e-mail
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]"
          >
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            className="h-12 rounded-none border-[#0a0a0a] bg-white focus-visible:border-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-[#ffb900]"
            {...register('email')}
          />
          {errors.email && (
            <p className="font-sans text-sm text-[#cc1f1f]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="password"
              className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]"
            >
              Senha
            </Label>
            <Link
              href="/forgot-password"
              className="font-sans text-xs text-[#6b6b6b] underline decoration-[#ffb900] decoration-2 underline-offset-4 hover:text-[#0a0a0a]"
            >
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            className="h-12 rounded-none border-[#0a0a0a] bg-white focus-visible:border-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-[#ffb900]"
            {...register('password')}
          />
          {errors.password && (
            <p className="font-sans text-sm text-[#cc1f1f]">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="border border-[#cc1f1f]/20 bg-[#cc1f1f]/5 px-3 py-2 font-sans text-sm text-[#cc1f1f]">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-none bg-[#ffb900] font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#e6a700] border border-[#0a0a0a]"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
