"use client";

import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.querySelector<HTMLInputElement>('input[type="email"]');
        if (input?.value) {
          alert(`Obrigado! Enviaremos novidades para ${input.value} 🍳`);
          form.reset();
        }
      }}
    >
      <input
        type="email"
        required
        placeholder="seu e-mail"
        aria-label="Seu e-mail"
        className="h-9 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
      />
      <Button
        size="sm"
        type="submit"
        className="shrink-0 rounded-full bg-orange-600 px-5 font-bold hover:bg-orange-700"
      >
        Assinar
      </Button>
    </form>
  );
}
