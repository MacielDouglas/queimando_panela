"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleGoogleSignIn() {
    try {
      setIsPending(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isPending}
      className="h-11 w-full rounded-none border-stone-300 bg-white text-stone-900 hover:bg-stone-50"
    >
      <FcGoogle className="mr-2 size-5" />
      {isPending ? "Conectando..." : "Continuar com Google"}
    </Button>
  );
}
