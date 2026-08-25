---
name: "Queimando Panela"
description: "Comunidade para preservar e descobrir receitas caseiras, afetivas e autorais brasileiras. Light quadrado, #ffb900 restrained 10%, tipografia grotesk."
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
    lineHeight: 1.6
  label:
    fontFamily: "Sora, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  sm: "0px"
  md: "0px"
  lg: "0px"
  xl: "0px"
  full: "0px"
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
    rounded: "0px"
    padding: "14px 24px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "0px"
    padding: "14px 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.foreground}"
    textColor: "#FFFFFF"
    rounded: "0px"
    padding: "14px 24px"
    height: "48px"
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "0px"
    padding: "0px"
  input-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "0px"
    padding: "12px 16px"
    height: "48px"
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "0px"
    padding: "4px 8px"
    height: "24px"
---

# Design System: Queimando Panela

## 1. Overview — North Star: "O Caderno Queimando Panela"

Faixas amarelas, header quadrado #ffb900, grid denso, footer institucional preto, tipografia grotesk Sora em caixa alta, tudo 0px. Foto grande, categorias em chips, receita do dia, linguagem direta.

**Contrato:**
- Light sempre: fundo #FFFFFF, tinta #0a0a0a.
- Amarelo #ffb900 só onde importa: CTA, badge, faixa fina, focus. Nunca mais que 10% da tela (restrained).
- Tudo quadrado: radius 0px em buttons, cards, inputs, sheets, dialogs.
- Estrutura = faixas, densidade, ritmo institucional. Conteúdo = foto, categoria, afeto.

## 2. Colors — Restrained Queimando Panela

- **#ffb900** — Primary. CTA, badge, faixa, ring. Texto sobre amarelo é sempre #0a0a0a (7.2:1).
- **#0a0a0a** — Ink. Títulos, header/footer preto, bordas de input, botões secundários.
- **#FFFFFF** — Fundo. Cards e página.
- **#f2f2f2 / #f5f5f5** — Muted/secondary para zebra e hover.
- **#e5e5e5** — Border. Linhas finas Queimando Panela.
- **#6b6b6b** — Muted-foreground. Único cinza permitido para descrição (4.5:1 sobre branco).
- **#cc1f1f** — Destructive.

**Regra do Quadrado:** `border-radius: 0` global. Se tem curva, é bug.

**Regra do Amarelo:** Amarelo nunca como fundo de seção inteira, só faixa de 4-8px, header, ou botão. O branco respira.

## 3. Typography — Sora Grotesk + Inter

**Display / Headings:** Sora 800, uppercase, tracking -0.02 a -0.03, leading 0.95-1.0. Queimando Panela fala gritando mas com precisão.
**Body:** Inter 400, leading 1.6, max 72ch.
**Label:** Sora 800, 0.7rem, tracking 0.14em, uppercase. Usado em eyebrow, kicker, navegação.

Hierarquia bem marcada: H1 800 amarelo-preto, H2 800 preto, body Inter solto.

## 4. Layout — Queimando Panela Grid

- **Container:** `w-[min(100%-1.5rem,84rem)]` centralizado. Respiro curto nas laterais (1.5rem) como Queimando Panela.
- **Grid Queimando Panela:** `repeat(auto-fit, minmax(280px,1fr))` para cards. Lista de receitas 3 colunas no desktop, 2 no tablet, 1 no mobile.
- **Faixas Queimando Panela:** cada seção começa com faixa amarela de 6px no topo (`border-t-[6px] border-[#ffb900]`) ou bloco amarelo lateral de 4px.
- **Header:** 64px, #ffb900, borda inferior preta 1px, navegação Sora 800 uppercase, CTA preto.
- **Footer:** preto #0a0a0a, texto #FFFFFF, faixas amarelas finas, grid 3 colunas Queimando Panela institucional.

## 5. Components — Quadrado Queimando Panela

### Buttons
- 0px, 48px altura, Sora 800 uppercase tracking 0.08em.
- Primary: #ffb900 + #0a0a0a, hover #e6a700.
- Secondary: #0a0a0a + branco, hover #1a1a1a.
- Outline: borda 1px #0a0a0a, hover fundo #0a0a0a texto branco.

### Cards — Queimando Panela quadrada
- 0px, borda 1px #e5e5e5, sem sombra, imagem 4:3 quadrada, sem radius na imagem.
- Faixa amarela 4px no topo do card (Queimando Panela).
- Título Sora 700 uppercase, descrição Inter cinza #6b6b6b.

### Inputs
- 0px, borda 1px #0a0a0a, fundo branco, placeholder #6b6b6b, focus ring #ffb900 2px.

### Badges/Chips — Queimando Panela quadrado
- 0px, padding 4px 8px, Sora 800 uppercase 0.7rem.
- Default: #ffb900 + preto. Active: preto + branco. Inactive: branco + borda #e5e5e5.

### Header
- `bg-[#ffb900] border-b border-[#0a0a0a] h-16`, logo preto, nav Sora uppercase 13px, CTA preto quadrado 48px.

### Footer
- `bg-[#0a0a0a] text-white`, colunas com título Sora uppercase amarelo #ffb900, links branco 14px, hover #ffb900.

## 6. Do's and Don'ts — Queimando Panela

Do:
- Tudo 0px.
- Amarelo só onde converte.
- Foto grande quadrada (4:3) em todo card — sem placeholder colorido.
- Faixa amarela de 4-6px para separar seções (DNA Queimando Panela).
- Sora uppercase para títulos, Inter para leitura.

Don't:
- Nenhum rounded >0.
- Nenhum fundo creme/bege — só #FFFFFF.
- Nenhum gradient, glass, sombra suave >8px.
- Nenhum eyebrow minúsculo em cada seção — só um kicker Sora amarelo quando faz sentido.
- Nenhum card com sombra em repouso — só borda #e5e5e5.
