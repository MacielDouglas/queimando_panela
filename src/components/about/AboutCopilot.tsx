'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '🔧',
    title: 'Utensílios',
    description:
      'A IA identifica o que você precisa: panela, frigideira, liquidificador, batedeira... nada de surpresa na hora de cozinhar.',
  },
  {
    icon: '⏱️',
    title: 'Tempo estimado',
    description:
      'Pré-aquecimento, preparo e cozimento — tudo estimado para você planejar melhor o dia.',
  },
  {
    icon: '🥗',
    title: 'Informação nutricional',
    description:
      'Calorias, proteínas, carboidratos e gorduras por porção. Não precisa ser nutricionista pra saber o que está comendo.',
  },
  {
    icon: '🏷️',
    title: 'Classificação automática',
    description:
      'Categoria, tipo, dificuldade e utensílios — tudo organizado pra encontrar sua receita na hora.',
  },
];

export function AboutCopilot() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 lg:py-28">
      <div className="editorial-container">
        <div
          ref={ref}
          className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
        >
          <div
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateX(0)' : 'translateX(-24px)',
              transition:
                'opacity 0.6s cubic-bezier(0.25,1,0.5,1), transform 0.6s cubic-bezier(0.25,1,0.5,1)',
            }}
          >
            <p className="eyebrow-queimando-panela">IA co-piloto</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-balance">
              A tecnologia serve{' '}
              <em
                className="font-display font-normal italic"
                style={{ color: 'var(--food-accent)' }}
              >
                você
              </em>
              , não o contrário.
            </h2>
            <p
              className="mt-5 max-w-[48ch] text-[1.04rem] leading-relaxed"
              style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
            >
              A IA do Queimando Panela não cozinha por você. Ela confere, sugere
              e organiza — como um amigo que já fez aquela receita antes. Você
              mantém o controle total.
            </p>

            <div
              className="mt-8 rounded-[var(--radius-md)] p-5"
              style={{
                background: 'var(--cocoa)',
                border: '1px solid var(--line)',
              }}
            >
              <p
                className="text-[0.78rem] font-bold uppercase"
                style={{
                  color: 'var(--food-accent)',
                  letterSpacing: '0.08em',
                }}
              >
                Filosofia
              </p>
              <p
                className="mt-2 text-[1.08rem] font-display font-bold italic leading-snug"
                style={{ color: 'white' }}
              >
                &ldquo;Quem manda na receita é quem cozinha. A IA só confere se
                tá tudo certo.&rdquo;
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="qp-card-delight group rounded-[var(--radius-md)] border bg-white p-5 transition-all duration-220"
                style={{
                  borderColor: 'var(--line)',
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s cubic-bezier(0.25,1,0.5,1) ${0.15 + index * 0.08}s, transform 0.5s cubic-bezier(0.25,1,0.5,1) ${0.15 + index * 0.08}s, box-shadow 220ms cubic-bezier(0.25,1,0.5,1), border-color 220ms cubic-bezier(0.25,1,0.5,1)`,
                }}
              >
                <span
                  className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  aria-hidden="true"
                >
                  {feature.icon}
                </span>
                <h3
                  className="mt-3 font-display text-lg font-bold tracking-[-0.01em]"
                  style={{ color: 'var(--cocoa)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-[0.92rem] leading-relaxed"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
