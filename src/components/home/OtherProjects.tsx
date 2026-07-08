'use client';

import type { Transition, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  RiArrowRightUpLine,
  RiCodeSSlashLine,
  RiGithubLine,
  RiLayoutGridLine,
  RiRocketLine,
  RiSparklingLine,
} from 'react-icons/ri';

const easeOut = [0.16, 1, 0.3, 1] as const satisfies Transition['ease'];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOut,
    },
  },
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const highlights = [
  {
    icon: RiCodeSSlashLine,
    title: 'Arquitetura moderna',
    description:
      'Projetos com foco em performance, componentização, acessibilidade e experiência real de uso.',
  },
  {
    icon: RiSparklingLine,
    title: 'IA aplicada',
    description:
      'Integrações inteligentes para enriquecer fluxos, classificar conteúdo e simplificar decisões.',
  },
  {
    icon: RiLayoutGridLine,
    title: 'Produto + interface',
    description:
      'Não é só tela bonita: cada projeto nasce com estrutura, propósito e atenção aos detalhes.',
  },
];

const featuredProjects = [
  {
    name: 'Queimando Panela',
    tag: 'Food Tech',
    description:
      'Um blog e plataforma de receitas com curadoria, classificação com IA, imagem de capa e experiência editorial moderna.',
  },
  {
    name: 'Projetos full-stack',
    tag: 'Web Apps',
    description:
      'Interfaces robustas, integrações reais, testes automatizados e foco em código sustentável ao longo do tempo.',
  },
  {
    name: 'Experimentos de produto',
    tag: 'Labs',
    description:
      'Ideias transformadas em experiências navegáveis, úteis e com personalidade própria.',
  },
];

export default function OtherProjects() {
  return (
    <section
      aria-labelledby="other-projects-title"
      className="relative overflow-hidden bg-neutral-950 py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_28%),radial-gradient(circle_at_bottom_center,rgba(255,255,255,0.05),transparent_40%)]" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <motion.p
              variants={fadeUp}
              className="text-[11px] font-semibold tracking-[0.22em] text-amber-400 uppercase"
            >
              Mais projetos
            </motion.p>

            <motion.h2
              id="other-projects-title"
              variants={fadeUp}
              className="mt-3 max-w-2xl text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Se você curtiu este projeto, espere até ver o{' '}
              <span className="text-amber-400">resto do laboratório.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg"
            >
              Aqui não mora projeto sem graça. Tem produto com cara de produto,
              interface com personalidade, código bem pensado e aquele nível de
              obsessão por detalhe que faz o desenvolvedor abrir o inspector só
              por respeito.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base"
            >
              Esta seção funciona como uma porta de entrada para outros
              trabalhos do Douglas Maciel, reunidos na página de projetos
              publicada em{' '}
              <a
                href="https://macield.vercel.app/work"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-400 underline decoration-amber-400/40 underline-offset-4 hover:text-amber-300"
              >
                macield.vercel.app/work
              </a>
              .
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="https://macield.vercel.app/work"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-amber-500 px-7 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
              >
                Explorar outros projetos
                <RiArrowRightUpLine className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-700 bg-transparent px-7 text-sm font-semibold text-neutral-200 transition-colors hover:border-neutral-500 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
              >
                Ver código e presença online
                <RiGithubLine className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.ul
              variants={container}
              className="mt-10 grid gap-4 sm:grid-cols-3"
              role="list"
            >
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.li
                    key={item.title}
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/12 text-amber-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      {item.description}
                    </p>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>

          <motion.aside
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6"
            aria-label="Prévia dos projetos"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
            />

            <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-amber-400 uppercase">
                  Preview
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  Alguns tipos de projeto que você encontra por lá
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <RiRocketLine className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <ul role="list" className="space-y-4">
              {featuredProjects.map((project, index) => (
                <li
                  key={project.name}
                  className="group rounded-2xl border border-white/8 bg-neutral-900/80 p-4 transition-colors hover:border-amber-400/30 hover:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-amber-300 uppercase">
                        {project.tag}
                      </p>

                      <h3 className="mt-3 text-base font-semibold text-white">
                        {project.name}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                        {project.description}
                      </p>
                    </div>

                    <span
                      className="mt-1 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-neutral-500"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-2xl border border-dashed border-amber-400/20 bg-amber-400/5 p-4">
              <p className="text-sm font-medium text-amber-300">
                Tem mais coisa além do card bonitinho.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                Tem solução, arquitetura, lapidação, testes, refatoração e um
                toque saudável de “isso aqui ficou bom demais pra ficar
                escondido”.
              </p>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
