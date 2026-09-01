'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    emoji: '✍️',
    title: 'Escreva como faz em casa',
    description:
      'Não precisa ser chef. Escreva com medidas de olhômetro, colher de pau e pitada de amor — a gente entende.',
    color: 'var(--food-accent)',
    bg: 'var(--food-accent-soft)',
  },
  {
    number: '02',
    emoji: '🤖',
    title: 'A IA confere pra você',
    description:
      'Enquanto você escreve, a IA analisa utensílios necessários, estima tempo, calcula nutrição e classifica a receita. Tudo automático.',
    color: 'var(--ai-primary)',
    bg: 'var(--ai-muted)',
  },
  {
    number: '03',
    emoji: '🔍',
    title: 'Revise o rascunho',
    description:
      'O rascunho da IA não é veredito — é sugestão. Você ajusta, edita, muda o que quiser. Quem manda é você.',
    color: 'var(--cocoa)',
    bg: 'var(--muted)',
  },
  {
    number: '04',
    emoji: '🎉',
    title: 'Publique com confiança',
    description:
      'Com a IA conferida e sua edição pronta, publice sabendo que a receita está completa: utensílios, tempo, nutrição e categoria.',
    color: 'var(--food-accent)',
    bg: 'var(--food-accent-soft)',
  },
  {
    number: '05',
    emoji: '❤️',
    title: 'Compartilhe a história',
    description:
      'Toda receita tem dono e história. Publique a sua, conte de onde veio e deixe outras pessoas cozinhar com o seu jeito.',
    color: 'var(--moss)',
    bg: '#d4dac9',
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="qp-reveal group relative flex gap-5 lg:gap-8"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s cubic-bezier(0.25,1,0.5,1) ${index * 0.08}s, transform 0.5s cubic-bezier(0.25,1,0.5,1) ${index * 0.08}s`,
      }}
    >
      {/* Número + linha vertical */}
      <div className="flex flex-col items-center">
        <div
          className="grid size-14 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md lg:size-16"
          style={{
            borderColor: step.color,
            background: step.bg,
            color: step.color,
          }}
        >
          <span className="text-xl font-black tracking-tight lg:text-2xl">
            {step.number}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div
            className="mt-3 hidden w-px flex-1 lg:block"
            style={{ background: 'var(--line)' }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 pb-10 lg:pb-14">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl transition-transform duration-300 group-hover:rotate-12 lg:text-3xl"
            aria-hidden="true"
          >
            {step.emoji}
          </span>
          <h3
            className="font-display text-[1.35rem] font-bold leading-tight tracking-[-0.02em] lg:text-[1.65rem]"
            style={{ color: 'var(--cocoa)' }}
          >
            {step.title}
          </h3>
        </div>
        <p
          className="mt-3 max-w-[48ch] text-[0.96rem] leading-relaxed lg:text-[1.04rem]"
          style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function AboutSteps() {
  return (
    <section className="py-24 lg:py-28" style={{ background: 'var(--cream)' }}>
      <div className="editorial-container">
        <div className="mx-auto max-w-[620px] text-center">
          <p className="eyebrow-queimando-panela">Passo a passo</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-balance">
            Como funciona o{' '}
            <em
              className="font-display font-normal italic"
              style={{ color: 'var(--food-accent)' }}
            >
              Queimando Panela
            </em>
            ?
          </h2>
          <p
            className="mx-auto mt-4 max-w-[48ch] text-[1.04rem] leading-relaxed"
            style={{ color: 'var(--ink-muted)' }}
          >
            Do caderno de receitas da vó até a tela do celular. Em 5 passos
            simples.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-[600px]">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
