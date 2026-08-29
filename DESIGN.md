---
name: "Queimando Panela"
description: "Blog acolhedor com IA co-piloto — floresta + amarelo creme, Playfair editorial + DM Sans leve, cantos suaves."
colors:
  background: "#fffdf7"
  foreground: "#1f2933"
  primary: "#ffc733"
  primary-foreground: "#1f2933"
  secondary: "#f5f0e8"
  secondary-foreground: "#1f2933"
  muted: "#f5f0e8"
  muted-foreground: "#52606d"
  accent: "#183a37"
  accent-foreground: "#ffffff"
  card: "#ffffff"
  card-foreground: "#1f2933"
  border: "#e8e1d5"
  input: "#1f2933"
  ring: "#ffc733"
  destructive: "#cc1f1f"
  forest: "#183a37"
  forest-hover: "#2f5d50"
  forest-dark: "#102c2a"
  cream: "#fffdf7"
  ink-muted: "#52606d"
  line: "#e8e1d5"
  sage: "#d9dfc9"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.4rem, 5vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.375rem, 1.125rem + 1vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.13em"
rounded:
  sm: "14px"
  md: "18px"
  lg: "28px"
  organic: "22px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary-queimando-panela:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "0 22px"
    height: "50px"
  button-outline-queimando-panela:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    rounded: "{rounded.full}"
    padding: "0 22px"
    height: "50px"
  button-secondary:
    backgroundColor: "{colors.forest}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "0 22px"
    height: "50px"
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.md}"
    padding: "0px"
  input-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "4px 8px"
    height: "24px"
---

# Design System: Queimando Panela

## 1. Overview

**Creative North Star: "A Cozinha como Sala de Estar"**

Queimando Panela é um blog que se lê como livro, mas acolhe como cozinha de casa. A tecnologia (IA que confere utensílios, nutrição, tempo e classificação) serve o afeto, não o contrário. Visualmente é **claro, editorial e quente** — Playfair Display dá peso editorial acolhedor, DM Sans garante leitura leve com farinha na mão. O creme `#fffdf7` aquece o branco sem virar bege pesado, o amarelo `#ffc733` pontua em pílulas e faixas de 2px, o forest `#183a37` ancora títulos e cabeçalho. Nada de site institucional quadrado pesado, nada de blog genérico lotado de anúncios.

Rejeita: fundo cream saturado que parece papel envelhecido, gradient text, glassmorphism decorativo, `border-left` colorido em cards, sombras 16px+ com borda, eyebrow em cada seção, `01/02/03` como scaffolding e cards idênticos. IA aparece como rascunho editável com utensílios, nutrição e tempo explicados — nunca como veredito fechado.

**Key Characteristics:**
- Editorial quente: Playfair + DM Sans, `text-wrap: balance` em h1–h3, 65–72ch, leading 1.6.
- Creme dominante, amarelo restrained (≤15% da tela), forest como âncora.
- Cantos suaves: `18px` cards/inputs, `28px` hero/CTA, `999px` botões/links — híbrido acolhedor, não precisão tech fria.
- Espaço generoso: `editorial-container min(100%-40px,1180px)`, `py-16 lg:py-20` entre seções, `gap-10` em grids.
- IA como co-piloto visível na Home e no fluxo de criação.

## 2. Colors

Paleta quente e editorial: forest profundo ancora, amarelo manteiga pontua, creme e linha dão respiro.

