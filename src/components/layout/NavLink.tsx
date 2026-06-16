'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
      className={`relative py-0.5 text-lg font-medium transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:origin-right before:scale-x-0 before:rounded-full before:bg-amber-500 before:transition-transform before:duration-300 before:ease-in-out hover:before:origin-left hover:before:scale-x-100 ${isActive ? 'text-zinc-400 before:origin-left before:scale-x-100' : 'text-zinc-600 hover:text-zinc-300'} `}
    >
      {label}
    </Link>
  );
}
