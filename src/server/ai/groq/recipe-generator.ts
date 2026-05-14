import type { GeneratedRecipeData } from './recipe-generator.types';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL_ID ?? 'llama-3.3-70b-versatile';

type GroqChatCompletionResponse = {
  choices: { message: { content: string | null } }[];
};

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();
  return raw.trim();
}

export async function generateRecipeFromGroq(
  title: string,
  modeOfPreparation: string,
): Promise<GeneratedRecipeData> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY não configurado no ambiente.');
  }

  const systemPrompt = `
Você é um assistente especializado em gastronomia brasileira.
Receberá o TÍTULO e o MODO DE PREPARO de uma receita e deverá retornar um JSON completo com todas as informações abaixo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: modeOfPreparation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Formate e corrija ortograficamente o modo de preparo seguindo estas regras:
- Numere cada etapa sequencialmente: "1. ", "2. ", etc.
- Cada etapa em seu próprio parágrafo (separados por \\n\\n).
- Corrija erros ortográficos e gramaticais, mas preserve o estilo e voz do autor.
- Não invente etapas, apenas formate o que foi fornecido.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Crie um resumo apetitoso com 1 parágrafo e até 200 caracteres, que dê água na boca.
Use emojis com moderação (1 a 2 no máximo).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: ingredients
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Extraia todos os ingredientes do modo de preparo.
- amount: quantidade (ex: "2", "3/4", "1 e meia")
- unit: unidade normalizada (ex: "xícara (chá)", "colher (sopa)", "grama", "unidade", "pitada")
- name: nome em minúsculas (ex: "fubá mimoso", "fermento químico em pó")
- originalText: trecho exato do texto original
- inferred: true se inferiu quantidade ou unidade
- suggestions: alternativas apenas quando inferred = true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: utensils
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Liste os utensílios necessários, incluindo os inferidos pelo preparo.
Ex: "Recipiente", "Colher de sopa", "Forno", "Forma".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: classification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
primaryGroup — UM valor em MAIÚSCULAS:
  "CARBOIDRATOS" | "REGULADORES" | "CONSTRUTORES" | "CALCIO" | "LIPIDIOS" | "OUTROS"

mainCategories — 1 a 3 strings em minúsculas.
  Ex: "bolo", "pão", "biscoito", "carne", "sopa", "salada", "bebida"

nutritionTags — strings em minúsculas relevantes.
  Ex: "rico em açúcar", "vegetariano", "rico em fibras", "alto em gordura"

courseTypes — 1 a 2 strings em minúsculas.
  Ex: "sobremesa", "lanche", "prato principal", "café da manhã"

typeSuggestions — OBRIGATÓRIO — 1 a 3 strings com inicial maiúscula, específicas.
  Ex: "Broa de Fubá", "Broa Caseira", "Pãozinho de Fubá"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: suggestions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Texto corrido (até 400 caracteres) com sugestões de:
- Substituições de ingredientes
- Variações da receita
- Acompanhamentos recomendados

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: difficulty
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"EASY" | "MEDIUM" | "HARD" — avalie com base na complexidade das técnicas e número de etapas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: cookTimeMinutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Número inteiro com o tempo de forno/cozimento em minutos. null se não mencionado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: nutritionTable
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tabela nutricional estimada por 100 g, com base nos ingredientes identificados.
Inclua: Valor energético, Carboidratos, Açúcares, Proteínas, Gorduras totais,
Gorduras saturadas, Fibra alimentar, Sódio.
- nutrient: nome do nutriente
- amount: valor numérico como string (ex: "312")
- unit: "kcal", "g", "mg"
- dailyValue: % VD estimado como string (ex: "16%"), ou "" se não aplicável

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPO: nutritionSummary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resumo nutricional em texto corrido, até 300 caracteres. Use 1 emoji ao final.
Ex: "Receita energética e rica em carboidratos, com moderado teor de proteínas e gorduras. Ideal como lanche acompanhado de café ☕"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAÍDA — responda APENAS com este JSON (sem nenhum texto fora dele):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "modeOfPreparation": "1. Em um recipiente...\\n\\n2. Quebre os ovos...",
  "summary": "Broinhas macias e douradinhas, com aroma irresistível de fubá 🤤",
  "ingredients": [
    {
      "amount": "2",
      "unit": "xícara (chá)",
      "name": "fubá mimoso",
      "originalText": "duas xicaras de fubá mimoso",
      "inferred": false,
      "suggestions": []
    }
  ],
  "utensils": [
    { "name": "Recipiente" },
    { "name": "Forno" }
  ],
  "classification": {
    "primaryGroup": "CARBOIDRATOS",
    "mainCategories": ["broa", "pão"],
    "nutritionTags": ["rico em açúcar", "vegetariano"],
    "courseTypes": ["lanche", "café da manhã"],
    "typeSuggestions": ["Broa de Fubá", "Broa Caseira", "Pãozinho de Fubá"]
  },
  "suggestions": "Substitua a manteiga por margarina ou óleo de coco. Acrescente queijo ralado para uma versão salgada. Sirva com manteiga e café.",
  "difficulty": "EASY",
  "cookTimeMinutes": 25,
  "nutritionTable": [
    { "nutrient": "Valor energético", "amount": "312", "unit": "kcal", "dailyValue": "16%" },
    { "nutrient": "Carboidratos", "amount": "52", "unit": "g", "dailyValue": "17%" },
    { "nutrient": "Açúcares", "amount": "14", "unit": "g", "dailyValue": "" },
    { "nutrient": "Proteínas", "amount": "6", "unit": "g", "dailyValue": "8%" },
    { "nutrient": "Gorduras totais", "amount": "9", "unit": "g", "dailyValue": "16%" },
    { "nutrient": "Gorduras saturadas", "amount": "5", "unit": "g", "dailyValue": "23%" },
    { "nutrient": "Fibra alimentar", "amount": "1.5", "unit": "g", "dailyValue": "6%" },
    { "nutrient": "Sódio", "amount": "180", "unit": "mg", "dailyValue": "8%" }
  ],
  "nutritionSummary": "Receita energética e rica em carboidratos, com moderado teor de proteínas e gorduras. Ideal como lanche acompanhado de café ☕"
}
`.trim();

  const userMessage = `TÍTULO: ${title}\n\nMODO DE PREPARO:\n${modeOfPreparation}`;

  const response = await fetch(GROQ_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      max_tokens: 4096,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error('Erro ao chamar Groq:', response.status, text);
    throw new Error(`Falha na chamada à Groq API (status ${response.status}).`);
  }

  const completion = (await response.json()) as GroqChatCompletionResponse;
  const content = completion.choices[0]?.message?.content ?? '';

  let parsed: GeneratedRecipeData;
  try {
    parsed = JSON.parse(extractJson(content));
  } catch {
    console.error('Erro ao fazer parse da resposta da IA:', content);
    throw new Error('A resposta da IA não está em formato JSON válido.');
  }

  // Garantias defensivas
  parsed.ingredients = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
  parsed.utensils = Array.isArray(parsed.utensils) ? parsed.utensils : [];
  parsed.nutritionTable = Array.isArray(parsed.nutritionTable) ? parsed.nutritionTable : [];

  const cls = parsed.classification ?? {
    primaryGroup: 'OUTROS' as const,
    mainCategories: [],
    nutritionTags: [],
    courseTypes: [],
    typeSuggestions: [],
  };

  if (!Array.isArray(cls.typeSuggestions) || cls.typeSuggestions.length === 0) {
    cls.typeSuggestions = (cls.mainCategories ?? [])
      .slice(0, 3)
      .map((c: string) => c.charAt(0).toUpperCase() + c.slice(1));
  }

  parsed.classification = cls;
  parsed.cookTimeMinutes =
    typeof parsed.cookTimeMinutes === 'number' ? parsed.cookTimeMinutes : null;
  parsed.difficulty = ['EASY', 'MEDIUM', 'HARD'].includes(parsed.difficulty)
    ? parsed.difficulty
    : 'MEDIUM';

  return parsed;
}
