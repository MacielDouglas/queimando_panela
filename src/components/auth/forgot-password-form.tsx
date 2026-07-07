"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/lib/validations/reset-password";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
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
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : "/reset-password";

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
              "Não foi possível solicitar a redefinição de senha.",
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
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          className="h-11 rounded-none border-stone-300 focus-visible:ring-amber-500"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      {isSuccess && (
        <p className="text-sm text-stone-600">
          Se existir uma conta com esse e-mail, enviaremos as instruções para
          redefinir sua senha.
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-none bg-amber-500 text-stone-950 hover:bg-amber-600"
      >
        {isSubmitting ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}
