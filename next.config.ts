import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  images: {
    // P0: toda imagem é servida direto do R2 (ou de /public), sem passar
    // pelo otimizador `/_next/image`. Isso zera Image Transformations,
    // Image Cache Reads/Writes e remove ~10 CDN Requests por pageview.
    // O R2 já responde com `Cache-Control: immutable`, então o browser
    // também para de revalidar as imagens entre visitas.
    unoptimized: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },

    proxyClientMaxBodySize: '10mb',
  },

  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    'better-auth',
    'pg',
  ],

  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
