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
    <div
      className="bg-white p-4"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-1 w-8"
          style={{ background: 'var(--food-accent)' }}
          aria-hidden
        />
        <p
          className="text-[0.78rem] font-bold uppercase"
          style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
        >
          Faça sua busca
        </p>
      </div>

      <form
        action="/receitas"
        method="get"
        aria-label="Buscar receitas"
        className="mt-3"
      >
        <div
          className="flex overflow-hidden bg-white transition-colors"
          style={{
            borderRadius: '999px',
            border: '1px solid var(--line)',
          }}
        >
          <div className="flex flex-1 items-center gap-3 px-4">
            <Search
              className="size-4 shrink-0"
              style={{ color: 'var(--ink-muted)' }}
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={defaultQuery ?? ''}
              placeholder="Ingrediente, prato ou categoria..."
              className="h-12 w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--cocoa)' }}
              aria-label="Pesquisar receitas"
            />
          </div>
          <button
            type="submit"
            className="px-6 text-[0.78rem] font-extrabold uppercase transition-colors"
            style={{
              background: 'var(--cocoa)',
              color: 'white',
              letterSpacing: '0.08em',
              borderLeft: '1px solid var(--line)',
            }}
          >
            Buscar
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--ink-muted)', letterSpacing: '0.06em' }}
          >
            Populares:
          </span>
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/receitas?q=${encodeURIComponent(suggestion)}`}
              className="rounded-full bg-white px-3 py-1 text-[0.78rem] font-bold uppercase transition-colors hover:text-white"
              style={{
                border: '1px solid var(--line)',
                color: 'var(--cocoa)',
                letterSpacing: '0.04em',
              }}
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
}
