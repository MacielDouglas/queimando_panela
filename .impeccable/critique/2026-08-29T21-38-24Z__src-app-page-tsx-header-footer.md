---
target: home + header + footer
total_score: 16
p0_count: 2
p1_count: 2
timestamp: 2026-08-29T21-38-24Z
slug: src-app-page-tsx-header-footer
---
# Critique — Home + Header + Footer — Queimando Panela

Method: dual-agent (A: ses_fb08dc165ffeZBeRz4tlzJpXe0 · B: ses_fb08c4787ffelRyr4eTJHTOIu9)
Slug: src-app-page-tsx-header-footer
Data: 2026-08-29

## Design Health Score — 16/40 — Poor (rework necessário)

| # | Heurística | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Dots Latest `h-1 w 16/32px` sem aria-selected/aria-current (`LatestRecipesSection.tsx:132-147`), skeleton `auth-nav-button.tsx:38` sem aria-busy |
| 2 | Match System / Real World | 1 | Copy não fala cozinha real: "Blog culinário, amador", "+Receitas", "Encontre nossos produtos" (`HeroSection.tsx:9`, `CtaSection.tsx:37`) vs job "história + olhômetro + IA" |
| 3 | User Control and Freedom | 2 | Latest sem teclado ←→/Esc, mobile sheet sem swipe, CTA final leva para `/receitas` não `/receitas/new` (`CtaSection.tsx:30`) |
| 4 | Consistency and Standards | 1 | Drift total: Sora+Inter → Playfair+DM Sans (`layout.tsx:7`), #FFFFFF/#ffb900/0px/12px → #fffdf7/#ffc733/18px/28px/999px (`globals.css:40-93`), var(--white) inexistente (`IntroSection.tsx:5`) |
| 5 | Error Prevention | 2 | CTA "Enviar receita" no Hero (`HeroSection.tsx:34`) mas CTA final vende "produtos" inexistentes; erro "esta bom" sem acento (`HeroSection.tsx:82`) |
| 6 | Recognition Rather Than Recall | 2 | Latest exige lembrar 02/06 sem preview; Categories 3× "Descobrir sabores" idênticos (`CategoriesSection.tsx:78`) |
| 7 | Flexibility and Efficiency | 2 | 7 seções sem âncoras, sem busca visível, sem "pular para receitas" |
| 8 | Aesthetic and Minimalist Design | 1 | 6 eyebrows + 01/02 + cream #fffdf7 + shadow 20/50 + arch 46% — viola "amarelo restrained ≤10%, branco dominante" (`DESIGN.md:115`) |
| 9 | Error Recovery | 2 | Empty states existem (`RecipesSection.tsx:15`, `LatestRecipesSection.tsx:15`) mas sem CTA "Envie sua primeira receita" |
| 10 | Help and Documentation | 1 | Zero explicação IA na Home (PRODUCT promete utensílios/nutrição/tempo/classificação editável) |
| **Total** | | **16/40** | **Poor — Major UX overhaul required** |

## Anti-Patterns Verdict — FALHOU: parece template Epirus, não Queimando Panela

**LLM assessment (Assessment A): 7.8/10 AI slop (alto)**
Home é coesa como tema gourmet premium, mas falha como marca "moderna, inteligente, acolhedora" do contrato. `PRODUCT.md` lista como anti-references: cream/bege, gradient text, eyebrow em cada seção, 01/02 scaffolding, glassmorphism, sombra 16px+ com borda — Home acerta 4 de 6.

