import { NextRequest, NextResponse } from 'next/server';
import { generateRecipeFromGroq } from '@/server/ai/groq/recipe-generator';
import type { GenerateRecipeRequest } from '@/server/ai/groq/recipe-generator.types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRecipeRequest;

    if (!body.title?.trim() || !body.modeOfPreparation?.trim()) {
      return NextResponse.json(
        { error: 'Os campos "title" e "modeOfPreparation" são obrigatórios.' },
        { status: 400 },
      );
    }

    const data = await generateRecipeFromGroq(body.title.trim(), body.modeOfPreparation.trim());
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/recipes/generate]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno.' },
      { status: 500 },
    );
  }
}
