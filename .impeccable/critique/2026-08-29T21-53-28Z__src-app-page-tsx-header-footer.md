---
target: home + header + footer
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-08-29T21-53-28Z
slug: src-app-page-tsx-header-footer
---
# Critique — Home + Header + Footer — Queimando Panela (pós-fix)

Method: dual-agent (A: ses_fb07ea478ffe5Ob6YeLNhRJlWX · B: ses_fb07dc073ffeiqrRgIskiLSf3G)
Slug: src-app-page-tsx-header-footer
Data: 2026-08-29 (pós-fix epirus→queimando-panela + document + polish + clarify)

## Design Health Score — 30/40 — Good

| # | Heurística | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Dots agora 44px + `role tablist / aria-selected` (`LatestRecipesSection.tsx:129-143`) e `aria-current` no nav (`nav-links.tsx:44`), mas falta status da publicação IA (pending) |
| 2 | Match System / Real World | 4 | Voz "olhômetro e grama", "arroz, feijoada, moqueca" (`CategoriesSection.tsx:7`) mapeia cozinha real — sólido |
| 3 | User Control and Freedom | 3 | Header sticky + `SheetClose` no mobile (`mobile-menu.tsx:45`) e dots voltam sem reload; falta swipe/arrow keys no Latest |
| 4 | Consistency and Standards | 4 | Tokens `var(--forest)/--accent-e/--cream` consistentes, botões pill 999px homogêneos (`globals.css:258-278`) |
| 5 | Error Prevention | 2 | Copy "IA confere antes de ir ao ar" (`HeroSection.tsx:22`) previne, mas Home sem preview de rascunho editável para calibrar expectativa |
| 6 | Recognition Rather Than Recall | 3 | Categorias com foto grande reduzem memória; remoção de 01/02 evita memorização de ordem arbitrária |
| 7 | Flexibility and Efficiency | 2 | Nav 4 itens ok, mas sem busca/filtro por tempo/utensílio e Latest exige clique sequencial sem swipe |
| 8 | Aesthetic and Minimalist Design | 4 | De 6 eyebrows → 2, sem 01/02, sem ghost-card — densidade caiu drasticamente (`page.tsx:34-41`) |
| 9 | Error Recovery | 2 | Empty states existem (`RecipesSection.tsx:15` / `LatestRecipesSection.tsx:15`) mas passivos, sem CTA "Seja o primeiro a publicar" |
| 10 | Help and Documentation | 3 | "IA confere utensílios, nutrição, tempo e categoria" (`CtaSection.tsx:26`) explica pós-clique, mas falta link "Como funciona" |
| **Total** | | **30/40** | **Good — Address weak areas, solid foundation (vs 16/40 Poor antes)** |

Evolução: 16 → 30 (+14 pontos). P0s zerados, base para ship.

## Anti-Patterns Verdict — PASSOU: não parece mais AI slop

**LLM assessment: AI slop corrigido 90% — de 7.8/10 alto para ~2/10 leve**
Antes: eyebrow factory 6/7 + 01/02 + cream translúcido + CTA full amarelo como anti-reference. Agora:

- **Eyebrow** 2/7 apenas (`HeroSection.tsx:9` "Feito por quem cozinha" + `ValuesSection.tsx:28` "Nosso compromisso") — cumpre `DESIGN.md:166` `The Eyebrow Pontual Rule` (`globals.css:217-235`). Três seções limpas: `IntroSection.tsx`, `CategoriesSection.tsx`, `RecipesSection.tsx`/`LatestRecipesSection.tsx` sem eyebrow.
- **01/02 removido** — `ValuesSection.tsx:1-19` sem números, grid `1fr` + `gap 6px` (`ValuesSection.tsx:54`) — sem scaffolding.
- **Tokens documentados** — `DESIGN.md:5-27` cobre `#fffdf7/#ffc733/#183a37/#102c2a/#d9dfc9` e `rounded 14/18/28/22/9999`; `globals.css:82-94` sem `var(--white)` fantasma, sem `epirus`.
- **Tipografia** Playfair 700 + DM Sans 400 com `text-wrap: balance` (`globals.css:139-141`) — contraste editorial real, não Inter/Sora genérico.
- **Decoração** — Categories `border 1px var(--line)` sem shadow, Recipes `shadow 0 10px 30px` sem border — cumpre `The Sem-Borda-Pesada Rule` (`DESIGN.md:177`). Sem gradient text, sem glass, sem border-left.
- **Resíduo leve**: `HeroSection.tsx:93` blob `46% 46% 22px 22px` + badge `rotate 10deg` é signature documentada (`DESIGN.md:193`), não slop. Único alerta é copy genérico em `ValuesSection.tsx:43-46`.

