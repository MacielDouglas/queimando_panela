'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: 'Prato principal',
    description: 'O que sustenta a família',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sobremesa',
    description: 'Doce com chave de ouro',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Café da manhã',
    description: 'Gosto de caseiro',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Acompanhamento',
    description: 'O extra que faz diferença',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
];

export default function SignUpSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="editorial-container">
        <div className="max-w-[62ch] border-t-2 border-[#ffb900] pt-6">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
            Queimando Panela
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
            As diversas histórias
            <br />
            da nossa cozinha
          </h2>
          <p className="mt-3 max-w-[52ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
            Receitas tradicionais que são a soma de incontáveis receitas locais
            com muito em comum, mas distinguidas pelas características típicas
            de sua origem.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={`/receitas?categoria=${encodeURIComponent(category.name)}`}
                className="group block overflow-hidden rounded-[12px] border border-[#e5e5e5] transition-[border-color,box-shadow] hover:border-[#0a0a0a] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
                aria-label={`Ver receitas de ${category.name}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-[0.05em] text-white text-wrap-balance">
                      {category.name}
                    </h3>
                    <p className="mt-1 font-sans text-xs text-white/70">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#e5e5e5] bg-white p-4">
                  <div className="inline-flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-[0.1em] text-[#0a0a0a]">
                    Ver receitas
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
