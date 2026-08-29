import Image from 'next/image';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="pb-[112px]">
      <div className="editorial-container">
        <div
          className="grid items-center overflow-hidden lg:grid-cols-[1.15fr_0.85fr]"
          style={{
            borderRadius: 'var(--radius-lg)',
            background: 'var(--accent-e)',
          }}
        >
          <div className="p-[clamp(38px,6vw,76px)]">
            <h2
              className="max-w-[630px] font-display text-[clamp(2.25rem,4.6vw,4rem)] font-bold leading-none tracking-[-0.05em]"
              style={{ color: 'var(--forest)' }}
            >
              Sua receita merece ir ao ar com confiança.
            </h2>
            <p
              className="mt-5 max-w-[520px]"
              style={{ color: 'rgba(31, 41, 51, 0.78)' }}
            >
              Publique em 3 minutos: escreva como faz em casa, a IA confere
              utensílios, nutrição, tempo e categoria. Você revisa e publica.
            </p>
            <Link
              href="/receitas/new"
              className="button-queimando-panela mt-8 inline-flex"
              style={{
                background: 'var(--forest)',
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
              src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80"
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
