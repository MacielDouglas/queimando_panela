---
target: homepage (src/app/page.tsx)
total_score: 27
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-07-09T13-27-58Z
slug: src-app-page-tsx
---
⚠️ DEGRADED: single-context (spawn_agent unavailable in this session)

## AI Slop Verdict

**1/4 — Minor tells, no immediate "AI made this" reaction**

The fixes landed well. Specific improvements confirmed:
- Only 1 eyebrow remains ("Últimas receitas") — the section name, not decorative scaffolding.
- No gradient text, glassmorphism is limited to functional `backdrop-blur-sm` on dark backgrounds, no numbered markers, no side-stripe borders, no decorative grid backgrounds.
- Card grids are differentiated: LatestRecipes uses a 4-col grid with first card `lg:col-span-2`; ClassicRecipes uses a 2x2 bento layout with bordered category containers.
- Over-rounded corners are corrected (rounded-lg/xl throughout; the global `--radius: 1.25rem` isn't used aggressively).

**Remaining tell**: The body background `--background: oklch(0.985 0.012 85)` is a warm-tinted near-white (cream/sand band). The Impeccable AI Slop Detector explicitly calls this the "saturated AI default of 2026." For "acolhedor, autêntico, sem frescura," the warmth should come from accent and imagery, not body bg.

**Deterministic scan**: 3 findings — all false positives (detector's `gray-on-color` rule flagged dark text on amber-500 buttons and the selection highlight as "gray-on-color"; contrast is adequate).

**LLM assessment**: The page is clean and differentiated enough to not scream "AI-generated." The biggest remaining POV problem is the OtherProjects section, which shifts register from recipe community to developer portfolio.

## Nielsen Heuristics Scores

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | No loading skeleton during async data fetch; page renders blank until all 3 promises resolve |
| 2 | Match System / Real World | 4/4 | Portuguese, natural cooking terminology, warm register throughout |
| 3 | User Control and Freedom | 3/4 | Header nav always available; no destructive actions on this page |
| 4 | Consistency and Standards | 3/4 | Color token inconsistency (stone-* in layout vs neutral-* in sections); Inter single-family holds it together |
| 5 | Error Prevention | 3/4 | Empty states, hero/image fallbacks are excellent; no forms on this page to validate |
| 6 | Recognition Rather Than Recall | 3/4 | Recipe cards show title/time/difficulty/type; all values visible at a glance |
| 7 | Flexibility and Efficiency | 2/4 | "Ver todas" shortcut works; no search, filters, or keyboard accelerators on homepage |
| 8 | Aesthetic and Minimalist Design | 3/4 | Clean sectioning; OtherProjects is information-dense with 3 highlights + aside + callout + 2 CTAs |
| 9 | Error Recovery | 2/4 | No error boundary visible; async server component crash would blank the page |
| 10 | Help and Documentation | 1/4 | No contextual help, onboarding, or documentation accessible from homepage |
| **Total** | | **27/40** | **Acceptable** |

## Cognitive Load

**0 of 8 items failed** — Low cognitive load.

Single focus ✓ (scroll-based, one section per viewport), Chunking ✓ (bordered category containers, clear headers), Grouping ✓, Visual hierarchy ✓ (Hero → Latest → Classic → SignUp → OtherProjects), One thing at a time ✓, Minimal choices ✓ (1-2 CTAs per section, ≤4 feature cards), Working memory ✓ (no cross-section dependencies), Progressive disclosure ✓ (homepage summaries, full recipes on detail pages).

## Strengths

1. **Empty states across all data sections**: Each data-driven section (Hero fallback, LatestRecipes empty, ClassicRecipes empty) has a thoughtful, branded empty state with icon + message + context. Rare for AI-generated interfaces — this shows production thinking.

2. **Section differentiation**: No two sections look alike. Hero = full-bleed image, Latest = white grid, Classic = bordered bento, SignUp = dark + animation, OtherProjects = dark + radial gradients. The visual rhythm keeps the page from blurring.

3. **NeuralCanvas IntersectionObserver optimization**: The canvas animation pauses when off-screen via `IntersectionObserver` with `threshold: 0`. This is a real performance win that ships genuine production quality.

## Priority Issues

### [P1] OtherProjects breaks the emotional contract

**What**: The final section pivots from "your recipes, our community" to "look at this developer's portfolio." Copy: "Se você curtiu este projeto, espere até ver o resto do laboratório." The page's brand is Queimando Panela, not "Douglas Maciel's portfolio."

**Why it matters**: A first-time visitor who arrived looking for Brazilian home cooking ends the experience with "oh, this is someone's portfolio." Trust erodes, the community feels secondary.

**Fix**: Remove the portfolio pivot from the homepage. Replace with community-focused content (recent contributors, "como funciona" guide, or stats). Move the portfolio to the footer or a separate /about page.

**Suggested command**: `$impeccable distill`

### [P1] "IA" terminology creates cognitive friction for the core audience

**What**: SignUpSection features are framed around AI mechanisms: "Cada receita passa por análise com IA," "A IA cria um resumo," "Ela avalia técnica..." The word "IA" appears 4+ times.

**Why it matters**: The target audience (Brazilian home cooks 45+, phones in the kitchen) may find "AI" cold, intimidating, or irrelevant. The brand voice is "sem frescura" (no fuss) — AI jargon is the opposite of no fuss.

**Fix**: Reframe features as community benefits without mechanism. "Resumo automático da receita" instead of "A IA cria um resumo." Focus on outcome, not technology.

**Suggested command**: `$impeccable clarify`

### [P1] No error boundary for async data fetching

**What**: `page.tsx` is an async server component that awaits 3 Promises. If any fetch fails (network error, database timeout, rate limit), the entire page crashes with no fallback.

**Why it matters**: Riley (Stress Tester) would find this immediately. A user on a slow connection or during a server hiccup sees a blank error page.

**Fix**: Add `error.tsx` at the app level or wrap sections in individual error boundaries with retry affordances.

**Suggested command**: `$impeccable harden`

### [P2] Body background is warm-tinted near-white (AI default signal)

**What**: `--background: oklch(0.985 0.012 85)` is a cream/sand band that the Impeccable rules explicitly flag as the "saturated AI default of 2026."

**Why it matters**: Even with good text contrast (~10:1), the warm-tinted background reads as generic "warm brand" default. It subtly undermines the brand's authenticity.

**Fix**: Choose either (a) a true off-white at chroma 0, or (b) push toward a more distinctive background color (terracotta, deeper neutral, or the amber-50 range at higher chroma toward amber's own hue).

**Suggested command**: `$impeccable colorize`

### [P2] CardRecipe title and metadata typography too small for kitchen phone use

**What**: CardRecipe uses `text-sm` (14px) for titles and `text-xs` (12px) for time/difficulty metadata. The target user (45+, reading on a phone in the kitchen, possibly without glasses) needs larger text.

**Why it matters**: Dona Maria would squint at the recipe cards. 12px metadata is below comfortable reading size, especially on a 320-375px phone viewport where cards are already small.

**Fix**: Increase minimum metadata to 13px floor, card titles to 15px floor on mobile. Use fluid scaling via clamp() starting from larger mobile values.

**Suggested command**: `$impeccable typeset`

## Persona Red Flags

### Dona Maria (Cozinheira Caseira 45+)
- **12px metadata is illegible on a kitchen phone**: `text-xs` for time/difficulty disappears on a greasy phone screen in a bright kitchen. Needs minimum 14px body, 13px metadata.
- **"IA" is cold, not acolhedor**: "Cada receita passa por análise com IA" sounds like bureaucratic processing, not community warmth. Dona Maria wants "sua receita vai ficar linda com um resumo automático."
- **NeuralCanvas looks like "tech happening"**: The animated neural network in SignUpSection signals a tech product, not a cozy cooking community.
- **OtherProjects confusion**: Dona Maria came for recipes. Seeing a developer portfolio at the bottom of a recipe homepage is disorienting.

### Casey (Mobile User)
- **Touch targets are adequate** (min-h-12 = 48px ✓)
- **No "back to top" button**: On a long scroll page with 5 sections, Casey must thumb-scroll all the way back up to reach navigation.
- **LatestRecipes 2-col mobile grid + small text**: Recipe cards at 2 columns on 320px phone = very narrow cards. Text-overflow is handled (line-clamp-2), but images become tiny.
- **No persistent sticky nav on scroll**: Header disappears on scroll down.

### Jordan (First-Timer)
- **First impression is strong**: Hero with recipe image + clear title + CTA ✓
- **"Ver todas" link in LatestRecipes is clear** ✓
- **SignUpSection feature cards are dense**: 4 cards with icon + title + description + the "IA" badge. Jordan might feel barraged by features before understanding what the platform does.

### Riley (Stress Tester)
- **Single-recipe edge case in LatestRecipes**: If `getLatestRecipes(3)` returns exactly 1 recipe, the grid has 1 card at index 0 with `lg:col-span-2`. The grid would look unbalanced at large viewports.
- **No error boundaries**: Async component crash = blank page. Riley would find this in 30 seconds.
- **Empty states are good** ✓

## Minor Observations

- Footer uses `bg-stone-950` while sections use `bg-neutral-950`. These are nearly identical but the token inconsistency (stone vs neutral) suggests two theming conventions coexisting.
- SignUpSection feature cards use `backdrop-blur-sm` with `bg-neutral-900/70`. On dark backgrounds this is very subtle and functional — not a slop concern.
- OtherProjects CTA buttons use `min-h-12` (48px) — consistent with SignUpSection. Good.
- The `qp-mark.tsx` SVG logo is reused in Header and Footer with `size-10` and `text-amber-500` — consistent brand touch.
- NeuralCanvas connection drawing performance on low-end phones could be a concern (38 nodes, ~130 connections drawn every frame). The IntersectionObserver helps, but consider adding `devicePixelRatio` capping or limiting node count on mobile.

## Questions to Consider

1. **What if OtherProjects were replaced with community content?** A "Como funciona" guide, recent recipe authors, or community stats would preserve the recipe-focus through the entire page and eliminate the portfolio dissonance.

2. **What if the body background were a true off-white or a deeper warm neutral?** Moving from the cream/sand band to a cleaner background would eliminate the last AI default signal and make the amber accent colors pop more.

3. **What if feature copy focused on outcomes instead of technology?** Replacing "Cada receita passa por análise com IA" with "Toda receita ganha resumo automático e tabela nutricional" would serve Dona Maria without losing engineering credibility.
