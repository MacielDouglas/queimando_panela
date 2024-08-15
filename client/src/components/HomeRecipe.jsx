import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipes/recipesThunck";
import Loading from "../helper/Loading";
import RecipeCard from "./cards/RecipeCard";

export default function HomeRecipe() {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    // Força o dispatch sempre que o componente monta
    dispatch(fetchRecipes());
  }, [dispatch, recipes]);

  // Tratamento de loading e erros
  if (loading || error || !recipes || recipes.length === 0) return <Loading />;

  const gridClasses = [
    "bg-pattern lg:col-span-2 ",
    "bg-pattern lg:row-span-3",
    "bg-pattern",
    "bg-pattern",
  ];

  const latestRecipes = recipes.slice(-4).reverse();

  return (
    <div className="w-full md:h-[800px] flex flex-col md:grid lg:grid-cols-3 md:grid-cols-2 grid-rows-2 text-white">
      {latestRecipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          extraClasses={gridClasses[index]}
        />
      ))}
    </div>
  );
}
