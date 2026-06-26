"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => Promise<void>;

  label?: string;
}

export function GoogleAuthButton({
  onClick,

  label = "Continuar com Google",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={handleClick}
      className="
mt-5
h-13
w-full
border-zinc-300
bg-white
hover:bg-zinc-50
"
    >
      <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24" aria-hidden />

      {loading ? "Conectando..." : label}
    </Button>
  );
}
