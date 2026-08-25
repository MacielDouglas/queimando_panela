import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { NavLinks } from '@/components/layout/nav-links';
import {
  developerLinks,
  footerNavItems,
} from '@/components/layout/navigation-data';

export default function Footer() {
  return (
    <footer className="border-t-[6px] border-[#ffb900] bg-[#0a0a0a] text-white">
      <div className="editorial-container grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:py-16">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white transition-colors hover:text-[#ffb900]"
          >
            <span className="flex size-10 items-center justify-center bg-[#ffb900] text-[#0a0a0a]">
              <QPMark className="size-7" />
            </span>
            <span className="flex flex-col font-display text-[13px] font-extrabold uppercase leading-none tracking-[0.1em]">
              <span>Queimando</span>
              <span>Panela</span>
            </span>
          </Link>

          <p className="mt-6 max-w-sm font-sans text-sm leading-6 text-white/70">
            A Estapar da cozinha brasileira — direta, quadrada e amarela.
            Receitas reais de gente real, sem pop-up, sem enrolação.
          </p>

          <div className="mt-6 flex gap-2">
            <span className="inline-block bg-[#ffb900] px-2 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
              Estapar
            </span>
            <span className="inline-block border border-white/20 px-2 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-white">
              Panelinha
            </span>
          </div>
        </div>

        <div>
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffb900]">
            Navegação
          </p>
          <nav aria-label="Links do rodapé" className="mt-4">
            <NavLinks
              items={footerNavItems}
              orientation="vertical"
              variant="footer"
              className="gap-2"
            />
          </nav>
        </div>

        <div>
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffb900]">
            Desenvolvimento
          </p>
          <p className="mt-4 font-sans text-sm leading-6 text-white/70">
            Site desenvolvido por Douglas Maciel — Estapar Panelinha, 0px,
            #ffb900, Sora grotesk.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {developerLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-[#ffb900] hover:bg-[#ffb900] hover:text-[#0a0a0a]"
                >
                  <Icon className="size-3.5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="editorial-container flex flex-col gap-3 py-5 font-sans text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Queimando Panela — Copia Estapar, alma Panelinha.</p>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">
            Feito com farinha na mão e #ffb900 no coração
          </p>
        </div>
      </div>
    </footer>
  );
}
