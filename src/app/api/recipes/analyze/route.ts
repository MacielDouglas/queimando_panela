import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

type Section = {
  name: string;
  ingredientsText: string;
  modeOfPreparation: string;
};

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
6. "summary" deve ser um resumo apetitoso, animado e convidativo, com no máximo 200 caracteres.
7. "suggestions" deve conter apenas substituições, adaptações e variações da receita, com no máximo 300 caracteres. Não use esse campo para sugerir acompanhamento.
8. "utensils" deve listar utensílios reais, distintos, úteis e completos. Exemplo: "Frigideira grande", "Espátula", "Faca afiada", "Tábua de corte".
9. "modeOfPreparation" em cada seção deve vir dividido em passos curtos e claros, separados por quebra de linha, no formato:
   "n..."
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
      "modeOfPreparation": "...\\n ...\\n ..."
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

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'A IA respondeu, mas não retornou JSON válido.' },
        { status: 422 },
      );
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
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
