import Link from 'next/link';

export function AboutCta() {
  return (
    <section className="py-24 lg:py-28">
      <div className="editorial-container">
        <div
          className="grid items-center overflow-hidden lg:grid-cols-[1.15fr_0.85fr]"
          style={{
            borderRadius: 'var(--radius-lg)',
            background: 'var(--food-accent)',
          }}
        >
          <div className="p-[clamp(42px,6vw,84px)]">
            <p
              className="mb-4 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase"
              style={{ color: 'var(--cocoa)', letterSpacing: '0.14em' }}
            >
              <span className="qp-wiggle inline-block" aria-hidden="true">
                ✦
              </span>
              Sua vez
            </p>
            <h2 className="max-w-[20ch] font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-balance">
              Pronto pra
              <br />
              queimar uma?
            </h2>
            <p
              className="mt-5 max-w-[560px] text-[1.08rem] leading-relaxed"
              style={{ color: 'rgba(31, 41, 51, 0.82)' }}
            >
              Escreva como faz em casa, deixe a IA conferir e publique com
              confiança. Olhômetro vale tanto quanto gramas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/receitas/new"
                className="button-queimando-panela inline-flex"
                style={{
                  background: 'var(--cocoa)',
                  color: 'white',
                }}
              >
                Publicar minha receita
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/o-que-tem"
                className="inline-flex min-h-11 items-center gap-1.5 px-4 text-sm font-bold"
                style={{ color: 'var(--cocoa)' }}
              >
                O que tem na geladeira?
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div
            className="relative hidden self-stretch lg:block"
            style={{ minHeight: '340px' }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'var(--cocoa)' }}
            >
              <div className="text-center">
                <span
                  className="qp-float-badge inline-block text-6xl"
                  role="img"
                  aria-label="Panela"
                >
                  🍳
                </span>
                <p
                  className="mt-4 font-display text-sm font-bold uppercase"
                  style={{
                    color: 'var(--food-accent)',
                    letterSpacing: '0.1em',
                  }}
                >
                  Panela &gt; perfeição
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
