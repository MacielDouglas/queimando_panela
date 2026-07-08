'use client';

import type { Transition, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  RiArrowRightLine,
  RiBrainLine,
  RiHeart2Line,
  RiLeafLine,
  RiScalesLine,
  RiSparklingLine,
  RiToolsLine,
} from 'react-icons/ri';

// ── Correção do erro de tipo: Easing deve ser literal, não string genérica ──
const easeOut = [0.16, 1, 0.3, 1] as const satisfies Transition['ease'];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: easeOut,
    } satisfies Transition,
  }),
};

// ── Features da IA ──
const aiFeatures = [
  {
    icon: RiSparklingLine,
    title: 'Resumo apetitoso',
    description:
      'A IA cria um resumo que faz a boca água — cheiro, sabor e textura em palavras.',
  },
  {
    icon: RiScalesLine,
    title: 'Dificuldade real',
    description:
      'Ela avalia técnica, etapas e tempo pra dizer se é Fácil, Médio ou Difícil de verdade.',
  },
  {
    icon: RiLeafLine,
    title: 'Tabela nutricional',
    description:
      'Calorias, proteínas, fibras e mais — tudo estimado por 100g da receita pronta.',
  },
  {
    icon: RiToolsLine,
    title: 'Utensílios e dicas',
    description:
      'Lista o que você vai precisar e sugere substituições, harmonizações e variações.',
  },
];

// ── Canvas de neurônios ──
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface Connection {
  a: number;
  b: number;
  progress: number; // 0-1 sinal elétrico
  speed: number;
  active: boolean;
}

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const NODE_COUNT = 38;
    const CONNECTION_DISTANCE = 160;
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function init() {
      if (!canvas) return;
      nodes.length = 0;
      connections.length = 0;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1.5,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Cria conexões entre nós próximos
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < CONNECTION_DISTANCE) {
            connections.push({
              a: i,
              b: j,
              progress: Math.random(),
              speed: Math.random() * 0.004 + 0.001,
              active: Math.random() > 0.5,
            });
          }
        }
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Move nós
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.pulsePhase += 0.02;
      }

      // Atualiza sinal elétrico
      for (const conn of connections) {
        if (conn.active) {
          conn.progress += conn.speed;
          if (conn.progress >= 1) {
            conn.progress = 0;
            conn.active = Math.random() > 0.3;
          }
        } else if (Math.random() > 0.997) {
          conn.active = true;
        }
      }

      // Desenha conexões
      for (const conn of connections) {
        const a = nodes[conn.a];
        const b = nodes[conn.b];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > CONNECTION_DISTANCE) continue;

        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.18;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`; // amber-400
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Sinal elétrico viajando pela conexão
        if (conn.active) {
          const px = a.x + dx * conn.progress;
          const py = a.y + dy * conn.progress;
          const signalAlpha = Math.sin(conn.progress * Math.PI) * 0.9;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${signalAlpha})`;
          ctx.fill();

          // Brilho ao redor do sinal
          const grd = ctx.createRadialGradient(px, py, 0, px, py, 10);
          grd.addColorStop(0, `rgba(251, 191, 36, ${signalAlpha * 0.4})`);
          grd.addColorStop(1, 'rgba(251, 191, 36, 0)');
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }

      // Desenha nós
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const r = node.radius + pulse * 1.2;
        const alpha = 0.5 + pulse * 0.4;

        // Halo
        const halo = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          r * 4,
        );
        halo.addColorStop(0, `rgba(251, 191, 36, ${alpha * 0.25})`);
        halo.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Nó
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-60"
    />
  );
}

// ── Componente principal ──
export default function SignUpSection() {
  return (
    <section
      aria-labelledby="signup-title"
      className="relative overflow-hidden bg-neutral-950 py-16 sm:py-20 lg:py-24"
    >
      {/* Neurônios em movimento — fundo animado */}
      <NeuralCanvas />

      {/* Gradiente que suaviza as bordas do canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0a0a_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Cabeçalho ── */}
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mb-12 text-center"
        >
          <motion.p
            variants={fadeUpVariants}
            custom={0}
            className="text-[11px] font-semibold tracking-[0.2em] text-amber-500 uppercase"
          >
            Comunidade
          </motion.p>

          <motion.h2
            id="signup-title"
            variants={fadeUpVariants}
            custom={1}
            className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Sua receita merece{' '}
            <span className="text-amber-400">existir aqui.</span>
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            custom={2}
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg"
          >
            Compartilhe as receitas de família, as criativas e até aquelas que
            você jurava que não iam dar certo —{' '}
            <span className="font-medium text-neutral-200">mas deram! 🎉</span>
          </motion.p>
        </motion.header>

        {/* ── Bloco da IA ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mb-12"
        >
          {/* Badge da IA */}
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/30">
              <RiBrainLine
                className="h-5 w-5 text-amber-400"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-semibold text-amber-400 sm:text-base">
              Cada receita passa por análise com IA
            </p>
          </motion.div>

          {/* Grid de features */}
          <ul
            role="list"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {aiFeatures.map((feature, i) => (
              <motion.li
                key={feature.title}
                variants={fadeUpVariants}
                custom={i + 1}
                className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                  <feature.icon
                    className="h-5 w-5 text-amber-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.p
            variants={fadeUpVariants}
            custom={0}
            className="flex items-center gap-2 text-sm text-neutral-500"
          >
            <RiHeart2Line
              className="h-4 w-4 text-amber-500/70"
              aria-hidden="true"
            />
            Grátis. Sem frescura. Só receita boa.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            custom={1}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/sign-up"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-amber-500 px-8 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
            >
              Quero entrar na cozinha
              <RiArrowRightLine className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href="/receitas"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-700 px-8 text-sm font-semibold text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
            >
              Ver receitas primeiro
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
