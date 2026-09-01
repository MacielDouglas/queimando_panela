import Image from 'next/image';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="qp-reveal pb-24 lg:pb-28">
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
              <span
                className="h-[2px] w-7"
                style={{ background: 'var(--cocoa)' }}
                aria-hidden="true"
              />
              Comece hoje
            </p>
            <h2
              className="max-w-[20ch] font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-balance"
              style={{ color: 'var(--cocoa)' }}
            >
              Sua receita merece ir ao ar com confiança.
            </h2>
            <p
              className="mt-5 max-w-[560px] text-[1.08rem] leading-relaxed"
              style={{ color: 'var(--ink-muted)' }}
            >
              Publique em 3 minutos: escreva como faz em casa, a IA confere
              utensílios, nutrição, tempo e categoria. Você revisa e publica.
            </p>
            <Link
              href="/receitas/new"
              className="button-queimando-panela mt-8 inline-flex"
              style={{
                background: 'var(--cocoa)',
                color: 'white',
              }}
            >
              Publicar minha receita
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div
            className="relative hidden self-stretch lg:block"
            style={{ minHeight: '340px' }}
          >
            <Image
              src="/images/refeicao-compartilhada.jpg"
              alt="Pessoas compartilhando uma refeição à mesa"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