- **Eyebrow factory — CRÍTICO** (`globals.css:203-221` + 6 usos): `.eyebrow-queimando-panela` (DM Sans 0.78rem 0.13em + ::before 30×2px #ffc733) repetido em `HeroSection.tsx:9`, `IntroSection.tsx:48`, `CategoriesSection.tsx:36`, `ValuesSection.tsx:31`, `RecipesSection.tsx:20/37`, `LatestRecipesSection.tsx:20/40`. Mesma cor, mesmo ritmo. Olho aprende a ignorar.
- **01/02/03 scaffolding**: `ValuesSection.tsx:1-19` números grandes `1.65rem` amarelos sem semântica, `border-t/b rgba(255,255,255,0.2)` — decorativo puro.
- **Cream drift estrutural**: `globals.css:42` `--background #fffdf7`, `layout.tsx:41` `background var(--cream)`, `Header.tsx:15` `rgba(255,253,247,0.9)` cream translúcido + `backdrop-blur` — `DESIGN.md` manda `#FFFFFF` puro, "Paleta light sem bege".
- **Seção inteira amarela**: `CtaSection.tsx:10-13` `background var(--accent-e) radius 28px` full-bleed — viola "Amarelo nunca como fill; se parece amarela ao dar zoom out, tem amarelo demais" (`DESIGN.md:125`).
- **Tipografia drift**: `layout.tsx:7-19` Playfair_Display + DM_Sans vs `DESIGN.md` Sora 800 uppercase + Inter. Playfair editorial rústico ≠ moderno tech. Letter-spacing hero `-0.07em` (`HeroSection.tsx:11`) excede floor `-0.04em` da skill.
- **Radii drift**: `DESIGN.md` híbrido 0px botões / 12px cards → código `globals.css:68,92-93` 18px/28px + `button-epirus` 999px + arch `46% 46% 22px 22px` (`HeroSection.tsx:92`) + `QPMark` `50% 50% 50% 8px rotate -18deg` (`qp-mark.tsx:23`).

**Deterministic scan (Assessment B): 5 findings advisory, 0 falsos positivos — cobre só 22% do drift**
Roda `node .agents/skills/impeccable/scripts/detect.mjs --json src/app/page.tsx src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/home`:

| # | Rule | file:line | ignoreValue | Veredito |
|---|------|-----------|-------------|----------|
| 1 | design-system-color | `Footer.tsx:30` | `#102c2a` | Drift real → warning. Footer `background #102c2a` viola `DESIGN.md:170` "Footer branco borda #e5e5e5, nada de footer preto pesado". |
| 2 | design-system-color | `CtaSection.tsx:24` | `rgba(31,41,51,0.78)` | Drift sintoma — token fantasma `ink` #1f2933 vs `DESIGN.md` #0a0a0a |
| 3 | design-system-radius | `HeroSection.tsx:92` | `22px` | Drift real — arch 46% fora do híbrido 0/12 |
| 4 | design-system-color | `HeroSection.tsx:93` | `#d9dfc9` | Drift real — verde sálvia não documentado |
| 5 | design-system-radius | `IntroSection.tsx:26` | `14px` | Drift real — deveria ser 12px |

Detector não pega `var()` indireto, font drift, eyebrow factory e cream global (mais 18 instâncias: `--background #fffdf7`, `--primary #ffc733` vs #ffb900, `--foreground #1f2933` vs #0a0a0a, Playfair, cream header, etc). Contraste passa AA (ex: #52606d sobre #fffdf7 6.35:1, #1f2933 sobre #ffc733 9.46:1), mas semântica erra.

**Visual overlays:** não executado (sem `live-server`/`next dev`). Recomendado `npm run dev` + `node .agents/skills/impeccable/scripts/live-server.mjs --background` para validar cream ao dar zoom out.

## Overall Impression
Gut: parece Shopify de azeite artesanal muito bem executado. Se o briefing fosse "Epirus gourmet", nota 8/10. Como "Queimando Panela — blog moderno com IA co-piloto", é outra marca: usuário não entende onde está a IA, lê 6 eyebrows iguais e termina vendendo "produtos" que não existem. Maior oportunidade: trazer IA para o hero e assumir ou reverter o fork Epirus.

## What's Working
1. **Execução editorial coesa** — tokens Epirus (`globals.css:82-94` forest/cream/accent-e/line/shadow) + `editorial-container min(100%-40px,1180px)` + `button-epirus hover translateY -2px` dão polimento premium. Se fosse gourmet, seria referência.
2. **Estados vazios + imagem cuidadosa** — `RecipesSection.tsx:15-32` e `LatestRecipesSection.tsx:15-30` tratam lista vazia; `fill + sizes + priority` + `aspect 1.15/1` e `1.2/1` mostram cuidado técnico.
3. **Header/Footer estruturalmente sólidos** — `Header.tsx` sticky `z-20 backdrop-blur` com `nav aria-label`, `MobileMenu` com `SheetClose asChild` (`mobile-menu.tsx:64`), `auth-nav-button.tsx:38-79` com pending/signed states; `Footer.tsx:60,84,108` 3 navs com aria + `rel noopener`.

## Priority Issues

### [P0] Drift sistêmico Epirus vs DESIGN.md — decidir identidade agora
- **What:** Contrato `DESIGN.md` (restrained #ffb900 ≤10%, bg #FFFFFF, Sora 800 uppercase + Inter, híbrido 0/12, header branco h-16, footer branco) foi substituído por Epirus cream #fffdf7 / #ffc733 / forest #183a37 / Playfair+DM Sans / radii 18/28/999 (`globals.css:40-95`, `layout.tsx:7-19`, `Header.tsx:12-15`, `Footer.tsx:30`).
- **Why it matters:** Quebra confiança produto/design; perde "moderno, inteligente" e vira "rústico editorial". `PRODUCT.md:113` "branco respira, amarelo pontua" some.
- **Fix:** Decisão binária: (A) manter Epirus → rodar `$impeccable document` para atualizar `DESIGN.md` para cream/Playfair/28px (assumir perda tech) ou (B) reverter tokens: `--background #FFFFFF`, `--primary #ffb900`, `Sora+Inter` via `next/font`, `rounded 0/12`, `Header bg-white border #e5e5e5 h-16`.
- **Suggested command:** `$impeccable document` (se manter) ou `$impeccable polish` (se reverter tokens)

### [P0] Eyebrow factory (6/7 seções) + 01/02 scaffolding
- **What:** `globals.css:203-221` eyebrow + `HeroSection.tsx:9`, `IntroSection.tsx:48`, `CategoriesSection.tsx:36`, `ValuesSection.tsx:31`, `RecipesSection.tsx:37`, `LatestRecipesSection.tsx:40`; `ValuesSection.tsx:1-19` 01/02/03 `text-[1.65rem] font-bold` amarelo.
- **Why it matters:** F-pattern quebrado, wallpaper cansaço, AI slop explícito no próprio `PRODUCT.md` anti-references.
- **Fix:** Manter eyebrow só em Hero + 1 âncora (ex: Intro). Remover demais. Em Values trocar "01/02/03" por lista sem número ou ícone utensílio, com título Sora Branco.
- **Suggested command:** `$impeccable quieter` + `$impeccable typeset`

### [P1] Home não vende o produto — sem IA visível + CTA "produtos" desconectado + 7 seções inchadas
- **What:** `page.tsx:33-41` 7 blocos 100-112px sem variação; nenhuma seção mostra IA (utensílios/nutrição/tempo/classificação editável — `PRODUCT.md:11`). `CtaSection.tsx:18-37` vende "Encontre nossos produtos" href `/receitas`.
- **Why it matters:** Job "criar receita e receber análise IA" não aparece acima da dobra; usuário acha que é blog bonito sem diferencial; conversão "Enviar receita" cai.
- **Fix:** Reescrever Hero h1/p para incluir IA ("Receitas com história, conferidas por IA"), trocar uma seção (Values ou Intro) por demo IA 3 cards editáveis, fix `CtaSection.tsx:30` href `/receitas/new` copy "Publique sua primeira receita — IA confere antes", cortar de 7 para 4-5 seções (mesclar Intro+Values).
- **Suggested command:** `$impeccable clarify` + `$impeccable layout`

### [P1] Acessibilidade e alvos quebrados
- **What:** `LatestRecipesSection.tsx:132-147` dots `h-1 w 16/32px` <44px sem `aria-current/role tablist` nem teclado; `HeroSection.tsx:42-85` stats "+Receitas"/"IA esta bom" placeholder + erro "esta"; `IntroSection.tsx:5` `var(--white)` inexistente; `globals.css:186` focus forest invisível sobre footer escuro.
- **Why it matters:** Viola `PRODUCT.md:136` "Toque ≥44px, foco amarelo visível, reduced-motion" + WCAG 2.5.5; mobile com farinha na mão falha.
- **Fix:** Dots → `min-h-11 min-w-44` hit-area, `aria-selected`, `role=tablist`, ←→ keyboard. Stats → valores reais ou remover. Trocar `var(--white)` → `var(--background)`. Footer focus `outline 2px var(--accent-e)`. Respeitar `prefers-reduced-motion` nos `scale-105` (`CategoriesSection.tsx:62` etc).
- **Suggested command:** `$impeccable audit` + `$impeccable polish`

### [P2] Hierarquia flat e ritmo monótono
- **What:** `globals.css:223-231` `.section-title-epirus clamp 2.2-4.2rem` vs Hero `clamp 3.15-6.1rem -0.07em` — ratio 1.35 mas todo peso 700-800 flat sem uppercase/peso; `py-[110px]/112px` repetido 5×.
- **Why it matters:** Leitor não sente onde está; escaneamento pobre para leitura longa 30-55a.
- **Fix:** Variar ritmo: Hero `py-16 lg:py-20` denso, Intro `py-12`, Values `py-16` etc; H2 seguintes `clamp 1.8-2.8rem 800 uppercase` (DESIGN headline) com peso contrastante, alternar Sora 800 vs Inter 400.
- **Suggested command:** `$impeccable typeset` + `$impeccable layout`

## Persona Red Flags
- **Jordan (First-Timer, quer publicar hoje com IA):** Home não mostra fluxo "criar → IA analisa → editar → publicar". `HeroSection.tsx:34` "Enviar receita" existe, mas `CtaSection.tsx:30` final manda para `/receitas` genérico. Sem demo IA, Jordan não confia. Risco abandono no scroll final.
- **Casey (Distracted Mobile, cozinha com celular):** `CategoriesSection.tsx:78` 3× "Descobrir sabores" idênticos + `LatestRecipesSection.tsx:132` dots 1px invisíveis ao polegar; `HeroSection.tsx:88-105` imagem arch `hidden lg:block` desperdiça hero mobile (só texto). CTA amarelo `min-h 50px` ok mas logo `Header.tsx:21` gap 3 + nav hidden empurra Auth button para sheet.
- **Riley (Stress Tester, esteta de design system):** Abre `DESIGN.md` esperando Sora+Inter #FFFFFF 0/12 e recebe Playfair cream 28px arch `Footer.tsx:30` #102c2a pesado vs spec "footer branco". `var(--white)` bug + `22px/14px` fora escala quebram confiança sistema.
- **Sam (Accessibility, 42a afeto):** Copy `HeroSection.tsx:9` "Blog culinário, amador" soa pejorativo vs `PRODUCT.md:130` "história tem valor"; erro "esta bom" diminui cuidado. Footer `rgba(255,255,255,0.72)` apagado sobre #102c2a perde hierarquia acolhedora; focus invisível sobre escuro.

## Minor Observations
- `qp-mark.tsx:23` `50% 50% 50% 8px rotate -18deg` charmoso mas 34px pode alias em low-dpi — testar 32/40.
- `editorial-container min(100%-40px,1180px)` (`globals.css:193`) vs spec `min(100%-1.5rem,84rem)` — 40px vs 24px drift documentar.
- `IntroSection.tsx:13` `bg #f5f0e8` hardcoded vs `--muted`; `--white` → `--background`.
- `CtaSection.tsx:42` imagem `hidden lg:block minHeight 340px` desperdiça LCP mobile — tornar visível com `aspect 4/3`.
- `auth-nav-button.tsx:39` skeleton sem `aria-busy`; `mobile-menu.tsx:42` `SheetHeader bg var(--accent-e)` conflita com header spec branco.
- `HeroSection.tsx:62` `+Receitas` sem número — se fake, remover métrica (quebra confiança).

## Questions to Consider
- Se amarelo é tempero ≤10%, por que a última impressão é uma seção 100% amarela de 340px? O que isso ensina sobre restrained?
- Você chamaria sua mãe que cozinha há 30 anos de "amadora" num eyebrow? Qual label faria Sam se orgulhar da panela queimada?
- Lida sem imagens (leitor de tela/3G), alguém entende que existe IA que confere utensílios e nutrição? Onde está essa frase acima da dobra?
- Precisa de 7 seções para 1 história? Qual seção você cortaria hoje para Jordan publicar em 3 cliques?
