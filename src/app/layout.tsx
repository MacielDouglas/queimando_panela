import type { Metadata } from 'next';
import { Geist_Mono, Montserrat, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

import Header from '@/components/layout/Header';

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
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        'h-full scroll-smooth antialiased',
        headingFont.variable,
        bodyFont.variable,
        monoFont.variable,
      )}
    >
      <body className="relative min-h-full overflow-x-hidden bg-[#fffaf2] font-sans text-neutral-800">
        <Header />

        <div className="relative flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
