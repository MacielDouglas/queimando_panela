import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';
import { ConsoleDelight } from '@/components/delight/console-delight';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

const playfair = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Queimando Panela',
    template: '%s | Queimando Panela',
  },
  description:
    'Sabores autênticos, ingredientes selecionados e receitas que aproximam pessoas.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${dmSans.variable} min-h-dvh antialiased`}
        style={{
          color: 'var(--ink)',
        }}
      >
        <div className="flex min-h-dvh flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <ConsoleDelight />
      </body>
    </html>
  );
}
