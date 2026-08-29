'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { type SignUpInput, signUpSchema } from '@/lib/validations/auth';

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: SignUpInput) {
    setServerError(null);
    const result = await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onError(context) {
          setServerError(
            context.error.message || 'Não foi possível criar sua conta.',
          );
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
            ou cadastre-se com e-mail
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
          >
            Nome
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            className="h-12 rounded-[14px] bg-white"
            style={{ borderColor: 'var(--line)' } as React.CSSProperties}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm" style={{ color: 'var(--destructive)' }}>
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
          >
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            className="h-12 rounded-[14px] bg-white"
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
          <Label
            htmlFor="password"
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
          >
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            className="h-12 rounded-[14px] bg-white"
            style={{ borderColor: 'var(--line)' } as React.CSSProperties}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm" style={{ color: 'var(--destructive)' }}>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
          >
            Confirmar senha
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repita sua senha"
            className="h-12 rounded-[14px] bg-white"
            style={{ borderColor: 'var(--line)' } as React.CSSProperties}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm" style={{ color: 'var(--destructive)' }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {serverError && (
          <p
            className="rounded-[var(--radius-md)] px-3 py-2 text-sm"
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
        <p className="text-xs leading-5" style={{ color: 'var(--ink-muted)' }}>
          Ao continuar, você concorda com nossos termos e política de
          privacidade.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="button-queimando-panela button-primary-queimando-panela h-12 w-full"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
    </div>
  );
}
