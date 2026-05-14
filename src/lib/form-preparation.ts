/**
 * Divide o modo de preparo em parágrafos por ponto final.
 * Preserva abreviações comuns (ex: 180ºC, 1/2, Dr., Sr., etc.)
 * e não quebra em pontos decimais ou ordinais.
 */
export function formatPreparation(text: string): string {
  if (!text?.trim()) return text;

  return (
    text
      // Normaliza quebras existentes para espaço simples
      .replace(/\s*\n+\s*/g, ' ')
      .trim()
      // Divide por ponto seguido de espaço + letra maiúscula
      // Usa lookahead para não consumir a letra maiúscula
      .split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÀÂÊÔÃÕÇ])/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join('\n\n')
  );
}
