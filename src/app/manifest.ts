import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Queimando Panela',
    short_name: 'Queimando Panela',
    description:
      'Sabores autênticos, ingredientes selecionados e receitas que aproximam pessoas. Publique com IA que confere utensílios, tempo e nutrição.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f0e4',
    theme_color: '#f6f0e4',
    lang: 'pt-BR',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
