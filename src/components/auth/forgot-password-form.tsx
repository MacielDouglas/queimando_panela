'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/lib/validations/reset-password';

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: ForgotPasswordInput) {
    setServerError(null);
    setIsSuccess(false);

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : '/reset-password';

    const result = await authClient.requestPasswordReset(
      {
        email: values.email,
        redirectTo,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (context) => {
          setServerError(
            context.error.message ||
              'Não foi possível solicitar a redefinição de senha.',
          );
        },
      },
    );

    if (result?.error?.message) {
      setServerError(result.error.message);
    }
  }

  return (
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

      {isSuccess && (
        <p className="text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>
          Se existir uma conta com esse e-mail, enviaremos as instruções para
          redefinir sua senha.
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="button-queimando-panela button-primary-queimando-panela h-12 w-full"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
      </Button>
    </form>
  );
}
