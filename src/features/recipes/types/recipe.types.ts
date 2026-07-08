export type RecipeDifficultyValue =
  | 'EASY'
  | 'EASY_MEDIUM'
  | 'MEDIUM'
  | 'MEDIUM_HARD'
  | 'HARD';

export const difficultyLabel: Record<RecipeDifficultyValue, string> = {
  EASY: 'Fácil',
  EASY_MEDIUM: 'Fácil / Médio',
  MEDIUM: 'Médio',
  MEDIUM_HARD: 'Médio / Difícil',
  HARD: 'Difícil',
};
