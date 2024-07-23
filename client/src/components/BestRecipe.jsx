import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipes/recipesThunck";
import BestRecipeCard from "./cards/BestRecipeCard";

export default function BestRecipe() {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipes);
  const [bestRecipes, setBestRecipes] = useState([]);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (recipes.length > 0) {
      const topThreeRecipes = recipes.reduce((topThree, recipe) => {
        const totalRatings = recipe.ratings.reduce(
          (sum, rating) => sum + rating.rating,
          0
        );
        const averageRating =
          recipe.ratings.length > 0 ? totalRatings / recipe.ratings.length : 0;
        const commentCount = recipe.ratings.length;

        const newRecipe = { ...recipe, averageRating, commentCount };

        // Insere a receita ordenada dentro das top três
        if (topThree.length < 3) {
          topThree.push(newRecipe);
          topThree.sort((a, b) => {
            if (b.averageRating === a.averageRating) {
              return b.commentCount - a.commentCount;
            }
            return b.averageRating - a.averageRating;
          });
        } else {
          const lowestTopRecipe = topThree[2];
          if (
            averageRating > lowestTopRecipe.averageRating ||
            (averageRating === lowestTopRecipe.averageRating &&
              commentCount > lowestTopRecipe.commentCount)
          ) {
            topThree[2] = newRecipe;
            topThree.sort((a, b) => {
              if (b.averageRating === a.averageRating) {
                return b.commentCount - a.commentCount;
              }
              return b.averageRating - a.averageRating;
            });
          }
        }

        return topThree;
      }, []);

      setBestRecipes(topThreeRecipes);
    }
  }, [recipes]);

  return (
    <section className="w-full bg-stone-100 text-center py-28 px-10">
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      <div className="flex flex-col gap-10 ">
        {bestRecipes.length > 0 ? (
          bestRecipes.map((recipe) => (
            <div key={recipe.id} className="flex-1">
              <BestRecipeCard recipe={recipe} />
            </div>
          ))
        ) : (
          <p>Não há receitas disponíveis.</p>
        )}
      </div>
    </section>
  );
}
