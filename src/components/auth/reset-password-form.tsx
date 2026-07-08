"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validations/reset-password";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const resetError = searchParams.get("error");

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultValues = useMemo<ResetPasswordInput>(
    () => ({
      token,
      password: "",
      confirmPassword: "",
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
            context.error.message || "Não foi possível redefinir sua senha.",
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
        <p className="text-sm leading-6 text-red-600">
          O link de redefinição é inválido ou expirou.
        </p>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-none border-stone-300"
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
          className="h-11 w-full rounded-none bg-amber-500 text-stone-950 hover:bg-amber-600"
        >
          <Link href="/sign-in">Ir para login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register("token")} />

      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Digite sua nova senha"
          className="h-11 rounded-none border-stone-300 focus-visible:ring-amber-500"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita sua nova senha"
          className="h-11 rounded-none border-stone-300 focus-visible:ring-amber-500"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-none bg-amber-500 text-stone-950 hover:bg-amber-600"
      >
        {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
