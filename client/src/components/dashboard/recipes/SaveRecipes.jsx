import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_FAVORITE } from "../../../graphql/mutation/user.mutation";
import useToast from "../../../hooks/useToast";

export default function SaveRecipes() {
  const user = useSelector((state) => state.auth.user);
  const { showSuccess, showError } = useToast();

  const myRecipes = user.mySavedRecipes;
  const { recipes } = useSelector((state) => state.recipes);
  const [savedMyRecipes, setSavedRecipe] = useState([]);
  const [savedRecipe] = useMutation(ADD_FAVORITE, {
    onCompleted: async (data) => {
      showSuccess(data.myRecipesSave.message);
    },

    onError: (error) => {
      showError(error.message);
    },
  });

  useEffect(() => {
    if (myRecipes && recipes.length > 0) {
      const filteredRecipes = myRecipes.map((id) =>
        recipes.find((recipe) => recipe.id === id)
      );

      // Filtra as receitas válidas (não undefined) e atualiza o estado
      setSavedRecipe(filteredRecipes.filter((recipe) => recipe));
    }
  }, [myRecipes, recipes]);

  const handleRemove = async (id) => {
    try {
      await savedRecipe({
        variables: {
          savedRecipe: {
            recipeId: id,
          },
        },
      });
    } catch (error) {
      showError(error.message);
      console.error(error.message);
    }
  };

  return (
    <section className="flex flex-col w-full items-start font-noto px-4 sm:px-8 md:px-20 lg:px-40 xl:px-52 py-8 bg-stone-100 gap-10">
      <motion.h1
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.5,
        }}
        className="font-oswald text-4xl border-b w-full pb-3 border-b-stone-600"
      >
        Receitas Salvas: {myRecipes.length}
      </motion.h1>
      {myRecipes.length === 0 ? (
        <>
          <h2>Você ainda não salvou nenhuma receita.</h2>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.9,
            }}
            className="overflow-x-auto w-full"
          >
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="w-full bg-gradient-to-b from-gray-100 to-gray-300 border-b">
                  <th className="px-4 text-left">image</th>
                  <th className="px-4 text-left">Título</th>
                  <th className="px-4 text-left">Data</th>
                  <th className="p-4 text-left">Categoria</th>
                  <th className="px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {savedMyRecipes.map((recipe) => (
                  <tr key={recipe.id} className="border-b hover:bg-gray-100">
                    <td className="p-4">
                      <Link to={`/recipe/${recipe.slug}`}>
                        <img
                          src={recipe.image}
                          alt={`imagem da recita ${recipe.title}`}
                          className="w-20 h-10 object-cover bg-stone-500"
                        />
                      </Link>
                    </td>
                    <td className="px-4 hover:font-semibold">
                      {" "}
                      <Link to={`/recipe/${recipe.slug}`}>{recipe.title} </Link>
                    </td>
                    <td className="px-4 text-xs">
                      {new Date(Number(recipe.createdAt)).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="p-4 hover:font-semibold">
                      <Link to={`/category/${recipe.category}`}>
                        {recipe.category}
                      </Link>
                    </td>
                    <td className="p-5 flex gap-2">
                      <button
                        className="border py-1 px-3 rounded-md text-red-600 hover:text-white hover:bg-red-500 mr-2"
                        onClick={() => handleRemove(recipe.id)}
                      >
                        remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.5,
        }}
        className="flex gap-5 justify-center  w-full flex-wrap"
      >
        <Link
          to={"/dashboard?tab=newRecipe"}
          className="border bg-yellow-400 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-yellow-950"
        >
          Criar Receita
        </Link>
        <Link
          to={"/dashboard?tab=myRecipes"}
          className="border bg-slate-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-slate-100"
        >
          Receitas enviadas
        </Link>
        {/* <Link
          to={"/dashboard?tab=saveRecipe"}
          className="border bg-stone-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-stone-100"
        >
          Receitas Salvas
        </Link> */}
      </motion.div>
    </section>
  );
}
