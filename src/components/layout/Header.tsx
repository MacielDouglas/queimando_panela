import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { AuthNavButton } from '@/components/layout/auth-nav-button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { NavLinks } from '@/components/layout/nav-links';
import { navItems } from '@/components/layout/navigation-data';

export default function Header() {
  return (
    <>
      <div className="qp-scroll-progress" aria-hidden="true" />
      <header
        className="sticky top-0 z-20 border-b backdrop-blur"
        style={{
          borderColor: 'rgba(27, 41, 32, 0.16)',
          background: 'rgba(246, 240, 228, 0.9)',
          boxShadow: '0 1px 12px rgba(27, 41, 32, 0.06)',
        }}
      >
        <div className="editorial-container flex min-h-[84px] items-center justify-between gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[#1b2920]"
            aria-label="Queimando Panela - Página inicial"
          >
            <QPMark className="size-[38px] text-[0.95rem]" />
            <span className="hidden font-display text-[1.45rem] font-extrabold tracking-[-0.015em] sm:inline">
              Queimando Panela
            </span>
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-8 md:flex"
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
    </>
  );
}
