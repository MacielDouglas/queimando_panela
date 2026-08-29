import Link from 'next/link';
import { QPMark } from '@/components/brand/qp-mark';

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-white grid place-items-center p-6">
      <div className="w-full max-w-lg border-2 border-[#0a0a0a] bg-white p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center border-2 border-[#0a0a0a] bg-[#ffc733] text-[#0a0a0a]">
          <QPMark className="size-8" />
        </span>
        <p className="mt-4 inline-block bg-[#0a0a0a] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-white">
          Erro 404
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#0a0a0a]">
          Essa receita queimou.
        </h1>
        <p className="mx-auto mt-4 max-w-md border-l border-[#e5e5e5] pl-3 text-left font-sans text-sm leading-6 text-[#6b6b6b]">
          Procuramos em todas as panelas, mas essa página virou carvão. Sem
          drama — volte ao menu.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="grid h-12 place-items-center border-2 border-[#0a0a0a] bg-[#ffc733] font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          >
            Voltar ao menu
          </Link>
          <Link
            href="/receitas"
            className="grid h-12 place-items-center border-2 border-[#0a0a0a] bg-white font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          >
            Ver receitas
          </Link>
        </div>
      </div>
    </main>
  );
}
