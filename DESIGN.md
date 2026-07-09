---
name: "Queimando Panela"
description: "Comunidade para preservar e descobrir receitas caseiras, afetivas e autorais brasileiras"
colors:
  background: "oklch(0.985 0.012 85)"
  foreground: "oklch(0.24 0.02 40)"
  primary: "oklch(0.78 0.17 72)"
  primary-foreground: "oklch(0.22 0.02 40)"
  secondary: "oklch(0.96 0.015 85)"
  secondary-foreground: "oklch(0.28 0.02 40)"
  muted: "oklch(0.95 0.01 85)"
  muted-foreground: "oklch(0.5 0.02 50)"
  accent: "oklch(0.94 0.03 80)"
  accent-foreground: "oklch(0.28 0.02 40)"
  card: "oklch(1 0 0 / 0.82)"
  card-foreground: "oklch(0.24 0.02 40)"
  border: "oklch(0.9 0.015 80)"
  input: "oklch(0.9 0.015 80)"
  ring: "oklch(0.78 0.17 72)"
  destructive: "oklch(0.62 0.23 28)"
  foreground-soft: "oklch(0.38 0.02 45)"
  foreground-subtle: "oklch(0.42 0.02 45)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 2.8vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.28rem + 1.6vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.18rem + 0.8vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.18vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.75rem, 0.73rem + 0.08vw, 0.8125rem)"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
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
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "28px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "28px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "28px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "28px"
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
    height: "28px"
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
    height: "20px"
---

# Design System: Queimando Panela

## 1. Overview

**Creative North Star: "O Caderno de Receitas"**

Cada tela é uma página de caderno — manuscrita, autoral, prática. O sistema visual trata receitas como documentos vivos: têm dono, história, marcas de uso. A estética é limpa sem ser fria, afetiva sem ser piegas, direta sem ser bruta. As cores vêm da cozinha (mel queimado, barro, palha, papel amassado pelo uso), a tipografia é uma família só (Inter) escolhida pela legibilidade em qualquer luz de cozinha, e o layout prioriza o conteúdo sobre a moldura.

O Queimando Panela rejeita explicitamente o que a web de receitas se tornou: pop-ups, anúncios, navegação confusa, SEO sobre experiência. Aqui medida de "colher de pau" vale tanto quanto grama, e o visual comunica isso — sem frescura, sem fingimento.

**Key Characteristics:**
- Tipografia limpa e legível com uma família só (Inter)
- Paleta quente com âncora em mel queimado (amber), neutros que parecem papel e barro
- Cards com borda sutil (ring), não sombra pesada — como uma ficha de receita sobre a mesa
- Componentes robustos e diretos: botões com hover evidente, inputs com foco claro
- Contraste alto para leitura em tela pequena, luz ambiente ruim de cozinha

## 2. Colors: A Paleta da Cozinha

A paleta é quente sem ser genérica. Os neutros puxam para o amarelado do papel e o acinzentado do barro, não para o bege-saturado-AI. O primário é um mel queimado (amber oklch 0.78 0.17 72) que funciona como tempero: aparece em botões, badges e links, nunca mais que 10% de qualquer tela. Fundo é papel de caderno (quase branco com 0.012 de chroma), texto é tinta escura (marrom quente profundo).

### Primary
- **Mel Queimado** (oklch(0.78 0.17 72)): Botões primários, badges, links, ring de foco, acentos em geral. A cor-da-marca aplicada com moderação.

### Neutral
- **Papel de Caderno** (oklch(0.985 0.012 85)): Fundo de página. Quase branco com o mínimo de chroma para não ser frio.
- **Tinta** (oklch(0.24 0.02 40)): Texto corrido e títulos. Marrom escuro quente, não preto puro.
- **Tinta Suave** (oklch(0.38 0.02 45)): Texto de parágrafo. Leve recuo de contraste para leitura confortável.
- **Tinta Sutil** (oklch(0.42 0.02 45)): Texto de lede (destaque).
- **Barro** (oklch(0.5 0.02 50)): Texto secundário, placeholders. Suficientemente escuro para 4.5:1 contra o fundo.
- **Creme** (oklch(0.96 0.015 85)): Fundo de superfícies secundárias (tabs, badges secondary).
- **Palha** (oklch(0.95 0.01 85)): Fundo de hover, estados muted.
- **Linho** (oklch(0.9 0.015 80)): Bordas de containers e inputs.
- **Branco Ligeiro** (oklch(1 0 0 / 0.82)): Fundo de cards com transparência sutil.

