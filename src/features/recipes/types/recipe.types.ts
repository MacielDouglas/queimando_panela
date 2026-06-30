export type RecipeDifficultyValue =
  | "EASY"
  | "EASY_MEDIUM"
  | "MEDIUM"
  | "MEDIUM_HARD"
  | "HARD";

export const DIFFICULTY_OPTIONS = [
  { value: "EASY" as const, label: "Fácil" },
  { value: "EASY_MEDIUM" as const, label: "Fácil a Médio" },
  { value: "MEDIUM" as const, label: "Médio" },
  { value: "MEDIUM_HARD" as const, label: "Médio a Difícil" },
  { value: "HARD" as const, label: "Difícil" },
] as const;

export const difficultyLabel: Record<RecipeDifficultyValue, string> = {
  EASY: "Fácil",
  EASY_MEDIUM: "Fácil a Médio",
  MEDIUM: "Médio",
  MEDIUM_HARD: "Médio a Difícil",
  HARD: "Difícil",
};

// Alinhado a RecipeClassification.name (string livre no schema)
export const CLASSIFICATION_OPTIONS = [
  "Clássica",
  "Contemporânea",
  "Criativa",
  "Fusão",
  "Regional",
  "Outros",
] as const;

export type RecipeClassificationLabel = (typeof CLASSIFICATION_OPTIONS)[number];
