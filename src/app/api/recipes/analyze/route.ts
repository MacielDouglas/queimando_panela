import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

type Section = {
  name: string;
  ingredientsText: string;
  modeOfPreparation: string;
};

function extractJsonObject(raw: string) {
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

      if (depth === 0) {
        return raw.slice(start, i + 1);
      }
    }
  }

  return null;
}

function sanitizeJsonString(raw: string) {
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

function parseAiJson(raw: string) {
  const extracted = extractJsonObject(raw);

  if (!extracted) {
    throw new Error('NO_JSON_OBJECT');
  }

  try {
    return JSON.parse(extracted);
  } catch {
    const sanitized = sanitizeJsonString(extracted);
    return JSON.parse(sanitized);
  }
}

export async function POST(request: Request) {
  console.log('[api/recipes/analyze] POST reached');

  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY não configurada.' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as {
      title: string;
      sections: Section[];
    };

    const { title, sections } = body;

    if (!title || !sections?.length) {
      return NextResponse.json(
        { error: 'Título e etapas são obrigatórios.' },
        { status: 400 },
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const sectionsText = sections
      .map(
        (s, i) =>
          `## ${
            i === 0 && sections.length === 1
              ? 'Receita'
              : s.name || `Etapa ${i + 1}`
          }

Ingredientes:
${s.ingredientsText}

Modo de preparo:
${s.modeOfPreparation}`,
      )
      .join('\n\n---\n\n');

    const prompt = `
Você é um chef brasileiro, revisor culinário e nutricionista.
Sua tarefa é corrigir, organizar e enriquecer a receita enviada pelo usuário.

REGRAS OBRIGATÓRIAS:
1. Corrija erros ortográficos e melhore a clareza do texto.
2. Preserve o estilo e a identidade da receita.
3. Retorne SOMENTE JSON válido.
4. Não use markdown.
5. Não inclua explicações fora do JSON.
6. "summary" deve ser um resumo apetitoso, animado e convidativo, com no máximo 300 caracteres.
7. "suggestions" deve ser em dois parágrafos com no máximo 350 caracteres. O primeiro deve conter apenas substituições, adaptações e variações da receita. O segundo deve ter sugestões de acompanhamentos que combinem com a receita. Dentro do JSON, quebras de linha devem ser escapadas como \\n.
8. "utensils" deve listar utensílios reais, distintos, úteis e completos, identificados nos ingredientes e no modo de preparo.
9. "modeOfPreparation" em cada seção deve vir dividido em passos curtos e claros, separados por \\n escapado em JSON, no formato "1. ...\\n2. ...\\n3. ...".
10. "nutritionPer100g" deve trazer EXATAMENTE estes nutrientes:
- Calorias
- Carboidratos
- Proteínas
- Gorduras totais
- Gorduras saturadas
- Sódio
11. "difficultyLabel" deve ser uma string amigável em português: "Fácil", "Fácil a Médio", "Médio", "Médio a Difícil" ou "Difícil".
12. "type" deve ser descritivo, por exemplo: "Prato principal / Carne / Clássico internacional".
13. Se a receita tiver apenas uma etapa, use "Receita" como nome da seção.
14. Não invente ingredientes que não façam sentido com a receita enviada.
15. Se houver flambagem, fritura, assar, bater ou gelar, isso deve influenciar dificuldade e tempos.

TÍTULO:
${title}

CONTEÚDO DA RECEITA:
${sectionsText}

Retorne este JSON exato:
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
    { "nutrient": "Calorias", "quantity": "0 kcal" },
    { "nutrient": "Carboidratos", "quantity": "0 g" },
    { "nutrient": "Proteínas", "quantity": "0 g" },
    { "nutrient": "Gorduras totais", "quantity": "0 g" },
    { "nutrient": "Gorduras saturadas", "quantity": "0 g" },
    { "nutrient": "Sódio", "quantity": "0 mg" }
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

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
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
