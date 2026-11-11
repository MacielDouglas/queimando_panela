import { ArrowUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { developerLinks } from '@/components/layout/navigation-data';

const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/receitas', label: 'Receitas' },
  { href: '/o-que-tem', label: 'O que tem?' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/sobre', label: 'Sobre' },
];

const institutionalLinks = [
  { href: '/receitas/new', label: 'Enviar receita' },
  { href: '/termos', label: 'Termos de uso' },
  { href: '/privacidade', label: 'Política de privacidade' },
];

const otherProjects = [
  {
    href: 'https://cafebourbon.vercel.app',
    label: 'Café Bourbon',
    description: 'Cafés especiais, queijos e vinhos',
  },
  {
    href: 'https://direcciones.vercel.app',
    label: 'Direcciones',
    description: 'Plataforma colaborativa de endereços e rotas',
  },
];

const columnTitleClassName =
  'mb-4 font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]';

const footerLinkClassName =
  'inline-flex min-h-7 items-center text-[0.9rem] text-cream/75 transition-colors hover:text-[var(--gold)]';

export default function Footer() {
  return (
    <footer className="border-t border-cream/15 bg-cocoa-dark">
      <div className="editorial-container py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.65fr_0.8fr_1fr] lg:gap-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Queimando Panela — página inicial"
              className="inline-flex items-center gap-3 text-cream"
            >
              <QPMark className="size-10 text-[0.95rem]" />
              <span className="font-display text-[1.45rem] font-bold tracking-[-0.02em]">
                Queimando Panela
              </span>
            </Link>

            <p className="mt-6 max-w-[15ch] font-display text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-cream">
              A cozinha continua aberta.
            </p>

            <p className="mt-5 max-w-[42ch] text-[0.92rem] leading-relaxed text-cream/70">
              Receitas caseiras com história, técnica e afeto — para cozinhar
              com mais segurança e sem medo de queimar a panela.
            </p>

            <Link
              href="/receitas/new"
              className="mt-8 inline-flex min-h-11 items-center gap-2 border border-cream/30 px-5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-cream transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Enviar sua receita
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h3 className={columnTitleClassName}>Navegar</h3>
            <ul className="flex flex-col gap-1.5">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links institucionais">
            <h3 className={columnTitleClassName}>Institucional</h3>
            <ul className="flex flex-col gap-1.5">
              {institutionalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={columnTitleClassName}>Outros projetos</h3>
            <ul className="flex flex-col gap-4">
              {otherProjects.map((project) => (
                <li key={project.href}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="flex items-center gap-1.5 text-[0.9rem] font-semibold text-cream/85 transition-colors group-hover:text-[var(--gold)]">
                      {project.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 text-cream/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold)]"
                      />
                    </span>
                    <span className="mt-0.5 block text-[0.78rem] leading-snug text-cream/55">
                      {project.description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="https://macield.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--gold)] transition-colors hover:text-cream"
            >
              Ver todos os projetos
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-cream/15 pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center border border-cream/20 font-display text-[1.1rem] font-bold text-[var(--gold)]"
              >
                DM
              </span>
              <div>
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Desenvolvido por
                </p>
                <p className="mt-1 font-display text-[1.25rem] font-semibold leading-tight text-cream">
                  Douglas Maciel
                </p>
                <p className="text-[0.82rem] text-cream/60">
                  Full-Stack Developer &amp; UX Designer
                </p>
              </div>
            </div>

            <nav aria-label="Links do desenvolvedor">
              <ul className="flex flex-wrap gap-2.5">
                {developerLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-2 border border-cream/20 px-3.5 text-[0.8rem] font-semibold text-cream/75 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                      >
                        <Icon aria-hidden="true" className="size-4" />
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-cream/15 pt-6 text-[0.78rem] text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-none">
            © {new Date().getFullYear()} Queimando Panela. Todos os direitos
            reservados.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/termos"
              className="transition-colors hover:text-[var(--gold)]"
            >
              Termos de uso
            </Link>
            <Link
              href="/privacidade"
              className="transition-colors hover:text-[var(--gold)]"
            >
              Privacidade
            </Link>
            <a
              href="#topo"
              className="group inline-flex items-center gap-1.5 font-semibold text-cream/75 transition-colors hover:text-[var(--gold)]"
            >
              Voltar ao topo
              <ArrowUp
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
