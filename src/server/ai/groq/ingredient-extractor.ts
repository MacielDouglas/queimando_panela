import { ParsedRecipeData } from './types';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL_ID ?? 'llama-3.3-70b-versatile';

if (!process.env.GROQ_API_KEY) {
  console.warn('GROQ_API_KEY não definido. A extração de ingredientes via IA não irá funcionar.');
}

type GroqChatCompletionResponse = {
  choices: { message: { content: string | null } }[];
};

export function extractJsonFromContent(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();
  return raw.trim();
}

export async function extractIngredientsAndUtensilsFromGroq(
  instructions: string,
): Promise<ParsedRecipeData> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY não configurado no ambiente.');
  }

  if (!instructions.trim()) {
    return {
      ingredients: [],
      utensils: [],
      classification: {
        primaryGroup: 'OUTROS',
        mainCategories: [],
        nutritionTags: [],
        courseTypes: [],
        typeSuggestions: [],
      },
    };
  }

  const systemPrompt = `
Você é um assistente especializado em gastronomia e análise de receitas.

TAREFAS:
A partir de um texto de MODO DE PREPARO (em português), você deve:

1) Extrair uma lista de INGREDIENTES.
2) Extrair uma lista de UTENSÍLIOS necessários.
3) Classificar a receita em eixos NUTRICIONAIS e CULINÁRIOS.

INGREDIENTES:
- amount: quantidade em texto, ex: "4", "1 e meia", "2".
- unit: unidade normalizada em português, ex:
  - "xícara (chá)", "xícara (café)", "xícara (sobremesa)"
  - "colher (sopa)", "colher (chá)", "colher (café)"
  - "grama", "quilo", "mililitro", "litro", etc.
- name: nome do ingrediente, ex: "leite em pó", "açúcar", "fubá".
- originalText: trecho EXATO como apareceu no texto do usuário.
- inferred: true se você precisou inferir quantidade ou unidade.
- suggestions: sugestões alternativas apenas quando houver inferência de unidade.

REGRAS PARA INGREDIENTES:
- Nunca invente ingredientes que não estejam implícitos no texto.
- Quando a unidade estiver ausente ou ambígua, infira a mais provável, marque inferred = true e inclua sugestões.
- Mantenha os nomes em português e em caixa-baixa, exceto nomes próprios.

UTENSÍLIOS:
- name: nome do utensílio, ex: "Liquidificador", "Refratário", "Forno", "Panela média".
- Inclua utensílios inferidos logicamente do modo de preparo.

CLASSIFICAÇÃO DA RECEITA:

3.1) primaryGroup — escolha UM em MAIÚSCULAS:
- "CARBOIDRATOS": massas, pães, bolos, arroz, batata, mandioca, etc.
- "REGULADORES": frutas, verduras e legumes.
- "CONSTRUTORES": carnes, peixes, aves, ovos, leite, queijos, leguminosas.
- "CALCIO": destaque principal para laticínios / cálcio.
- "LIPIDIOS": frituras ou molhos muito gordurosos.
- "OUTROS": quando nenhum grupo acima for claramente predominante.

3.2) mainCategories — lista de 1 a 3 strings em minúsculas.
Exemplos: "carne", "peixe", "ave", "ovo", "pão", "bolo", "biscoito", "massa", "torta",
"sopa", "salada", "arroz", "doce de colher", "bebida".

3.3) nutritionTags — lista de strings em minúsculas relevantes para a receita.
Exemplos: "nutritivo", "rico em açucar", "alto em gordura", "rico em cálcio",
"rico em fibras", "vegano", "vegetariano", "natural", "ultraprocessado".

3.4) courseTypes — lista de 1 a 2 strings em minúsculas.
Exemplos: "prato principal", "entrada", "sobremesa", "lanche",
"café da manhã", "café da tarde", "acompanhamento".

3.5) typeSuggestions — lista de 1 a 3 strings com inicial maiúscula. OBRIGATÓRIO.
Seja específico: prefira "Bolo de Café" a apenas "Bolo" quando o contexto permitir.
Exemplos: "Bolo", "Torta", "Sopa", "Strogonoff", "Risoto", "Pão", "Cookie",
"Omelete", "Frango Assado", "Mousse", "Pudim", "Crepe", "Wrap", "Pizza", "Macarrão".

SAÍDA — responda APENAS com o JSON abaixo (sem nenhum texto fora dele):

{
  "ingredients": [
    {
      "amount": "4",
      "unit": "xícara (chá)",
      "name": "leite em pó",
      "originalText": "4 xicaras de leite em pó",
      "inferred": false,
      "suggestions": []
    }
  ],
  "utensils": [
    { "name": "Liquidificador" },
    { "name": "Forno" }
  ],
  "classification": {
    "primaryGroup": "CARBOIDRATOS",
    "mainCategories": ["bolo"],
    "nutritionTags": ["rico em açucar"],
    "courseTypes": ["sobremesa", "lanche"],
    "typeSuggestions": ["Bolo de Fubá", "Broa", "Bolo"]
  }
}
`.trim();

  const response = await fetch(GROQ_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.2,
      max_tokens: 2048,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: instructions },
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

  let parsed: ParsedRecipeData;

  try {
    const clean = extractJsonFromContent(content);
    parsed = JSON.parse(clean);
  } catch {
    console.error('Erro ao fazer parse do JSON retornado pela IA:', content);
    throw new Error('A resposta da IA não está em formato JSON válido.');
  }

  const ingredients = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
  const utensils = Array.isArray(parsed.utensils) ? parsed.utensils : [];

  const classification = parsed.classification ?? {
    primaryGroup: 'OUTROS' as const,
    mainCategories: [],
    nutritionTags: [],
    courseTypes: [],
    typeSuggestions: [],
  };

  // Fallback: se o modelo omitir typeSuggestions, deriva de mainCategories
  if (
    !Array.isArray(classification.typeSuggestions) ||
    classification.typeSuggestions.length === 0
  ) {
    classification.typeSuggestions = (classification.mainCategories ?? [])
      .slice(0, 3)
      .map((c: string) => c.charAt(0).toUpperCase() + c.slice(1));
  }

  return { ingredients, utensils, classification };
}
