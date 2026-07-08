import Link from "next/link";
import { QPMark } from "@/components/brand/qp-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-stone-50 px-6 py-16 text-center">
      <span className="text-amber-500">
        <QPMark className="size-14" />
      </span>

      <p className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-amber-500">
        Erro 404
      </p>

      <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
        Essa receita queimou.
      </h1>

      <p className="mt-5 max-w-md text-base leading-7 text-stone-600">
        Procuramos em todas as panelas, mas essa página não estava em nenhuma
        delas. Deve ter virado carvão em algum lugar do fogão.
      </p>

      <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
        Que bom que você tem outra chance — sem precisar limpar a fumaça.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="h-11 rounded-none bg-amber-500 px-8 text-sm font-medium uppercase tracking-[0.16em] text-stone-950 hover:bg-amber-600"
        >
          <Link href="/">Voltar para o menu principal</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-11 rounded-none border-stone-300 px-8 text-sm font-medium uppercase tracking-[0.16em] text-stone-700 hover:bg-stone-100"
        >
          <Link href="/receitas">Ver receitas</Link>
        </Button>
      </div>
    </main>
  );
}
