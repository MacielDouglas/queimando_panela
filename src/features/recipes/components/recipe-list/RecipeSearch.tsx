'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  defaultQuery?: string;
};

const SUGGESTIONS = ['Bolo', 'Frango', 'Massa', 'Vegano', 'Brasileira', 'Sopa'];

function buildHref(raw: string) {
  const q = raw.trim().slice(0, 60);
  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
  );
  if (q) params.set('q', q);
  else params.delete('q');
  params.delete('page');
  const qs = params.toString();
  return qs ? `/receitas?${qs}` : '/receitas';
}

export function RecipeSearch({ defaultQuery }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultQuery ?? '');

  // Sincroniza quando a navegação muda (voltar/avançar, limpar filtros).
  useEffect(() => {
    setValue(defaultQuery ?? '');
  }, [defaultQuery]);

  // Debounce 400ms: digitar não dispara 1 request por tecla no 4G fraco.
  // Mínimo 2 caracteres; limpar (vazio) navega na hora.
  useEffect(() => {
    if (value === (defaultQuery ?? '')) return;
    const trimmed = value.trim();
    if (trimmed.length === 1) return;
    const timer = setTimeout(() => {
      router.replace(buildHref(value), { scroll: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [value, defaultQuery, router]);

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
        aria-label="Buscar receitas"
        className="mt-3"
        onSubmit={(event) => {
          event.preventDefault();
          router.replace(buildHref(value), { scroll: false });
        }}
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
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Ingrediente, prato ou categoria..."
              className="h-12 w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--cocoa)' }}
              aria-label="Pesquisar receitas"
              autoComplete="off"
              maxLength={60}
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
          {SUGGESTIONS.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/receitas?q=${encodeURIComponent(suggestion)}`}
              prefetch={false}
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
