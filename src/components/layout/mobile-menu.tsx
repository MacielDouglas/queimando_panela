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
          className="size-11 border border-[#183a37] bg-transparent text-[#183a37] hover:bg-[#183a37] hover:text-white"
          aria-label="Abrir menu"
        >
          <HiOutlineMenuAlt3 className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col border-l p-0"
        style={{ borderColor: 'var(--line)', background: 'var(--cream)' }}
      >
        <SheetHeader
          className="border-b px-6 py-5 text-left"
          style={{ borderColor: 'var(--line)', background: 'var(--accent-e)' }}
        >
          <SheetTitle asChild>
            <SheetClose asChild>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-[#183a37]"
              >
                <QPMark />
                <span className="font-display text-sm font-bold uppercase tracking-[0.1em]">
                  Queimando Panela
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

        <div
          className="border-t px-6 py-5"
          style={{ borderColor: 'var(--line)' }}
        >
          <SheetClose asChild>
            <AuthNavButton className="w-full" />
          </SheetClose>
        </div>

        <div
          className="border-t px-6 py-5"
          style={{ borderColor: 'var(--line)', background: '#102c2a' }}
        >
          <p
            className="text-xs font-bold uppercase"
            style={{ color: 'var(--accent-e)', letterSpacing: '0.16em' }}
          >
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
                    className="inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-[var(--accent-e)] hover:text-[#183a37]"
                    style={{
                      borderColor: 'rgba(255,255,255,0.1)',
                      letterSpacing: '0.08em',
                    }}
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
