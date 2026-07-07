"use client";

import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

import { QPMark } from "@/components/brand/qp-mark";
import { NavLinks } from "@/components/layout/nav-links";
import { developerLinks, navItems } from "@/components/layout/navigation-data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 rounded-none border border-stone-300 text-stone-900 hover:bg-stone-100 hover:text-amber-500"
          aria-label="Abrir menu"
        >
          <HiOutlineMenuAlt3 className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col rounded-none border-l border-stone-200 bg-white p-0"
      >
        <SheetHeader className="border-b border-stone-200 px-6 py-5 text-left">
          <SheetTitle asChild>
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-stone-950"
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

        <div className="border-t border-stone-200 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Desenvolvido por Douglas Maciel
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {developerLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-stone-700 transition-colors hover:text-amber-500"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
