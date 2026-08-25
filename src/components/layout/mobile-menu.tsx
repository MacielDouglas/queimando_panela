'use client';

import Link from 'next/link';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

import { QPMark } from '@/components/brand/qp-mark';
import { AuthNavButton } from '@/components/layout/auth-nav-button';
import { NavLinks } from '@/components/layout/nav-links';
import { developerLinks, navItems } from '@/components/layout/navigation-data';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 border border-[#0a0a0a] bg-transparent text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#ffb900]"
          aria-label="Abrir menu"
        >
          <HiOutlineMenuAlt3 className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col border-l border-[#e5e5e5] bg-white p-0"
      >
        <SheetHeader className="border-b border-[#e5e5e5] bg-[#ffb900] px-6 py-5 text-left">
          <SheetTitle asChild>
            <SheetClose asChild>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-[#0a0a0a]"
              >
                <span className="flex size-10 items-center justify-center bg-[#0a0a0a] text-[#ffb900]">
                  <QPMark className="size-7" />
                </span>
                <span className="flex flex-col font-display text-sm font-extrabold uppercase leading-none tracking-[0.1em]">
                  <span>Queimando</span>
                  <span>Panela</span>
                </span>
              </Link>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Navegação mobile" className="flex-1 px-6 py-6">
          <NavLinks
            items={navItems}
            orientation="vertical"
            variant="mobile"
            wrapItem={(link) => <SheetClose asChild>{link}</SheetClose>}
          />
        </nav>

        <div className="border-t border-[#e5e5e5] px-6 py-5">
          <SheetClose asChild>
            <AuthNavButton className="w-full" />
          </SheetClose>
        </div>

        <div className="border-t border-[#e5e5e5] bg-[#0a0a0a] px-6 py-5 text-white">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffb900]">
            Desenvolvido por Douglas Maciel
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {developerLinks.map((item) => {
              const Icon = item.icon;
              return (
                <SheetClose asChild key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-white hover:border-[#ffb900] hover:bg-[#ffb900] hover:text-[#0a0a0a]"
                  >
                    <Icon className="size-3.5" />
                    <span>{item.label}</span>
                  </a>
                </SheetClose>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
