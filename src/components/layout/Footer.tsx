import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';

const institutionalLinks = [
  { href: '/', label: 'Home' },
  { href: '/receitas', label: 'Receitas' },
  { href: '/receitas/new', label: 'Enviar receita' },
];

const supportLinks = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/termos', label: 'Termos de uso' },
];

const socialLinks = [
  { href: 'https://github.com/MacielDouglas', label: 'GitHub' },
  {
    href: 'https://www.linkedin.com/in/douglas-maciel-4943461b0/',
    label: 'LinkedIn',
  },
  { href: 'https://macield.vercel.app/', label: 'Portfólio' },
];

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        background: 'var(--cocoa-dark, #111b14)',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      <div className="editorial-container py-16 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,0.65fr)]">
          <div className="footer-brand">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-white"
            >
              <QPMark />
              <span className="hidden font-display text-[1.35rem] font-bold sm:inline">
                Queimando Panela
              </span>
            </Link>
            <p
              className="mt-4 max-w-[340px] text-[0.95rem] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.76)' }}
            >
              Gastronomia com origem, cuidado e sabor para os momentos que
              realmente importam.
            </p>
          </div>

          <div>
            <h3
              className="mb-4 text-[0.82rem] font-extrabold uppercase"
              style={{ color: 'var(--food-accent)', letterSpacing: '0.1em' }}
            >
              Institucional
            </h3>
            <nav aria-label="Links institucionais">
              <ul className="flex flex-col gap-2.5">
                {institutionalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9rem] transition-colors hover:text-[var(--food-accent)]"
                      style={{ color: 'rgba(255,255,255,0.72)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3
              className="mb-4 text-[0.82rem] font-extrabold uppercase"
              style={{ color: 'var(--food-accent)', letterSpacing: '0.1em' }}
            >
              Atendimento
            </h3>
            <nav aria-label="Links de atendimento">
              <ul className="flex flex-col gap-2.5">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9rem] transition-colors hover:text-[var(--food-accent)]"
                      style={{ color: 'rgba(255,255,255,0.72)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3
              className="mb-4 text-[0.82rem] font-extrabold uppercase"
              style={{ color: 'var(--food-accent)', letterSpacing: '0.1em' }}
            >
              Siga a gente
            </h3>
            <nav aria-label="Redes sociais">
              <ul className="flex flex-col gap-2.5">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.9rem] transition-colors hover:text-[var(--food-accent)]"
                      style={{ color: 'rgba(255,255,255,0.72)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col justify-between gap-5 border-t pt-6 text-[0.8rem] sm:flex-row"
          style={{
            borderColor: 'rgba(255,255,255,0.16)',
            color: 'rgba(255,255,255,0.72)',
          }}
        >
          <span>© 2026 Queimando Panela. Todos os direitos reservados.</span>
          <span className="flex items-center gap-2">
            <Link
              href="/termos"
              className="transition-colors hover:text-[var(--food-accent)]"
            >
              Política de privacidade
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/termos"
              className="transition-colors hover:text-[var(--food-accent)]"
            >
              Termos de uso
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
