# Product

## Register

brand

## Users

Cozinheiros caseiros brasileiros — amadores apaixonados que cozinham por afeto, memória e cultura. Não são chefs profissionais; são pessoas que aprendem na prática, herdam receitas de família, adaptam com o que têm na despensa. Contexto de uso: cozinha doméstica, celular na mão suja de farinha, busca por "aquela receita da avó" ou vontade de registrar a própria. O job-to-be-done: **preservar e descobrir receitas que carregam história**, não apenas instruções técnicas.

## Product Purpose

Queimando Panela é uma comunidade para preservar e descobrir receitas caseiras, afetivas e autorais brasileiras. Existe porque receitas de família se perdem, sites de receita atuais priorizam SEO e anúncios sobre experiência, e não há um lugar que trate a culinária amadora brasileira com o respeito (e a leveza) que merece. Sucesso = comunidade ativa contribuindo receitas reais, usuários voltando para cozinhar (não só "salvar"), e a sensação de "aqui eu encontro receita que parece da minha mãe".

## Brand Personality

**Acolhedor, Autêntico, Sem frescura**

- *Acolhedor*: porta aberta, sem gatekeeping culinário; erro na cozinha é parte da história
- *Autêntico*: receitas reais, pessoas reais, medidas de "colher de pau" e "olhômetro" valem tanto quanto gramas
- *Sem frescura*: direto ao ponto, visual limpo, zero pop-ups, zero anúncios, zero bullshit

Emoções alvo: confiança ("essa receita funciona"), alegria ("que delícia ver isso aqui"), pertencimento ("essa também é minha cozinha").

## Anti-references

- **Sites de receita tradicionais com UX ruim** (TudoGostoso, Receitas Nestlé, etc.): excesso de anúncios, pop-ups, navegação confusa, priorizam pageviews sobre cozinhar
- **Blogs de comida genéricos / editorial clichê**: tipografia serifada "revista", layouts de blog padrão, hero-metric template, estética Pinterest sem alma
- **Padrões AI slop**: background cream/beige/sand genérico, gradient text, tiny uppercase eyebrow acima de toda section, numbered section markers (01/02/03) como scaffolding, identical card grids, glassmorphism decorativo, side-stripe borders

## Design Principles

1. **Prática o que prega** — a interface deve ser tão descomplicada quanto uma receita de "olhômetro"; zero friction entre vontade e ação
2. **Receita tem dono** — autoria visível, crédito real, história por trás do prato; não é commodity de conteúdo
3. **Cozinha não é laboratório** — medidas precisas quando importam, intuição quando não; a UI reflete essa dualidade (precisão onde ajuda, leveza onde não)
4. **Comunidade > Catálogo** — descoberta via pessoas e contextos (utensílios, ocasiões, memórias), não só taxonomia fria
5. **Acessível por princípio, não por checklist** — WCAG AAA não como obrigação legal, mas porque cozinheiro com farinha na mão, tela pequena, luz ruim da cozinha *precisa* que funcione

## Accessibility & Inclusion

WCAG 2.1 AAA — requisito legal e ético. Considerações críticas:
- **Reduced motion**: animações decorativas (canvas neural, transições de entrada) têm alternativa instantânea
- **Contraste extremo**: textos em fundos escuros/claros, estados de foco visíveis, não depender só de cor
- **Touch targets generosos**: alvos ≥44px, espaçamento para dedo sujo/úmido
- **Navegação por teclado completa**: toda ação acessível sem mouse
- **Legibilidade real**: line-length ≤75ch, leading ≥1.7, font-size fluido clamp(), sem texto cinza-claro sobre fundo claro