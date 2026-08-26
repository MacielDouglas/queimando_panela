# Queimando Panela

Blog comunitario para cozinheiros amadores compartilharem e comentarem receitas — com analise completa por IA de cada receita enviada.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **Tailwind CSS 4** + **Shadcn + Base UI** — Button/Card/Badge/Avatar/Separator/Dialog baseados em \@base-ui/react\
- **Prisma 7** (sintaxe compativel com o futuro Prisma 8) + **PostgreSQL** no **Neon**
- **Better Auth** — autenticacao email/senha com adaptador Prisma
- **Biome** — lint + format (substitui ESLint + Prettier)

## Rodando local

\\\ash
npm install
# configure o banco
# copie .env.example para .env e preencha DATABASE_URL (Neon)
npx prisma db push   # ou: npx prisma migrate dev
npm run dev          # http://localhost:3000
\\\

Outros scripts:

\\\ash
npm run build        # build de producao
npm run lint         # biome check .
npm run lint:fix     # biome check --write .
npm run format       # biome format --write .
npx prisma generate  # regenera o client
\\\

## Deploy na Vercel

1. Conecte o repositorio na Vercel.
2. Em **Environment Variables**, defina \DATABASE_URL\, \BETTER_AUTH_SECRET\ e \BETTER_AUTH_URL\ (ex: \https://seu-dominio.vercel.app\).
3. Deploy — \
ext build\ ja esta configurado.

## Estrutura

- \pp/page.tsx\ — landing page (hero, destaque, ultimas, classicas, IA, footer)
- \pp/layout.tsx\ — layout raiz + fonts + metadata pt-BR
- \components/landing/\ — RecipeCard, NewsletterForm
- \components/ui/\ — componentes Shadcn (Base UI)
- \lib/mock-data.ts\ — dados de demonstracao da landing
- \lib/prisma.ts\ + \lib/auth.ts\ — Prisma + Better Auth
- \prisma/schema.prisma\ — modelos User/Session/Account/Verification/Recipe/Comment
- \iome.json\ — config Biome (lint + format)
