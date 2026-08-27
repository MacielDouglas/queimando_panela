import { Search } from 'lucide-react';
import Link from 'next/link';

type Props = {
  defaultQuery?: string;
};

export function RecipeSearch({ defaultQuery }: Props) {
  const suggestions = [
    'Bolo',
    'Frango',
    'Massa',
    'Vegano',
    'Brasileira',
    'Sopa',
  ];

  return (
    <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-1 w-8 bg-[#ffb900]" aria-hidden />
        <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[#0a0a0a]">
          Faça sua busca
        </p>
      </div>

      <form
        action="/receitas"
        method="get"
        aria-label="Buscar receitas"
        className="mt-3"
      >
        <div className="flex overflow-hidden rounded-none border border-[#e5e5e5] bg-white transition-colors focus-within:border-[#0a0a0a] focus-within:ring-2 focus-within:ring-[#ffb900]/30">
          <div className="flex flex-1 items-center gap-3 px-4">
            <Search
              className="size-4 shrink-0 text-[#6b6b6b]"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={defaultQuery ?? ''}
              placeholder="Ingrediente, prato ou categoria..."
              className="h-12 w-full bg-transparent font-sans text-sm text-[#0a0a0a] outline-none placeholder:text-[#6b6b6b]"
              aria-label="Pesquisar receitas"
            />
          </div>
          <button
            type="submit"
            className="border-l border-[#e5e5e5] bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ffb900] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900]"
          >
            Buscar
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
            Populares:
          </span>
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/receitas?q=${encodeURIComponent(suggestion)}`}
              className="rounded-full border border-[#e5e5e5] bg-white px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.08em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
}
