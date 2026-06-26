import type { Metadata } from "next";
import Image from "next/image";

import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "Entrar | Queimando Panela",
  description:
    "Acesse sua conta e continue explorando receitas, histórias e sabores.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-svh bg-zinc-100 lg:grid lg:grid-cols-[1.35fr_0.65fr]">
      <aside className="relative hidden lg:block" aria-hidden>
        <Image
          src="/login.webp"
          fill
          priority
          alt=""
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/25" />
      </aside>

      <section className="flex min-h-svh items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-105">
          <header className="mb-10">
            <span className="mb-4 block text-sm font-medium tracking-wide text-amber-600">
              Queimando Panela
            </span>

            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
              Bem-vindo de volta
            </h1>

            <p className="mt-4 text-[15px] leading-7 text-neutral-600">
              Entre para acessar suas receitas favoritas, continuar escrevendo
              histórias culinárias e descobrir novos sabores.
            </p>
          </header>

          <div className="border border-neutral-200 bg-white p-8">
            <SignInForm />
          </div>
        </div>
      </section>
    </main>
  );
}
