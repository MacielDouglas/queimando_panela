import { Link } from "react-router-dom";
import recipeIcons from "../assets/recipes/icons";
import { motion } from "framer-motion";
import recipeCategories from "../constants/recipeCategories.js";
import { useSelector } from "react-redux";
import Loading from "../helper/Loading.jsx";
import { useEffect, useState } from "react";

const recipeImage =
  "https://firebasestorage.googleapis.com/v0/b/queimando-panela.appspot.com/o/recipe%2F1722535207622receita_cozinhando.jpg?alt=media&token=243cb3c2-b0b6-4cf3-b20c-41449fcdd35c";

const isLongText = (text) => text.length > 13;

// Função para embaralhar as receitas
const shuffleArray = (array) => {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item);
};

export default function Recipes() {
  const { recipes, loading } = useSelector((state) => state.recipes);
  const [shuffledRecipes, setShuffledRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  useEffect(() => {
    // Embaralhar receitas apenas uma vez ao montar o componente
    setShuffledRecipes(shuffleArray(recipes));
  }, [recipes]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = shuffledRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const totalPages = Math.ceil(shuffledRecipes.length / recipesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto flex flex-col text-center font-noto gap-16 py-10 ">
      <img
        className="w-full object-cover max-h-[450px]"
        src={recipeImage}
        alt="imagem de alimentos prontos para serem preparados"
      />

      <h1 className="font-oswald text-xl  sm:text-2xl text-stone-900 uppercase tracking-widest mx-2">
        receitas por categoria e outras ideias
      </h1>

      <div className="w-full">
        <div className="flex justify-center items-center gap-10">
          <div className="border-t-2 w-full border-stone-300"></div>
          <h2 className="font-bold uppercase text-nowrap text-sm sm:text-xl">
            Escolha uma categoria
          </h2>
          <div className="border-t-2 w-full border-stone-300"></div>
        </div>

        <div className="w-full flex items-center justify-center lg:h-60 py-4">
          <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:flex lg:flex-wrap lg:justify-center lg:gap-6">
            {recipeCategories?.map((category) => (
              <motion.li
                key={category}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.1 }}
                transition={{ type: "just", stiffness: 1000, damping: 20 }}
                className={` hover:bg-yellow-400 p-4 cursor-pointer group border border-stone-400   ${
                  isLongText(category) ? "col-span-2" : ""
                }`}
              >
                <Link
                  to={`/category/${category}`}
                  className="flex flex-col items-center "
                >
                  <img
                    src={recipeIcons[category]}
                    alt={category}
                    className="w-8 h-8 relative"
                  />
                  <p className=" lg:hidden group-hover:block">{category}</p>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full flex flex-col gap-20 px-2 sm:">
        <div className="flex justify-center items-center gap-10">
          <div className="border-t-2 w-full border-stone-300"></div>
          <h2 className="font-bold uppercase text-nowrap text-sm sm:text-xl">
            Algumas sugestões:
          </h2>
          <div className="border-t-2 w-full border-stone-300"></div>
        </div>
        <div className="max-w-5xl mx-auto py-4">
          <ul className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {currentRecipes.map((recipe) => (
              <li key={recipe.id} className="mb-5">
                <Link
                  to={`/recipe/${recipe.slug}`}
                  className="block w-full h-full text-start"
                >
                  <img
                    className="object-cover w-full h-[13rem]"
                    src={recipe.image}
                    alt={`Imagem da receita ${recipe.title}`}
                  />
                  <p className="pt-2 text-stone-600">{recipe.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center mt-10">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 ${
                currentPage === index + 1
                  ? "bg-stone-600 text-white"
                  : "bg-stone-200 text-stone-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
