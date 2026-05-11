import { ParsedRecipeData } from './types';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions'; // endpoint OpenAI-compatible[web:15][web:229]

const DEFAULT_MODEL = process.env.GROQ_MODEL_ID ?? 'llama-3.3-70b-versatile';

if (!process.env.GROQ_API_KEY) {
  // falhar cedo ajuda a identificar problemas de config
  console.warn('GROQ_API_KEY não definido. A extração de ingredientes via IA não irá funcionar.');
}

type GroqChatCompletionResponse = {
  choices: { message: { content: string | null } }[];
};

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
- inferred: true se você precisou inferir quantidade ou unidade (por exemplo se o usuário escreveu "2 colher de farinha").
- suggestions: lista de sugestões alternativas apenas quando houver inferência de unidade, ex:
  - ["2 colheres (sopa)", "2 colheres (café)"].

REGRAS PARA INGREDIENTES:
- Nunca invente ingredientes que não estejam implícitos no texto.
- Quando a unidade estiver ausente ou ambígua (ex: "2 colher de farinha"):
  - tente inferir a unidade mais provável (ex: "colher (sopa)") baseado em práticas culinárias comuns.
  - marque inferred = true e inclua sugestões.
- Mantenha os nomes em português e em caixa-baixa, exceto nomes próprios.

UTENSÍLIOS:
- name: nome do utensílio, ex: "Liquidificador", "Refratário", "Forno", "Panela média".
- Considere utensílios inferidos logicamente do modo de preparo (ex: se fala "leve ao forno", inclua "Forno").

CLASSIFICAÇÃO DA RECEITA:

3.1) primaryGroup (grupo principal de nutrientes)
Escolha UM dos valores abaixo, em MAIÚSCULAS:
- "CARBOIDRATOS": receitas base de massas, pães, bolos, arroz, batata, mandioca, etc.
- "REGULADORES": destaque para frutas, verduras e legumes.
- "CONSTRUTORES": foco em proteínas (carnes, peixes, aves, ovos, leite, queijos, leguminosas).
- "CALCIO": quando o destaque principal for cálcio (ex.: laticínios).
- "LIPIDIOS": receitas predominantemente gordurosas (frituras, molhos muito gordurosos).
- "OUTROS": quando nada acima for claramente predominante.

3.2) mainCategories (categorias culinárias principais)
Lista de strings em minúsculas.
Use 1 a 3 tags dentre, por exemplo:
- "carne", "peixe", "ave", "ovo"
- "pão", "bolo", "biscoito", "massa", "torta"
- "sopa", "salada", "arroz", "doce de colher", "bebida", etc.

3.3) nutritionTags (tags nutricionais)
Lista de strings em minúsculas.
Use tags como:
- "nutritivo"
- "rico em açucar"
- "alto em gordura"
- "rico em cálcio"
- "rico em fibras"
- "vegano"
- "vegetariano"
- "natural"
- "ultraprocessado"
Escolha apenas tags que façam sentido com os ingredientes identificados.

3.4) courseTypes (tipo de prato / ocasião)
Lista de strings em minúsculas, 1 a 2 tags.
Use valores como:
- "prato principal"
- "entrada"
- "sobremesa"
- "lanche"
- "café da manhã"
- "café da tarde"
- "acompanhamento"

SAÍDA:
Você DEVE responder APENAS com um JSON válido, no seguinte formato exato:

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
    "courseTypes": ["sobremesa", "lanche"]
  }
}

NÃO inclua nenhum texto fora do JSON. Somente o objeto JSON.
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
      max_tokens: 1024,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: instructions,
        },
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
    parsed = JSON.parse(content) as ParsedRecipeData;
  } catch (error) {
    console.error('Erro ao fazer parse do JSON retornado pela IA:', content);
    throw new Error('A resposta da IA não está em formato JSON válido.');
  }

  const ingredients = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
  const utensils = Array.isArray(parsed.utensils) ? parsed.utensils : [];

  const classification = parsed.classification ?? {
    primaryGroup: 'OUTROS',
    mainCategories: [],
    nutritionTags: [],
    courseTypes: [],
  };

  return {
    ingredients,
    utensils,
    classification,
  };
}
