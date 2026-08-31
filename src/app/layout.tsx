import type { Metadata, Viewport } from 'next';
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://queimandopanela.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
    template: '%s | Queimando Panela',
  },
  description:
    'Sabores autênticos, ingredientes selecionados e receitas que aproximam pessoas. Publique com IA que confere utensílios, tempo e nutrição.',
  keywords: [
    'receitas',
    'receitas caseiras',
    'gastronomia',
    'culinária afetiva',
    'blog de receitas',
    'Queimando Panela',
  ],
  authors: [{ name: 'Queimando Panela', url: siteUrl }],
  creator: 'Queimando Panela',
  publisher: 'Queimando Panela',
  category: 'food',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
    description:
      'Sabores autênticos, ingredientes selecionados e receitas que aproximam pessoas. Publique com IA que confere utensílios, tempo e nutrição.',
    url: siteUrl,
    siteName: 'Queimando Panela',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Queimando Panela — onde olhômetro vira medida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
    description:
      'Sabores autênticos, ingredientes selecionados e receitas que aproximam pessoas.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#f6f0e4',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
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
