'use client';

import { ChefHat, Home, Sparkles, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { QPMark } from '@/components/brand/qp-mark';

const piadas = [
  {
    titulo: 'Essa receita fugiu da panela! 🏃‍♂️💨',
    texto:
      'Juro que estava aqui… deve ter escorregado no azeite e fugido pela janela da cozinha.',
  },
  {
    titulo: 'Ih, queimou! 🔥',
    texto:
      'Até o Google Maps se perdeu. Mas calma, nenhuma panela foi maltratada.',
  },
  {
    titulo: '404: tempero não encontrado 🧂',
    texto:
      'Procuramos em todas as gavetas. Até o orégano se escondeu de vergonha.',
  },
  {
    titulo: 'Panela vazia, coração cheio ❤️',
    texto: 'Essa página evaporou igual água no arroz. Bora cozinhar outra?',
  },
  {
    titulo: 'O chef se distraiu com o cheirinho 👨‍🍳',
    texto:
      'Foi cheirar o bolo e esqueceu onde salvou a página. Acontece nas melhores cozinhas!',
  },
];

export default function NotFound() {
  const [idx, setIdx] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const piada = piadas[idx % piadas.length];

  const sortear = () => {
    setIdx((p) => (p + 1) % piadas.length);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1200);
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-transparent px-4 py-10 sm:p-8">
      {/* confetti fofo */}
      {confetti && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute animate-[qp-confetti_900ms_cubic-bezier(0.25,1,0.5,1)_forwards]"
              style={{
                left: `${8 + i * 6}%`,
                top: -10,
                fontSize: i % 2 === 0 ? 18 : 14,
                animationDelay: `${i * 40}ms`,
                transform: `rotate(${i * 18}deg)`,
              }}
            >
              {['✨', '🍳', '🥚', '🧂'][i % 4]}
            </span>
          ))}
        </div>
      )}

      <div className="relative mx-auto w-full max-w-[560px]">
        {/* cartaz divertido */}
        <div
          className="relative overflow-hidden bg-white p-6 sm:p-8"
          style={{
            border: '2px solid #1b2920',
            boxShadow: '8px 8px 0 #1b2920',
          }}
        >
          {/* faixa topo */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-2 bg-[#1b2920] px-2.5 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.16em] text-white"
              style={{ letterSpacing: '0.14em' }}
            >
              <span
                className="size-2 rounded-full bg-[#a85131] animate-pulse"
                aria-hidden="true"
              />
              ERRO GOSTOSO 404
            </span>
            <button
              type="button"
              onClick={sortear}
              className="rounded-full border bg-white px-3 py-1 text-xs font-bold hover:bg-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              style={{ borderColor: 'var(--line)', color: 'var(--cocoa)' }}
              aria-label="Sortear outra piada"
            >
              outra piada →
            </button>
          </div>

          {/* 404 grandão com panela */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="font-display text-[clamp(3rem,12vw,5.5rem)] font-black leading-none tracking-[-0.04em] text-[#1b2920]">
                4
              </span>
              <button
                type="button"
                onClick={sortear}
                className="group grid size-[clamp(3rem,12vw,5.5rem)] place-items-center rounded-full border-2 bg-[#a85131] text-[#1b2920] transition-transform hover:rotate-6 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                style={{ borderColor: '#1b2920' }}
                aria-label="Tocar a panela"
                title="Toc toc, tem alguém aí?"
              >
                <span
                  className="text-[clamp(1.6rem,6vw,2.4rem)] transition-transform group-hover:rotate-12"
                  aria-hidden="true"
                >
                  🍳
                </span>
              </button>
              <span className="font-display text-[clamp(3rem,12vw,5.5rem)] font-black leading-none tracking-[-0.04em] text-[#1b2920]">
                4
              </span>
            </div>
            <p
              className="mt-2 text-xs font-bold uppercase tracking-[0.12em]"
              style={{ color: 'var(--ink-muted)' }}
            >
              panela → fumaça → risada
            </p>
          </div>

          <div className="mx-auto mt-6 flex justify-center">
            <QPMark className="size-10 rotate-[-8deg] transition-transform hover:rotate-[-2deg] hover:scale-105" />
          </div>

          <h1
            className="mt-4 text-center font-display text-[1.65rem] font-extrabold leading-none tracking-[-0.02em] sm:text-[1.9rem]"
            style={{ color: '#1b2920' }}
          >
            {piada.titulo}
          </h1>
          <p
            className="mx-auto mt-3 max-w-[42ch] text-center text-sm leading-6"
            style={{ color: '#3e4d42', textWrap: 'pretty' }}
          >
            {piada.texto} A boa notícia? Sua fome ainda está intacta e a gente
            tem centenas de receitas que <b>não</b> queimaram.
          </p>

          {/* selo feliz */}
          <div
            className="mx-auto mt-5 flex max-w-[360px] items-center justify-center gap-2 rounded-full border bg-[var(--muted)] px-3 py-2 text-xs font-bold"
            style={{ borderColor: 'var(--line)', color: 'var(--cocoa)' }}
          >
            <span
              className="size-2 rounded-full bg-[#a85131]"
              aria-hidden="true"
            />
            Você está a 1 clique de algo delicioso
            <span aria-hidden="true">😋</span>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="group relative grid h-12 place-items-center overflow-hidden border-2 bg-[#a85131] font-display text-xs font-extrabold uppercase tracking-[0.12em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1b2920] active:translate-y-0 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              style={{ borderColor: '#1b2920', color: '#1b2920' }}
            >
              <span
                className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0"
                aria-hidden="true"
              />
              <span className="relative flex items-center gap-2">
                <Home
                  className="size-4 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                  aria-hidden="true"
                />
                Voltar pra cozinha
                <span
                  className="grid size-6 place-items-center rounded-full bg-white text-[#1b2920] transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-12"
                  aria-hidden="true"
                >
                  <ChefHat className="size-3.5" />
                </span>
              </span>
            </Link>
            <Link
              href="/receitas"
              className="group relative grid h-12 place-items-center overflow-hidden border-2 bg-white font-display text-xs font-extrabold uppercase tracking-[0.12em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1b2920] hover:bg-[#1b2920] hover:text-white active:translate-y-0 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              style={{ borderColor: '#1b2920', color: '#1b2920' }}
            >
              <span className="relative flex items-center gap-2">
                <Utensils
                  className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                  aria-hidden="true"
                />
                Que não queimaram
                <Sparkles
                  className="size-3.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                  aria-hidden="true"
                />
              </span>
              <span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#a85131] px-2 py-0.5 text-[9px] font-black tracking-[0.08em] text-white opacity-0 transition-all duration-300 group-hover:bottom-2 group-hover:opacity-100"
                aria-hidden="true"
              >
                com carinho!
              </span>
            </Link>
          </div>

          <p
            className="mt-4 text-center text-xs"
            style={{ color: 'var(--ink-muted)' }}
          >
            Dica do chef: se tudo der errado, peça pizza e tente amanhã. A gente
            não conta. 😉
          </p>
        </div>

        {/* rodapé fofo */}
        <p
          className="mt-4 text-center text-xs"
          style={{ color: 'var(--ink-muted)' }}
        >
          Código 404 — mas com carinho.{' '}
          <Link
            href="/o-que-tem"
            className="font-bold underline decoration-[var(--food-accent)] underline-offset-4 hover:text-[var(--cocoa)]"
          >
            O que tem na geladeira?
          </Link>
        </p>
      </div>

      <style>{`@keyframes qp-confetti { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1 } 100% { transform: translateY(380px) rotate(180deg); opacity: 0 } }`}</style>
    </main>
  );
}
