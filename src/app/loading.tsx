export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando página inicial"
    >
      <span className="sr-only">Carregando receitas, aguarde...</span>

      {/* Hero — espelha HeroSection: eyebrow + h1 + p + CTAs + stats + imagem arch */}
      <section className="overflow-hidden px-0 py-[76px] lg:py-[64px]">
        <div className="editorial-container grid items-center gap-[clamp(36px,7vw,94px)] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
          <div className="max-w-[650px] animate-pulse">
            <div className="h-3 w-32 rounded-full bg-[var(--line)]" />
            <div className="mt-4 space-y-3">
              <div className="h-[52px] w-full rounded-[var(--radius-md)] bg-[var(--cocoa)]/10" />
              <div className="h-[52px] w-[68%] rounded-[var(--radius-md)] bg-[var(--cocoa)]/10" />
            </div>
            <div className="mt-7 h-5 w-[92%] max-w-[530px] rounded bg-[var(--muted)]" />
            <div className="mt-2 h-5 w-[78%] max-w-[480px] rounded bg-[var(--muted)]" />
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="h-[50px] w-[172px] rounded-full bg-[var(--food-accent)]" />
              <div className="h-[50px] w-[172px] rounded-full border border-[var(--cocoa)] bg-transparent" />
            </div>
            <div className="mt-14 flex flex-wrap gap-7">
              {['s1', 's2', 's3'].map((k) => (
                <div key={k} className="flex min-w-[132px] flex-col gap-2">
                  <div className="h-6 w-16 rounded bg-[var(--cocoa)]/10" />
                  <div className="h-3 w-24 rounded bg-[var(--muted)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[580px] lg:block">
            <div
              className="absolute inset-0 animate-pulse bg-[var(--muted)]"
              style={{ borderRadius: '46% 46% 22px 22px', right: '12px' }}
            />
            <div
              className="qp-badge-float absolute bottom-[18px] right-[-6px] grid size-[168px] place-items-center rounded-full border-[10px] bg-[var(--muted)]"
              style={{ borderColor: 'var(--cream)' }}
            />
          </div>
        </div>
      </section>

      {/* Intro — espelha IntroSection: imagem 4/3 + card forest */}
      <section
        className="py-24 lg:py-28"
        style={{ background: 'var(--cream)' }}
      >
        <div className="editorial-container grid items-center gap-[clamp(38px,9vw,120px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative animate-pulse">
            <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--muted)] lg:aspect-[1/1.06]" />
            <div className="relative mt-4 h-24 max-w-[230px] rounded-[14px] bg-[var(--cocoa)]/10 p-5 lg:absolute lg:bottom-[34px] lg:right-[-28px] lg:mt-0" />
          </div>
          <div className="max-w-[520px] animate-pulse space-y-4">
            <div className="h-8 w-[78%] rounded bg-[var(--cocoa)]/10" />
            <div className="h-8 w-[64%] rounded bg-[var(--cocoa)]/10" />
            <div className="h-4 w-full rounded bg-[var(--muted)]" />
            <div className="h-4 w-[88%] rounded bg-[var(--muted)]" />
          </div>
        </div>
      </section>

      {/* Categories — 3 cards com borda line */}
      <section className="py-24 lg:py-28">
        <div className="editorial-container">
          <div className="h-9 w-[42%] max-w-[520px] rounded bg-[var(--cocoa)]/10 animate-pulse" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['c1', 'c2', 'c3'].map((k) => (
              <div
                key={k}
                className="overflow-hidden border bg-white animate-pulse"
                style={{
                  borderColor: 'var(--line)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  className="bg-[var(--muted)]"
                  style={{ aspectRatio: '1.2 / 1' }}
                />
                <div className="space-y-3 p-6">
                  <div className="h-6 w-3/4 rounded bg-[var(--cocoa)]/10" />
                  <div className="h-3 w-full rounded bg-[var(--muted)]" />
                  <div className="h-3 w-5/6 rounded bg-[var(--muted)]" />
                  <div className="h-4 w-28 rounded-full bg-[var(--line)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values — forest 120px + 3 itens */}
      <section
        className="py-[120px]"
        style={{ background: 'var(--cocoa)', color: 'white' }}
      >
        <div className="editorial-container grid items-start gap-[clamp(38px,8vw,110px)] lg:grid-cols-[1fr_1.1fr]">
          <div className="animate-pulse space-y-4">
            <div className="h-3 w-28 rounded-full bg-white/20" />
            <div className="h-10 w-full rounded bg-white/10" />
            <div className="h-10 w-[78%] rounded bg-white/10" />
            <div className="h-[3px] w-12 rounded bg-[var(--food-accent)]/60" />
            <div className="h-4 w-full rounded bg-white/10" />
          </div>
          <div className="grid gap-0 border-t border-white/20">
            {['v1', 'v2', 'v3'].map((k) => (
              <div
                key={k}
                className="border-b py-[28px] border-white/20 animate-pulse space-y-3"
              >
                <div className="h-5 w-40 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes — heading + grid 3 cards com shadow */}
      <section className="py-24 lg:py-28">
        <div className="editorial-container">
          <div className="h-9 w-[44%] max-w-[520px] rounded bg-[var(--cocoa)]/10 animate-pulse" />
          <div className="mt-3 h-4 w-[56%] max-w-[520px] rounded bg-[var(--muted)] animate-pulse" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['r1', 'r2', 'r3'].map((k) => (
              <div
                key={k}
                className="overflow-hidden bg-white animate-pulse"
                style={{
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 30px rgba(24, 58, 55, 0.06)',
                }}
              >
                <div
                  className="bg-[var(--muted)]"
                  style={{ aspectRatio: '1.15 / 1' }}
                />
                <div className="space-y-3 p-[22px]">
                  <div className="h-5 w-3/4 rounded bg-[var(--cocoa)]/10" />
                  <div className="h-3 w-full rounded bg-[var(--muted)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest — cream + grid 1.1/0.9 com 1 card */}
      <section
        className="py-24 lg:py-28"
        style={{ background: 'var(--cream)' }}
      >
        <div className="editorial-container grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="max-w-[520px] animate-pulse space-y-4">
            <div className="h-9 w-[72%] rounded bg-[var(--cocoa)]/10" />
            <div className="h-3 w-[68%] rounded bg-[var(--muted)]" />
            <div className="h-4 w-28 rounded-full bg-[var(--line)]" />
          </div>
          <div
            className="animate-pulse overflow-hidden border bg-white"
            style={{
              borderRadius: 'var(--radius-md)',
              borderColor: 'var(--line)',
            }}
          >
            <div
              className="bg-[var(--muted)]"
              style={{ aspectRatio: '1.15 / 1' }}
            />
            <div
              className="space-y-3 border-t bg-white p-5"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="h-5 w-3/4 rounded bg-[var(--cocoa)]/10" />
              <div className="h-3 w-full rounded bg-[var(--muted)]" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA — amarelo 28px com 2 cols */}
      <section className="pb-24 lg:pb-28">
        <div className="editorial-container">
          <div
            className="grid items-center overflow-hidden lg:grid-cols-[1.15fr_0.85fr] animate-pulse"
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'var(--food-accent)',
            }}
          >
            <div className="space-y-4 p-[clamp(42px,6vw,84px)]">
              <div className="h-3 w-24 rounded-full bg-[var(--cocoa)]/20" />
              <div className="h-10 w-full rounded bg-[var(--cocoa)]/10" />
              <div className="h-10 w-[68%] rounded bg-[var(--cocoa)]/10" />
              <div className="h-4 w-[78%] rounded bg-[var(--cocoa)]/10" />
              <div className="h-[50px] w-[212px] rounded-full bg-[var(--cocoa)]" />
            </div>
            <div className="hidden min-h-[340px] bg-[var(--cocoa)]/10 lg:block" />
          </div>
        </div>
      </section>
    </main>
  );
}
