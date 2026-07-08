import Link from "next/link";

import { QPMark } from "@/components/brand/qp-mark";
import { AuthNavButton } from "@/components/layout/auth-nav-button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavLinks } from "@/components/layout/nav-links";
import { navItems } from "@/components/layout/navigation-data";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-stone-950 transition-colors hover:text-amber-500"
        >
          <span className="text-amber-500">
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

        <nav aria-label="Navegação principal" className="hidden md:block">
          <NavLinks items={navItems} variant="header" />
        </nav>

        <div className="hidden md:block">
          <AuthNavButton />
        </div>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
