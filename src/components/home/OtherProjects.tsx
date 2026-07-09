'use client';

import type { Transition, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  RiArrowRightLine,
  RiBookOpenLine,
  RiGroupLine,
  RiHeartLine,
  RiRestaurantLine,
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

const pillars = [
  {
    icon: RiRestaurantLine,
    title: 'Panela no fogo',
    description:
      'Receitas feitas por gente como você, testadas na cozinha de casa. Ingredientes acessíveis, modo de preparo claro e nenhum frescura.',
  },
  {
    icon: RiHeartLine,
    title: 'História à mesa',
    description:
      'Cada receita carrega uma memória: a da sua avó, a do almoço de domingo, a daquela descoberta que virou tradição.',
  },
  {
    icon: RiGroupLine,
    title: 'Comunidade que cozinha',
    description:
      'Descubra, inspire-se e compartilhe. Sua receita pode ser exatamente o que alguém está procurando hoje.',
  },
];

const categories = [
  { name: 'Prato principal', description: 'Arroz, feijão, carne, massa — o que sustenta a família' },
  { name: 'Sobremesa', description: 'Doce que encerra a refeição com chave de ouro' },
  { name: 'Café da manhã', description: 'Começar o dia com gosto de caseiro' },
  { name: 'Acompanhamento', description: 'Aquele extra que faz toda diferença no prato' },
];

export default function OtherProjects() {
  return (
    <section
      aria-labelledby="community-title"
      className="relative overflow-hidden bg-neutral-950 py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_28%),radial-gradient(circle_at_bottom_center,rgba(255,255,255,0.05),transparent_40%)]" />
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
            <motion.h2
              id="community-title"
              variants={fadeUp}
              className="mt-3 max-w-2xl text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              A cozinha é{' '}
              <span className="text-amber-400">de todo mundo.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg"
            >
              Queimando Panela é um caderno de receitas vivo — um lugar onde
              cozinheiros de verdade compartilham pratos, histórias e sabores
              que merecem ser lembrados.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/sign-up"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-amber-500 px-7 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
              >
                Quero compartilhar minhas receitas
                <RiArrowRightLine className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/receitas"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-700 bg-transparent px-7 text-sm font-semibold text-neutral-200 transition-colors hover:border-neutral-500 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
              >
                Explorar receitas
              </Link>
            </motion.div>

            <motion.ul
              variants={container}
              className="mt-10 grid gap-4 sm:grid-cols-3"
              role="list"
            >
              {pillars.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.li
                    key={item.title}
                    variants={fadeUp}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
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
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
            aria-label="Categorias de receitas"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
            />

            <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                  Categorias
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  Navegue pelo tipo de receita que mais combina com seu momento
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <RiBookOpenLine className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <ul role="list" className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/receitas?categoria=${encodeURIComponent(cat.name)}`}
                    className="group flex items-center gap-3 rounded-lg border border-white/8 bg-neutral-900/80 p-4 transition-colors hover:border-amber-400/30 hover:bg-neutral-900"
                  >
                    <div className="shrink-0">
                      <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {cat.name}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-neutral-400">
                        {cat.description}
                      </p>
                    </div>
                    <RiArrowRightLine
                      className="ml-auto h-4 w-4 shrink-0 text-neutral-500 transition-colors group-hover:text-amber-400"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg border border-amber-400/20 bg-amber-400/[0.03] p-4">
              <p className="text-sm font-medium text-amber-300">
                Toda receita publicada passa por análise da comunidade.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                Nosso caderno de receitas cresce com a contribuição de
                cozinheiros de verdade — sem frescura, sem ego, só o sabor de
                compartilhar.
              </p>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
