import { RecipeCardSkeleton } from '@/features/recipes/components/recipe-list/RecipeCardSkeleton';

export default function RecipesLoading() {
  return (
    <main aria-busy="true" aria-live="polite" aria-label="Carregando receitas">
      <span className="sr-only">Carregando receitas, aguarde...</span>

      {/* Hero editorial — eyebrow + título + copy + stats */}
      <section
        className="border-b bg-white"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="editorial-container py-12 lg:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-6 w-32 rounded-full bg-[var(--muted)]" />
              <div className="hidden h-6 w-px bg-[var(--line)] sm:block" />
              <div className="hidden h-3 w-28 rounded bg-[var(--muted)] sm:block" />
            </div>
            <div className="h-11 w-36 rounded-full bg-[var(--accent-e)]" />
          </div>

          <div className="mt-8 h-3 w-28 rounded-full bg-[var(--line)] animate-pulse" />
          <div className="mt-4 space-y-3 animate-pulse">
            <div className="h-10 w-[72%] max-w-2xl rounded bg-[var(--forest)]/10" />
            <div className="h-10 w-[48%] max-w-xl rounded bg-[var(--forest)]/10" />
          </div>
          <div className="mt-4 h-4 w-[62%] max-w-2xl rounded bg-[var(--muted)] animate-pulse" />
        </div>
      </section>

      {/* Busca — faixa muted */}
      <section
        className="border-y"
        style={{ borderColor: 'var(--line)', background: 'var(--muted)' }}
      >
        <div className="editorial-container py-6">
          <div className="flex items-center gap-4 animate-pulse">
            <div
              className="hidden h-7 w-20 rounded-full bg-white sm:block"
              style={{ border: '1px solid var(--line)' }}
            />
            <div
              className="h-12 flex-1 rounded-full bg-white"
              style={{ border: '1px solid var(--line)' }}
            />
            <div
              className="hidden h-11 w-20 rounded-full bg-white sm:block"
              style={{ border: '1px solid var(--line)' }}
            />
          </div>
        </div>
      </section>

      <div className="editorial-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="min-w-0 space-y-10">
            {/* Hero featured skeleton */}
            <div
              className="grid overflow-hidden bg-white animate-pulse sm:grid-cols-[1.35fr_1fr]"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div className="min-h-64 bg-[var(--muted)] sm:min-h-[380px]" />
              <div className="space-y-3 p-6">
                <div className="h-3 w-20 rounded-full bg-[var(--accent-e)]/40" />
                <div className="h-6 w-full rounded bg-[var(--forest)]/10" />
                <div className="h-4 w-3/4 rounded bg-[var(--muted)]" />
                <div className="mt-6 h-11 w-full rounded-full bg-[var(--forest)]" />
              </div>
            </div>

            {/* Category rows */}
            {['cat-1', 'cat-2'].map((k) => (
              <div
                key={k}
                className="overflow-hidden bg-white animate-pulse"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                }}
              >
                <div
                  className="flex items-end justify-between gap-4 bg-white px-5 py-4"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <div className="space-y-2">
                    <div className="h-1 w-8 bg-[var(--accent-e)]" />
                    <div className="h-5 w-32 rounded bg-[var(--forest)]/10" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-[var(--line)]" />
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  {['s1', 's2', 's3', 's4'].map((s) => (
                    <RecipeCardSkeleton key={`${k}-${s}`} aspectRatio="4/3" />
                  ))}
                </div>
              </div>
            ))}

            {/* Grid 3 cols */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                'skeleton-1',
                'skeleton-2',
                'skeleton-3',
                'skeleton-4',
                'skeleton-5',
                'skeleton-6',
              ].map((key) => (
                <RecipeCardSkeleton key={key} aspectRatio="4/3" />
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[96px]">
            <div
              className="overflow-hidden bg-white animate-pulse"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                className="bg-white px-5 py-4"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <div className="h-1 w-8 bg-[var(--accent-e)]" />
                <div className="mt-2 h-4 w-20 rounded bg-[var(--forest)]/10" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    'chip-1',
                    'chip-2',
                    'chip-3',
                    'chip-4',
                    'chip-5',
                    'chip-6',
                  ].map((key) => (
                    <div
                      key={key}
                      className="h-7 w-20 rounded-full bg-[var(--muted)]"
                      style={{ border: '1px solid var(--line)' }}
                    />
                  ))}
                </div>
                <div
                  className="pt-5 space-y-3"
                  style={{ borderTop: '1px solid var(--line)' }}
                >
                  <div className="h-3 w-24 rounded bg-[var(--line)]" />
                  <div className="flex flex-wrap gap-2">
                    {['a', 'b', 'c'].map((k) => (
                      <div
                        key={k}
                        className="h-7 w-16 rounded-full bg-[var(--muted)]"
                        style={{ border: '1px solid var(--line)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-5"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
                background: 'var(--muted)',
              }}
            >
              <div className="h-3 w-12 rounded bg-[var(--forest)]/10" />
              <div className="mt-2 h-3 w-full rounded bg-[var(--ink-muted)]/20" />
              <div className="mt-1 h-3 w-5/6 rounded bg-[var(--ink-muted)]/20" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
