import type { Metadata } from 'next';

import { Geist_Mono, Montserrat, Source_Sans_3 } from 'next/font/google';

import './globals.css';

import { cn } from '@/lib/utils';

import { getServerSession } from '@/lib/get-server-session';

import { SignOutButton } from '@/components/auth/sign-out-button';

const headingFont = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700', '800', '900'],
});

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const monoFont = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Queimando Panela',
    template: '%s | Queimando Panela',
  },

  description:
    'Blog gastronômico comunitário para cozinheiros amadores apaixonados por receitas, histórias e experiências culinárias.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        'h-full scroll-smooth antialiased',
        headingFont.variable,
        bodyFont.variable,
        monoFont.variable,
      )}
    >
      <body className="relative min-h-full overflow-x-hidden bg-[#fffaf2] font-sans text-neutral-800">
        {/* GLOBAL BACKGROUND */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-50 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_42%)]"
        />

        <div
          aria-hidden
          className="pointer-events-none fixed top-30 right-30 -z-50 h-105 w-105 rounded-full bg-amber-200/30 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none fixed bottom-35 left-35 -z-50 h-105 w-105 rounded-full bg-orange-200/20 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none fixed top-1/2 left-1/2 -z-50 h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/20 blur-3xl"
        />

        {/* subtle texture */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-40 bg-[radial-gradient(#000_0.6px,transparent_0.6px)] bg-size-[18px_18px] opacity-[0.03]"
        />

        <div className="relative flex min-h-screen flex-col">
          {session?.user && (
            <div className="fixed top-4 right-4 z-50">
              <SignOutButton />
            </div>
          )}

          {children}
        </div>
      </body>
    </html>
  );
}
