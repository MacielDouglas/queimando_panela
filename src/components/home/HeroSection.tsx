import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="overflow-hidden px-0 py-[76px] lg:py-[64px]">
      <div className="editorial-container grid items-center gap-[clamp(36px,7vw,94px)] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="max-w-[650px]">
          <p className="eyebrow-queimando-panela">Feito por quem cozinha</p>

          <h1 className="font-display text-[clamp(3.2rem,7vw,6.4rem)] font-extrabold leading-[0.88] tracking-[-0.04em]">
            Receitas caseiras que são{' '}
            <em className="not-italic" style={{ color: 'var(--cocoa-hover)' }}>
              memória.
            </em>
          </h1>

          <p
            className="mt-7 max-w-[560px] text-[clamp(1rem,1.7vw,1.12rem)] leading-relaxed"
            style={{ color: 'var(--ink-muted)' }}
          >
            Escreva como faz em casa. A IA confere utensílios, tempo, nutrição e
            categoria — você revisa e publica com segurança.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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

          <ul className="mt-14 flex flex-wrap gap-7" aria-label="Diferenciais">
            <li className="flex min-w-[132px] flex-col gap-1">
              <strong
                className="text-[1.45rem] font-extrabold leading-none tracking-[-0.02em]"
                style={{ color: 'var(--cocoa)' }}
              >
                100%
              </strong>
              <span
                className="text-[0.76rem] font-bold uppercase"
                style={{ color: 'var(--ink-muted)', letterSpacing: '0.1em' }}
              >
                histórias reais
              </span>
            </li>
            <li className="flex min-w-[132px] flex-col gap-1">
              <strong
                className="text-[1.45rem] font-extrabold leading-none tracking-[-0.02em]"
                style={{ color: 'var(--cocoa)' }}
              >
                3 passos
              </strong>
              <span
                className="text-[0.76rem] font-bold uppercase"
                style={{ color: 'var(--ink-muted)', letterSpacing: '0.1em' }}
              >
                escrever · conferir · publicar
              </span>
            </li>
            <li className="flex min-w-[132px] flex-col gap-1">
              <strong
                className="text-[1.45rem] font-extrabold leading-none tracking-[-0.02em]"
                style={{ color: 'var(--cocoa)' }}
              >
                IA
              </strong>
              <span
                className="text-[0.76rem] font-bold uppercase"
                style={{ color: 'var(--ink-muted)', letterSpacing: '0.1em' }}
              >
                co-piloto que confere
              </span>
            </li>
          </ul>
        </div>

        <div className="relative hidden min-h-[580px] lg:block">
          <div
            className="qp-parallax absolute inset-0 overflow-hidden"
            style={{
              borderRadius: '46% 46% 22px 22px',
              background: '#e8ddca',
              right: '12px',
            }}
          >
            <Image
              src="/images/hero-cozinha.jpg"
              alt="Mesa com ingredientes frescos e receitas"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
          <div
            className="qp-badge-float absolute bottom-[18px] right-[-6px] grid size-[168px] place-items-center border-[10px] text-center"
            style={{
              borderColor: 'var(--cream)',
              borderRadius: '50%',
              background: 'var(--food-accent)',
              color: 'var(--cocoa)',
              boxShadow: 'var(--shadow)',
              transform: 'rotate(12deg)',
            }}
            role="img"
            aria-label="Feito com cuidado"
          >
            <span
              className="max-w-[92px] text-[0.83rem] font-bold uppercase leading-[1.25]"
              style={{ letterSpacing: '0.06em' }}
            >
              feito com cuidado por cozinheiros amadores
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
