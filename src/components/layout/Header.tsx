import Link from 'next/link';

import { QPMark } from '@/components/brand/qp-mark';
import { AuthNavButton } from '@/components/layout/auth-nav-button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { NavLinks } from '@/components/layout/nav-links';
import { navItems } from '@/components/layout/navigation-data';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="editorial-container flex h-16 items-center justify-between gap-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-[#0a0a0a] transition-opacity hover:opacity-80"
        >
          <span className="flex size-9 items-center justify-center bg-[#ffb900] text-[#0a0a0a]">
            <QPMark className="size-6" />
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
    </header>
  );
}
