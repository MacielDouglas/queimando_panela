import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { AuthNavButton } from '@/components/layout/auth-nav-button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { NavLinks } from '@/components/layout/nav-links';
import { navItems } from '@/components/layout/navigation-data';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#0a0a0a] bg-[#ffb900]">
      <div className="editorial-container flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-[#0a0a0a] transition-opacity hover:opacity-80"
        >
          <span className="flex size-10 items-center justify-center bg-[#0a0a0a] text-[#ffb900]">
            <QPMark className="size-7" />
          </span>
          <span className="hidden flex-col font-display text-[13px] font-extrabold uppercase leading-none tracking-[0.1em] sm:flex">
            <span>Queimando</span>
            <span>Panela</span>
          </span>
          <span className="font-display text-sm font-extrabold uppercase tracking-[0.08em] sm:hidden">
            QP
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 md:flex"
        >
          <NavLinks items={navItems} variant="header" />
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <AuthNavButton />
          </div>

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
      {/* faixa preta fina Estapar */}
      <div className="h-[3px] bg-[#0a0a0a]" aria-hidden="true" />
    </header>
  );
}
