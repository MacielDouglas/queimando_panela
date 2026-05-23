import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

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

type AnalyzedSection = {
  name: string;
  ingredients: string[];
  modeOfPreparation: string;
};

type AnalyzeResult = {
  title: string;
  summary: string;
  difficulty: 'EASY' | 'EASY_MEDIUM' | 'MEDIUM' | 'MEDIUM_HARD' | 'HARD';
  difficultyLabel: string;
  type: string;
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
- Retorne SOMENTE o JSON abaixo. Nenhum texto, emoji ou markdown fora do JSON.

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
  Resumo apetitoso, animado e convidativo. Máximo 300 caracteres.
  Desperte o desejo de preparar a receita.

"difficulty"
  Um dos valores: "EASY" | "EASY_MEDIUM" | "MEDIUM" | "MEDIUM_HARD" | "HARD"
  Considere técnicas, número de etapas, equipamentos e tempo total.

"difficultyLabel"
  Rótulo amigável em português correspondente ao difficulty:
  "EASY" → "Fácil"
  "EASY_MEDIUM" → "Fácil a Médio"
  "MEDIUM" → "Médio"
  "MEDIUM_HARD" → "Médio a Difícil"
  "HARD" → "Difícil"

"type"
  Classificação descritiva da receita.
  Exemplos: "Prato principal / Carne / Clássico brasileiro"
            "Sobremesa / Doce / Forno"
            "Lanche / Pão / Artesanal"

"prepTimeMinutes"
  Tempo de preparo em minutos (inteiro). Inclui apenas mise en place e montagem a frio.

"cookTimeMinutes"
  Tempo de cozimento em minutos (inteiro). Inclui forno, fogão, grelha, fritadeira, etc.

"suggestions"
  Dois parágrafos separados por \\n\\n:
  - Parágrafo 1 (até 350 caracteres): substituições de ingredientes, adaptações e variações da receita.
  - Parágrafo 2 (até 350 caracteres): sugestões de acompanhamentos e harmonizações que combinem com o prato.
  Quebras de linha dentro do JSON devem ser escapadas como \\n.

"nutritionSummary"
  Frase curta e acessível resumindo o perfil nutricional da receita.
  Exemplo: "Receita rica em proteínas e com baixo teor de carboidratos."

"nutritionPer100g"
  Tabela nutricional estimada por 100g da receita pronta.
  Deve conter EXATAMENTE estes 7 nutrientes, nesta ordem:
  1. Calorias       → formato: "000 kcal"
  2. Carboidratos   → formato: "0,0 g"
  3. Proteínas      → formato: "0,0 g"
  4. Gorduras totais → formato: "0,0 g"
  5. Gorduras saturadas → formato: "0,0 g"
  6. Fibras         → formato: "0,0 g"
  7. Sódio          → formato: "0 mg"

"utensils"
  Lista de utensílios reais, distintos e necessários identificados no preparo.
  Não inclua utensílios genéricos desnecessários (ex: não inclua "colher" se só for misturar).

"sections"
  Array de seções revisadas da receita.
  - Se houver apenas uma seção, use "Receita" como name.
  - "ingredients": lista limpa, um item por string, com medidas padronizadas.
  - "modeOfPreparation": passos numerados, curtos e claros.
    Formato obrigatório: "1. ...\\n2. ...\\n3. ..."
    Cada passo deve ter no máximo 2 ações relacionadas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON ESPERADO (retorne apenas isso)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "title": "string",
  "summary": "string",
  "difficulty": "EASY",
  "difficultyLabel": "string",
  "type": "string",
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
      "ingredients": ["string"],
      "modeOfPreparation": "1. ...\\n2. ...\\n3. ..."
    }
  ]
}
`.trim();
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  console.log('[api/recipes/analyze] POST reached');

  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY não configurada.' },
        { status: 500 },
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

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: buildPrompt(title, sections) }],
      temperature: 0.2,
      max_tokens: 2048,
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    console.log('[api/recipes/analyze] raw response:', raw);

    try {
      const parsed = parseAiJson(raw);
      return NextResponse.json({ data: parsed });
    } catch (error) {
      console.error('[api/recipes/analyze] JSON parse error:', error);
      return NextResponse.json(
        { error: 'A resposta da IA veio em formato inválido.' },
        { status: 422 },
      );
    }
  } catch (error) {
    console.error('[api/recipes/analyze] request error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar com a IA.' },
      { status: 500 },
    );
  }
}
