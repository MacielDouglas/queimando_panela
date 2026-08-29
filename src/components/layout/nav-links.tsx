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
              variant === 'header' && 'text-[#52606d] hover:text-[#183a37]',
              variant === 'header' &&
                active &&
                'font-bold text-[#183a37] underline decoration-[var(--accent-e)] decoration-2 underline-offset-8',
              variant === 'footer' &&
                'text-sm normal-case tracking-normal text-white/80 hover:text-[var(--accent-e)]',
              variant === 'mobile' &&
                'flex min-h-12 items-center border-b py-3 text-sm text-[#1f2933] hover:bg-[var(--accent-e)]',
              variant === 'mobile' && active && 'bg-[var(--accent-e)] px-3',
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
