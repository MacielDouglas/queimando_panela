import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
};

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLinkHref,
  footerLinkLabel,
}: AuthShellProps) {
  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden border border-stone-200 bg-white md:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden border-r border-stone-200 bg-stone-100 md:flex md:flex-col md:justify-between">
            <div className="p-10 lg:p-12">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium uppercase tracking-[0.2em] text-amber-500"
              >
                Queimando Panela
              </Link>

              <div className="mt-16 max-w-md space-y-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                  Blog culinário amador
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
                  Receitas para guardar, testar e compartilhar.
                </h1>

                <p className="text-base leading-7 text-stone-600">
                  Entre para salvar suas favoritas e enviar novas receitas para
                  a comunidade.
                </p>
              </div>
            </div>

            <div className="border-t border-stone-200 p-10 lg:p-12">
              <p className="max-w-sm text-sm leading-6 text-stone-500">
                Simples, claro e direto. Um espaço aberto para quem gosta de
                cozinhar em casa.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center bg-white">
            <div className="w-full max-w-md px-6 py-10 sm:px-8">
              <div className="mb-8 md:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium uppercase tracking-[0.2em] text-amber-500"
                >
                  Queimando Panela
                </Link>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                  {title}
                </h2>
                <p className="text-sm leading-6 text-stone-600">{description}</p>
              </div>

              <div className="mt-8">{children}</div>

              <p className="mt-8 text-sm text-stone-600">
                {footerText}{" "}
                <Link
                  href={footerLinkHref}
                  className="font-medium text-amber-500 underline underline-offset-4 hover:text-amber-600"
                >
                  {footerLinkLabel}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
