'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const slides = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Ingredientes frescos e temperos',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
    alt: 'Prato tradicional caseiro',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    alt: 'Apresentação gastronômica',
  },
];

const pillars = [
  {
    title: 'Receitas de família',
    description:
      'Pratos que passam de geração em geração, guardando memórias e sabores.',
  },
  {
    title: 'Ingredientes locais',
    description:
      'Valorizamos o que é da terra, o que enche a despensa e o coração.',
  },
  {
    title: 'Tradição viva',
    description: 'Cada receita é um pedaço de história que merece ser contada.',
  },
];

export function GastronomySection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="bg-[#0a0a0a] py-16 lg:py-24">
      <div className="editorial-container">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-[520px]">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#ffb900]">
              Gastronomia
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-white text-wrap-balance">
              Raízes e história
            </h2>
            <p className="mt-5 max-w-[48ch] font-sans text-[15px] leading-7 text-white/70 text-wrap-pretty">
              Faça uma viagem sensorial no tempo pelas tradições culinárias.
              Saboreie as tortas salgadas, o orgulho da culinária caseira.
              Aproveite o café da manhã, uma fonte atemporal de energia.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/receitas"
                className="group inline-flex items-center gap-3 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:text-[#ffb900]"
              >
                Descobrir
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:border-[#ffb900] group-hover:bg-[#ffb900] group-hover:text-[#0a0a0a]">
                  →
                </span>
              </Link>
            </div>

            <ul className="mt-10 grid gap-4">
              {pillars.map((pillar) => (
                <li
                  key={pillar.title}
                  className="border-l-2 border-white/20 pl-5 transition-colors hover:border-[#ffb900]"
                >
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.1em] text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-6 text-white/60">
                    {pillar.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={slides[index].id}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1 transition-all ${
                      index === currentSlide
                        ? 'w-8 bg-[#ffb900]'
                        : 'w-4 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                {String(currentSlide + 1).padStart(2, '0')} /{' '}
                {String(slides.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
