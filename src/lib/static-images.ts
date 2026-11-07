/**
 * Imagens editoriais (não enviadas por usuários).
 *
 * P0: todas são servidas diretamente do R2 — nunca passam pelo otimizador
 * `/_next/image` da Vercel. Isso zera Image Transformations e Image Cache
 * Reads/Writes e remove ~10 CDN Requests por pageview.
 *
 * Passo a passo:
 *   1. bun run images:optimize   # gera os .webp em public/images
 *   2. bun run images:upload     # publica em <bucket>/static
 *
 * A base vem de `NEXT_PUBLIC_R2_STATIC_BASE_URL` e, na falta dela, de
 * `R2_PUBLIC_URL` (já usada pelas fotos de receita). Como todos os
 * componentes que importam este módulo são Server Components, a variável
 * server-side funciona também no build.
 *
 * Sem nenhuma das duas, cai no fallback local `/images/*.webp`. Esses
 * arquivos não ficam no repositório (as imagens vivem no R2); para usá-los
 * localmente, rode `bun run images:optimize` com os originais em public/images.
 */

const baseUrl = (
  process.env.NEXT_PUBLIC_R2_STATIC_BASE_URL ||
  process.env.R2_PUBLIC_URL ||
  ''
).replace(/\/+$/, '');

function staticImage(fileName: string) {
  return baseUrl ? `${baseUrl}/static/${fileName}` : `/images/${fileName}`;
}

export const staticImages = {
  heroCozinha: staticImage('hero-cozinha.webp'),
  ingredientes: staticImage('ingredientes.webp'),
  pratoPrincipalChef: staticImage('prato-principal-chef.webp'),
  sobremesa: staticImage('sobremesa.webp'),
  cafeDaManha: staticImage('cafe-da-manha.webp'),
  refeicaoCompartilhada: staticImage('refeicao-compartilhada.webp'),
  pattern: staticImage('pattern.webp'),
} as const;
