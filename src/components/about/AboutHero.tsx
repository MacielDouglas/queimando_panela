import Link from 'next/link';

export function AboutHero() {
  return (
    <section className="overflow-hidden px-0 py-[76px] lg:py-[64px]">
      <div className="editorial-container">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow-queimando-panela mx-auto">
            <span className="qp-float-badge inline-flex items-center gap-2">
              <span className="qp-wiggle inline-block" aria-hidden="true">
                🍳
              </span>
              Sobre o projeto
            </span>
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.2rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-balance">
            Queimando{' '}
            <em
              className="font-display font-normal italic"
              style={{ color: 'var(--food-accent)', letterSpacing: '-0.03em' }}
            >
              Panela
            </em>
            ?
          </h1>

          <p
            className="mx-auto mt-7 max-w-[52ch] text-[clamp(1rem,1.7vw,1.12rem)] leading-relaxed"
            style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
          >
            Um cantinho digital para cozinheiros amadores que acreditam que
            receita boa não precisa ser perfeita — precisa ter história.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/receitas/new"
              className="button-queimando-panela button-primary-queimando-panela"
            >
              Publicar receita
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/receitas"
              className="button-queimando-panela button-outline-queimando-panela"
            >
              Explorar receitas
            </Link>
          </div>

          <ul
            className="mx-auto mt-14 flex max-w-[480px] flex-wrap items-center justify-center gap-x-8 gap-y-4"
            aria-label="Valores"
          >
            {[
              { emoji: '🫶', label: 'Afeto primeiro' },
              { emoji: '🤖', label: 'IA co-piloto' },
              { emoji: '📖', label: 'Receitas com história' },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--ink-muted)' }}
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
