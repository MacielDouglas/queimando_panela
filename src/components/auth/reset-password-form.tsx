'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from '@/lib/validations/reset-password';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const resetError = searchParams.get('error');

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultValues = useMemo<ResetPasswordInput>(
    () => ({
      token,
      password: '',
      confirmPassword: '',
    }),
    [token],
  );

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    values: defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);
    setIsSuccess(false);

    const result = await authClient.resetPassword(
      {
        token: values.token,
        newPassword: values.password,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (context) => {
          setServerError(
            context.error.message || 'Não foi possível redefinir sua senha.',
          );
        },
      },
    );

    if (result?.error?.message) {
      setServerError(result.error.message);
    }
  }

  if (!token || resetError) {
    return (
      <div className="space-y-4">
        <p
          className="text-sm leading-6"
          style={{ color: 'var(--destructive)' }}
        >
          O link de redefinição é inválido ou expirou.
        </p>
        <Button
          asChild
          variant="outline"
          className="button-queimando-panela button-outline-queimando-panela h-12 w-full"
        >
          <Link href="/forgot-password">Solicitar novo link</Link>
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>
          Sua senha foi redefinida com sucesso. Agora você já pode entrar com a
          nova senha.
        </p>
        <Button
          asChild
          className="button-queimando-panela button-primary-queimando-panela h-12 w-full"
        >
          <Link href="/sign-in">Ir para login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register('token')} />

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-[0.78rem] font-bold uppercase"
          style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
        >
          Nova senha
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Digite sua nova senha"
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

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-[0.78rem] font-bold uppercase"
          style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
        >
          Confirmar nova senha
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita sua nova senha"
          className="h-12 bg-white"
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
        {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
      </Button>
    </form>
  );
}
