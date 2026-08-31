# Queimando Panela

> Comunidade para preservar e descobrir receitas caseiras, afetivas e autorais brasileiras.

Receitas de família se perdem, sites tradicionais priorizam SEO e anúncios, e não existe um lugar que trate a culinária amadora brasileira com respeito e leveza. O **Queimando Panela** existe para isso: um acervo vivo onde cada receita tem dono, história e medidas de "colher de pau" valendo tanto quanto gramas.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 7 (PostgreSQL) · Better Auth · Biome

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Design System](#design-system)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Instalação](#instalação)
- [Scripts](#scripts)
- [Biome — Lint e Formatação](#biome--lint-e-formatação)
- [Banco de dados](#banco-de-dados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Deploy](#deploy)

---

## Funcionalidades

- **Descoberta:** Home com receitas em destaque, últimas e clássicas; listagem `/receitas` com filtros por tipo, utensílio, ingrediente, busca e paginação.
- **Detalhe da receita:** Seções de ingredientes, modo de preparo, utensílios, nutrição, história e imagens (capa + galeria) via R2/S3.
- **Criação e edição:** Formulário com validação Zod + React Hook Form, upload drag-and-drop (`react-dropzone`), processamento com `sharp`, análise assistida por IA (Groq SDK).
- **Conta do usuário:** Cadastro, login (incluindo Google OAuth), recuperação de senha com e-mail (Resend), área `/minha-conta` e edição de receitas do autor.
- **Interações:** Favoritos/comentários (modelo `Comment`), publicação controlada (`isPublished`/`publishedAt`).
- **Página 404 divertida:** Página de erro amigável com piadas rotativas, animação de confetti, botões com ícones lucide e cópia de mensagem. O visitante pode clicar em “Sortear outra piada” para ver uma nova mensagem. Navegação para a página inicial ou para a lista de receitas está disponível.

> Veja `PRODUCT.md:9` e `prisma/schema.prisma:10` para a visão de produto e o modelo de dados completo.

---

## Rota `/o-que-tem` (antiga `/geladeira`)

A rota principal de listagem da geladeira foi renomeada de `/geladeira` para `/o-que-tem` para melhorar a identidade visual e a usabilidade. As alterações incluem:

- `src/app/(public)/geladeira` → `src/app/(public)/o-que-tem`
- `page.tsx` atualizado com metadados otimizados (`title`, `description`, `openGraph`, `twitter`)
- `sitemap.ts` atualizado para incluir `/o-que-tem`
- Navegação internal e links atualizados em `Header` e `footer`
- O slug `/receitas/[slug]` continua intacto

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Server Actions, `proxy.ts`) |
| UI | React 19, Tailwind CSS 4, Radix UI, shadcn/ui (`components.json`), `lucide-react`, `framer-motion` |
| Formulários | `react-hook-form` + `@hookform/resolvers` + `zod` |
| Banco | PostgreSQL + Prisma 7 (`@prisma/client` + `@prisma/adapter-pg` + `pg`) |
| Auth | `better-auth` (com `better-auth` + `next` adapter) |
| Storage | Cloudflare R2 via `@aws-sdk/client-s3` (`src/lib/r2.ts:1`) |
| Imagem | `sharp` (geração de variantes, `src/features/recipes/actions/recipe-imagem-helpers.ts:1`) |
| IA | `groq-sdk` (`src/lib/groq-client.ts:1`, rota `src/app/api/recipes/analyze/route.ts:1`) |
| E-mail | `resend` (`src/lib/email/`) |
| Qualidade | Biome 2.5.10 (lint + format + organize imports), TypeScript 6, Vitest, Playwright |
| Runtime | Bun (gerenciador e runner — `bun.lock` presente) |

---

## Design System

Fonte única **Inter**, paleta quente "cozinha" (mel queimado `oklch(0.78 0.17 72)` como primária, papel de caderno como fundo) e componentes com `ring-1` ao invés de sombras. Documentação completa em `DESIGN.md:1`.

Tokens principais (`DESIGN.md:5` e `src/app/globals.css:39`):

```css
--background: oklch(0.985 0 0);  /* papel de caderno */
--primary:    oklch(0.78 0.17 72); /* mel queimado */
--foreground: oklch(0.24 0.02 40); /* tinta */
--radius: 1.25rem;
```

Regras de ouro:
- **Regra do Mel Queimado:** primária ≤ 10% da tela.
- **Regra da Mesa:** cards sem sombra em repouso, só `ring-1`.
- Tipografia fluida com `clamp()`, `max-width: 72ch`, `leading: 1.7`.

---

## Pré-requisitos

- **Bun** ≥ 1.3 (projeto usa `bun.lock` e scripts `bun run ...`)
- **Node.js** 24.20.0 LTS Krypton (`lts/krypton` — última LTS em 26/08/2026; Current 26.8.0 disponível, use `.nvmrc`/`.node-version`)
- **PostgreSQL** (local ou remoto)
- Conta **Cloudflare R2** (ou S3 compatível) para imagens
- Chave **Groq** (se usar análise por IA) e **Resend** (e-mails)

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz a partir do `.env.example` (não versionado). Principais chaves utilizadas em `src/lib/env/` e `prisma.config.ts:10`:

```ini
DATABASE_URL="postgresql://user:password@localhost:5432/queimando_panela"
BETTER_AUTH_SECRET="gerado-com-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Google (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# R2 / S3
R2_ENDPOINT=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""
R2_PUBLIC_URL="https://*.r2.dev"

# E-mail
RESEND_API_KEY=""
EMAIL_FROM="Queimando Panela <contato@exemplo.com>"

# IA
GROQ_API_KEY=""

# E2E (Playwright)
E2E_USER_EMAIL=""
E2E_USER_PASSWORD=""
E2E_USER_NAME=""
PLAYWRIGHT_BASE_URL="http://localhost:3000"
```

> Nunca commite `.env`. O `.gitignore:38` já ignora `.env` e `.env*.local`.

---

## Instalação

```bash
# 1. Clone
git clone <repo-url> queimando_panela
cd queimando_panela

# 2. Instale dependências
bun install

# 3. Configure o .env (veja seção acima)

# 4. Gere o Prisma Client
bun run db:generate

# 5. Rode as migrations (cria as tabelas)
bunx prisma migrate dev

# 6. Suba o servidor de desenvolvimento
bun run dev
# → http://localhost:3000
```

Build de produção:

```bash
bun run build   # roda db:generate + next build
bun run start   # serve o build em http://localhost:3000
```

---

## Scripts

| Comando | Descrição |
|---|---|
| `bun run dev` | Servidor de desenvolvimento Next.js |
| `bun run build` | `prisma generate` + `next build` |
| `bun run start` | Servidor de produção |
| `bun run db:generate` | Gera o Prisma Client em `src/generated/prisma` |
| `bun run lint` | `biome lint .` |
| `bun run lint:fix` | `biome lint --write .` (corrige auto-fixáveis) |
| `bun run format` | `biome format --write .` |
| `bun run format:check` | Verifica formatação sem escrever |
| `bun run check` | `biome check --write .` (lint + format + organize imports) |
| `bun run check:ci` | `biome check .` (sem write, usado no CI) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run ci` | `check:ci` + `typecheck` + `test:coverage` |
| `bun run test` / `test:run` / `test:coverage` | Vitest (happy-dom, coverage v8) |
| `bun run test:e2e` / `test:e2e:ui` / `test:e2e:headed` | Playwright E2E |

---

## Biome — Lint e Formatação

ESLint e Prettier foram removidos. O **Biome 2.5.10** (`@biomejs/biome`) é a única ferramenta de qualidade de código.

**Configuração:** `biome.json:1`

- `formatter`: 2 espaços, `lineWidth: 80`, `lf`, `quoteStyle: single`, `trailingCommas: all`, `semicolons: always`.
- `linter`: preset `recommended` + domínios `next` e `react` habilitados; regras equivalentes ao ESLint anterior (`useImportType`, `noUnusedVariables`, etc.).
- `assist`: `organizeImports: on`.
- `overrides`: testes (`tests/**/*`) com regras relaxadas; `src/generated`, `public`, `.next` ignorados.
- `css.parser.tailwindDirectives: true` para suportar `@theme`, `@apply`, `@custom-variant` do Tailwind 4.
- `noArrayIndexKey: off` nos overrides de testes para permitir geração de confetti estático em `src/app/not-found.tsx`.

**Formatação automática ao salvar:**

O repositório já inclui `.vscode/settings.json:1` e `.vscode/extensions.json:1`:

```jsonc
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

Passos no VS Code:
1. Instale a extensão recomendada **Biome** (o VS Code vai sugerir automaticamente).
2. Ao salvar qualquer `.ts`/`.tsx`/`.css`/`.json`, o Biome formata e organiza imports.
3. Para corrigir todo o projeto manualmente: `bun run check`.

CI roda `bun run check:ci` (`.github/workflows/ci.yml:36`).

---

## Banco de dados

**Prisma** (`prisma/schema.prisma:1`, `prisma.config.ts:1`):

- Modelos principais: `Recipe`, `RecipeSection`, `Ingredient`, `GeneralIngredient`, `RecipeType`, `RecipeImage`, `Utensil`, `UtensilOnRecipe`, `Comment`, `User`/`Session`/`Account`/`Verification` (Better Auth).
- Datasource PostgreSQL via `DATABASE_URL`.

Comandos úteis:

```bash
bun run db:generate                    # regenera o client
bunx prisma migrate dev --name <nome>  # cria migration
bunx prisma studio                     # UI para inspecionar dados
bunx prisma db seed                    # se houver seed configurado
```

O client gerado fica em `src/generated/prisma` (ignorado pelo Biome e `.gitignore:49`).

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/sign-up/        # fluxo de cadastro
│   ├── (public)/receitas/     # listagem e detalhe público
│   ├── (private)/             # rotas autenticadas
│   ├── api/recipes/analyze/   # rota Groq para análise de receita
│   ├── minha-conta/           # área do usuário
│   ├── layout.tsx             # root layout + Inter + Header/Footer
│   ├── page.tsx               # home (Hero + Latest + Classic)
│   └── globals.css            # tokens Tailwind + tema claro/escuro
├── components/
│   ├── ui/                    # shadcn/radix (button, card, dialog...)
│   ├── layout/                # Header, Footer, nav, mobile-menu
│   ├── home/                  # seções da home
│   └── auth/                  # forms de auth
├── features/
│   ├── recipes/
│   │   ├── actions/           # server actions (create, update, get-*)
│   │   ├── components/        # RecipeCard, RecipeFormShell, RecipeSteps...
│   │   └── types/             # recipe.types, recipe-ai.types...
│   └── auth/
├── lib/
│   ├── auth.ts / auth-client.ts / get-server-session.ts
│   ├── prisma.ts              # singleton Prisma + adapter pg
│   ├── r2.ts                  # cliente S3/R2
│   ├── groq-client.ts
│   ├── email/                 # Resend + templates
│   ├── env/                   # validação de env (server/client)
│   └── validations/           # schemas Zod
├── generated/prisma/          # client gerado (não editar)
└── actions/auth/

tests/
├── setup/vitest.setup.ts
├── unit/                      # testes Vitest + Testing Library
└── e2e/                       # Playwright (auth.setup, chromium)

prisma/
├── schema.prisma
└── migrations/
```

Alias `@/*` → `./src/*` (`tsconfig.json:22`).

---

## Autenticação

`src/lib/auth.ts:1` configura `better-auth` com `drizzle`/`prisma` adapter e `src/lib/auth-client.ts:1` expõe o client. Sessão server-side via `src/lib/get-server-session.ts:1`.

- Login por e-mail/senha e OAuth Google.
- Middleware/`proxy.ts:1` protege rotas privadas.
- E-mails de reset via `src/lib/email/` (Resend).

---

## Testes

**Unitários / Integração — Vitest** (`vitest.config.mts:1`):

```bash
bun run test          # watch
bun run test:run      # single run
bun run test:coverage # com cobertura (thresholds: 64% statements, 60% branches, 64% functions, 54.5% lines)
```

As exclusões de cobertura foram adicionadas em `vitest.config.mts` para: `o-que-tem/**`, `geladeira/**, manifest.ts, robots.ts, sitemap.ts, opengraph-image.tsx, src/app/**/loading.tsx`, visando contemplar as novas páginas e a página 404 redesignada.

**Teste da página 404** — `tests/app/not-found.test.tsx` agora cobre:
- Mensagem `"Essa receita fugiu da panela!"`
- Link `"Voltar pra cozinha"` (home)
- Link `"Que não queimaram"` (receitas)

---

Ambiente `happy-dom`, setup em `tests/setup/vitest.setup.ts`, path alias `@`.

**E2E — Playwright** (`playwright.config.ts:1`):

```bash
bun run test:e2e        # headless
bun run test:e2e:ui     # UI mode
bun run test:e2e:headed # headed
bun run test:e2e:debug  # debug
```

O projeto de `setup` autentica e salva `tests/e2e/playwright/.auth/user.json` (usado pelo projeto `chromium`).

---

## CI/CD

Workflow principal `.github/workflows/ci.yml:1` ( `push` em `main`/`develop` e PRs):

```yaml
quality:  checkout → setup-bun → bun install → db:generate → biome check:ci → typecheck → test:coverage → build
e2e:      needs quality → build → playwright chromium → wait-on → test:e2e
```

Workflow adicional `playwright.yml` para testes E2E em `main`/`master`.

Localmente o equivalente ao CI é:

```bash
bun run ci      # biome check:ci + typecheck + test:coverage
bun run build   # valida o build Next.js
```

---

## Deploy

Next.js standalone. Variáveis obrigatórias em produção: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `R2_*`, `RESEND_API_KEY`, `GROQ_API_KEY`.

Exemplo (Vercel):

1. Conecte o repositório.
2. Configure as env vars no dashboard.
3. Build command: `bun run build` (já roda `prisma generate`).
4. Garanta que as migrations foram aplicadas (`bunx prisma migrate deploy`).

`next.config.ts:4` permite imagens remotas de `*.r2.dev` e `images.unsplash.com` e aumenta o limite de Server Actions para `10mb`.

---

## Contribuindo

1. Crie uma branch a partir de `develop`.
2. Rode `bun run check` antes de commitar (ou deixe o format on save cuidar).
3. Garanta `bun run typecheck` e `bun run test:coverage` passando.
4. Abra PR contra `develop`.

Padrões:
- Commits em português ou inglês, curtos e descritivos.
- Código formatado pelo Biome (não abra PR com diffs de formatação manual).
- Tipagem estrita (`tsconfig.json:6` com `strict: true`).

---

## Licença

Privado — todos os direitos reservados. Entre em contato com os mantenedores para uso ou distribuição.

---

*Feito com afeto, sem frescura — como boa comida de casa.*
