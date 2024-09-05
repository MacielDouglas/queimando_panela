import { Link, useParams } from "react-router-dom";
import { ALL_RECIPES } from "../graphql/queries/recipe.query";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Loading from "../helper/Loading";
import { motion } from "framer-motion";

// Função para embaralhar as receitas
const shuffleArray = (array) => {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item);
};

export default function Category() {
  const { category } = useParams();
  const [searchCategory, { loading }] = useLazyQuery(ALL_RECIPES);
  const [shuffledRecipes, setShuffledRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      const response = await searchCategory({
        variables: {
          input: {
            category: category,
          },
        },
      });
      if (response?.data) {
        setShuffledRecipes(shuffleArray(response.data.getRecipes));
      }
    };
    fetchData();
  }, [category, searchCategory]);

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

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [loading]);

  if (showLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto flex flex-col text-center font-noto gap-16 py-10 ">
      <motion.h1
        className="uppercase font-oswald text-2xl lg:text-[40px] font-bold text-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 0.6,
        }}
      >
        {category}
      </motion.h1>
      <div>
        <div className="flex justify-center items-center gap-10 mb-20">
          <div className="border-t-2 w-full border-stone-300"></div>
          <h2 className="font-bold uppercase text-nowrap text-sm sm:text-xl">
            Encontrado: {shuffledRecipes.length} receitas
          </h2>
          <div className="border-t-2 w-full border-stone-300"></div>
        </div>

        <motion.ul
          className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.9,
          }}
        >
          {currentRecipes.map((recipe) => (
            <li key={recipe.id} className="mb-5 max-h-72">
              <Link
                to={`/recipe/${recipe.slug}`}
                className="block w-full h-full text-start"
              >
                <img
                  className="object-cover w-full h-[13rem]  z-20"
                  src={recipe.image}
                  alt={`Imagem da receita ${recipe.title}`}
                />
                <motion.p
                  className="pt-2 text-stone-600  z-10"
                  initial={{ opacity: 0, y: -200 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                    delay: 1.2,
                  }}
                >
                  {recipe.title}
                </motion.p>
              </Link>
            </li>
          ))}
        </motion.ul>
      </div>
      <div className="flex justify-center">
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
  );
}
