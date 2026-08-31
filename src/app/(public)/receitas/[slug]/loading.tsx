export default function RecipeDetailLoading() {
  return (
    <main
      style={{ background: 'var(--cream)' }}
      className="pb-0"
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando receita"
    >
      <span className="sr-only">Carregando receita, aguarde...</span>

      {/* Breadcrumb */}
      <div className="editorial-container pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs animate-pulse"
        >
          <span className="h-3 w-10 rounded bg-[var(--muted)]" />
          <span className="h-3 w-2 rounded bg-[var(--line)]" />
          <span className="h-3 w-16 rounded bg-[var(--muted)]" />
          <span className="h-3 w-2 rounded bg-[var(--line)]" />
          <span className="h-3 w-32 rounded bg-[var(--cocoa)]/10" />
        </nav>
      </div>

      {/* Hero — espelha RecipeDetailHero: tipos + título + resumo + 4 stats + autor + história + capa */}
      <header
        className="border-b bg-white"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="editorial-container py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_420px] lg:items-start">
            <div className="space-y-6 animate-pulse">
              {/* tipos */}
              <div className="flex flex-wrap gap-2">
                <span className="h-7 w-24 rounded-full bg-[var(--food-accent)]/30" />
                <span className="h-7 w-20 rounded-full bg-[var(--food-accent)]/20" />
                <span
                  className="h-7 w-28 rounded-full border bg-white"
                  style={{ borderColor: 'var(--line)' }}
                />
              </div>
              {/* título */}
              <div className="space-y-3">
                <div className="h-10 w-full rounded bg-[var(--cocoa)]/10" />
                <div className="h-10 w-[68%] rounded bg-[var(--cocoa)]/10" />
              </div>
              {/* resumo */}
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[var(--muted)]" />
                <div className="h-4 w-[88%] rounded bg-[var(--muted)]" />
              </div>
              {/* 4 stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['t1', 't2', 't3', 't4'].map((k) => (
                  <div
                    key={k}
                    className="rounded-[14px] bg-white p-4"
                    style={{ border: '1px solid var(--line)' }}
                  >
                    <div className="h-2.5 w-12 rounded bg-[var(--muted)]" />
                    <div className="mt-3 h-4 w-16 rounded bg-[var(--cocoa)]/10" />
                  </div>
                ))}
              </div>
              {/* autor */}
              <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] bg-white p-4"
                style={{ border: '1px solid var(--line)' }}
              >
                <div className="h-4 w-32 rounded bg-[var(--muted)]" />
                <div className="flex gap-2">
                  <div className="h-9 w-20 rounded-full bg-[var(--line)]" />
                  <div className="h-9 w-20 rounded-full bg-[var(--line)]" />
                </div>
              </div>
              {/* história */}
              <div
                className="rounded-[14px] p-5"
                style={{ background: 'var(--cocoa)' }}
              >
                <div className="h-3 w-28 rounded bg-white/20" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-[82%] rounded bg-white/10" />
                </div>
              </div>
            </div>

            {/* capa */}
            <div className="relative animate-pulse">
              <div
                className="relative overflow-hidden bg-white p-2"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--line)',
                }}
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>
              <div
                className="absolute -bottom-3 -right-2 hidden size-[132px] place-items-center rounded-full border-[8px] bg-[var(--muted)] lg:grid"
                style={{ borderColor: 'var(--cream)' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo: ingredientes + modo + nutrição */}
      <section className="editorial-container py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-10">
          <aside className="space-y-6 lg:sticky lg:top-[96px] lg:self-start">
            {/* Ingredientes */}
            <section
              className="overflow-hidden bg-white animate-pulse"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                className="flex items-center gap-2 px-5 py-4"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <span className="size-8 rounded-full bg-[var(--food-accent)]/40" />
                <span className="h-3 w-20 rounded bg-[var(--cocoa)]/10" />
                <span className="ml-auto h-3 w-12 rounded bg-[var(--muted)]" />
              </div>
              <div className="space-y-3 p-5">
                {['i1', 'i2', 'i3', 'i4', 'i5'].map((k) => (
                  <div
                    key={k}
                    className="flex gap-3 rounded-[10px] bg-white px-3 py-2.5"
                    style={{ border: '1px solid var(--line)' }}
                  >
                    <span className="mt-2.5 size-1.5 rounded-full bg-[var(--food-accent)]/40" />
                    <span className="h-3 w-full rounded bg-[var(--muted)]" />
                  </div>
                ))}
                <div
                  className="pt-5"
                  style={{ borderTop: '1px solid var(--line)' }}
                >
                  <div className="h-3 w-20 rounded bg-[var(--cocoa)]/10" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['u1', 'u2', 'u3'].map((k) => (
                      <span
                        key={k}
                        className="h-7 w-20 rounded-full bg-[var(--muted)]"
                        style={{ border: '1px solid var(--line)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Card confiança desktop */}
            <div
              className="hidden rounded-[var(--radius-md)] p-5 lg:block animate-pulse"
              style={{ background: 'var(--cocoa)' }}
            >
              <div className="h-3 w-20 rounded bg-white/20" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-[78%] rounded bg-white/10" />
              </div>
              <div className="mt-4 h-10 w-full rounded-full bg-white/20" />
            </div>
          </aside>

          <div className="space-y-6">
            {/* Modo de preparo */}
            <section
              className="overflow-hidden bg-white animate-pulse"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                className="flex items-center gap-2 px-5 py-4"
                style={{
                  borderBottom: '1px solid var(--line)',
                  background: 'var(--cocoa)',
                }}
              >
                <span className="size-4 rounded-full bg-white/20" />
                <span className="h-3 w-32 rounded bg-white/20" />
                <span className="ml-auto h-3 w-12 rounded bg-white/20" />
              </div>
              <div className="space-y-3 p-5 sm:p-6">
                {['s1', 's2', 's3', 's4'].map((k) => (
                  <div
                    key={k}
                    className="grid grid-cols-[44px_1fr] gap-3 rounded-[14px] bg-white p-3"
                    style={{ border: '1px solid var(--line)' }}
                  >
                    <span className="size-11 rounded-full bg-[var(--food-accent)]/20" />
                    <div className="space-y-2 pt-1">
                      <div className="h-3 w-full rounded bg-[var(--muted)]" />
                      <div className="h-3 w-[78%] rounded bg-[var(--muted)]" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Nutrição + Sugestões */}
            <section className="grid gap-6 xl:grid-cols-[1fr_320px] animate-pulse">
              <div
                className="overflow-hidden bg-white"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                }}
              >
                <div
                  className="flex items-center gap-2 px-5 py-4"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <span className="size-4 rounded-full bg-[var(--muted)]" />
                  <span className="h-3 w-40 rounded bg-[var(--cocoa)]/10" />
                </div>
                <div className="p-5 space-y-3">
                  <div className="h-3 w-full rounded bg-[var(--muted)]" />
                  <div className="h-3 w-[88%] rounded bg-[var(--muted)]" />
                  <div
                    className="mt-4 h-40 rounded-[14px] bg-[var(--muted)]"
                    style={{ border: '1px solid var(--line)' }}
                  />
                </div>
              </div>
              <div
                className="overflow-hidden bg-white"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                }}
              >
                <div className="h-1 w-full bg-[var(--food-accent)]/30" />
                <div
                  className="px-5 pt-5 pb-4"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <div className="flex gap-3">
                    <span className="size-8 rounded-full bg-[var(--muted)]" />
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-[var(--muted)]" />
                      <div className="h-4 w-28 rounded bg-[var(--cocoa)]/10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  {['g1', 'g2', 'g3'].map((k) => (
                    <div
                      key={k}
                      className="h-14 rounded-[12px] bg-[var(--muted)]"
                      style={{ border: '1px solid var(--line)' }}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* CTA final — espelha page.tsx CTA */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--line)', background: 'white' }}
      >
        <div className="editorial-container py-12 lg:py-16">
          <div
            className="group relative grid overflow-hidden lg:grid-cols-[1.38fr_0.62fr] animate-pulse"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
              background: 'var(--food-accent)',
            }}
          >
            <div className="flex flex-col gap-5 p-[clamp(24px,5vw,48px)] lg:p-[clamp(28px,4vw,56px)] lg:pr-10">
              <div className="h-3 w-24 rounded bg-[var(--cocoa)]/20" />
              <div className="space-y-2">
                <div className="h-8 w-[78%] rounded bg-[var(--cocoa)]/10" />
                <div className="h-8 w-[54%] rounded bg-[var(--cocoa)]/10" />
              </div>
              <div className="h-4 w-[78%] rounded bg-[var(--cocoa)]/10" />
              <div className="mt-1 flex gap-3">
                <span className="h-11 w-36 rounded-full bg-[var(--cocoa)]/20" />
                <span className="h-11 w-28 rounded bg-white/20" />
              </div>
            </div>
            <div
              className="relative hidden min-h-[380px] flex-col justify-between overflow-hidden p-6 lg:flex"
              style={{ background: 'var(--cocoa)' }}
            >
              <div className="mx-auto w-full max-w-[280px] flex-1 content-center">
                <div
                  className="bg-white p-3 pb-8"
                  style={{
                    borderRadius: '14px',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[10px] bg-[var(--muted)]" />
                  <div className="mt-3 h-3 w-3/4 mx-auto rounded bg-[var(--muted)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
