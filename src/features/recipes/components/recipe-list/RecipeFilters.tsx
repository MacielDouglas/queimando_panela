import Link from 'next/link';
import type { RecipeDifficultyValue } from '../../types/recipe.types';

type FilterOption = {
  label: string;
  value: string;
};

type Props = {
  currentQuery?: string;
  currentCategory?: string;
  currentDifficulty?: RecipeDifficultyValue | '';
  currentTypes?: string[];
  currentUtensils?: string[];
  currentIngredients?: string[];

  categories: FilterOption[];
  types: FilterOption[];
  utensils: FilterOption[];
  ingredients: FilterOption[];
};

const difficultyOptions: {
  label: string;
  value: '' | RecipeDifficultyValue;
}[] = [
  { label: 'Qualquer dificuldade', value: '' },
  { label: 'Fácil', value: 'EASY' },
  { label: 'Fácil / Médio', value: 'EASY_MEDIUM' },
  { label: 'Médio', value: 'MEDIUM' },
  { label: 'Médio / Difícil', value: 'MEDIUM_HARD' },
  { label: 'Difícil', value: 'HARD' },
];

function buildHref(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/receitas?${query}` : '/receitas';
}

function buildBaseParams({
  currentQuery,
  currentCategory,
  currentDifficulty,
  currentTypes = [],
  currentUtensils = [],
  currentIngredients = [],
}: Omit<Props, 'categories' | 'types' | 'utensils' | 'ingredients'>) {
  const params = new URLSearchParams();
  if (currentQuery) params.set('q', currentQuery);
  if (currentCategory) params.set('categoria', currentCategory);
  if (currentDifficulty) params.set('dificuldade', currentDifficulty);
  currentTypes.forEach((item) => {
    params.append('tipo', item);
  });
  currentUtensils.forEach((item) => {
    params.append('utensilio', item);
  });
  currentIngredients.forEach((item) => {
    params.append('ingrediente', item);
  });
  return params;
}

function setSingleParam(base: URLSearchParams, key: string, value?: string) {
  const params = new URLSearchParams(base.toString());
  params.delete('page');
  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  return buildHref(params);
}

function toggleMultiParam(base: URLSearchParams, key: string, value: string) {
  const params = new URLSearchParams(base.toString());
  const current = params.getAll(key);
  const hasValue = current.includes(value);
  params.delete('page');
  params.delete(key);
  const nextValues = hasValue
    ? current.filter((item) => item !== value)
    : [...current, value];
  nextValues.forEach((item) => {
    params.append(key, item);
  });
  return buildHref(params);
}

function clearFilters(base: URLSearchParams) {
  const params = new URLSearchParams();
  const q = base.get('q');
  if (q) params.set('q', q);
  return buildHref(params);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-1 w-6"
        style={{ background: 'var(--food-accent)' }}
        aria-hidden
      />
      <p
        className="text-[0.78rem] font-bold uppercase"
        style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
      >
        {children}
      </p>
    </div>
  );
}

function ChipLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const activeStyle = {
    background: 'var(--cocoa)',
    color: 'white',
    borderColor: 'var(--cocoa)',
  } as const;
  const inactiveStyle = {
    background: 'white',
    color: 'var(--cocoa)',
    borderColor: 'var(--line)',
  } as const;

  return (
    <Link
      href={href}
      className="rounded-full border px-3 py-1.5 text-[0.78rem] font-bold uppercase transition-colors hover:opacity-90"
      style={active ? activeStyle : inactiveStyle}
    >
      <span style={{ letterSpacing: '0.04em' }}>{children}</span>
    </Link>
  );
}

function FilterGroup({
  title,
  options,
  activeValues,
  getHref,
}: {
  title: string;
  options: FilterOption[];
  activeValues: string[];
  getHref: (value: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <div
      className="space-y-3 pt-5"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <ChipLink
            key={option.value}
            href={getHref(option.value)}
            active={activeValues.includes(option.value)}
          >
            {option.label}
          </ChipLink>
        ))}
      </div>
    </div>
  );
}

export function RecipeFilters({
  currentQuery,
  currentCategory,
  currentDifficulty,
  currentTypes = [],
  currentUtensils = [],
  currentIngredients = [],
  categories,
  types,
  utensils,
  ingredients,
}: Props) {
  const baseParams = buildBaseParams({
    currentQuery,
    currentCategory,
    currentDifficulty,
    currentTypes,
    currentUtensils,
    currentIngredients,
  });

  const hasActiveFilters =
    !!currentCategory ||
    !!currentDifficulty ||
    currentTypes.length > 0 ||
    currentUtensils.length > 0 ||
    currentIngredients.length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SectionTitle>Categoria</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <ChipLink
            href={setSingleParam(baseParams, 'categoria', undefined)}
            active={!currentCategory}
          >
            Todas
          </ChipLink>
          {categories.map((cat) => (
            <ChipLink
              key={cat.value}
              href={setSingleParam(baseParams, 'categoria', cat.value)}
              active={currentCategory === cat.value}
            >
              {cat.label}
            </ChipLink>
          ))}
        </div>
      </div>

      <FilterGroup
        title="Ingredientes"
        options={ingredients.slice(0, 12)}
        activeValues={currentIngredients}
        getHref={(value) => toggleMultiParam(baseParams, 'ingrediente', value)}
      />

      <div
        className="space-y-3 pt-5"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <SectionTitle>Dificuldade</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((item) => {
            const active =
              item.value === ''
                ? !currentDifficulty
                : currentDifficulty === item.value;
            return (
              <ChipLink
                key={item.value || 'ALL'}
                href={setSingleParam(
                  baseParams,
                  'dificuldade',
                  item.value || undefined,
                )}
                active={active}
              >
                {item.label}
              </ChipLink>
            );
          })}
        </div>
      </div>

      <FilterGroup
        title="Tipos"
        options={types}
        activeValues={currentTypes}
        getHref={(value) => toggleMultiParam(baseParams, 'tipo', value)}
      />

      <FilterGroup
        title="Utensílios"
        options={utensils.slice(0, 6)}
        activeValues={currentUtensils}
        getHref={(value) => toggleMultiParam(baseParams, 'utensilio', value)}
      />

      {hasActiveFilters && (
        <div className="pt-5" style={{ borderTop: '1px solid var(--line)' }}>
          <Link
            href={clearFilters(baseParams)}
            className="inline-flex rounded-full bg-white px-4 py-2 text-[0.78rem] font-bold uppercase transition-colors hover:text-white"
            style={{
              border: '1px solid var(--line)',
              color: 'var(--cocoa)',
              letterSpacing: '0.04em',
            }}
          >
            Limpar filtros
          </Link>
        </div>
      )}
    </div>
  );
}
