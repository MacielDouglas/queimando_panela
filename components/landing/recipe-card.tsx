import { ChefHat, Clock3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { RecipeMock } from "@/lib/mock-data";

export function RecipeCard({ recipe }: { recipe: RecipeMock }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-border/60 bg-card p-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-900 backdrop-blur hover:bg-white">
            {recipe.category}
          </Badge>
          {recipe.classic && (
            <Badge
              variant="secondary"
              className="rounded-full bg-amber-500 text-white hover:bg-amber-500"
            >
              Clássica
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
          <div className="flex items-center gap-3 text-xs font-medium text-white">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" /> {recipe.time}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" /> {recipe.servings}
            </span>
            <span className="inline-flex items-center gap-1">
              <ChefHat className="size-3.5" /> {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight">
          {recipe.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>
        <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
          <span className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800">
            {recipe.author.avatar}
          </span>
          por {recipe.author.name}
        </div>
      </CardContent>
    </Card>
  );
}
