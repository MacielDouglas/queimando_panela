'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
// import { useState } from 'react';

type Props = {
  href: string;
  label: string;
  onClick?: () => void;
  exit?: boolean;
};

export function NavLink({ href, label, onClick, exit }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const router = useRouter();

  async function handleSignOut() {
    const result = await authClient.signOut();

    if (result) {
      router.replace('/login');
      router.refresh();
    }
  }

  return (
    <Link
      href={href}
      onClick={exit ? handleSignOut : onClick}
      className={`relative py-0.5 text-sm font-medium transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:origin-right before:scale-x-0 before:rounded-full before:bg-stone-800 before:transition-transform before:duration-300 before:ease-in-out hover:before:origin-left hover:before:scale-x-100 ${isActive ? 'text-stone-900 before:origin-left before:scale-x-100' : 'text-stone-600 hover:text-stone-900'} `}
    >
      {label}
    </Link>
  );
}
