import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import type { RecipeDifficultyValue } from '@/features/recipes/types/recipe.types';

// ─── Rate Limit (in-memory per IP) ─────────────────────────────────────────

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000; // 1 minuto

export function resetRateLimit() {
  rateLimit.clear();
}

function checkRateLimit(ip: string): boolean {
  if (process.env.NODE_ENV === 'test') return true;

  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = {
  name: string;
  ingredientsText: string;
  modeOfPreparation: string;
};

type RequestBody = {
  title: string;
  sections: Section[];
};

type NutrientEntry = {
  nutrient: string;
  quantity: string;
};

type AnalyzedIngredient = {
  originalText: string;
  name: string;
  generalName: string;
};

type AnalyzedSection = {
  name: string;
  ingredients: AnalyzedIngredient[];
  modeOfPreparation: string;
};

type AnalyzeResult = {
  title: string;
  summary: string;
  difficulty: RecipeDifficultyValue;
  difficultyLabel: string;
  types: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  suggestions: string;
  nutritionSummary: string;
  nutritionPer100g: NutrientEntry[];
  utensils: string[];
  sections: AnalyzedSection[];
};
// ─── JSON Extraction ──────────────────────────────────────────────────────────

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

function parseAiJson(raw: string): AnalyzeResult {
  const extracted = extractJsonObject(raw);
  if (!extracted) throw new Error('NO_JSON_OBJECT');

  try {
    return JSON.parse(extracted) as AnalyzeResult;
  } catch {
    const sanitized = sanitizeJsonString(extracted);
    return JSON.parse(sanitized) as AnalyzeResult;
  }
}

function normalizeSuggestions(raw: unknown): string {
  if (Array.isArray(raw)) {
    return raw
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 3)
      .join('\n\n');
  }
  if (typeof raw === 'string') {
    // Converte sequências literais "\\n" ainda presentes para quebra real
    const s = raw.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
    // Normaliza múltiplas quebras para separar exatamente 3 parágrafos
    const parts = s
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 3) return parts.slice(0, 3).join('\n\n');
    if (parts.length > 0) return parts.join('\n\n');
    return s.trim();
  }
  return String(raw ?? '');
}

function normalizeModeOfPreparation(raw: unknown): string {
  if (typeof raw !== 'string') return String(raw ?? '');
  // Converte "\n" literal e \r\n para quebra real
  const s = raw.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  // Primeiro tenta split por quebra real
  let parts = s
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);
  // Fallback: se ainda é 1 parágrafo mas contém "2." "3." inline (ex: "1. Bata \n2. Asse" colado ou "1. A 2. B 3. C")
  if (parts.length === 1 && /\s\d+\.\s/.test(parts[0])) {
    const fallback = parts[0]
      .split(/\s(?=\d+\.\s)/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (fallback.length > 1) parts = fallback;
  }
  // Normaliza para "1. texto" garantindo numeração sequencial e sem prefixos duplicados
  const normalized = parts
    .map((p, i) => {
      const cleaned = p.replace(/^\s*\d+[.)-]?\s*/, '').trim();
      if (!cleaned) return '';
      return `${i + 1}. ${cleaned}`;
    })
    .filter(Boolean);
  return normalized.join('\n');
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildSectionsText(sections: Section[]): string {
  return sections
    .map((s, i) => {
      const label =
        sections.length === 1 ? 'Receita' : s.name || `Etapa ${i + 1}`;
      return `## ${label}\n\nIngredientes:\n${s.ingredientsText}\n\nModo de preparo:\n${s.modeOfPreparation}`;
    })
    .join('\n\n---\n\n');
}

