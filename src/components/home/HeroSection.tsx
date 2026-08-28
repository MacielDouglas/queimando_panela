import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="overflow-hidden px-0 py-[76px] lg:py-[64px]">
      <div className="editorial-container grid items-center gap-[clamp(36px,7vw,94px)] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="max-w-[650px]">
          <p className="eyebrow-queimando-panela">Blog culinário, amador</p>

          <h1 className="font-display text-[clamp(3.15rem,7vw,6.1rem)] font-bold leading-[0.92] tracking-[-0.07em]">
            Receitas caseiras que são{' '}
            <em className="not-italic" style={{ color: 'var(--forest-hover)' }}>
              memória.
            </em>
          </h1>

          <p
            className="mt-7 max-w-[530px] text-[clamp(1rem,1.7vw,1.12rem)]"
            style={{ color: 'var(--ink-muted)' }}
          >
            Descubra, guarde e compartilhe receitas de família. Histórias que
            merecem ser lembradas, direto da cozinha de quem faz com carinho.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/receitas"
              className="button-epirus button-primary-epirus"
            >
              Explorar receitas
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/receitas/new"
              className="button-epirus button-outline-epirus"
            >
              Enviar receita
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap gap-5" aria-label="Diferenciais">
            <li className="flex min-w-[118px] flex-col gap-0.5">
              <strong
                className="text-[1.25rem] font-bold"
                style={{ color: 'var(--forest)' }}
              >
                100%
              </strong>
              <span
                className="text-[0.84rem]"
                style={{ color: 'var(--ink-muted)' }}
              >
                cozinheiros de plantão
              </span>
            </li>
            <li className="flex min-w-[118px] flex-col gap-0.5">
              <strong
                className="text-[1.25rem] font-bold"
                style={{ color: 'var(--forest)' }}
              >
                +Receitas
              </strong>
              <span
                className="text-[0.84rem]"
                style={{ color: 'var(--ink-muted)' }}
              >
                de tradição à mesa
              </span>
            </li>
            <li className="flex min-w-[118px] flex-col gap-0.5">
              <strong
                className="text-[1.25rem] font-bold"
                style={{ color: 'var(--forest)' }}
              >
                IA
              </strong>
              <span
                className="text-[0.84rem]"
                style={{ color: 'var(--ink-muted)' }}
              >
                aprimorando o que esta bom
              </span>
            </li>
          </ul>
        </div>

        <div className="relative hidden min-h-[540px] lg:block">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              borderRadius: '46% 46% 22px 22px',
              background: '#d9dfc9',
              right: '18px',
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85"
              alt="Mesa com ingredientes frescos e receitas"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
          <div
            className="absolute bottom-[30px] right-0 grid size-[145px] place-items-center border-[9px] text-center"
            style={{
              borderColor: 'var(--cream)',
              borderRadius: '50%',
              background: 'var(--accent-e)',
              color: 'var(--forest)',
              boxShadow: 'var(--shadow)',
              transform: 'rotate(10deg)',
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
