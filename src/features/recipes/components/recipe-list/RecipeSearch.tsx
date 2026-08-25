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
    <div className="border-2 border-white bg-white p-4">
      <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#0a0a0a]">
        Faça sua busca
      </p>

      <form
        action="/receitas"
        method="get"
        aria-label="Buscar receitas"
        className="mt-3"
      >
        <div className="flex gap-0 border-2 border-[#0a0a0a] bg-white">
          <div className="flex flex-1 items-center gap-3 px-4">
            <Search className="size-4 text-[#0a0a0a]" aria-hidden="true" />
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
            className="border-l-2 border-[#0a0a0a] bg-[#ffb900] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          >
            Buscar
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-white/60">
            Populares:
          </span>
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/receitas?q=${encodeURIComponent(suggestion)}`}
              className="border border-white/20 bg-white/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.08em] text-white hover:border-[#ffb900] hover:bg-[#ffb900] hover:text-[#0a0a0a]"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
}
