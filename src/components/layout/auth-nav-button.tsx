"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthNavButtonProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AuthNavButton({ className, onNavigate }: AuthNavButtonProps) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isAuthenticated = Boolean(data?.user);

  async function handleSignOut() {
    setIsSigningOut(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          onNavigate?.();
          router.push("/");
          router.refresh();
        },
        onError: () => {
          setIsSigningOut(false);
        },
      },
    });
  }

  if (isPending) {
    return (
      <div
        className={cn(
          "h-10 w-24 animate-pulse rounded-none bg-stone-200",
          className,
        )}
      />
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={cn(
          "h-10 rounded-none bg-stone-950 px-5 text-sm font-medium uppercase tracking-[0.16em] text-white hover:bg-stone-800",
          className,
        )}
      >
        {isSigningOut ? "Saindo..." : "Sair"}
      </Button>
    );
  }

  return (
    <Button
      asChild
      onClick={onNavigate}
      className={cn(
        "h-10 rounded-none bg-amber-500 px-5 text-sm font-medium uppercase tracking-[0.16em] text-stone-950 hover:bg-amber-600",
        className,
      )}
    >
      <Link href="/sign-in">Entrar</Link>
    </Button>
  );
}
