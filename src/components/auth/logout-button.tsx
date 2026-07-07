"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
        onError: () => {
          setIsPending(false);
        },
      },
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
      className={className ?? "rounded-none border-stone-300"}
    >
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
