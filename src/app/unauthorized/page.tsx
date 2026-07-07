import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <div className="mx-auto flex min-h-dvh max-w-3xl items-center justify-center px-4 py-12">
        <section className="w-full border border-stone-200 bg-white p-8 sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
            Acesso restrito
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
            Você não tem permissão para acessar esta página.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600">
            Faça login com uma conta válida ou volte para continuar navegando
            pelas receitas públicas.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-11 rounded-none bg-amber-500 text-stone-950 hover:bg-amber-600"
            >
              <Link href="/sign-in">Entrar</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-stone-300"
            >
              <Link href="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
