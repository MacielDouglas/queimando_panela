import Link from 'next/link';
import { Search } from 'lucide-react';

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
    <div className="border border-neutral-200 bg-white p-5 sm:p-6 lg:p-8">
      <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-neutral-600 uppercase">
        Faça sua busca
      </p>

      <form
        action="/receitas"
        method="get"
        aria-label="Buscar receitas"
        className="space-y-4"
      >
        <div className="flex items-center gap-3 border border-neutral-900 bg-neutral-950 px-4 py-3">
          <Search className="h-5 w-5 text-amber-500" aria-hidden="true" />

          <input
            type="search"
            name="q"
            defaultValue={defaultQuery ?? ''}
            placeholder="Pesquise por ingrediente, prato ou categoria..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-400"
            aria-label="Pesquisar receitas"
          />

          <button
            type="submit"
            className="shrink-0 border border-amber-500 bg-amber-500 px-4 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400"
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500">Populares:</span>

          {suggestions.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/receitas?q=${encodeURIComponent(suggestion)}`}
              className="border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
}
