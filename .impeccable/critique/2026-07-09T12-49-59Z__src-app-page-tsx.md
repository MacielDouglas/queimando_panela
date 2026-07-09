---
target: homepage (src/app/page.tsx)
total_score: 27
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-07-09T12-49-59Z
slug: src-app-page-tsx
---
### AI Slop Verdict: 2/4

### Nielsen Heuristics Scores

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading states not visible; sections render null with no placeholder |
| 2 | Match System / Real World | 4 | Excellent Portuguese copy, kitchen-domain language throughout |
| 3 | User Control and Freedom | 3 | Standard navigation; no undo needed on landing page |
| 4 | Consistency and Standards | 2 | DESIGN.md bans patterns that code implements |
| 5 | Error Prevention | 3 | No destructive actions; missing image fallback could confuse |
| 6 | Recognition Rather Than Recall | 4 | Navigation always visible, all controls labeled |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts, no skip-to-content |
| 8 | Aesthetic and Minimalist Design | 2 | Eyebrow repetition, identical grids, OtherProjects bans |
| 9 | Error Recovery | 3 | Nothing to recover from on landing page |
| 10 | Help and Documentation | 1 | No contextual help, FAQ not discoverable |
| **Total** | | **27/40** | **Acceptable** |

### Cognitive Load: 1/8 failed (visual hierarchy)

### Strengths
1. NeuralCanvas animation — original, purposeful, emotionally warm
2. CardRecipe — follows design system, clean metadata
3. Mobile menu — production-grade Radix sheet with proper focus

### Priority Issues
- **[P1] Ubiquitous uppercase eyebrows** violate own DESIGN.md ban
- **[P1] OtherProjects uses 5+ banned AI slop patterns** (grid bg, glassmorphism, numbered markers, over-rounded corners, backdrop blur)
- **[P1] Footer rendered twice** on homepage (page.tsx + layout.tsx)
- **[P2] Identical card grids** in LatestRecipes and ClassicRecipes sections
- **[P2] Hero "Sem imagem" placeholder** is a trust-breaker on a food site
