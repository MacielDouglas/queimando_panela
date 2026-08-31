import Groq from 'groq-sdk';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// ─── Types ────────────────────────────────────────────────────────────────────
type Preference = 'doce' | 'salgado' | 'tanto_faz';
type Answer = { question: string; answer: boolean };

type GenerateBody = {
  ingredients: string[];
  preference: Preference;
  answers?: Answer[];
};

// Reuse AnalyzeResult shape for recipe
type AnalyzeResult = {
  title: string;
  summary: string;
  difficulty: 'EASY' | 'EASY_MEDIUM' | 'MEDIUM' | 'MEDIUM_HARD' | 'HARD';
  difficultyLabel: string;
  types: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number | null;
  suggestions: string;
  nutritionSummary: string;
  nutritionPer100g: { nutrient: string; quantity: string }[];
  utensils: string[];
  sections: {
    name: string;
    ingredients: { originalText: string; name: string; generalName: string }[];
    modeOfPreparation: string;
  }[];
};

type AiResponse =
  | { status: 'needs_info'; questions: string[] }
  | { status: 'ready'; recipe: AnalyzeResult };

function getClientIp(h: Headers): string | null {
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null;
  return h.get('x-real-ip') ?? h.get('cf-connecting-ip') ?? null;
}

function buildGeladeiraPrompt(
  ingredients: string[],
  preference: Preference,
  answers: Answer[],
): string {
  const prefLabel =
    preference === 'doce'
      ? 'DOCE'
      : preference === 'salgado'
        ? 'SALGADO'
        : 'TANTO FAZ (doce ou salgado, escolha o que melhor combina)';

  const ingredientsList = ingredients.join(', ');
  const answersText =
    answers.length > 0
      ? answers
          .map(
            (a) =>
              `- "${a.question}" → ${a.answer ? 'SIM, tenho' : 'NÃO tenho'}`,
          )
          .join('\n')
      : '(primeira tentativa, sem respostas ainda)';

  const hasAnswers = answers.length > 0;

  return `
Você é um Chef criativo do Queimando Panela. Sua tarefa é criar uma receita deliciosa APENAS com o que o usuário tem em casa.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INGREDIENTES DISPONÍVEIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${ingredientsList}

Preferência: ${preference === 'tanto_faz' ? 'TANTO FAZ' : preference.toUpperCase()} (${prefLabel})

Respostas anteriores a perguntas (se houver):
${answersText}

${hasAnswers ? 'O usuário já respondeu às suas perguntas. AGORA VOCÊ DEVE GERAR A RECEITA FINAL, mesmo que ainda falte algum tempero básico (use substituições criativas). NÃO faça mais perguntas.' : 'Se os ingredientes forem suficientes para uma receita completa, gere a receita. Se faltarem 1-2 itens ESSENCIAIS (ex: manteiga, leite, farinha, óleo, sal), você PODE fazer até 2 perguntas de SIM/NÃO sobre itens específicos que tornariam a receita possível. Exemplo: usuário tem ovos e manjericão e quer salgado → pergunte "Você tem manteiga?" e "Você tem leite?" para sugerir ovos mexidos.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use PRIORITARIAMENTE os ingredientes listados. Pode assumir itens básicos de despensa (sal, pimenta, azeite/óleo, água) sem perguntar.
- NÃO invente ingredientes que o usuário não tem, exceto básicos. Se precisar de um item não listado e não confirmado, NÃO use.
- Se for perguntar, faça no máximo 2 perguntas, curtas, específicas, formato "Você tem X?" (ex: "Você tem manteiga?", "Você tem leite?").
- Quando gerar receita, seja criativo e divertido no título e resumo, mas mantenha precisão técnica.
- Dificuldade siga escala: EASY ≤30min ≤5 ingr., EASY_MEDIUM 30-45min, MEDIUM 45-90min, MEDIUM_HARD 90-150min, HARD >150min/técnica avançada.
- Tipos: use FUNÇÃO correta (Lanche, Café da manhã, Prato principal, Sobremesa etc). Pamonha/cuscuz = Lanche, não Prato principal.
- Modo de preparo: UM parágrafo do usuário imaginário = UM passo numerado. Gere passos curtos, cada um "N. texto" separado por \\n.
- Retorne SOMENTE JSON, sem markdown, sem emoji fora do JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO JSON — CASO FAÇA PERGUNTAS (status needs_info)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "status": "needs_info",
  "questions": ["Você tem manteiga?", "Você tem leite?"]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO JSON — CASO GERE RECEITA (status ready)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "status": "ready",
  "recipe": {
    "title": "string",
    "summary": "string (máx 400c, apetitoso)",
    "difficulty": "EASY" | "EASY_MEDIUM" | "MEDIUM" | "MEDIUM_HARD" | "HARD",
    "difficultyLabel": "Fácil" | "Fácil a Médio" | "Médio" | "Médio a Difícil" | "Difícil",
    "types": ["Lanche", "Milho", "Festa Junina"],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 20,
    "servings": 4,
    "suggestions": "Parágrafo 1 substituições.\\n\\nParágrafo 2 alerta nutricional.\\n\\nParágrafo 3 harmonização.",
    "nutritionSummary": "Frase curta até 200c.",
    "nutritionPer100g": [
      { "nutrient": "Calorias", "quantity": "180 kcal" },
      { "nutrient": "Carboidratos", "quantity": "12,0 g" },
      { "nutrient": "Açúcares", "quantity": "2,0 g" },
      { "nutrient": "Proteínas", "quantity": "6,0 g" },
      { "nutrient": "Gorduras totais", "quantity": "10,0 g" },
      { "nutrient": "Gorduras saturadas", "quantity": "3,0 g" },
      { "nutrient": "Colesterol", "quantity": "80 mg" },
      { "nutrient": "Cálcio", "quantity": "40 mg" },
      { "nutrient": "Fibras", "quantity": "1,2 g" },
      { "nutrient": "Ferro", "quantity": "0,8 mg" },
      { "nutrient": "Sódio", "quantity": "320 mg" }
    ],
    "utensils": ["Frigideira", "Espátula"],
    "sections": [{
      "name": "Receita",
      "ingredients": [
        { "originalText": "3 ovos", "name": "ovos", "generalName": "ovo" },
        { "originalText": "1 colher de manteiga", "name": "manteiga", "generalName": "manteiga" }
      ],
      "modeOfPreparation": "1. Bata os ovos.\\n2. Aqueça a frigideira.\\n3. Sirva com manjericão."
    }]
  }
}
`.trim();
}

