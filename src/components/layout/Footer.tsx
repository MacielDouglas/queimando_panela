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

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-[#0a0a0a] text-white">
      <div className="editorial-container grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr_1fr] lg:py-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white hover:text-[#ffb900]"
          >
            <span className="flex size-9 items-center bg-[#ffb900] text-[#0a0a0a]">
              <QPMark className="size-6" />
            </span>
            <span className="flex flex-col font-display text-[13px] font-extrabold uppercase leading-none tracking-[0.1em]">
              <span>Queimando</span>
              <span>Panela</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm font-sans text-sm leading-6 text-stone-400">
            Um blog culinário amador, aberto a todos, para descobrir, guardar e
            compartilhar receitas.
          </p>
        </div>

        <div>
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-stone-500">
            Navegação
          </p>
          <nav aria-label="Links do rodapé" className="mt-4">
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-stone-300 transition-colors hover:text-[#ffb900]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-stone-500">
            Legal
          </p>
          <nav aria-label="Links legais" className="mt-4">
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-stone-300 transition-colors hover:text-[#ffb900]"
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
        <div className="editorial-container flex flex-col gap-2 py-4 font-sans text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Queimando Panela. Todos os direitos reservados.</p>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.1em]">
            Leitura agradável • IA inteligente
          </p>
        </div>
      </div>
    </footer>
  );
}