### Primary
- **Amarelo Manteiga** (#ffc733): CTA primário, badge/pill, faixa `::before` 30×2px do eyebrow, ring `2px #ffc733`. Sempre com texto `#1f2933` (9.4:1). Hover `#eeb214`.
- **Forest Profundo** (#183a37): Títulos, header text, borda, botão secundário, footer. Sobre creme 12.3:1. Hover `#2f5d50`.

### Secondary
- **Creme Queimando Panela** (#fffdf7): Fundo de página (`--background`, `--cream`) e header translúcido `rgba(255,253,247,0.9)`. Aquece sem virar bege.
- **Areia Clara** (#f5f0e8): Muted/secondary para hover, zebra e fundo de imagem. Nunca fundo de página cheio.

### Neutral
- **Tinta** (#1f2933): Texto base, `--foreground`/`--ink`/`--input`.
- **Tinta Suave** (#52606d): Texto secundário, `p` e descrições (6.3:1 sobre #fffdf7, AA).
- **Linha** (#e8e1d5): Border fina 1px, divisores. Mesmo valor para `--border`/`--line`.
- **Branco Puro** (#ffffff): Cards, popover. Sobre forest 12.3:1.
- **Vermelho Panela** (#cc1f1f): Destructive.
- **Verde Sálvia** (#d9dfc9): Fundo sutil atrás da imagem hero orgânica (não token, uso pontual).

### Named Rules
**The Amarelo Restrained Rule.** Amarelo aparece em pílula, badge ou faixa 2px — nunca como fill de seção inteira. Se a página parece amarela ao dar zoom out, tem amarelo demais.
**The Cream Não É Bege Rule.** #fffdf7 é fundo, não personalidade. Aquece o branco; não compete com ele. Evitar saturar com #f5f0e8 em bloco grande.

## 3. Typography

**Display Font:** Playfair Display (Google, variable `--font-display`, weights 400/600/700/800) com fallback Georgia, serif
**Body Font:** DM Sans (Google, variable `--font-body`, weights 400/500/600/700) com fallback system-ui, sans-serif
**Label/Mono Font:** DM Sans bold para eyebrow, badge e navegação

**Character:** Editorial acolhedor com leitura leve. Playfair dá peso e confiança ("a IA conferiu"), DM Sans conduz sem fadiga. Contraste não vem de duas sans similares, mas de serif display + sans humanista. `text-wrap: balance` em h1–h3, `text-wrap: pretty` no corpo.

### Hierarchy
- **Display** (Playfair 700, `clamp(2.2rem,5vw,4.2rem)` 1.03 -0.045em): Hero h1 e títulos de seção `.section-title-queimando-panela`. Só hero e h2 de página.
- **Headline** (Playfair 700, `clamp(1.75rem,1.25rem+2vw,2.75rem)` 1.15 -0.03em): `h2` padrão.
- **Title** (Playfair 600, `clamp(1.375rem,1.125rem+1vw,1.75rem)` 1.2 -0.01em): `h3` e títulos de card `1.55–1.72rem`.
- **Body** (DM Sans 400, `1rem` 1.6, `max-width 72ch`): Texto corrido, `section-copy 1.05rem` em `max-width 620px`.
- **Label** (DM Sans 700, `0.78rem` 1.2 0.13em uppercase): Eyebrow `eyebrow-queimando-panela` (com traço 30×2px amarelo), navegação, badge `0.73rem`.

### Named Rules
**The Balance Rule.** Todo h1–h3 usa `text-wrap: balance`; corpo usa `pretty`. Linha nunca passa 72ch.
**The Eyebrow Pontual Rule.** Eyebrow só em Hero + 1 seção âncora por página, nunca factory em 6/7 seções.

## 4. Elevation

Sistema usa sombra suave como lift acolhedor, não como borda. Superfícies são planas por padrão; sombra aparece para destacar card ou badge flutuante.

### Shadow Vocabulary
- **Ambient Soft** (`0 20px 50px rgba(24, 58, 55, 0.1)` — `--shadow`): Card flutuante da Intro e badge rotacionado do hero. Uso pontual.
- **Card Lift** (`0 10px 30px rgba(24, 58, 55, 0.06)`): Cards de receita (`RecipesSection`). Sutil, sem borda pesada.

### Named Rules
**The Sem-Borda-Pesada Rule.** Nunca `border: 1px solid` + `box-shadow 16px+` no mesmo elemento. Ou borda `1px #e8e1d5` ou sombra `≤10px`, nunca ambos como decoração.
**The Flat-By-Default Rule.** Fundo creme + cards brancos já criam profundidade por contraste tonal. Sombra só quando precisa elevar.

## 5. Components

### Buttons
- **Shape:** Pill `999px`, `min-height 50px`, `padding 0 22px`, `font-weight 700`, `transition transform 180ms`.
- **Primary Queimando Panela:** `bg #ffc733` + `color #1f2933`, hover `#eeb214` + `translateY(-2px)`.
- **Outline Queimando Panela:** `border 1px #183a37` + `color #183a37` transparente, hover preenche `#ffc733` + `border #ffc733`.
- **Secondary:** `bg #183a37` + `color white`.
- **AuthNav:** `h-42px px-17px` pill, ghost quando deslogado usa primary queimando-panela.

### Chips
- **Style:** Pill `999px`, `0.73rem extrabold uppercase 0.04em`, `bg #ffc733` + `color #1f2933` quando badge; `bg white border 1px #e8e1d5` quando inativo.

### Cards / Containers
- **Corner Style:** `18px` (`--radius-md`) para cards de categoria/receita; `28px` (`--radius-lg`) para hero CTA; `46% 46% 22px 22px` orgânico só no hero image (uso signature).
- **Background:** `white` sobre `cream #fffdf7`.
- **Shadow Strategy:** `0 10px 30px rgba(24,58,55,0.06)` em receitas; sem sombra em categorias (borda `1px #e8e1d5`).
- **Border:** `1px #e8e1d5` quando sem sombra; `14px` card flutuante forest da Intro (`bg #183a37` + `color white`).
- **Internal Padding:** `p-6` categorias, `p-[22px]` receitas, `p-5` card.

### Inputs / Fields
- **Style:** `bg white`, `border 1px #1f2933`, `radius 18px`, `placeholder #52606d`.
- **Focus:** `outline 2px solid #183a37` + `ring 2px #ffc733`.
- **Error / Disabled:** `border #cc1f1f` para erro.

### Navigation
- **Header:** `sticky top-0 z-20 h-78px`, `bg rgba(255,253,247,0.9)` + `backdrop-blur`, `border-b rgba(232,225,213,0.72)`. `editorial-container flex justify-between`. Logo `QP` pill `34px 50% 50% 50% 8px rotate -18deg` + `bg #ffc733`.
- **Nav links:** `DM Sans 0.92rem semibold`, `color #52606d` default, `#183a37` hover/active, `gap-7`. Mobile `Sheet` com `max-w-sm`, header amarelo.
- **Footer:** `bg #102c2a` (forest escuro `#102c2a` derivado de #183a37) + `border-top rgba(255,255,255,0.1)`, 4 cols `1.2fr repeat(3,0.65fr)`, títulos `0.8rem uppercase 0.08em #ffc733`, links `0.9rem rgba(255,255,255,0.72)` hover `#ffc733`.

### Signature Component — Eyebrow Queimando Panela
- `inline-flex gap 10px` + `::before 30×2px #ffc733`, `DM Sans 0.78rem 700 0.13em uppercase`, `color #183a37`. Uso pontual (Hero + 1 seção).

## 6. Do's and Don'ts

### Do:
- **Do** usar creme #fffdf7 dominante, amarelo #ffc733 pontual (pill/badge/faixa 2px) e forest #183a37 como âncora.
- **Do** usar Playfair Display para títulos com `text-wrap: balance` e DM Sans para corpo com `max-width 72ch`.
- **Do** manter híbrido `999px` botões/links e `18px/28px` cards — cantos suaves são a marca.
- **Do** manter `editorial-container min(100%-40px,1180px)` com respiro generoso.
- **Do** mostrar IA como cards editáveis claros (utensílios, nutrição, tempo, classificação) na Home e no fluxo de criação.
- **Do** garantir toque ≥44px, foco visível `2px #183a37` (ou `2px #ffc733` sobre escuro) e respeitar `prefers-reduced-motion`.
- **Do** usar fotos grandes 4:3 com `border 1px #e8e1d5` ou sombra suave — nunca card sem imagem.

### Don't:
- **Don't** usar amarelo como fundo de seção inteira (ex: CTA full `#ffc733` é exceção pontual documentada com `28px`, não padrão).
- **Don't** repetir eyebrow `eyebrow-queimando-panela` em cada seção — máximo 1–2 por página. Eyebrow factory é AI slop.
- **Don't** usar `01/02/03` numerados como scaffolding em Values — número só quando é fluxo ordenado real.
- **Don't** usar `border-left` >1px colorido como faixa lateral em cards.
- **Don't** usar gradient text (`background-clip: text`) ou glassmorphism decorativo.
- **Don't** usar `border 1px + box-shadow 16px+` juntos como ghost-card.
- **Don't** usar cards idênticos com ícone + heading + text repetidos sem diferenciação.
- **Don't** usar texto `color #52606d` claro sobre creme com contraste <4.5:1 — `#52606d` sobre `#fffdf7` está em 6.3:1, manter.
- **Don't** usar `border-radius 32px+` em cards — topo é `28px`.
- **Don't** voltar ao site antigo amarelo quadrado 0px ou ao blog genérico lotado de anúncios — ambos são anti-references de PRODUCT.md.