**Deterministic scan: 0 findings — CLEAN (`[]`, exit 0)**
`node .agents/skills/impeccable/scripts/detect.mjs --json src/app/page.tsx src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/home src/app/globals.css` → 0 error / 0 warning / 0 advisory.

Por que 0 não é milagre: DESIGN.md foi atualizado para documentar o que antes era drift. `forest-dark #102c2a` (`Footer.tsx:30`), `sage #d9dfc9` (`HeroSection.tsx:94`), `rounded 14px/22px` (`IntroSection.tsx:26` / `HeroSection.tsx:93`) agora são tokens explícitos (`DESIGN.md:23-27,58-62`). Antes esses 5 eram advisories; agora são sistema. `0` prova convergência código↔DESIGN, não perfeição UX.

O detector não avalia copy, ritmo, IA como prova visual ou layout em `375/768/1180px` — por isso o LLM ainda aponta P1/P2.

**Visual overlays:** não executado (sem `live-server`/`next dev` neste contexto). Fallback: leitura estática + cálculo de contraste (`#52606d/#fffdf7 6.35:1 AA`, `#1f2933/#ffc733 9.4:1`, `#fff/#183a37 12.3:1`). Recomendado `npm run dev` + screenshots `320/768/1180/1440` + Lighthouse antes de merge.

## Overall Impression
De template gourmet genérico para revista de cozinha crível. A correção cirúrgica de eyebrow + scaffolding devolveu credibilidade editorial; agora o problema é substância (copy Values + Latest assimétrico) não sistema. Maior oportunidade: provar a IA com um mini-card "3 panelas · 420 kcal · 45 min" na Home e tornar o Latest um feed vivo com peek, não vitrine única.

## What's Working
1. **Correção de AI slop → credibilidade editorial** — eyebrow 2/7 + remoção 01/02 + Playfair/DM + cream dominante elevaram de template para revista. Regra `Eyebrow Pontual` cumprida é o maior ganho (`HeroSection.tsx:9`, `ValuesSection.tsx:28`, `globals.css:217`).
2. **Sistema restrained coeso** — amarelo `#ffc733` só em pill/badge/faixa 2px, forest `#183a37` âncora, `18px/28px/9999px` e `editorial-container 1180px` criam marca híbrida acolhedora. CTA amarelo como exceção pontual funciona (`CtaSection.tsx:11`).
3. **IA como co-piloto visível e acessível** — copy IA em 3 seções com verbo "confere" + "3 minutos" (`HeroSection.tsx:22`, `IntroSection.tsx:52`, `CtaSection.tsx:26`) + dots `44px` + `role tablist/aria-selected` + `prefers-reduced-motion` (`LatestRecipesSection.tsx:138-143`, `globals.css:195-203`) — Inteligente+Acolhedor sem intimidar.

## Priority Issues

### [P1] LatestRecipesSection assimétrico e vazio cognitivo
- **What:** `LatestRecipesSection.tsx:37-52` grid `1.1fr/0.9fr` deixa coluna esquerda com h2 + 1 frase + "Ver todas" flutuando ~300px de vazio; card único à direita esconde que há 6 receitas (só dots indicam).
- **Why it matters:** Reduz descoberta e sensação de comunidade viva; Casey cético acha que só há 1 receita.
- **Fix:** Mostrar peek de 2 cards empilhados ou carrossel com snap+drag; mover contador `01/06` para junto do h2 e adicionar "6 novas esta semana"; garantir swipe + arrow keys (`aria-controls`).
- **Suggested command:** `$impeccable layout` + `$impeccable polish`

### [P1] Copy Values genérico quebra brand Inteligente/Acolhedor
- **What:** `ValuesSection.tsx:40-47` "saboreie as tortas salgadas, o orgulho da culinária caseira. Aproveite o café da manhã, uma fonte atemporal de energia." — filler vago, desconexo de "Menos artifícios" e sem IA/dono/história.
- **Why it matters:** Pico emocional negativo no meio da jornada; Jordan desconecta.
- **Fix:** Substituir por 2 frases específicas + prova: "Cada receita mostra autor, história e medidas de olhômetro validadas pela IA — você publica sabendo que vai dar certo." Manter 3 valores com verbo concreto (Contar/Testar/Publicar).
- **Suggested command:** `$impeccable clarify`

