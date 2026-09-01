'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

const values = [
  {
    emoji: '🫶',
    title: 'Afeto primeiro',
    description:
      'Receita não é técnica — é memória. Medida de olhômetro, pitada de amor e história que passa de geração em geração.',
  },
  {
    emoji: '🤝',
    title: 'Confiança mútua',
    description:
      'A IA confere, mas quem aprova é você. Transparência total no processo — sem veredito fechado, sem surpresa.',
  },
  {
    emoji: '🌱',
    title: 'Comunidade que volta',
    description:
      'Não é só um blog. É um lugar onde cozinheiros amadores compartilham, aprendem e se inspiram mutualmente.',
  },
];

export function AboutCommunity() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      className="py-[120px]"
      style={{ background: 'var(--cocoa)', color: 'white' }}
    >
      <div className="editorial-container">
        <div
          ref={ref}
          className="grid items-start gap-[clamp(38px,8vw,110px)] lg:grid-cols-[1fr_1.1fr]"
        >
          <div
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateX(0)' : 'translateX(-24px)',
              transition:
                'opacity 0.6s cubic-bezier(0.25,1,0.5,1), transform 0.6s cubic-bezier(0.25,1,0.5,1)',
            }}
          >
            <p
              className="eyebrow-queimando-panela"
              style={{ color: 'var(--food-accent)' }}
            >
              Comunidade
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-balance">
              Cozinhar é melhor{' '}
              <em
                className="font-display font-normal italic"
                style={{ color: 'var(--food-accent)' }}
              >
                junto
              </em>
              .
            </h2>
            <div
              className="mt-5 h-[3px] w-12"
              style={{ background: 'var(--food-accent)' }}
              aria-hidden="true"
            />
            <p
              className="mt-6 max-w-[52ch] text-[1.08rem] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              O Queimando Panela nasceu da ideia simples de que receita boa se
              conta, não se compra. Um lugar onde o errou na panela vira piada e
              a receita da avó vira referência.
            </p>
          </div>

          <div
            className="grid gap-0 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            {values.map((value, index) => (
              <article
                key={value.title}
                className="border-b py-[28px]"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.5s cubic-bezier(0.25,1,0.5,1) ${0.2 + index * 0.1}s, transform 0.5s cubic-bezier(0.25,1,0.5,1) ${0.2 + index * 0.1}s`,
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="mt-1 text-2xl transition-transform duration-300 hover:scale-110"
                    aria-hidden="true"
                  >
                    {value.emoji}
                  </span>
                  <div>
                    <h3
                      className="text-[1.22rem] font-bold leading-tight tracking-[-0.015em]"
                      style={{ color: 'white' }}
                    >
                      {value.title}
                    </h3>
                    <p
                      className="mt-2 max-w-[48ch] text-[0.96rem] leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.72)' }}
                    >
                      {value.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
