'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { SignOutButton } from '../auth/sign-out-button';

type Props = {
  links: { href: string; label: string }[];
  categories: string[];
  isLoggedIn: boolean;
};

export function MobileMenu({ links, categories, isLoggedIn }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-11 w-11 items-center justify-center text-stone-700 transition-colors hover:text-stone-900 lg:hidden"
      >
        <span
          className={`absolute transition-all duration-200 ${
            isOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
          }`}
        >
          <X className="h-5 w-5" />
        </span>
        <span
          className={`absolute transition-all duration-200 ${
            isOpen ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
        >
          <Menu className="h-5 w-5" />
        </span>
      </button>

      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-label="Menu mobile"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[#f8f4ee] text-stone-900 transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-6">
          <Link
            href="/"
            onClick={closeMenu}
            className="inline-flex items-start gap-3 text-stone-800"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-orange-200 text-base font-bold tracking-[-0.08em]">
              QP
            </div>

            <div className="pt-0.5 leading-none">
              <span className="font-heading block text-lg font-extrabold tracking-[-0.04em]">
                Queimando
              </span>
              <span className="font-heading block text-lg font-extrabold tracking-[-0.04em]">
                Panela
              </span>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center text-stone-500 transition-colors hover:text-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-8 pb-6">
            <p className="mb-6 max-w-[16ch] text-2xl leading-[0.95] font-bold text-stone-900">
              Explore receitas e encontre algo para cozinhar hoje.
            </p>

            <nav className="flex flex-col gap-4" aria-label="Links principais">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="border-b border-stone-200 pb-3 text-xl font-semibold tracking-[-0.03em] text-stone-800 transition-colors hover:text-orange-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-stone-200 px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-[0.18em] text-stone-500 uppercase">
                Explorar categorias
              </h2>
              <Link
                href="/receitas"
                onClick={closeMenu}
                className="text-xs font-semibold tracking-[0.12em] text-orange-700 uppercase transition hover:text-orange-800"
              >
                Ver tudo
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/receitas?tipo=${encodeURIComponent(category)}`}
                  onClick={closeMenu}
                  className="inline-flex min-h-11 items-center border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-200 px-6 py-6">
            {isLoggedIn ? (
              <div className="w-full">
                <SignOutButton />
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="inline-flex min-h-12 w-full items-center justify-center bg-stone-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-500 hover:text-stone-950"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        <footer className="border-t border-stone-200 bg-[#f3ede4] px-6 py-5">
          <p className="text-xs tracking-[0.16em] text-stone-500 uppercase">
            Desenvolvido por
          </p>

          <p className="mt-2 text-sm font-semibold text-stone-900">
            Douglas Maciel
          </p>

          <div className="mt-4 flex items-center gap-4">
            <Link
              href="https://github.com/MacielDouglas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 transition hover:text-stone-950"
            >
              <FaGithub className="text-stone-500" />
              GitHub
            </Link>

            <Link
              href="https://www.linkedin.com/in/douglas-maciel-4943461b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 transition hover:text-stone-950"
            >
              <FaLinkedin className="text-stone-500" />
              LinkedIn
            </Link>
          </div>
        </footer>
      </aside>
    </>
  );
}
