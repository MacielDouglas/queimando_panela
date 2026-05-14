export type ParsedIngredient = {
  amount: string | null;
  unit: string | null;
  name: string;
  originalText: string;
  inferred?: boolean;
  suggestions?: string[];
};

export type ParsedUtensil = {
  name: string;
};

// Grupo principal nutricional (modelo dos livros escolares BR)
export type PrimaryNutrientGroup =
  | 'CARBOIDRATOS'
  | 'REGULADORES' // frutas, verduras, legumes
  | 'CONSTRUTORES' // proteínas: carnes, ovos, leite, leguminosas
  | 'CALCIO'
  | 'LIPIDIOS'
  | 'OUTROS';

export type RecipeClassification = {
  primaryGroup: PrimaryNutrientGroup;

  /**
   * Categorias culinárias principais (tags).
   * Exemplos: "carne", "peixe", "ave", "pão", "bolo", "massa", "sopa", "salada", "bebida", etc.
   */
  mainCategories: string[];

  /**
   * Tags nutricionais.
   * Exemplos: "nutritivo", "rico em açucar", "alto em gordura", "rico em cálcio",
   * "rico em fibras", "vegano", "vegetariano", "natural", etc.
   */
  nutritionTags: string[];

  /**
   * Tipo de prato / ocasião.
   * Exemplos: "prato principal", "entrada", "sobremesa", "lanche", "café da manhã", "café da tarde".
   */
  courseTypes: string[];

  typeSuggestions: string[]; // até 3 sugestões de tipo ex: ["Bolo", "Torta", "Biscoito"]
};

export type ParsedRecipeData = {
  ingredients: ParsedIngredient[];
  utensils: ParsedUtensil[];
  classification: RecipeClassification;
};
