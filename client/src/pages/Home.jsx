import { useDispatch, useSelector } from "react-redux";
import Loading from "../helper/Loading";
import Login from "./Login";
import RecipeCard from "../components/cards/RecipeCard";
import { useEffect } from "react";
import { fetchRecipes } from "../features/recipes/recipesThunck";
import HomeRecipe from "../components/HomeRecipe";

export default function Home() {
  // const dispatch = useDispatch();
  // const { recipes, loading, error } = useSelector((state) => state.recipes);

  // useEffect(() => {
  //   dispatch(fetchRecipes());
  // }, [dispatch]);

  // console.log("RECIPES: ", recipes);

  // const loading = true;
  // if (loading) return <Loading />;

  // if (error) return <p>Error: {error}</p>;

  const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    console.log("User: ", user);

    if (!user) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div>
          <h1>BEm vindo, {user.name}</h1>
          <p>Admin: {user.isAdmin}</p>
          <p>Username: {user.username}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-pattern bg-cover">
      <div>
        <HomeRecipe />
        <h1>Home</h1>
      </div>
      <Login />
      <Profile />
      {/* {loading && <Loading />} */}
    </div>
  );
}
