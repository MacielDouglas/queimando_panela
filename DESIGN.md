---
name: "Queimando Panela"
description: "Blog moderno para cozinheiros 30-55 — IA que analisa receita, leitura limpa e hierarquia forte. Light, #ffb900 restrained, Sora grotesk + Inter."
colors:
  background: "#FFFFFF"
  foreground: "#0a0a0a"
  primary: "#ffb900"
  primary-foreground: "#0a0a0a"
  secondary: "#f2f2f2"
  secondary-foreground: "#0a0a0a"
  muted: "#f5f5f5"
  muted-foreground: "#6b6b6b"
  accent: "#0a0a0a"
  accent-foreground: "#FFFFFF"
  card: "#FFFFFF"
  card-foreground: "#0a0a0a"
  border: "#e5e5e5"
  input: "#0a0a0a"
  ring: "#ffb900"
  destructive: "#cc1f1f"
typography:
  display:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(1.8rem, 1.3rem + 1.8vw, 2.8rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Sora, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  sm: "0px"
  md: "8px"
  lg: "12px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.foreground}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
    height: "48px"
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "0px"
  input-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    height: "24px"
---

# Design System: Queimando Panela — Blog Moderno com IA

## 1. Overview — North Star: "Blog que se lê como livro, com IA como co-piloto"

Queimando Panela tem identidade própria: nem site antigo amarelo quadrado, nem blog genérico. É um **blog claro, limpo, com bom respiro**, feito para leitura prolongada de receita em tela grande e no celular com farinha na mão. O amarelo `#ffb900` é tempero restrained (≤10% da tela) — aparece em CTA, badge e faixa fina de 2px para guiar, nunca como fundo de seção. A tipografia faz o trabalho pesado: Sora grotesk 800 em caixa alta para títulos com peso e contraste, Inter para corpo com leading 1.7 e 65–72ch.

**Contrato:**
- Light #FFFFFF, tinta #0a0a0a, amarelo #ffb900 restrained.
- Híbrido: botões/inputs/badges 0px quadrados (precisão tech), cards/sheets 12px suaves (acolhimento blog).
- Espaço generoso: `py-16 lg:py-20` entre seções, `gap-10` em grids, `editorial-container` com respiro `min(100%-1.5rem,84rem)`.
- IA como diferencial visível: ao criar receita, a análise retorna em cards claros com utensílios, nutrição, tempo e classificação — sempre editável.

## 2. Colors — Restrained Queimando Panela

Paleta light sem bege. Amarelo nunca como fill de seção.

- **#ffb900** — Primary. Só CTA, badge, faixa 2–4px, ring. Sempre com texto #0a0a0a (7.2:1).
- **#0a0a0a** — Foreground. Títulos, header text sobre amarelo, bordas, botão secundário.
- **#FFFFFF** — Fundo página e cards.
- **#f2f2f2 / #f5f5f5** — Muted/secondary para hover e zebra. Nunca fundo de página.
- **#e5e5e5** — Border fina. Linhas de separação.
- **#6b6b6b** — Muted-foreground. Único cinza para descrição (5.6:1 sobre branco).
- **#cc1f1f** — Destructive.

**Regra do Amarelo:** se a seção parece amarela ao dar zoom out, tem amarelo demais. O branco deve dominar.

**Regra do Híbrido:** `border-radius: 0` em botões/inputs/badges; `12px` em cards/sheets/dialogs. Se um card está quadrado 0px, é drift do Estapar antigo.

## 3. Typography — Sora Grotesk + Inter para leitura

**Escolha:** Grotesk + Inter (mantida por voto). Sora traz modernidade tech sem ser fria; Inter garante leitura longa sem fadiga. Duas famílias com contraste claro, não duas similares.

- **Display** Sora 800 `clamp(2.4rem,1.6rem+3vw,4.5rem)` 0.95 -0.03em uppercase. Só hero e h1 de página.
- **Headline** Sora 800 `clamp(1.8rem,1.3rem+1.8vw,2.8rem)` 1 -0.02em uppercase. Títulos de seção.
- **Title** Sora 700 `clamp(1.25rem,1.1rem+0.6vw,1.6rem)` 1.15 -0.01em uppercase. Card titles.
- **Body** Inter 400 `1rem` 1.7. Texto corrido, `max-width:72ch`, `text-wrap: pretty` para evitar viúvas.
- **Label** Sora 800 `0.7rem` 1.2 0.14em uppercase. Navegação, eyebrow pontual, badge.

**Hierarquia:** peso faz o trabalho, não tamanho exagerado. H1 sempre mais pesado que H2, nunca flat (ratio ≥1.25). `text-wrap: balance` em h1–h3.

## 4. Layout — Blog com bom respiro

- **Container:** `w-[min(100%-1.5rem,84rem)]` centralizado. Respiro generoso, não colado na borda.
- **Ritmo:** `py-16 lg:py-20` entre seções, `gap-10` em grids, `space-y-6` dentro de cards. Variação intencional: hero mais denso, leitura mais arejada.
- **Grid:** `repeat(auto-fit, minmax(280px,1fr))` para cards. Lista 3 cols desktop, 2 tablet, 1 mobile. Nada de `grid-cols-4` fixo que quebra.
- **Faixas:** faixa fina 2–4px `#ffb900` como divisor sutil, nunca bloco amarelo cheio. Header 64px branco com borda inferior `1px #e5e5e5`, CTA amarelo pontual.
- **Leitura:** `reading-container` 72ch para steps/ingredientes. Imagem sempre `4/3` quadrada com `border-2 #0a0a0a` leve quando em destaque.

## 5. Components

### Buttons — Híbrido
- 0px, h-12, Sora 800 uppercase 0.12em.
- Primary: #ffb900 + #0a0a0a, hover #e6a700.
- Secondary: #0a0a0a + branco.
- Outline: borda 1px #0a0a0a, hover preenche preto.

### Cards — Blog 12px
- 12px, borda 1px #e5e5e5, sem sombra, imagem 4:3, padding 0 (conteúdo p-4). Faixa 4px #ffb900 opcional no topo.
- Título Sora 700 uppercase, descrição Inter #6b6b6b.

### Inputs
- 0px, borda 1px #0a0a0a, placeholder #6b6b6b, focus `ring 2px #ffb900`, erro borda #cc1f1f.

### Badges/Chips
- 0px, Sora 800 uppercase 0.7rem, padding 4px 8px. Default amarelo, active preto/branco, inactive branco/borda.

### Header
- Branco `bg-white border-b border-[#e5e5e5] h-16`, logo preto, nav Sora 800 uppercase 13px #0a0a0a, CTA amarelo 0px.

### Footer
- Branco com borda superior 1px #e5e5e5, texto #6b6b6b, títulos Sora amarelo #ffb900 pontual, nada de footer preto pesado antigo.

## 6. Do's and Don'ts — Blog Moderno

Do:
- Branco dominante, amarelo pontual ≤10%.
- Híbrido 0px botões / 12px cards.
- Espaço generoso e hierarquia forte — leitura agradável é P0.
- Foto grande 4:3 em todo card.
- IA visível como cards editáveis claros, não modal escuro.

Don't:
- Amarelo como fundo de seção.
- Tudo 0px quadrado pesado (era Estapar).
- Fundo cream/bege, gradient text, glass, sombra 16px+ com borda.
- Eyebrow em cada seção, `01/02`, cards idênticos.
- Texto cinza claro sobre branco (<4.5:1).