### Accent
- **Trigo** (oklch(0.94 0.03 80)): Background de acentos secundários.

### Destructive
- **Vermelho Fogão** (oklch(0.62 0.23 28)): Ações destrutivas, erros. Tom vermelho profundo, não neon.

### Named Rules
**A Regra do Mel Queimado.** O primário ocupa no máximo 10% de qualquer tela. Raridade é a razão de ser — quando aparece, guia a ação.

**A Regra do Papel.** Nenhum fundo bege genérico. O chroma máximo dos neutros é 0.015; acima disso vira "tema de site de receita".

## 3. Typography

**Body/Display Font:** Inter (com fallback ui-sans-serif, system-ui, sans-serif)

**Caráter:** Uma família só, escolhida pela legibilidade em contextos reais de cozinha — tela pequena, luz mista, dedo sujo de farinha. Inter é humanista o bastante para não ser fria, técnica o bastante para não ser ornamental. O peso e o tracking fazem o trabalho de hierarquia que uma segunda família faria.

### Hierarchy
- **Display** (800, clamp(2.2rem, 1.5rem + 2.8vw, 4rem), 1.12, -0.04em): Hero da home, títulos de página. Uso exclusivo para headlines maiores.
- **Headline** (700, clamp(1.75rem, 1.28rem + 1.6vw, 2.75rem), 1.2, -0.03em): Títulos de seção na home, páginas internas.
- **Title** (700, clamp(1.375rem, 1.18rem + 0.8vw, 1.875rem), 1.25, -0.025em): Títulos de card, subtítulos de seção.
- **Body** (400, clamp(1rem, 0.96rem + 0.18vw, 1.125rem), 1.7): Texto corrido. Largura máxima 72ch. Leading generoso (1.7) para leitura em tela.
- **Label** (700, clamp(0.75rem, 0.73rem + 0.08vw, 0.8125rem), 1.45, 0.08em uppercase): Eyebrows, badges, labels de formulário, navegação.

### Named Rules
**A Regra do Caderno.** Texto de receita usa body leading 1.7 e max-width 72ch. Linhas mais curtas e arejadas = receita mais fácil de seguir.

## 4. Elevation

Sistema híbrido: containers usam camadas tonais (ring-1 com cor de foreground/10) em vez de sombras; elementos modais e tooltips usam sombras leves para destacar da superfície. Cards não têm sombra em repouso — a borda sutil (ring) define o container. Overlays de modal usam backdrop-blur e fundo preto 80% para isolar o conteúdo. O princípio é "ficha de receita sobre a mesa": a profundidade vem do empilhamento, não de sombras dramáticas.

### Shadow Vocabulary
- **Tooltip** (`box-shadow: ...` via radix-ui): Sombra leve para destacar o tooltip do conteúdo subjacente.
- **Modal** (`box-shadow`: herdado do Radix Dialog): Sombra funcional para isolar o modal.

### Named Rules
**A Regra da Mesa.** Nenhum card tem sombra em repouso. Só elementos que precisam flutuar (tooltips, modais) ganham sombra. Superfícies são planas até que a interação as levante.

## 5. Components

### Buttons
- **Forma:** Cantos suavemente arredondados (8px). Transição em todas as propriedades. Estado ativo empurra o botão 1px para baixo.
- **Primary:** Fundo Mel Queimado, texto Carvão. Hover escurece 20% (bg-primary/80).
- **Outline:** Borda Linho, fundo transparente. Hover ganha fundo input/50.
- **Secondary:** Fundo Creme, texto Couro. Hover escurece 20%.
- **Ghost:** Sem fundo, hover ganha fundo Palha.
- **Destructive:** Fundo Vermelho Fogão 10%, texto Vermelho Fogão. Hover dobra opacidade.
- **Link:** Texto Mel Queimado, sublinhado no hover.

