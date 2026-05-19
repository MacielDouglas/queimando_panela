'use client';

import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf2]">
      {/* Background gradients */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_45%)]"
      />

      <div
        aria-hidden
        className="absolute -top-32 right-30 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div
        aria-hidden
        className="absolute bottom-30 left-30 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl"
      />

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700"
            >
              <ChefHat className="h-4 w-4" />
              Receita em preparação
            </motion.div>

            <div className="space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                }}
                className="max-w-2xl text-5xl font-black tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl"
              >
                Queimando <span className="text-amber-500">Panela</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.25,
                }}
                className="max-w-xl text-lg leading-8 text-neutral-600 sm:text-xl"
              >
                Estamos terminando de cozinhar o blog. Receitas, histórias,
                dicas e sabores estão quase saindo do forno.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.35,
                }}
                className="text-base font-medium text-amber-700"
              >
                Em breve será servido.
              </motion.p>
            </div>

            {/* animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.5,
              }}
              className="flex items-center gap-3"
            >
              {[0, 1, 2].map((item) => (
                <motion.div
                  key={item}
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: item * 0.2,
                  }}
                  className="h-3 w-3 rounded-full bg-amber-500"
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Main card */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative overflow-hidden rounded-4xl border border-amber-100 bg-white/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">Receita do dia</p>

                      <h2 className="mt-1 text-2xl font-bold text-neutral-900">
                        Bolo de Cenoura
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                      <ChefHat className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 w-full rounded-full bg-neutral-100" />
                    <div className="h-3 w-5/6 rounded-full bg-neutral-100" />
                    <div className="h-3 w-4/6 rounded-full bg-neutral-100" />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-5 py-4">
                    <div>
                      <p className="text-sm text-neutral-500">Status</p>

                      <p className="font-semibold text-neutral-900">
                        Cozinhando...
                      </p>
                    </div>

                    <motion.div
                      animate={{
                        rotate: [0, 8, -8, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                      }}
                      className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950"
                    >
                      🔥
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card */}
              <motion.div
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-8 -left-8 rounded-2xl border border-amber-100 bg-white px-5 py-4 shadow-xl"
              >
                <p className="text-sm text-neutral-500">Temperando ideias</p>

                <p className="mt-1 font-semibold text-neutral-900">
                  Receitas autorais 🍲
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
