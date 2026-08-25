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
        orientation === 'horizontal' ? 'items-center gap-1' : 'flex-col gap-1',
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
              'font-display text-xs font-extrabold uppercase tracking-[0.12em] transition-colors',
              variant === 'header' &&
                'px-3 py-2 text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white',
              variant === 'header' && active && 'bg-[#0a0a0a] text-white',
              variant === 'footer' &&
                'text-sm font-bold normal-case tracking-normal text-white/80 hover:text-[#ffb900]',
              variant === 'mobile' &&
                'flex min-h-12 items-center border-b border-[#e5e5e5] py-3 text-sm text-[#0a0a0a] hover:bg-[#ffb900]',
              variant === 'mobile' && active && 'bg-[#ffb900] px-3',
              itemClassName,
            )}
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
