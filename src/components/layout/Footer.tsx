import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { NavLinks } from '@/components/layout/nav-links';
import {
  developerLinks,
  footerNavItems,
} from '@/components/layout/navigation-data';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_1fr] lg:px-8 lg:py-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white transition-colors hover:text-amber-500"
          >
            <span className="text-amber-500">
              <QPMark className="size-10" />
            </span>

            <span className="flex flex-col">
              <span className="text-sm font-semibold tracking-[0.18em] uppercase">
                Queimando
              </span>
              <span className="text-sm font-semibold tracking-[0.18em] uppercase">
                Panela
              </span>
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-6 text-stone-400">
            Um blog culinário amador, aberto a todos, para descobrir, guardar e
            compartilhar receitas.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
            Navegação
          </p>

          <nav aria-label="Links do rodapé" className="mt-4">
            <NavLinks
              items={footerNavItems}
              orientation="vertical"
              variant="footer"
              className="gap-3"
            />
          </nav>
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
            Desenvolvimento
          </p>

          <p className="mt-4 text-sm leading-6 text-stone-300">
            Site desenvolvido por Douglas Maciel, com foco em experiência,
            performance e arquitetura moderna para web.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            {developerLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-stone-200 transition-colors hover:text-amber-500"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-stone-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 Queimando Panela. Todos os direitos reservados.</p>
          <p>
            Feito para compartilhar receitas de forma simples, acessível e
            moderna.
          </p>
        </div>
      </div>
    </footer>
  );
}
