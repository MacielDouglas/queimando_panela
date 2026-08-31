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
        <p className="text-sm leading-6 text-[#cc1f1f]">
          O link de redefinição é inválido ou expirou.
        </p>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-none border-[#1b2920]"
        >
          <Link href="/forgot-password">Solicitar novo link</Link>
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-stone-600">
          Sua senha foi redefinida com sucesso. Agora você já pode entrar com a
          nova senha.
        </p>
        <Button
          asChild
          className="h-11 w-full rounded-none bg-[#a85131] text-[#1b2920] hover:bg-[#8e4429]"
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
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Digite sua nova senha"
          className="h-11 rounded-none border-[#1b2920] focus-visible:ring-[#a85131]"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-[#cc1f1f]">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita sua nova senha"
          className="h-11 rounded-none border-[#1b2920] focus-visible:ring-[#a85131]"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-[#cc1f1f]">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && <p className="text-sm text-[#cc1f1f]">{serverError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-none bg-[#a85131] text-[#1b2920] hover:bg-[#8e4429]"
      >
        {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
      </Button>
    </form>
  );
}
