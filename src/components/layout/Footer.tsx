import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { NavLinks } from '@/components/layout/nav-links';
import {
  developerLinks,
  footerNavItems,
} from '@/components/layout/navigation-data';

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white">
      <div className="editorial-container grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:py-16">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[#0a0a0a] hover:text-[#ffb900]"
          >
            <span className="flex size-9 items-center justify-center bg-[#0a0a0a] text-[#ffb900]">
              <QPMark className="size-6" />
            </span>
            <span className="flex flex-col font-display text-[13px] font-extrabold uppercase leading-none tracking-[0.1em]">
              <span>Queimando</span>
              <span>Panela</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm font-sans text-sm leading-6 text-[#6b6b6b]">
            Blog moderno para cozinheiros 30–55. Receitas com leitura agradável
            e IA que classifica, sugere e estima.
          </p>
        </div>

        <div>
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#0a0a0a]">
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
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#0a0a0a]">
            Desenvolvimento
          </p>
          <p className="mt-4 font-sans text-sm leading-6 text-[#6b6b6b]">
            Site desenvolvido por Douglas Maciel — blog limpo, hierarquia forte,
            amarelo restrained.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {developerLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#e5e5e5] bg-white px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.08em] text-[#0a0a0a] hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
                >
                  <Icon className="size-3.5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-[#e5e5e5]">
        <div className="editorial-container flex flex-col gap-2 py-4 font-sans text-xs text-[#6b6b6b] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Queimando Panela. Todos os direitos reservados.</p>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.1em]">
            Leitura agradável • IA inteligente
          </p>
        </div>
      </div>
    </footer>
  );
}
