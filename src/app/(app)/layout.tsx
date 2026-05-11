import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from '@/lib/get-server-session';
import { SignOutButton } from '@/components/auth/sign-out-button';

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await getServerSession();

  if (!session) {
    redirect('/entrar');
  }

  const user = session.user as { email?: string | null } | null;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold tracking-tight text-neutral-900">
            Queimando Panela
          </Link>

          <div className="flex items-center gap-3 text-sm text-neutral-700">
            {user?.email && (
              <span className="max-w-45 truncate" title={user.email ?? undefined}>
                {user.email}
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">{children}</main>
    </div>
  );
}
