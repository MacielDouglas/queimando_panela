"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getZodFirstError } from "@/lib/validations/get-zod-first-error";
import { type SignUpInput, signUpSchema } from "../schemas/auth.schemas";

export function useSignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUp(input: SignUpInput) {
    setError(null);

    const parsed = signUpSchema.safeParse(input);

    if (!parsed.success) {
      setError(getZodFirstError(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authClient.signUp.email({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (result.error) {
        setError(result.error.message ?? "Não foi possível criar a conta.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Erro inesperado ao criar conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signUpWithGoogle() {
    setError(null);
    try {
      const result = await authClient.signIn.social({ provider: "google" });
      if (result?.error) {
        setError(
          result.error.message ?? "Não foi possível criar conta com Google.",
        );
      }
    } catch {
      setError("Erro inesperado ao usar Google.");
    }
  }

  return { signUp, signUpWithGoogle, isSubmitting, error, setError };
}
