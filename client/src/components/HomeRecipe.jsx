import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipes/recipesThunck";
import Loading from "../helper/Loading";
import RecipeCard from "./cards/RecipeCard";

export default function HomeRecipe() {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  if (loading || error || !recipes || recipes.length === 0) return <Loading />;

  const gridClasses = [
    "lg:col-span-2",
    "bg-green-500 lg:row-span-2",
    "bg-yellow-500",
    "bg-red-500",
  ];

  const latestRecipes = recipes.slice(-4).reverse();

  return (
    <div className="w-full md:h-[700px] flex flex-col md:grid lg:grid-cols-3 md:grid-cols-2 grid-rows-2 text-white">
      {latestRecipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.slug}
          recipe={recipe}
          extraClasses={gridClasses[index]}
        />
      ))}
    </div>
  );
}
