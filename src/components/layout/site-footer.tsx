import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/receitas', label: 'Receitas' },
  { href: '/receitas/new', label: 'Enviar receita' },
];

const legalLinks = [
  { href: '/termos', label: 'Termos de uso' },
  { href: '/privacidade', label: 'Política de privacidade' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#0a0a0a] text-white">
      <div className="editorial-container grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr_1fr] lg:py-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white transition-colors hover:text-[#ffb900]"
          >
            <span className="text-[#ffb900]">
              <QPMark className="size-10" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Queimando
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
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
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Navegação
          </p>
          <nav aria-label="Links do rodapé" className="mt-4">
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-300 transition-colors hover:text-[#ffb900]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Legal
          </p>
          <nav aria-label="Links legais" className="mt-4">
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-300 transition-colors hover:text-[#ffb900]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="editorial-container flex flex-col gap-3 py-5 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
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
