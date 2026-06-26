"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { headerNavItems } from "./header-nav-items";
import { HeaderLogo } from "./logo";
// import { HeaderLogo } from './header-logo';

export function HeaderMobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className="h-11 w-11 rounded-none border border-neutral-200 bg-white p-0 text-neutral-900 hover:bg-neutral-50"
      >
        <Menu size={22} />
      </Button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            <motion.aside
              id="mobile-navigation"
              aria-label="Menu mobile"
              className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-88 flex-col bg-white"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-20 items-center justify-between border-b border-neutral-200 px-6">
                <HeaderLogo />

                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Fechar menu"
                  onClick={closeMenu}
                  className="h-11 w-11 rounded-none border border-neutral-200 bg-white p-0 text-neutral-900 hover:bg-neutral-50"
                >
                  <X size={22} />
                </Button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
                <nav aria-label="Navegação mobile">
                  <ul className="space-y-1">
                    {headerNavItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex min-h-12 items-center border-b border-neutral-100 py-3 text-base font-medium text-neutral-900 transition-colors hover:text-amber-600"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="inline-flex h-12 w-full items-center justify-center bg-amber-500 px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
                  >
                    Entrar
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
