'use client';

type Props = {
  value: string;
  suggestions: string[];
  onChange: (value: string) => void;
};

export function TypeSelector({ value, suggestions, onChange }: Props) {
  return (
    <div className="space-y-2">
      {/* Chips de sugestão da IA */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                value === s
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Campo livre */}
      <input
        name="type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          suggestions.length > 0 ? 'Selecione acima ou digite...' : 'Ex: Bolo, Sopa, Salada...'
        }
        className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
      />
    </div>
  );
}
