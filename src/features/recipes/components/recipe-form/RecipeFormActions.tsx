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
        className="button-ai min-h-12 w-full"
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
      <p
        className="font-sans text-xs leading-5"
        style={{ color: 'var(--ink-muted)' }}
      >
        A IA retorna utensílios, nutrição, tempo e classificação. Você revisa
        tudo antes de publicar — nada é salvo automático.
      </p>
      {aiError && (
        <p
          className="rounded-[var(--radius-md)] border bg-white px-4 py-3 font-sans text-sm"
          style={{ borderColor: 'var(--line)', color: 'var(--destructive)' }}
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
      className="button-queimando-panela button-primary-queimando-panela min-h-12 w-full"
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