function buildPrompt(title: string, sections: Section[]): string {
  const sectionsText = buildSectionsText(sections);
  const paragraphInfo = sections
    .map((s, i) => {
      const label =
        sections.length === 1 ? 'Receita' : s.name || `Etapa ${i + 1}`;
      const count = s.modeOfPreparation
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean).length;
      return `- "${label}": ${count} parágrafo(s) no modo de preparo → retorne EXATAMENTE ${count} passo(s) numerado(s)`;
    })
    .join('\n');

  return `
Você é um Chef de Cozinha com 3 estrelas Michelin, Revisor Culinário e Nutricionista profissional.
Você receberá uma receita enviada pelo usuário e deverá corrigi-la, organizá-la e enriquecê-la.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS OBRIGATÓRIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Nunca invente ingredientes que não estejam na receita original.
- Corrija ortografia, gramática e clareza, preservando o estilo do autor.
- Interprete erros de digitação e medidas com bom senso culinário (ex: "Pruntio" → "Prontinho").
- Ajuste tempos, temperaturas e etapas incoerentes quando necessário.
- Identifique utensílios reais e distintos com base no modo de preparo.
- Considere técnicas como flambagem, fritura, assar, bater e gelar ao definir dificuldade e tempos.
- PRESERVE A QUANTIDADE EXATA DE PARÁGRAFOS DO MODO DE PREPARO: cada quebra de linha do usuário é um passo. NÃO subdivida um parágrafo em dois, NÃO junte dois parágrafos em um. Se o usuário enviou 8 parágrafos, retorne exatamente 8 passos numerados.
- Retorne SOMENTE o JSON abaixo. Nenhum texto, emoji ou markdown fora do JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFERÊNCIA DE PARÁGRAFOS DO USUÁRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${paragraphInfo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECEITA DO USUÁRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Título: ${title}

${sectionsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPOS DO JSON — INSTRUÇÕES DETALHADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"title"
  Título corrigido e aprimorado, mantendo a identidade da receita original.

"summary"
  Resumo animado, convidativo, apetitoso que dê vontade de comer. Máximo 400 caracteres.
  Desperte o desejo de preparar a receita, criando expectativa, faça sentir notas, sabores, cheiro.

"difficulty"
  Um dos valores: "EASY" | "EASY_MEDIUM" | "MEDIUM" | "MEDIUM_HARD" | "HARD"
  DISTRIBUA de forma honesta entre as 5 faixas — NÃO use sempre "MEDIUM".
  Use tempo total (prep + cook), número de ingredientes/etapas e técnica como critério objetivo:
  - EASY (Fácil): até 30 min total, ≤5 ingredientes simples, técnicas básicas (misturar, cortar, mexer, gelar), sem forno ou forno simples ≤20 min. Ex: brigadeiro tradicional, vitaminas, sanduíche.
  - EASY_MEDIUM (Fácil a Médio): 30-45 min, 5-8 ingredientes, 1 técnica que exige atenção (refogar, bater massa simples, forno 20-35 min). Ex: bolo de cenoura simples, panqueca.
  - MEDIUM (Médio): 45-90 min, 6-12 ingredientes, 2-3 etapas encadeadas, controle de ponto/temperatura, fritura simples, forno médio, milho ralado/cozido. Ex: pamonha, curau, estrogonofe, lasanha simples.
  - MEDIUM_HARD (Médio a Difícil): 90-150 min, 10+ ingredientes, técnicas como sovar, fermentação curta, fritura por imersão, banho-maria, defumação leve, montagem em camadas. Ex: feijoada completa, coxinha, pão caseiro.
  - HARD (Difícil): >150 min OU técnicas avançadas (massa folhada/laminada, fermentação longa, confeitaria fina, sous-vide, temperagem de chocolate). Ex: croquembouche, macaron, char siu artesanal.
  Conte ingredientes, estime tempo real e só então classifique. Varie a escala.

"difficultyLabel"
  "EASY" -> "Fácil"
  "EASY_MEDIUM" -> "Fácil a Médio"
  "MEDIUM" -> "Médio"
  "MEDIUM_HARD" -> "Médio a Difícil"
  "HARD" -> "Difícil"


  "types"
  Array de classificações da receita. Mínimo 1, máximo 3 itens.
  Cada item deve ser uma categoria isolada e específica, em português, sem "/" dentro do item.
  ESTRUTURA OBRIGATÓRIA (escolha 1 por posição):
  - Posição 1 = FUNÇÃO NA REFEIÇÃO: "Lanche" | "Café da manhã" | "Entrada" | "Prato principal" | "Acompanhamento" | "Sobremesa" | "Bebida" | "Petisco" | "Doce"
  - Posição 2 = BASE/INGREDIENTE ou MODO: "Milho", "Carne", "Frango", "Porco", "Peixe", "Vegetariano", "Massa", "Forno", "Fritura", etc
  - Posição 3 = ORIGEM/ESTILO opcional: "Festa Junina", "Clássico brasileiro", "Italiana", etc
  REGRAS ANTI-ERRO:
  - Pamonha, curau, canjica, bolo, brigadeiro, biscoito, tapioca, cuscuz, pão de queijo, broa são SEMPRE "Lanche", "Café da manhã", "Sobremesa" ou "Doce" — NUNCA "Prato principal" ou "Acompanhamento".
  - "Prato principal" SOMENTE para refeição salgada completa que sustenta (ex: arroz+feijão+proteína, massas recheadas, carnes com acompanhamento).
  - "Sobremesa"/"Doce" para doces de finalização.
  - Os 3 itens devem ser distintos entre si, nunca repita.
  Exemplos CORRETOS:
    Pamonha → ["Lanche", "Milho", "Festa Junina"]
    Brigadeiro com bacon → ["Sobremesa", "Doce", "Festa"]
    Feijoada → ["Prato principal", "Carne", "Clássico brasileiro"]
    Bolo de cenoura → ["Lanche", "Bolo", "Clássico brasileiro"]
    Coxinha → ["Petisco", "Frango", "Fritura"]
  Nunca classifique lanche/festa junina como prato principal.

"prepTimeMinutes"
  Tempo de preparo em minutos (inteiro). Inclui apenas mise en place e montagem a frio.

"cookTimeMinutes"
  Tempo de cozimento em minutos (inteiro). Inclui forno, fogão, grelha, fritadeira, etc.

"suggestions"
  String com EXATAMENTE 3 parágrafos de texto corrido, separados por "\\n\\n" (duas quebras escapadas). NÃO use markdown, NÃO use quebras simples \n, NÃO deixe "\n" visível como texto.
  - Parágrafo 1 (até 400 caracteres): substituições de ingredientes, adaptações e variações.
  - Parágrafo 2 (até 400 caracteres): alerta nutricional sobre ingrediente calórico/açúcar/sódio (ex: leite condensado, bacon).
  - Parágrafo 3 (até 400 caracteres): acompanhamentos e harmonizações (ex: sorvete, café, vinho, frutas).
  Formato exato: "Texto do parágrafo 1.\\n\\nTexto do parágrafo 2.\\n\\nTexto do parágrafo 3."
  Cada \\n deve ser escapado como \\n dentro do JSON; o frontend separa por parágrafos, não por "\n" literal.

"nutritionSummary"
  Frase curta e acessível resumindo o perfil nutricional da receita (até 200 caracteres).
  Exemplo: "Receita rica em proteínas e com baixo teor de carboidratos."

"nutritionPer100g"
  Tabela nutricional estimada por 100g da receita pronta.
  Deve conter EXATAMENTE estes 11 nutrientes, nesta ordem:
  1. Valor energético (kcal) → formato: "000 kcal"
  2. Carboidratos   → formato: "0,0 g"
  3. Açúcares      → formato: "0,0 g"
  4. Proteínas      → formato: "0,0 g"
  5. Gorduras totais → formato: "0,0 g"
  6. Gorduras saturadas → formato: "0,0 g"
  7. Colesterol          → formato: "0 mg"
  8. Cálcio       → formato: "0 mg"
  9. Fibras         → formato: "0,0 g"
  10. Ferro          → formato: "0,0 mg"
  11. Sódio          → formato: "0 mg"

"utensils"
  Lista de utensílios reais, distintos e necessários identificados no preparo.
  Não inclua utensílios genéricos desnecessários (ex: não inclua "colher" se só for misturar).

"sections"
  Array de seções revisadas da receita.
  - Se houver apenas uma seção, use "Receita" como name.
  - "ingredients": lista de objetos.
  - Cada ingrediente deve conter:
    - "originalText": texto completo padronizado do ingrediente, preservando quantidade, unidade e detalhes.
    - "name": nome específico do ingrediente, sem quantidade.
    - "generalName": nome genérico do ingrediente, em português e lowercase, próprio para indexação e busca.
  - Exemplos:
    { "originalText": "50 g de manteiga em ponto pomada", "name": "manteiga em ponto pomada", "generalName": "manteiga" }
    { "originalText": "1 disco de pizza de frigideira", "name": "pizza de frigideira", "generalName": "pizza" }
    { "originalText": "¼ de xícara (chá) de vinho branco", "name": "vinho branco", "generalName": "vinho branco" }
  - "modeOfPreparation": string com passos numerados, UM PARÁGRAFO DO USUÁRIO = UM PASSO NUMERADO. Mantenha EXATAMENTE a mesma quantidade de parágrafos que o usuário enviou (ver CONFERÊNCIA acima). Formato EXATO: "1. Primeiro passo corrigido.\n2. Segundo passo corrigido.\n3. Terceiro passo corrigido." Cada passo começa com "N. " (número + ponto + espaço), preserva o conteúdo daquele parágrafo (corrigido ortograficamente), NÃO quebre um parágrafo longo em 2 passos, NÃO junte 2 parágrafos em 1. Quebras escapadas como \n, nunca "\n" literal visível.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON ESPERADO (retorne apenas isso)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "title": "string",
  "summary": "string",
  "difficulty": "EASY",
  "difficultyLabel": "string",
  "types": ["string"],
  "prepTimeMinutes": 0,
  "cookTimeMinutes": 0,
  "suggestions": "string",
  "nutritionSummary": "string",
  "nutritionPer100g": [
    { "nutrient": "Calorias",            "quantity": "0 kcal" },
    { "nutrient": "Carboidratos",        "quantity": "0,0 g"  },
    { "nutrient": "Proteínas",           "quantity": "0,0 g"  },
    { "nutrient": "Gorduras totais",     "quantity": "0,0 g"  },
    { "nutrient": "Gorduras saturadas",  "quantity": "0,0 g"  },
    { "nutrient": "Fibras",              "quantity": "0,0 g"  },
    { "nutrient": "Sódio",               "quantity": "0 mg"   }
  ],
  "utensils": ["string"],
"sections": [
  {
    "name": "string",
    "ingredients": [
      {
        "originalText": "string",
        "name": "string",
        "generalName": "string"
      }
    ],
    "modeOfPreparation": "1. ...\n2. ...\n3. ..."
  }
]
}
`.trim();
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas requisições. Aguarde um minuto e tente novamente.' },
      { status: 429 },
    );
  }

  try {
    const rawKey = process.env.GROQ_API_KEY?.trim();
    if (!rawKey) {
      return NextResponse.json(
        {
          error:
            'Serviço de IA indisponível. Configure GROQ_API_KEY em .env e na Vercel (https://console.groq.com/keys).',
        },
        { status: 503 },
      );
    }
    if (!rawKey.startsWith('gsk_')) {
      return NextResponse.json(
        {
          error:
            'GROQ_API_KEY inválida (deve começar com gsk_). Gere uma nova em https://console.groq.com/keys e atualize .env e Vercel.',
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as RequestBody;
    const { title, sections } = body;

    if (!title?.trim() || !sections?.length) {
      return NextResponse.json(
        { error: 'Título e seções são obrigatórios.' },
        { status: 400 },
      );
    }

    const groq = new Groq({ apiKey: rawKey });

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b', // ← MODELO ATUALIZADO
      messages: [{ role: 'user', content: buildPrompt(title, sections) }],
      temperature: 0.2,
      max_tokens: 4096,
      // response_format: { type: 'json_object' }, // ← ADICIONADO para garantir JSON
    });

    const raw = completion.choices[0]?.message?.content ?? '';

    try {
      const parsed = parseAiJson(raw);
      // Normaliza suggestions para garantir 3 parágrafos com \n\n reais, lidando com \\n literal
      const rawSuggestions = (parsed as unknown as Record<string, unknown>)
        .suggestions;
      (parsed as unknown as Record<string, unknown>).suggestions =
        normalizeSuggestions(rawSuggestions);
      // Normaliza modo de preparo e preserva quantidade exata de parágrafos do usuário
      const parsedSections = (parsed as unknown as Record<string, unknown>)
        .sections as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(parsedSections)) {
        for (let i = 0; i < parsedSections.length; i++) {
          const sec = parsedSections[i];
          let normalized = normalizeModeOfPreparation(sec.modeOfPreparation);
          const originalText = sections[i]?.modeOfPreparation ?? '';
          const expectedCount = originalText
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean).length;
          const actualCount = normalized.split('\n').filter(Boolean).length;
          if (expectedCount && actualCount !== expectedCount) {
            console.warn(
              `[api/recipes/analyze] paragraph count mismatch secao "${String(sec.name)}": esperado ${expectedCount}, IA retornou ${actualCount}. Ajustando.`,
            );
            if (actualCount > expectedCount) {
              const parts = normalized.split('\n').filter(Boolean);
              const head = parts.slice(0, expectedCount - 1);
              const tailParts = parts.slice(expectedCount - 1);
              // Junta o excedente em um único parágrafo, removendo numerações intermediárias
              const tailJoined = tailParts
                .map((p) => p.replace(/^\s*\d+[.)-]?\s*/, '').trim())
                .join(' ');
              const merged = [...head, `${expectedCount}. ${tailJoined}`].join(
                '\n',
              );
              const finalParts = merged.split('\n').map((p, idx) => {
                const cleaned = p.replace(/^\s*\d+[.)-]?\s*/, '').trim();
                return `${idx + 1}. ${cleaned}`;
              });
              normalized = finalParts.join('\n');
            }
          }
          sec.modeOfPreparation = normalized;
        }
      }
      return NextResponse.json({ data: parsed });
    } catch (error) {
      console.error('[api/recipes/analyze] JSON parse error:', error);
      return NextResponse.json(
        { error: 'A resposta da IA veio em formato inválido.' },
        { status: 422 },
      );
    }
  } catch (error) {
    const status =
      typeof error === 'object' && error !== null
        ? ((error as Record<string, unknown>).status ??
          (error as Record<string, unknown>).statusCode)
        : undefined;
    const statusCode = typeof status === 'number' ? status : 0;
    const message =
      typeof error === 'object' && error !== null
        ? String((error as Record<string, unknown>).message ?? '')
        : '';

    if (
      statusCode === 401 ||
      statusCode === 403 ||
      message.includes('Invalid API Key') ||
      message.includes('invalid_api_key')
    ) {
      console.error('[api/recipes/analyze] GROQ_API_KEY inválida:', {
        status: statusCode,
        message,
      });
      return NextResponse.json(
        {
          error:
            'Chave da IA inválida ou expirada. Gere uma nova em https://console.groq.com/keys, atualize GROQ_API_KEY no .env (local) e em Vercel → Settings → Environment Variables, depois faça redeploy.',
        },
        { status: 503 },
      );
    }

    console.error('[api/recipes/analyze] request error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar com a IA. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}
