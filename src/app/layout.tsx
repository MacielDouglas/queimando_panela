import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ConsoleDelight } from '@/components/delight/console-delight';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { staticImages } from '@/lib/static-images';

// Fontes self-hosted (arquivos variáveis, subset `latin`) em vez de
// `next/font/google`: o fetch do CSS do Google no build é instável e, quando o
// Google responde com URLs sem extensão (`/l/font?kit=…&skey=…&v=…`), o build
// do Turbopack quebra com "next/font/google queries have exactly one entry".
// Referência: vercel/next.js#99114.
const fraunces = localFont({
  src: './fonts/fraunces-latin-variable.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '500 700',
  adjustFontFallback: 'Times New Roman',
});

const dmSans = localFont({
  src: './fonts/dm-sans-latin-variable.woff2',
  variable: '--font-body',
  display: 'swap',
  weight: '400 700',
  adjustFontFallback: 'Arial',
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
        id="topo"
        className={`${fraunces.variable} ${dmSans.variable} min-h-dvh antialiased`}
        style={
          {
            color: 'var(--ink)',
            // P0: o pattern também sai do R2. O fallback CSS fica em
            // `body::before` (var --qp-pattern, url("/images/pattern.webp")).
            '--qp-pattern': `url("${staticImages.pattern}")`,
          } as React.CSSProperties
        }
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
