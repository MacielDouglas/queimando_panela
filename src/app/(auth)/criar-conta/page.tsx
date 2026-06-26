import type { Metadata } from "next";
import Image from "next/image";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "Criar conta | Queimando Panela",

  description:
    "Crie sua conta para salvar receitas e participar da comunidade.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <main className="min-h-svh bg-zinc-100 lg:grid lg:grid-cols-[1.35fr_0.65fr]">
      <aside className="relative hidden lg:block" aria-hidden>
        <Image
          fill
          priority
          src="/new_user.webp"
          alt=""
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/15" />
      </aside>

      <section className="flex items-center justify-center px-6 py-14 lg:px-16">
        <div className="w-full max-w-md">
          <header className="mb-12">
            <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-amber-500 uppercase">
              Queimando Panela
            </p>

            <h1
              className="
text-4xl
font-semibold
tracking-tight
text-zinc-950
"
            >
              Crie sua conta
            </h1>

            <p
              className="
mt-4
max-w-sm
text-sm
leading-6
text-zinc-500
"
            >
              Salve receitas, organize favoritos e participe da comunidade
              gastronômica.
            </p>
          </header>

          <div
            className="
border
border-zinc-200
bg-white
px-8
py-8
shadow-xs
"
          >
            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
  );
}
