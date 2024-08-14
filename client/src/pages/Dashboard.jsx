import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DashSidebar from "../components/dashboard/DashSidebar";
import Profile from "../components/dashboard/profile/Profile";
import UpdateProfile from "../components/dashboard/profile/UpdateProfile";
import NewRecipe from "../components/dashboard/recipes/NewRecipe";
import MyRecipes from "../components/dashboard/recipes/MyRecipes";
import SaveRecipes from "../components/dashboard/recipes/SaveRecipes";
import EditRecipe from "../components/dashboard/recipes/EditRecipe";

export default function Dashboard() {
  const location = useLocation();

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || ""
  );

  // Efeito para atualizar a aba com base nos parâmetros da URL
  useEffect(() => {
    // Extrair o valor do parâmetro "tab" da URL
    const tabFromUrl = new URLSearchParams(location.search).get("tab");

    // Definir a aba com base no valor da URL, ou manter vazio se não estiver presente
    setTab(tabFromUrl || "");
  }, [location.search]);

  // Função para extrair o ID do post da URL
  const getUpdateRecipeFromTab = () => {
    const match = tab.match(/^\/editedRecipe\/(.+)/);
    return match ? match[1] : null;
  };

  const recipeSlug = getUpdateRecipeFromTab();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-200">
      <div className="md:w-56">{<DashSidebar />}</div>
      {tab === "profile" && <Profile />}
      {tab === "updateProfile" && <UpdateProfile />}
      {tab === "newRecipe" && <NewRecipe />}
      {tab === "saveRecipe" && <SaveRecipes />}
      {tab === "myRecipes" && <MyRecipes />}
      {tab === "editedRecipe/:slug" && <EditRecipe />}
      {recipeSlug && <EditRecipe recipeSlug={recipeSlug} />}
      {/* {tab === "posts" && <DashPosts />} */}
      {/* {tab === "newPost" && <CreatePost />} */}
      {/* {postSlug && <UpdatePost postSlug={postSlug} />} */}
    </div>
  );
}
