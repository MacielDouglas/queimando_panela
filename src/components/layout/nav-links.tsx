'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { isActivePath } from '@/components/layout/is-active-path';
import type { NavItem } from '@/components/layout/navigation-data';
import { cn } from '@/lib/utils';

type NavLinksProps = {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'header' | 'footer' | 'mobile';
  className?: string;
  itemClassName?: string;
  wrapItem?: (link: ReactNode, item: NavItem) => ReactNode;
};

export function NavLinks({
  items,
  orientation = 'horizontal',
  variant = 'header',
  className,
  itemClassName,
  wrapItem,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'items-center gap-7' : 'flex-col gap-1',
        className,
      )}
    >
      {items.map((item) => {
        const active = isActivePath(pathname, item.href, item.exact);

        const link = (
          <Link
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'text-[0.92rem] font-semibold transition-colors',
              variant === 'header' && 'text-[#74665d] hover:text-[#3a2418]',
              variant === 'header' &&
                active &&
                'font-bold text-[#3a2418] underline decoration-[var(--food-accent)] decoration-2 underline-offset-8',
              variant === 'footer' &&
                'text-sm normal-case tracking-normal text-white/80 hover:text-[var(--food-accent)]',
              variant === 'mobile' &&
                'flex min-h-12 items-center border-b py-3 text-sm text-[#2a211d] hover:bg-[var(--food-accent)]',
              variant === 'mobile' && active && 'bg-[var(--food-accent)] px-3',
              itemClassName,
            )}
            style={{
              fontFamily: 'var(--font-body), "DM Sans", Arial, sans-serif',
            }}
          >
            {item.label}
          </Link>
        );

        return (
          <li key={item.href}>{wrapItem ? wrapItem(link, item) : link}</li>
        );
      })}
    </ul>
  );
}
