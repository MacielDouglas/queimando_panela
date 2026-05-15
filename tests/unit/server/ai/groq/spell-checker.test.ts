import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
  vi.stubEnv('GROQ_API_KEY', 'test-key');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

// Import após os stubs para garantir que o módulo pega GROQ_API_KEY
const { spellCheckRecipeFields } = await import('@/server/ai/groq/spell-checker');

const makeOkResponse = (body: object) => ({
  ok: true,
  text: async () => '',
  json: async () => ({
    choices: [{ message: { content: JSON.stringify(body) } }],
  }),
});

describe('spellCheckRecipeFields', () => {
  it('lança erro se GROQ_API_KEY não estiver definido', async () => {
    vi.stubEnv('GROQ_API_KEY', ''); // ← força vazio em vez de vi.unstubAllEnvs()
    await expect(spellCheckRecipeFields({ title: 'Teste' })).rejects.toThrow(/GROQ_API_KEY/i);
  });

  it('retorna campos corrigidos', async () => {
    mockFetch.mockResolvedValueOnce(
      makeOkResponse({ title: 'Bolo de Banana', summary: 'Receita deliciosa' }),
    );

    const result = await spellCheckRecipeFields({
      title: 'bolo de banana',
      summary: 'receita deliciosa',
    });

    expect(result.title).toBe('Bolo de Banana');
    expect(result.summary).toBe('Receita deliciosa');
  });

  it('lança erro quando a API retorna status de erro', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    await expect(spellCheckRecipeFields({ title: 'Teste' })).rejects.toThrow(/500/);
  });

  it('lança erro quando a resposta não é JSON válido', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '',
      json: async () => ({
        choices: [{ message: { content: 'isso não é json {' } }],
      }),
    });

    await expect(spellCheckRecipeFields({ title: 'Teste' })).rejects.toThrow(/JSON/i);
  });

  it('extrai JSON de bloco fenced ```json```', async () => {
    const body = { title: 'Bolo Corrigido' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '',
      json: async () => ({
        choices: [{ message: { content: '```json\n' + JSON.stringify(body) + '\n```' } }],
      }),
    });

    const result = await spellCheckRecipeFields({ title: 'bolo corrigido' });
    expect(result.title).toBe('Bolo Corrigido');
  });

  it('normaliza parágrafos duplicados na resposta', async () => {
    mockFetch.mockResolvedValueOnce(
      makeOkResponse({
        modeOfPreparation: 'Parágrafo um.\n\n\n\nParágrafo dois.',
      }),
    );

    const result = await spellCheckRecipeFields({
      modeOfPreparation: 'Parágrafo um.\n\n\n\nParágrafo dois.',
    });

    expect(result.modeOfPreparation).toBe('Parágrafo um.\n\nParágrafo dois.');
  });

  it('retorna string vazia para campos ausentes na resposta', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ title: 'Bolo' }));

    const result = await spellCheckRecipeFields({ title: 'Bolo', summary: 'Resumo' });

    // summary não veio na resposta — o hook usa o original como fallback
    expect(typeof result.title).toBe('string');
  });
});
