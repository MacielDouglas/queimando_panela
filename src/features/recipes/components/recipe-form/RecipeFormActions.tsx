'use client';

import { Loader2, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  mode: 'create' | 'edit';
  isAnalyzing: boolean;
  isSaving: boolean;
  aiError: string | null;
  isReviewVisible: boolean;
  onAnalyze: () => void;
  onSave: () => void;
};

export function RecipeFormAnalyzeAction({
  isAnalyzing,
  mode,
  onAnalyze,
  aiError,
}: Pick<Props, 'isAnalyzing' | 'mode' | 'onAnalyze' | 'aiError'>) {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="min-h-12 w-full rounded-none bg-[#ffc733] px-5 text-sm font-bold uppercase tracking-[0.08em] text-[#0a0a0a] hover:bg-[#e6a700]"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Analisando com IA...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 size-4" />
            {mode === 'edit' ? 'Reanalisar com IA' : 'Analisar receita com IA'}
          </>
        )}
      </Button>
      <p className="font-sans text-xs leading-5 text-[#6b6b6b]">
        A IA retorna utensílios, nutrição, tempo e classificação. Você revisa
        tudo antes de publicar — nada é salvo automático.
      </p>
      {aiError && (
        <p
          className="border border-[#e5e5e5] bg-[#fff4f4] px-4 py-3 font-sans text-sm text-[#cc1f1f]"
          role="alert"
        >
          {aiError}
        </p>
      )}
    </div>
  );
}

export function RecipeFormSaveAction({
  isSaving,
  mode,
  onSave,
}: Pick<Props, 'isSaving' | 'mode' | 'onSave'>) {
  return (
    <Button
      type="button"
      onClick={onSave}
      disabled={isSaving}
      className="min-h-12 w-full rounded-none bg-[#0a0a0a] px-5 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-[#ffc733] hover:text-[#0a0a0a]"
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          {mode === 'edit' ? 'Salvando alterações...' : 'Salvando receita...'}
        </>
      ) : (
        <>
          <Save className="mr-2 size-4" />
          {mode === 'edit' ? 'Salvar alterações' : 'Salvar receita'}
        </>
      )}
    </Button>
  );
}
