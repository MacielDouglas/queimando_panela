import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { AuthNavButton } from '@/components/layout/auth-nav-button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { NavLinks } from '@/components/layout/nav-links';
import { navItems } from '@/components/layout/navigation-data';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur"
      style={{
        borderColor: 'rgba(232, 225, 213, 0.72)',
        background: 'rgba(255, 253, 247, 0.9)',
      }}
    >
      <div className="editorial-container flex min-h-[78px] items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-[#183a37]"
          aria-label="Queimando Panela - Página inicial"
        >
          <QPMark />
          <span className="hidden font-display text-[1.35rem] font-bold sm:inline">
            Queimando Panela
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-7 md:flex"
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
    </header>
  );
}