### Inputs
- **Forma:** Cantos arredondados (8px), borda Linho, fundo input/20. Altura compacta (28px).
- **Foco:** Borda troca para Mel Queimado + ring 2px com 30% de opacidade.
- **Placeholder:** Cor Barro (testado para 4.5:1 contra o fundo).
- **Erro:** Borda e ring Vermelho Fogão.

### Cards
- **Forma:** Cantos arredondados (12px). Borda sutil via ring-1 com foreground/10. Fundo Branco Ligeiro (82% opaco) para leve transparência.
- **Padding interno:** 16px.
- **Título:** font-heading, text-sm (clamp ~0.95rem), font-medium.
- **Descrição:** cor Barro, text-xs/relaxed.

### Badges
- **Forma:** Totalmente arredondados (pill). Altura compacta (20px). Fundo Mel Queimado (default).
- **Variantes:** secondary, outline (borda Linho), destructive, ghost, link.

### Diálogos (Modal)
- **Overlay:** Fundo preto 80% com backdrop-blur sutil.
- **Conteúdo:** Cantos arredondados (16px), fundo Popover, ring-1. Aparece com fade-in + zoom-in-95.
- **Título:** font-heading, text-sm, font-medium.
- **Botão de fechar:** ghost, posicionado no canto superior direito.

### Tooltips
- **Fundo:** Tinta, texto Papel de Caderno. Cantos arredondados (8px). Seta triangular apontando para o elemento alvo.
- **Atraso:** delayDuration = 0 (aparece imediatamente no foco/hover).

### Navegação (Header)
- **Header:** Fundo branco, borda inferior Linho. Altura 72px (h-18).
- **Links header:** text-sm, font-medium, tracking 0.16em, uppercase. Cor stone-700, hover Mel Queimado, ativo Mel Queimado.
- **Logo:** QPMark (SVG 40×40) na cor Mel Queimado. Nome "QUEIMANDO PANELA" em duas linhas, uppercase, tracking 0.18em, semibold.

### Navegação (Footer)
- **Footer:** Fundo Carvão Profundo (stone-950), texto stone-100.
- **Links footer:** text-sm, stone-200, hover Mel Queimado.
- **Títulos de seção:** text-xs, font-medium, uppercase, tracking 0.2em, stone-500.

### Navegação (Mobile)
- **Sheet:** Lado direito, max-w-sm, fundo branco. Links com border-bottom, text-base, uppercase, tracking 0.14em.

## 6. Do's and Don'ts

### Do:
- **Do** usar Mel Queimado com moderação. ≤10% da tela.
- **Do** usar Papel de Caderno como fundo de página. Nunca branco puro (#fff).
- **Do** garantir contraste ≥4.5:1 para corpo de texto. Barro (#7a6e5e) sobre Papel de Caderno (#faf5ed) passa. Texto mais claro que Barro em fundo claro é proibido.
- **Do** usar Inter em todos os pesos e tamanhos. Uma família só.
- **Do** usar cards com ring-1, não com sombra. A Regra da Mesa.
- **Do** prefixar classes de componente com `ds-` quando forem para documentação/sidecar.
- **Do** priorizar acessibilidade: touch targets ≥44px, foco visível com ring Mel Queimado, reduced motion respeitado.

### Don't:
- **Don't** usar background beige/cream/sand genérico tipo "tema AI". Papel de Caderno é o único off-white permitido.
- **Don't** usar sombra em cards em repouso.
- **Don't** usar gradient text (background-clip: text + gradient). Uma cor sólida apenas.
- **Don't** usar glassmorphism decorativo.
- **Don't** usar side-stripe borders (border-left >1px colorido).
- **Don't** usar número de seção (01, 02, 03) como scaffold de landing page.
- **Don't** repetir tiny uppercase eyebrow acima de toda seção. Um kicker com voz própria é permitido; scaffolding automático não.
- **Don't** usar border-radius >16px em cards ou containers. 12px é o teto para cards; 8px para inputs e botões.
- **Don't** usar anúncios, pop-ups, ou padrões de UX que priorizam pageview sobre cozinhar — o anti-reference do TudoGostoso.
- **Don't** usar o mesmo layout de card para toda seção. Varie a apresentação.
- **Don't** usar grid backgrounds decorativos (linear-gradient simulando grid). Superfícies devem ser limpas.
- **Don't** substituir fotografia de receita por placeholders de cor sólida. Hero sem imagem é um bug.
