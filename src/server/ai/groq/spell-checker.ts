const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL_ID ?? 'llama-3.3-70b-versatile';

export type SpellCheckFields = {
  title?: string;
  summary?: string;
  story?: string;
  modeOfPreparation?: string;
  suggestions?: string;
  notesAuthor?: string;
  notesPublic?: string;
};

export type SpellCheckResult = SpellCheckFields;

type GroqChatCompletionResponse = {
  choices: { message: { content: string | null } }[];
};

function normalizeparagraphs(text: string): string {
  if (!text?.trim()) return text;
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');
}

export async function spellCheckRecipeFields(fields: SpellCheckFields): Promise<SpellCheckResult> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY não configurado no ambiente.');
  }

  const systemPrompt = `
Você é um revisor ortográfico e gramatical especializado em textos culinários em português brasileiro.

TAREFAS:
1) Corrija erros ortográficos, gramaticais e de concordância.
2) Normalize parágrafos: garanta exatamente uma linha em branco entre parágrafos (\n\n).
   - Se o usuário não separou os parágrafos, identifique e separe.
   - Se usou mais de uma linha em branco, reduza para uma.
3) Mantenha o estilo, tom e voz originais do autor.
4) Não reescreva nem amplie o conteúdo — apenas corrija e normalize.
5) Se um campo estiver vazio ou ausente no JSON de entrada, retorne-o como string vazia "".

SAÍDA:
Responda APENAS com JSON válido no mesmo formato do input. Nenhum texto fora do JSON.
`.trim();

  const input = JSON.stringify(fields, null, 2);

  const response = await fetch(GROQ_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.1,
      max_tokens: 2048,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Falha na Groq API (status ${response.status}): ${text}`);
  }

  const completion = (await response.json()) as GroqChatCompletionResponse;
  const content = completion.choices[0]?.message?.content ?? '';

  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const clean = fenced?.[1]?.trim() ?? content.trim();

  let parsed: SpellCheckResult;
  try {
    parsed = JSON.parse(clean) as SpellCheckResult;
  } catch {
    throw new Error('Resposta da IA não está em formato JSON válido.');
  }

  // Normalização defensiva de parágrafos no cliente também
  return Object.fromEntries(
    Object.entries(parsed).map(([k, v]) => [k, typeof v === 'string' ? normalizeparagraphs(v) : v]),
  ) as SpellCheckResult;
}
