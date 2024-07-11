import { useEffect } from "react";
import RecipeCard from "./cards/RecipeCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipes/recipesThunck";
import Loading from "../helper/Loading";

export default function HomeRecipe() {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch, recipes]);

  console.log("RECIPES: ", recipes[0]);

  if (loading) return <Loading />;
  if (error) return <Loading />;

  return (
    <div className="w-full md:h-[700px] flex flex-col md:grid lg:grid-cols-3 md:grid-cols-2 grid-rows-2">
      <div className="lg:col-span-2 bg-slate-500 max-w-full max-h-full">
        <RecipeCard recipe={recipes[2]} />
      </div>
      <div className="bg-green-500 lg:row-span-2 max-w-full max-h-full">
        <RecipeCard recipe={recipes[1]} />
      </div>
      <div className="bg-yellow-500 max-w-full max-h-full">
        <RecipeCard recipe={recipes[1]} />
      </div>
      <div className="bg-red-500 max-w-full max-h-full">
        <RecipeCard recipe={recipes[0]} />
      </div>
    </div>
  );
}
