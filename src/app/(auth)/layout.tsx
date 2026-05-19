import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: AppLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect('/');

  return <div>{children}</div>;
}