### [P2] Header nav active pouco perceptível + header translúcido sobre hero claro
- **What:** `nav-links.tsx:47-48` active = só `text #183a37` vs `#52606d` (2.1:1) sem underline/weight; `Header.tsx:12-16` `rgba(255,253,247,0.9)` + `backdrop-blur` sobre foto hero clara pode cair <4.5:1.
- **Why it matters:** Sam (30-55) perde "onde estou"; falha WCAG 1.4.11.
- **Fix:** Adicionar `underline 2px #ffc733` ou pill sutil no active (como mobile), testar `shadow 1px` quando scrolled, active `font-weight 700`.
- **Suggested command:** `$impeccable polish`

### [P2] Intro card flutuante com overflow negativo em mobile
- **What:** `IntroSection.tsx:23-44` card `absolute right-[-28px] bottom 34px` escapa do container em `375-768px` quando grid vira coluna única; `aspect 1/1.06` deixa espaço branco excessivo em mobile.
- **Why it matters:** Quebra "Claro, limpo, com bom respiro" no celular — persona principal usa tablet na cozinha.
- **Fix:** Em `<lg` tornar card `static` abaixo da imagem (`right-0`) ou `translate-x`; reduzir aspect para `4/3` em `<1024`.
- **Suggested command:** `$impeccable adapt` + `$impeccable layout`

### [P2] Footer linha final sem links + token órfão
- **What:** `Footer.tsx:30` bg `#102c2a` hardcoded vs `DESIGN.md:23` `forest-dark`; `Footer.tsx:128-137` linha "Política de privacidade · Termos de uso" é `span` não link.
- **Why it matters:** Quebra confiança final e manutenabilidade.
- **Fix:** Criar `var(--forest-dark)` em `globals.css` e usar `var()`, transformar spans em `<Link href="/privacidade">` com `hover var(--accent-e)`.
- **Suggested command:** `$impeccable polish`

## Persona Red Flags
- **Jordan (38, cozinheira que publica):** Risco MÉDIO — vê "3 pilares" e "tortas salgadas" vagos em Values, não vê amostra de rascunho editável (utensílios/nutrição) na Home. Pode clicar em "Publicar minha receita" (`CtaSection.tsx:30`) sem saber o que a IA faz e abandonar no form.
- **Casey (45, cético em tecnologia):** Risco BAIXO-MÉDIO — Stats "100% histórias reais" (`HeroSection.tsx:45`) sem prova soa marketing; Latest com 1 card reforça "comunidade vazia". Precisa de social proof "127 receitas publicadas esta semana" perto dos stats.
- **Sam (52, leitura no tablet na cozinha):** Risco MÉDIO — DM Sans 1rem ok, mas Intro `-28px` pode gerar scroll horizontal no tablet, dots 44px ok mas sem swipe. Falta `skip-link` para pular Header sticky 78px (`Header.tsx:18`) no teclado com farinha na mão.

## Minor Observations
- `page.tsx:12` `dynamic force-dynamic` sem skeleton causa layout shift quando `classicRecipes` vazio; `RecipesSection.tsx:52` badge `#ffc733` 9.4:1 excelente.
- `auth-nav-button.tsx:55` ghost "Sair" 42px vs `button-queimando-panela` 50px desalinho 8px no Header.
- `globals.css:97` duplicação `:root` para sidebar vars — limpar; `--secondary` igual `--background` confunde semântica.
- `mobile-menu.tsx:42` SheetHeader bg `#ffc733` com QPMark forest 9.4:1 forte, mas close X pouco visível sobre amarelo.
- `CtaSection.tsx:42` imagem `hidden lg:block` — em `<1024` CTA vira bloco amarelo puro sem imagem; considerar pattern sutil mobile.

## Questions to Consider
- Se a IA é co-piloto, por que a Home mostra 0 utensílios, 0 kcal e 0 minutos reais? Um exemplo "3 panelas · 420 kcal · 45 min" não venderia mais confiança?
- Values diz "Menos artifícios. Mais sabor" — qual artifício vocês removeram? E se cada valor tivesse 1 verbo de ação ("Contar", "Testar", "Publicar")?
- Latest mostra 1 receita: e se quem acabou de publicar não se ver em 5s, sente pertencimento? Como celebrar "saiu do forno" como feed vivo?
- Header tem "Receitas, Favoritos, Sobre" mas Footer tem "Enviar receita" em Institucional — onde está a hierarquia de conversão? "Enviar receita" não deveria ser CTA outline no Header para Jordan?
