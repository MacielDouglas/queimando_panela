---
name: "Queimando Panela"
description: "Blog editorial Raízes — papel, tinta, barro e ouro, Fraunces + DM Sans, editoração Epirus."
colors:
  background: "#f6f0e4"
  foreground: "#1b2920"
  primary: "#a85131"
  primary-foreground: "#ffffff"
  secondary: "#e8ddca"
  secondary-foreground: "#1b2920"
  muted: "#e8ddca"
  muted-foreground: "#3e4d42"
  accent: "#1b2920"
  accent-foreground: "#f6f0e4"
  card: "#ffffff"
  card-foreground: "#1b2920"
  border: "rgba(27, 41, 32, 0.16)"
  input: "#1b2920"
  ring: "#c4975d"
  destructive: "#cc1f1f"
  cocoa: "#1b2920"
  cocoa-hover: "#2a3a2f"
  cocoa-dark: "#111b14"
  cream: "#f6f0e4"
  ink-muted: "#3e4d42"
  line: "rgba(27, 41, 32, 0.16)"
  paper: "#f6f0e4"
  paper-strong: "#e8ddca"
  clay: "#a85131"
  gold: "#c4975d"
  moss: "#65765b"
  sage: "#65765b"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.4rem, 5vw, 4.2rem)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.375rem, 1.125rem + 1vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.16em"
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
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "0 22px"
    height: "50px"
  button-outline-queimando-panela:
    backgroundColor: "transparent"
    textColor: "{colors.cocoa}"
    rounded: "{rounded.full}"
    padding: "0 22px"
    height: "50px"
  button-secondary:
    backgroundColor: "{colors.cocoa}"
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
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "4px 8px"
    height: "24px"
---

# Design System: Queimando Panela — Epirus

## 1. Overview

**Creative North Star: "Raízes à Mesa"**

Queimando Panela agora fala a língua editorial de `D:\epirus\nova.html` — papel `#f6f0e4`, tinta `#1b2920`, barro `#a85131`, ouro `#c4975d` e musgo `#65765b`. O creme quente de `nova.html` substitui o `cream #fffdf8` anterior; o amarelo manteiga `#ffc733` sai e entra o barro terroso como acento. Fraunces (9..144, 500-700) lidera títulos com `letter-spacing -0.06em` e `line-height 0.9`, DM Sans conduz corpo com `1.8` e `ink-soft #3e4d42`. Linha `rgba(27,41,32,0.16)` desenha bordas finas, sombras `0 20px 60px rgba(27,41,32,0.2)`.

Rejeita: amarelo saturado, `border-left` colorido, gradient text, glassmorphism, shadows 16px+ com borda, eyebrow repetido, `01/02/03` como scaffolding genérico.

**Key Characteristics:**
- Papel dominante `#f6f0e4`, tinta `#1b2920` ancora, barro `#a85131` pontua em números e CTAs, ouro `#c4975d` no foco/quote, musgo `#65765b` no card 03.
- Fraunces editorial (500) + DM Sans (400-600), `text-wrap: balance`, 65–72ch, leading 1.8.
- Cantos suaves: `18px` cards, `28px` hero/CTA, `999px` pills.
- Espaço Epirus: `container min(100% - 2rem, 78rem)`, `py-[clamp(5rem,12vw,11rem)]` em seções, `gap 1px` com `line` para grelhas.
- Fotos full-bleed com `hero::before` gradiente `rgba(10,19,13,0.87)`.

## 2. Colors

Paleta Epirus nova.html: papel aquece, tinta ancora, barro e ouro pontuam, musgo respira.

