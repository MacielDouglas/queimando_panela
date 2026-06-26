"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setError(null);
    setIsSigningOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(result.error.message ?? "Não foi possível sair.");
        return;
      }
      router.refresh();
    } catch {
      setError("Erro inesperado ao sair.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return { signOut, isSigningOut, error };
}
