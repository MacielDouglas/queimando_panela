"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getZodFirstError } from "@/lib/validations/get-zod-first-error";
import { type SignInInput, signInSchema } from "../schemas/auth.schemas";

export function useSignIn() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(input: SignInInput) {
    setError(null);

    const parsed = signInSchema.safeParse(input);

    if (!parsed.success) {
      setError(getZodFirstError(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message ?? "Não foi possível entrar.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Erro inesperado ao tentar entrar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signInWithGoogle() {
    setError(null);
    try {
      const result = await authClient.signIn.social({ provider: "google" });
      if (result?.error) {
        setError(result.error.message ?? "Não foi possível entrar com Google.");
      }
    } catch {
      setError("Erro inesperado ao entrar com Google.");
    }
  }

  return { signIn, signInWithGoogle, isSubmitting, error, setError };
}