### Primary
- **Barro** (#a85131): CTA, número `story-card__number`, acento de ação. Sobre branco 5.8:1, sobre papel 5.4:1. Hover `#8e4429`.
- **Tinta** (#1b2920): Títulos, header, footer `#111b14`, linha `rgba(27,41,32,0.16)`. Sobre papel 14.1:1.

### Secondary
- **Papel** (#f6f0e4): Fundo de página (`--background`, `--paper`, `--cream`) e `story-card` 01.
- **Papel Forte** (#e8ddca): `story-card` 02, muted/secondary, zebra.

### Tertiary
- **Musgo** (#65765b): `story-card` 03 `background #d4dac9` deriva de musgo, variação vegetal.
- **Ouro** (#c4975d): Foco `outline 3px solid var(--gold)`, `heritage__quote cite`, detalhe nobre. Sobre tinta 5.1:1.

### Neutral
- **Tinta Suave** (#3e4d42): Texto secundário `intro__copy`, `story-card p` (7.2:1 sobre papel).
- **Branco** (#ffffff): Cards, popover.
- **Linha** (`rgba(27,41,32,0.16)`): Borda fina, grelha `story-grid gap 1px`, divisores.
- **Vermelho Panela** (#cc1f1f): Destructive.

### Named Rules
**The Barro Restrained Rule.** Barro aparece em número, link e CTA — nunca como fill de página inteira. Se a página parece terracota ao zoom out, tem barro demais.
**The Papel Não É Bege Rule.** `#f6f0e4` é fundo editorial, não envelhecido. Evita saturar com `#e8ddca` em bloco grande.

## 3. Typography

**Display Font:** Fraunces (Google, `--font-display`, opsz 9..144, 500/600/700) fallback Georgia, serif
**Body Font:** DM Sans (Google, `--font-body`, 400/500/600) fallback system-ui, sans-serif
**Label Font:** DM Sans 600 `0.68rem 0.16em uppercase` para eyebrow e nav

**Character:** Editorial Raízes — Fraunces com `-0.06em` e `0.9` dá voz de território; DM Sans leve conduz longa leitura com `1.8`. `hero h1 clamp(3.3rem,8vw,7.75rem)` e `intro h2 clamp(2.25rem,5vw,4.9rem)`.

### Hierarchy
- **Display** (Fraunces 500, `clamp(3.3rem,8vw,7.75rem)` 0.9 -0.06em): Hero e story h2.
- **Headline** (Fraunces 500, `clamp(2.5rem,6vw,5.5rem)` 0.94 -0.06em): `heritage h2`.
- **Title** (Fraunces 500, `clamp(1.8rem,3vw,3rem)` 0.98 -0.05em): `story-card h3`.
- **Body** (DM Sans 400, `1rem` 1.8): `intro__copy`, `heritage p` com `rgba(246,240,228,0.78)` sobre tinta.
- **Label** (DM Sans 600, `0.68rem` 1.4 0.16em uppercase): Eyebrow, `text-link 0.72rem 0.13em`.

## 4. Elevation

Sistema Epirus: sombra única profunda, não borda pesada.

### Shadow Vocabulary
- **Epirus** (`0 20px 60px rgba(27,41,32,0.2)` — `--shadow`): Único shadow documentado em nova.html.
- **Card** (`0 4px 12px rgba(27,41,32,0.06)`): Variação suave para lifts.

## 5. Components

### Buttons
- **Shape:** Pill `999px`, `min-height 50px`, `padding 0 22px`, `font-weight 700`.
- **Primary:** `bg #a85131` + `color #ffffff`, hover `#8e4429`.
- **Outline:** `border 1px #1b2920` + `color #1b2920`, hover preenche `#a85131`.
- **Secondary:** `bg #1b2920` + `color #f6f0e4`.

### Chips
- **Style:** Pill `999px`, `0.68rem 600 0.16em uppercase`, `bg #a85131` + `color #fff` quando ativo; `bg white border 1px rgba(27,41,32,0.16)` quando inativo.

### Cards / Containers
- **Grelha Epirus:** `story-grid gap 1px background var(--line)` com 3 cards: `01 #f6f0e4`, `02 #e9ddc8`, `03 #d4dac9` (musgo).
- **Heritage Quote:** `border 1px solid rgba(246,240,228,0.24)` sobre `bg #1b2920`.
- **Corner:** `18px` (`--radius-md`) para cards, `28px` para hero/CTA.
- **Border:** `1px rgba(27,41,32,0.16)` quando sem sombra.

### Navigation
- **Header:** `absolute top-0 h-5.5rem`, transparente sobre hero, `color var(--white)`, nav `0.72rem 600 0.11em uppercase` com underline `scaleX` hover, menu-button `2.75rem` círculo.
- **Footer:** `bg #111b14` + `color var(--paper)`, `border-top rgba(246,240,228,0.16)`.

### Signature Component — Eyebrow Epirus
- `DM Sans 0.68rem 600 0.16em uppercase`, `margin 0 0 1rem`, sem traço amarelo — cor herda do contexto (`var(--white)` sobre imagem, `var(--clay)` sobre papel).

## 6. Do's and Don'ts

### Do:
- **Do** usar papel `#f6f0e4` dominante, barro `#a85131` pontual e tinta `#1b2920` como âncora.
- **Do** usar Fraunces 500 com `-0.06em` e DM Sans com `1.8`.
- **Do** manter `gap 1px + line` para grelhas Epirus e `container min(100% - 2rem, 78rem)`.
- **Do** manter `focus-visible outline 3px solid var(--gold)` com `offset 4px`.
- **Do** usar `hero::before` gradiente `rgba(10,19,13,0.87)` sobre imagem full-bleed.

### Don't:
- **Don't** usar amarelo `#ffc733` ou `cocoa #3a2418` antigos.
- **Don't** usar `border-left` >1px como acento.
- **Don't** usar gradient text ou glassmorphism.
- **Don't** voltar ao site antigo amarelo quadrado — anti-reference.
