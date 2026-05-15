import type { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from '@/lib/get-server-session';
import { SignOutButton } from '@/components/auth/sign-out-button';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  const user = session?.user as { email?: string | null } | null;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold tracking-tight text-neutral-900">
            Queimando Panela
          </Link>

          <div className="flex items-center gap-3 text-sm text-neutral-700">
            {user ? (
              <>
                {user.email && (
                  <span className="max-w-45 truncate" title={user.email ?? undefined}>
                    {user.email}
                  </span>
                )}
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/entrar"
                className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-stone-950 hover:bg-amber-400"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">{children}</main>
    </div>
  );
}