function extractJsonObject(raw: string): string | null {
  const start = raw.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < raw.length; i++) {
    const char = raw[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') depth++;
      if (char === '}') depth--;
      if (depth === 0) return raw.slice(start, i + 1);
    }
  }
  return null;
}

function sanitizeJsonString(raw: string): string {
  let inString = false;
  let escaped = false;
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      result += char;
      escaped = true;
      continue;
    }
    if (char === '"') {
      result += char;
      inString = !inString;
      continue;
    }
    if (inString) {
      if (char === '\n') {
        result += '\\n';
        continue;
      }
      if (char === '\r') {
        result += '\\r';
        continue;
      }
      if (char === '\t') {
        result += '\\t';
        continue;
      }
    }
    result += char;
  }
  return result;
}

function parseAiJson(raw: string): AiResponse {
  const extracted = extractJsonObject(raw);
  if (!extracted) throw new Error('NO_JSON_OBJECT');
  try {
    return JSON.parse(extracted) as AiResponse;
  } catch {
    const sanitized = sanitizeJsonString(extracted);
    return JSON.parse(sanitized) as AiResponse;
  }
}

export async function POST(request: Request) {
  try {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'Você precisa estar logado para criar receitas na geladeira.',
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as GenerateBody;
    const ingredients = (body.ingredients ?? [])
      .map((s) => s.trim())
      .filter(Boolean);
    const preference = body.preference ?? 'tanto_faz';
    const answers = (body.answers ?? []).filter(
      (a) => a.question && typeof a.answer === 'boolean',
    );

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Informe ao menos 1 ingrediente.' },
        { status: 400 },
      );
    }
    if (ingredients.length > 30) {
      return NextResponse.json(
        { error: 'Máximo 30 ingredientes.' },
        { status: 400 },
      );
    }
    if (!['doce', 'salgado', 'tanto_faz'].includes(preference)) {
      return NextResponse.json(
        { error: 'Preferência inválida.' },
        { status: 400 },
      );
    }
    if (answers.length > 2) {
      return NextResponse.json(
        { error: 'Máximo 2 respostas.' },
        { status: 400 },
      );
    }

    // Rate limit: 3 criações por 24h deslizante por usuário (conta apenas receitas geradas, não perguntas)
    // Mas para evitar abuso de perguntas, também contamos se já fez 3 receitas nas últimas 24h, bloqueia nova tentativa mesmo que ainda em perguntas.
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await prisma.geladeiraLog.count({
      where: { userId: session.user.id, createdAt: { gte: since } },
    });
    if (recentCount >= 3) {
      const oldest = await prisma.geladeiraLog.findFirst({
        where: { userId: session.user.id, createdAt: { gte: since } },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      });
      const retryAfterMs = oldest
        ? oldest.createdAt.getTime() + 24 * 60 * 60 * 1000 - Date.now()
        : 0;
      const retryAfterSec = Math.max(60, Math.ceil(retryAfterMs / 1000));
      return NextResponse.json(
        {
          error:
            'Limite de 3 criações por 24h atingido. Tente novamente mais tarde.',
          retryAfter: retryAfterSec,
        },
        { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
      );
    }

    const ip = getClientIp(h);

    const rawKey = process.env.GROQ_API_KEY?.trim();
    if (!rawKey?.startsWith('gsk_')) {
      return NextResponse.json(
        { error: 'Serviço de IA indisponível.' },
        { status: 503 },
      );
    }

    // Se já respondeu 2 perguntas, força geração (não permite mais perguntas)
    const forceRecipe = answers.length >= 2;

    let prompt = buildGeladeiraPrompt(
      ingredients,
      preference as Preference,
      answers,
    );
    if (forceRecipe) {
      prompt +=
        '\n\nATENÇÃO: Você já fez 2 perguntas, agora GERE A RECEITA FINAL obrigatoriamente com status ready, mesmo que falte algo.';
    }

    const groq = new Groq({ apiKey: rawKey });
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    console.log('[geladeira/generate] raw:', raw);

    let parsed: AiResponse;
    try {
      parsed = parseAiJson(raw);
    } catch (e) {
      console.error('[geladeira/generate] parse error', e);
      return NextResponse.json(
        { error: 'Resposta da IA inválida.' },
        { status: 422 },
      );
    }

    // Validação do retorno
    if (parsed.status === 'needs_info') {
      if (forceRecipe) {
        return NextResponse.json(
          {
            error:
              'IA ainda pediu mais informações após 2 perguntas. Tente com outros ingredientes.',
          },
          { status: 422 },
        );
      }
      const qs = (parsed.questions ?? [])
        .slice(0, 2)
        .map((q) => q.trim())
        .filter(Boolean);
      if (qs.length === 0) {
        return NextResponse.json(
          { error: 'IA não retornou perguntas válidas.' },
          { status: 422 },
        );
      }
      // Não conta no rate limit ainda, apenas retorna perguntas
      return NextResponse.json({ status: 'needs_info', questions: qs });
    }

    if (parsed.status === 'ready') {
      const recipe = (parsed as Extract<AiResponse, { status: 'ready' }>)
        .recipe;
      if (!recipe?.title || !recipe?.sections?.length) {
        return NextResponse.json(
          { error: 'Receita incompleta retornada pela IA.' },
          { status: 422 },
        );
      }

      // Normaliza suggestions e modeOfPreparation como no analyze
      if (typeof recipe.suggestions === 'string') {
        recipe.suggestions = recipe.suggestions.replace(/\\n/g, '\n');
      }
      for (const sec of recipe.sections) {
        if (typeof sec.modeOfPreparation === 'string') {
          sec.modeOfPreparation = sec.modeOfPreparation.replace(/\\n/g, '\n');
        }
      }

      // Loga a geração para rate limit
      await prisma.geladeiraLog.create({
        data: { userId: session.user.id, ip: ip ?? undefined },
      });

      const remaining = Math.max(0, 2 - recentCount);
      return NextResponse.json({ status: 'ready', recipe, remaining });
    }

    return NextResponse.json(
      { error: 'Resposta inesperada da IA.' },
      { status: 422 },
    );
  } catch (error) {
    console.error('[geladeira/generate] error', error);
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 },
    );
  }
}
