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
    <div className="space-y-8">
      <GoogleSignInButton />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#e5e5e5]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#6b6b6b]">
            ou cadastre-se com e-mail
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]"
          >
            Nome
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            className="h-12 rounded-none border-[#0a0a0a] bg-white focus-visible:border-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-[#ffb900]"
            {...register('name')}
          />
          {errors.name && (
            <p className="font-sans text-sm text-[#cc1f1f]">
              {errors.name.message}
            </p>
          )}
        </div>
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
          <Label
            htmlFor="password"
            className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]"
          >
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            className="h-12 rounded-none border-[#0a0a0a] bg-white focus-visible:border-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-[#ffb900]"
            {...register('password')}
          />
          {errors.password && (
            <p className="font-sans text-sm text-[#cc1f1f]">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]"
          >
            Confirmar senha
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repita sua senha"
            className="h-12 rounded-none border-[#0a0a0a] bg-white focus-visible:border-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-[#ffb900]"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="font-sans text-sm text-[#cc1f1f]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {serverError && (
          <p className="border border-[#cc1f1f]/20 bg-[#cc1f1f]/5 px-3 py-2 font-sans text-sm text-[#cc1f1f]">
            {serverError}
          </p>
        )}
        <p className="font-sans text-xs leading-5 text-[#6b6b6b]">
          Ao continuar, você concorda com nossos termos e política de
          privacidade.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-none bg-[#ffb900] font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#e6a700] border border-[#0a0a0a]"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
    </div>
  );
}
