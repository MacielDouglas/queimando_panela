---
target: homepage (src/app/page.tsx)
total_score: 27
p0_count: 0
p1_count: 3
timestamp: 2026-07-09T12-55-11Z
slug: src-app-page-tsx
---
### AI Slop Verdict: 2/4 — Borderline. The site avoids the worst AI tells (cream/beige bg, gradient text, side-stripe borders) but falls into others: repeated uppercase eyebrows above every section, identical card grids in Latest/Classic sections, and OtherProjects section which packs 5+ banned patterns.

### Nielsen Heuristics Scores

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading states not visible; sections render null with no placeholder |
| 2 | Match System / Real World | 4 | Excellent Portuguese copy, kitchen-domain language throughout |
| 3 | User Control and Freedom | 3 | Standard navigation; no undo needed on landing page |
| 4 | Consistency and Standards | 2 | code implements patterns that DESIGN.md bans |
| 5 | Error Prevention | 3 | No destructive actions; missing image fallback could confuse |
| 6 | Recognition Rather Than Recall | 4 | Navigation always visible, all controls labeled |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts, no skip-to-content |
| 8 | Aesthetic and Minimalist Design | 2 | Eyebrow repetition, identical grids, OtherProjects bans |
| 9 | Error Recovery | 3 | Nothing to recover from on landing page |
| 10 | Help and Documentation | 1 | No contextual help, FAQ not discoverable |
| **Total** | | **27/40** | **Acceptable** |

### Cognitive Load: 1/8 failed — visual hierarchy suffers from uniform section headers.

### Strengths
1. **NeuralCanvas animation** on SignUpSection — original, purposeful, emotionally warm. One of the few genuinely bespoke visual elements.
2. **CardRecipe component** — follows design system, clean metadata layout, good responsive grid.
3. **Mobile menu** — production-grade Radix sheet with proper focus management and aria labels.

### Priority Issues

**[P1] Ubiquitous uppercase eyebrows** violate the DESIGN.md ban ("Don't repeat tiny uppercase eyebrow above every section"). Every section (Latest, Classic, SignUp, OtherProjects) has the same kicker pattern (text-[11px] tracking-[0.18em] uppercase amber-700). The spec allows one named kicker as brand voice; this feels like AI scaffolding.
- **Fix:** Remove eyebrows from 3 of 4 sections; keep only one as brand signature.
- **Suggested:** $impeccable quieter

**[P1] OtherProjects section** uses 5+ banned anti-patterns from DESIGN.md and the Impeccable skill: decorative grid background (linear-gradient grid), glassmorphism decorativo (backdrop-blur-sm on cards), numbered markers (01/02/03), border-radius 24px+ (rounded-2xl = 16px, rounded-3xl = 24px), and dasboard border (border-dashed). This section contradicts the brand's "sem frescura" voice.
- **Fix:** Strip all decorative patterns. Use solid backgrounds, flat cards, no numbered markers.
- **Suggested:** $impeccable quieter OtherProjects

**[P1] Duplicate footer** — page.tsx imports and renders <Footer />, and layout.tsx also renders <Footer />. The homepage will show two stacked footers. Functional bug.
- **Fix:** Remove <Footer /> from page.tsx (layout already handles it).
- **Suggested:** manual edit (1-line removal)

**[P2] Identical card grids** in LatestRecipesSection and ClassicRecipesSection — same 4-column grid, same CardRecipe component, same layout. No visual distinction between "latest" and "classic" beyond the heading.
- **Fix:** Vary presentation: Latest could be horizontal scroll on mobile; Classic could be a 2x2 matrix with category labels as section headers.
- **Suggested:** $impeccable layout

**[P2] Hero "Sem imagem" placeholder** — when a recipe has no cover image, the hero shows a solid gray div with "Sem imagem" text. On a food site, this is a trust-breaker and makes the hero look broken.
- **Fix:** Generate a food-themed SVG fallback or use a default pattern. Never show "Sem imagem" in the hero.
- **Suggested:** $impeccable harden

### Persona Red Flags

**Jordan (First-Timer):** No contextual help, FAQ not discoverable. Hero CTA leads to recipe detail, not an obvious "start here" path. The section flow (hero → latest → classic → signup → other projects) feels like a portfolio, not a community.

**Casey (Mobile User):** Good touch targets (min-h-12 on CTAs). But header logo + uppercase brand text is small (text-sm) and hard to read at a glance with flour-covered fingers. The hero badge with backdrop-blur may not render on all mobile browsers.

**Riley (Stress Tester):** Empty states are silent (return null with no placeholder). If getLatestRecipes(3) returns 0, the section disappears completely — no "Ainda não há receitas" empty state. Same for ClassicRecipes and featuredRecipe.

**Dona Maria (Cozinheira Caseira):** The uppercase tracking-heavy nav (HOME, RECEITAS, FAVORITOS, SOBRE) reads as formal, not acolhedor. The "Ver todas" / "Ver receitas primeiro" CTAs use English-influenced Portuguese ("Ver todas" for recipes is correct but the overall UX copy could be warmer: "Que tal dar uma olhada?"). The neural canvas animation is beautiful but doesn't communicate "cozinha" to a 45+ home cook — it reads as "tech".

### Minor Observations
- Header uses g-white and order-stone-200 while the design system specifies g-background (Papel de Caderno). Inconsistency.
- g-stone-50 in layout.tsx body vs g-background in page.tsx main — two different off-whites.
- NeuralCanvas paint loop runs even when not in viewport; no intersection observer to pause.
- The "Ver todas" link in LatestRecipesSection has no aria-label; screen readers just say "link Ver todas".

### Questions to Consider
1. **"OtherProjects" é uma seção de portfolio em um site de comida.** A presença do desenvolvedor é relevante para o produto ou distrai do propósito comunitário? Se for intencional, precisa de um tratamento visual mais coeso com o resto.
2. **O hero depende de uma receita aleatória.** Se não houver receitas cadastradas, a homepage fica vazia. Vale a pena ter um hero estático de fallback?
3. **A identidade visual é afetiva e acolhedora, mas o sistema de grid e eyebrows é repetitivo e frio.** O layout comunica "portfólio de dev" mais do que "comunidade de cozinha" — isso é intencional?
