import { NextRequest, NextResponse } from 'next/server';
import { spellCheckRecipeFields } from '@/server/ai/groq/spell-checker';
import type { SpellCheckFields } from '@/server/ai/groq/spell-checker';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SpellCheckFields;
    const result = await spellCheckRecipeFields(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
