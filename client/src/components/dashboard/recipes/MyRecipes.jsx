import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../helper/Loading";
import { useState } from "react";
import Modal from "../../modal/Modal";
import { useMutation } from "@apollo/client";
import { DELETE_RECIPE } from "../../../graphql/mutation/recipe.mutation";
import useToast from "../../../hooks/useToast";

export default function MyRecipes() {
  const user = useSelector((state) => state.auth.user);
  const { recipes, loading } = useSelector((state) => state.recipes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const { showSuccess, showError } = useToast();

  const navigate = useNavigate();

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    onCompleted: async (data) => {
      if (data) await showSuccess("Receita excluída com sucesso!");
    },

    onError: (error) => {
      showError(error.message);
    },
  });

  const myRecipes = recipes.filter((recipe) => recipe.userId === user.id);

  const handleDelete = (recipeId, recipeName) => {
    setModalContent(
      <div>
        <h2 className="text-xl font-semibold mb-4">Confirmação de Exclusão</h2>

        <p className="flex flex-col gap-2">
          Tem certeza de que deseja excluir esta receita?{" "}
          <span className="text-center font-semibold">{recipeName}</span>
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              deleteRecipe({
                variables: { recipeId: recipeId },
              });
              // Função para deletar receita
              console.log(`Deletando receita ${recipeId}`);
              setIsModalOpen(false);
            }}
          >
            Deletar
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  if (loading) return <Loading />;

  return (
    <section className="max-w-4xl mx-auto m-3  w-full  flex flex-col items-center gap-4">
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
        Minhas Receitas Enviadas: {myRecipes.length}
      </motion.h1>

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
            {myRecipes.map((recipe) => (
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
                    className="border py-1 px-3 rounded-md text-blue-600 hover:text-white hover:bg-blue-500 "
                    onClick={() =>
                      navigate(`/dashboard?tab=/editedRecipe/${recipe.slug}`)
                    }
                  >
                    Editar
                  </button>
                  <button
                    className="border py-1 px-3 rounded-md text-red-600 hover:text-white hover:bg-red-500 mr-2"
                    onClick={() => handleDelete(recipe.id, recipe.title)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.5,
        }}
        className="flex gap-5 justify-center w-full flex-wrap"
      >
        <Link
          to={"/dashboard?tab=newRecipe"}
          className="border bg-yellow-400 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-yellow-950"
        >
          Criar Receita
        </Link>

        <Link
          to={"/dashboard?tab=saveRecipe"}
          className="border bg-stone-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-stone-100"
        >
          Receitas Salvas
        </Link>
      </motion.div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </section>
  );
}
