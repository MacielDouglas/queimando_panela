import {
  ArrowRight,
  ChefHat,
  ClipboardCheck,
  Clock3,
  Flame,
  Lightbulb,
  PenLine,
  Quote,
  Search,
  Sparkles,
  Star,
  Table2,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { NewsletterForm } from "@/components/landing/newsletter-form";
import { RecipeCard } from "@/components/landing/recipe-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { classicRecipes, featuredRecipe, latestRecipes } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-[#FFFCF5]/80 backdrop-blur supports-[backdrop-filter]:bg-[#FFFCF5]/70">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
              <Flame className="size-5" />
            </span>
            <span className="font-display text-[18px] font-bold leading-none tracking-tight">
              Queimando Panela
              <span className="block text-[11px] font-sans font-medium tracking-widest text-orange-600/80">
                COMUNIDADE & SABOR
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
            <a href="#destaque" className="hover:text-zinc-900">
              Destaque
            </a>
            <a href="#ultimas" className="hover:text-zinc-900">
              Últimas
            </a>
            <a href="#classicas" className="hover:text-zinc-900">
              Clássicas
            </a>
            <a href="#ia" className="hover:text-zinc-900">
              Análise IA
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
              Entrar
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-zinc-900 px-5 font-semibold text-white hover:bg-zinc-800"
            >
              Enviar receita <ArrowRight className="hidden size-4 sm:inline" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50 via-orange-50/60 to-[#FFFCF5]" />
        <div className="absolute -top-28 left-1/2 -z-10 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-200/40 via-amber-100/50 to-transparent blur-3xl" />
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-16">
          <div>
            <Badge className="mb-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200">
              <Sparkles className="mr-1 size-3.5 text-amber-500" /> Novo: análise completa por IA em
              segundos
            </Badge>
            <h1 className="font-display text-balance text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl md:text-[52px]">
              A cozinha é{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                melhor
              </span>{" "}
              quando a gente divide.
            </h1>
            <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg">
              O <strong className="font-semibold text-zinc-900">Queimando Panela</strong> é o blog
              comunitário para cozinheiros amadores. Compartilhe sua receita do jeitinho que saiu da
              panela — a nossa IA cuida do resto: corrige, organiza, calcula e deixa irresistível.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="rounded-full bg-orange-600 px-7 text-[15px] font-bold hover:bg-orange-700"
              >
                Publicar minha receita agora
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-zinc-200 bg-white px-6"
              >
                <Search className="size-4" /> Explorar receitas
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-zinc-700">
                <span className="flex -space-x-2">
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-amber-200 text-xs font-bold text-amber-900">
                    A
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-orange-200 text-xs font-bold text-orange-900">
                    B
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-xs font-bold text-white">
                    +2k
                  </span>
                </span>
                2.400+ cozinheiros já queimaram panela por aqui
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600">
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <Star className="size-4 fill-amber-500/50 text-amber-500" />
                <span className="ml-1 text-xs font-semibold text-zinc-700">
                  4,8/5 na comunidade
                </span>
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-[520px]">
              {[
                { k: "+3.200", l: "receitas publicadas" },
                { k: "38 mil", l: "comentários trocados" },
                { k: "100%", l: "com análise de IA" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-orange-100 bg-white px-3 py-3 text-center shadow-sm"
                >
                  <div className="font-display text-xl font-extrabold leading-none text-zinc-900">
                    {s.k}
                  </div>
                  <div className="mt-1 text-xs font-medium leading-tight text-zinc-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* collage / destaque visual */}
          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="relative rounded-[28px] border border-orange-100 bg-white p-3 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-frutas.jpg"
                alt="Mesa com pratos variados"
                className="aspect-[4/3.2] w-full rounded-2xl object-cover"
              />
              <Card className="absolute -bottom-4 -left-2 max-w-[260px] rounded-2xl border-orange-100 bg-white p-0 shadow-xl sm:-left-6">
                <CardContent className="flex gap-3 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ClipboardCheck className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                      Corrigida pela IA
                    </p>
                    <p className="text-sm font-semibold leading-tight">
                      “Leite de coco fresco” — ponto perfeito, sem talhar
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      + tabela nutricional • utensílios • substituições
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -right-2 -top-2 flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-xs font-bold text-white shadow-lg sm:-right-4">
                <Sparkles className="size-4 text-amber-400" /> Análise em 12s
              </div>
            </div>
            <p className="mt-8 text-center text-xs font-medium text-zinc-500">
              Sem perfeccionismo. Aqui a graça é compartilhar o que deu certo — e o que quase
              queimou.
            </p>
          </div>
        </div>
      </section>

      {/* RECEITA EM DESTAQUE */}
      <section id="destaque" className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
              <span className="size-1.5 rounded-full bg-orange-600" /> Receita em destaque da semana
            </div>
            <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              A panela que está bombando
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
          >
            Ver todas <ArrowRight className="size-4" />
          </Link>
        </div>

        <Card className="overflow-hidden rounded-[28px] border-orange-100 bg-white p-0 shadow-sm">
          <div className="grid md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[360px] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredRecipe.image}
                alt={featuredRecipe.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <Badge className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-900">
                  🔥 Escolha da comunidade
                </Badge>
                <Badge variant="secondary" className="rounded-full bg-zinc-900 text-white">
                  IA verificada ✓
                </Badge>
              </div>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 pt-10 text-white">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                    <Clock3 className="size-3.5" /> {featuredRecipe.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                    <Users className="size-3.5" /> {featuredRecipe.servings}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                    <ChefHat className="size-3.5" /> {featuredRecipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                  {featuredRecipe.category} • por Marina Queiroz
                </p>
                <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-[28px]">
                  {featuredRecipe.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-zinc-600">
                  {featuredRecipe.description}
                </p>
                <div className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100">
                  <Quote className="mt-0.5 size-5 shrink-0 text-amber-600" />
                  <p className="text-sm italic leading-relaxed text-amber-950">
                    “Arrebatadora: o dendê abraça o coco, o tomate traz frescor e a tilápia fica num
                    ponto que desmancha na colher. De comer rezando — com farofinha, então…”
                  </p>
                </div>
              </div>

              {/* mini tabela nutricional */}
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                  <Table2 className="size-4" /> Tabela por 100g (gerada pela IA)
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    { v: "238", l: "kcal" },
                    { v: featuredRecipe.aiNutrition?.proteina ?? "18g", l: "proteína" },
                    { v: featuredRecipe.aiNutrition?.carbo ?? "7g", l: "carbo" },
                    { v: featuredRecipe.aiNutrition?.gordura ?? "14g", l: "gordura" },
                  ].map((c) => (
                    <div key={c.l} className="rounded-xl bg-white px-2 py-2.5 shadow-sm">
                      <div className="text-sm font-extrabold leading-none">{c.v}</div>
                      <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                        {c.l}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-center text-[11px] text-zinc-500">
                  Utensílios detectados: panela de barro, colher de pau, frigideira, tábua •
                  Correção ortográfica aplicada
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="rounded-full bg-orange-600 font-bold hover:bg-orange-700">
                  Ver receita completa
                </Button>
                <Button variant="outline" className="rounded-full">
                  Ver análise da IA
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* ÚLTIMAS RECEITAS */}
      <section id="ultimas" className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Últimas da panela
            </h2>
            <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-zinc-600">
              Direto do fogo para o feed. Receitas reais, testadas em cozinha de verdade — com todos
              os perrengues e truques.
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full">
            Ver feed completo
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestRecipes.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      </section>

      {/* CLÁSSICAS */}
      <section
        id="classicas"
        className="border-y border-orange-100 bg-gradient-to-b from-white to-amber-50/60"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="rounded-full bg-amber-100 px-3 py-1 text-amber-900"
            >
              Acervo afetivo
            </Badge>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Receitas clássicas que nunca queimam
            </h2>
            <p className="mx-auto mt-3 max-w-[58ch] text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base">
              Aqueles clássicos que atravessam gerações. Já vêm com análise de IA caprichada, dicas
              de ponto e histórias da comunidade — é só escolher e repetir em casa.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {classicRecipes.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="hidden size-8 items-center justify-center rounded-full bg-amber-100 sm:flex">
              👩‍🍳
            </span>
            <p className="text-center leading-relaxed text-zinc-700">
              <strong>Sugestão da semana:</strong> faça o trio{" "}
              <em>Arroz de Coco + Moqueca + Farofa de Castanha</em> — combinação validada pela IA
              com equilíbrio perfeito de sabor e textura.
            </p>
          </div>
        </div>
      </section>

      {/* ANÁLISE DE IA */}
      <section id="ia" className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="lg:sticky lg:top-[84px]">
            <Badge className="rounded-full bg-zinc-900 px-3 py-1 text-white">
              <Sparkles className="mr-1 size-3.5 text-amber-400" /> O diferencial
            </Badge>
            <h2 className="font-display mt-3 text-balance text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
              Você manda do seu jeito. <br />
              <span className="text-orange-600">A IA deixa impecável.</span>
            </h2>
            <p className="mt-3 max-w-[48ch] text-pretty text-[15px] leading-relaxed text-zinc-600">
              Chega de receita com ingrediente faltando ou instrução confusa. Nossa inteligência
              artificial lê o nome, os ingredientes e o modo de preparo e devolve uma receita
              redonda — pronta para publicar e para cozinhar.
            </p>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Como funciona na prática
              </p>
              <div className="mt-3 space-y-2 font-mono text-xs leading-relaxed">
                <div className="rounded-xl bg-zinc-900 px-3 py-2.5 text-zinc-100">
                  <span className="text-zinc-400">você envia →</span> “Strogonof de frango da minha
                  mãe, com creme de leite e champignon”
                </div>
                <div className="flex items-center justify-center py-1 text-zinc-400">
                  ↓ IA analisa em segundos
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-900">
                  ✓ Utensílios, correção, nutrição/100g, substituições e texto apetitoso gerados
                </div>
              </div>
              <Button className="mt-4 w-full rounded-full bg-zinc-900 font-bold">
                Testar com minha receita — é grátis
              </Button>
              <p className="mt-2 text-center text-xs text-zinc-500">
                Sem cartão. Publicação só quando você aprovar.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                icon: UtensilsCrossed,
                title: "Identifica utensílios automaticamente",
                desc: "Panela, frigideira, forno, batedeira, peneira… a IA lista tudo que você vai precisar antes mesmo de começar — sem susto no meio da receita.",
                color: "bg-orange-100 text-orange-700",
              },
              {
                icon: PenLine,
                title: "Corrige português e organiza o texto",
                desc: "Erros de digitação, concordância e medidas confusas são corrigidos. Ingredientes padronizados (g, ml, xíc.) e modo de preparo em passos claros.",
                color: "bg-sky-100 text-sky-700",
              },
              {
                icon: Search,
                title: "Reconhece cada ingrediente",
                desc: "Detecta e normaliza ingredientes, quantidades e unidades. ‘Uma pitada’, ‘1 xíc.’, ‘a gosto’ — tudo entendido e catalogado.",
                color: "bg-amber-100 text-amber-700",
              },
              {
                icon: Table2,
                title: "Tabela nutricional por 100g",
                desc: "Cálculo estimado de calorias, proteínas, carboidratos, gorduras, fibras e sódio — com base na composição real da sua receita. Transparência total.",
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                icon: Lightbulb,
                title: "Sugestões de combinações e substituições",
                desc: "‘Sem lactose? Troque por…’ • ‘Combina com vinho branco seco e salada cítrica’ • ‘Falta coentro? Use salsinha + cominho’. Ideias que salvam o jantar.",
                color: "bg-violet-100 text-violet-700",
              },
              {
                icon: Sparkles,
                title: "Texto apetitoso que dá água na boca",
                desc: "Um parágrafo envolvente, em português natural e apetitoso, para abrir sua receita — digno de capa de livro. Feito para compartilhar e dar vontade de cozinhar.",
                color: "bg-rose-100 text-rose-700",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="rounded-2xl border-zinc-200 bg-white p-0 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="flex gap-4 p-5">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-8 overflow-hidden rounded-2xl border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-0">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="font-display text-lg font-bold leading-tight">
                Pronto para ver sua receita brilhar?
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Cole os ingredientes agora e veja a mágica acontecer — leva menos de um minuto.
              </p>
            </div>
            <Button
              size="lg"
              className="shrink-0 rounded-full bg-orange-600 px-7 font-bold hover:bg-orange-700"
            >
              Enviar receita para análise <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* CTA + FOOTER */}
      <footer className="mt-auto border-t border-zinc-200 bg-zinc-950 text-zinc-300">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                  <Flame className="size-5" />
                </span>
                <span className="font-display text-lg font-bold leading-none text-white">
                  Queimando Panela
                  <span className="block font-sans text-[11px] font-medium tracking-widest text-zinc-400">
                    COMUNIDADE & SABOR
                  </span>
                </span>
              </div>
              <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-zinc-400">
                Blog comunitário de receitas com alma. Aqui a gente celebra o improviso, compartilha
                o que deu certo e aprende junto — com uma ajudinha deliciosa da IA.
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold hover:bg-white/15"
                >
                  IG
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold hover:bg-white/15"
                >
                  TK
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold hover:bg-white/15"
                >
                  YT
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Explorar</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>
                  <a href="#destaque" className="hover:text-white">
                    Receita em destaque
                  </a>
                </li>
                <li>
                  <a href="#ultimas" className="hover:text-white">
                    Últimas receitas
                  </a>
                </li>
                <li>
                  <a href="#classicas" className="hover:text-white">
                    Clássicas
                  </a>
                </li>
                <li>
                  <a href="#ia" className="hover:text-white">
                    Análise de IA
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Comunidade</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Enviar receita
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Ranking de cozinheiros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Comentários recentes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Guia de boas práticas
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Fique por dentro</h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Receba 1 e-mail por semana com as receitas mais comentadas e dicas da IA.
              </p>
              <NewsletterForm />
              <p className="mt-2 text-xs text-zinc-500">Sem spam. Cancele quando quiser.</p>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col gap-3 text-xs leading-relaxed text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Queimando Panela. Feito com 🔥 por quem ama comer bem.
              Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-zinc-300">
                Privacidade
              </a>
              <a href="#" className="hover:text-zinc-300">
                Termos
              </a>
              <a href="#" className="hover:text-zinc-300">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
