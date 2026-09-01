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
    <div className="space-y-7">
      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span
            className="w-full border-t"
            style={{ borderColor: 'var(--line)' }}
          />
        </div>
        <div className="relative flex justify-center">
          <span
            className="bg-white px-3 text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--ink-muted)', letterSpacing: '0.08em' }}
          >
            ou entre com e-mail
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
          >
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            className="h-12 bg-white"
            style={{ borderColor: 'var(--line)' } as React.CSSProperties}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm" style={{ color: 'var(--destructive)' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="password"
              className="text-[0.78rem] font-bold uppercase"
              style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
            >
              Senha
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs underline decoration-2 underline-offset-4 transition-colors hover:opacity-80"
              style={{
                color: 'var(--ink-muted)',
                textDecorationColor: 'var(--food-accent)',
              }}
            >
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            className="h-12 bg-white"
            style={{ borderColor: 'var(--line)' } as React.CSSProperties}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm" style={{ color: 'var(--destructive)' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p
            className="px-3 py-2 text-sm"
            style={{
              border:
                '1px solid color-mix(in srgb, var(--destructive) 20%, transparent)',
              background: 'color-mix(in srgb, var(--destructive) 6%, white)',
              color: 'var(--destructive)',
            }}
          >
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="button-queimando-panela button-primary-queimando-panela h-12 w-full"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
