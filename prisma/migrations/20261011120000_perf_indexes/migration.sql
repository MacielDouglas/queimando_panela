-- Otimização Home + /receitas (mobile, menos consultas ao Neon)
-- 1) pg_trgm: busca ILIKE em title/summary usa índice GIN em vez de seq scan.
-- 2) Compostos (isPublished, createdAt/updatedAt): listagens ordenadas por data.
-- 3) Cobertura da capa: WHERE recipeId ORDER BY isCover, "order".

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Recipe_isPublished_createdAt_idx"
  ON "Recipe" ("isPublished", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "Recipe_isPublished_updatedAt_idx"
  ON "Recipe" ("isPublished", "updatedAt" DESC);

CREATE INDEX IF NOT EXISTS "Recipe_title_trgm_idx"
  ON "Recipe" USING gin ("title" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Recipe_summary_trgm_idx"
  ON "Recipe" USING gin ("summary" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "RecipeImage_recipeId_isCover_order_idx"
  ON "RecipeImage" ("recipeId", "isCover", "order");
