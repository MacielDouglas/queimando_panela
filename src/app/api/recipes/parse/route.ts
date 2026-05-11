import { NextResponse } from 'next/server';
import { extractIngredientsAndUtensilsFromGroq } from '@/server/ai/groq/ingredient-extractor';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      modeOfPreparation?: string;
    } | null;

    const modeOfPreparation = body?.modeOfPreparation ?? '';

    if (!modeOfPreparation.trim()) {
      return NextResponse.json({ error: 'modeOfPreparation é obrigatório.' }, { status: 400 });
    }

    const parsed = await extractIngredientsAndUtensilsFromGroq(modeOfPreparation);
    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error('Erro em /api/recipes/parse:', error);
    return NextResponse.json(
      { error: 'Não foi possível analisar o modo de preparo.' },
      { status: 500 },
    );
  }
}
