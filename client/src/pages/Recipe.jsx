import { useSelector } from "react-redux";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import recipeIcons from "../assets/recipes/icons";
import Loading from "../helper/Loading";
import RecipeCard from "../components/cards/RecipeCard";
import Ratings from "../components/Ratings";
import { useMutation } from "@apollo/client";
import { ADD_FAVORITE } from "../graphql/mutation/user.mutation";
import useToast from "../hooks/useToast";
import PropTypes from "prop-types";
import recipeCategories from "../constants/recipeCategories";

export default function Recipe() {
  const { recipes, loading } = useSelector((state) => state.recipes);
  const user = useSelector((state) => state.auth.user);
  const { slug } = useParams();
  const { showSuccess, showError } = useToast();
  const [recipe, setRecipe] = useState(null);
  const [category, setCategory] = useState([]);
  const [optionalItens, setOptionalItens] = useState([]);
  const [savedRecipe] = useMutation(ADD_FAVORITE, {
    onCompleted: async (data) => {
      showSuccess(data.myRecipesSave.message);
    },

    onError: (error) => {
      showError(error.message);
    },
  });

  useEffect(() => {
    const selectedRecipe = recipes.find((recipe) => recipe.slug === slug);
    const selectedCategory = recipes.filter(
      (item) => item.category === selectedRecipe?.category
    );

    setRecipe(selectedRecipe);
    setCategory(selectedCategory);

    if (selectedRecipe) {
      const { massa, recheio, cobertura, calda } = selectedRecipe;
      const newOptionalItems = {
        ...(massa?.content.length && { massa }),
        ...(recheio?.content.length && { recheio }),
        ...(cobertura?.content.length && { cobertura }),
        ...(calda?.content.length && { calda }),
      };

      setOptionalItens(newOptionalItems);
    } else {
      setOptionalItens([]);
    }
  }, [slug, recipes]);

  const totalRating = useMemo(
    () => recipe?.ratings.reduce((sum, rating) => sum + rating?.rating, 0),
    [recipe]
  );

  const averageRating = useMemo(
    () => totalRating / (recipe?.ratings.length || 1),
    [totalRating, recipe]
  );

  const renderStars = useCallback((rating) => {
    const fullStars = Math.floor(rating || 0);
    const emptyStars = 5 - fullStars;

    return (
      <>
        {Array.from({ length: fullStars }, (_, index) => (
          <IoStarSharp key={`full-${index}`} className="text-yellow-400 " />
        ))}
        {Array.from({ length: emptyStars }, (_, index) => (
          <IoStarOutline key={`empty-${index}`} className="text-yellow-400" />
        ))}
      </>
    );
  }, []);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoading(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [loading]);

  if (showLoading) return <Loading />;
  if (!recipe) return <p>Recipe not found</p>;

  const {
    title,
    category: recipeCategory,
    description,
    image,
    writer,
    time,
    difficult,
    ingredients,
    content,
    ratings,
    id,
  } = recipe;

  const handleAddRecipe = async (id) => {
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
    <div className="py-36 px-6 font-noto flex flex-col bg-stone-200 md:grid md:grid-cols-3">
      <div className="col-span-2">
        <div className="flex flex-col gap-6 bg-white p-6">
          {user && (
            <button
              onClick={() => handleAddRecipe(id)}
              className="self-end -mb-10 p-2 bg-yellow-300 text-xs hover:bg-yellow-500"
            >
              adicionar favoritas
            </button>
          )}
          <h1 className="font-oswald text-2xl lg:text-[40px] font-bold text-center mt-6 uppercase leading-10">
            {title}
          </h1>
          <motion.div
            className="flex justify-center h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:4px_4px] text-sm md:text-xl"
            initial={{ opacity: 0, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.7,
            }}
          >
            <div className="bg-white text-stone-600 px-6 flex gap-4 justify-center font-oswald items-center">
              <Link
                className="flex gap-2 items-center hover:text-stone-700 bg-white"
                to={`/category/${recipeCategory}`}
              >
                <img
                  className="w-4 h-4"
                  src={recipeIcons[recipeCategory]}
                  alt={`Ícone da categoria ${recipeCategory}`}
                />
                <p className="uppercase font tracking-wider">
                  {recipeCategory}
                </p>
              </Link>
              <div className="flex gap-1">{renderStars(averageRating)}</div>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col gap-5 bg-white p-6">
          <motion.p
            className="text-stone-800 pb-4 text-sm lg:text-lg"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              type: "just",
              stiffness: 90,
              damping: 30,
              delay: 1,
            }}
          >
            {description}
          </motion.p>
          <motion.img
            src={image}
            alt={`imagem da receita ${title}`}
            className="w-full sm:h-72 lg:h-[31rem] object-cover"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.8,
            }}
          />
          <div className="flex gap-3 justify-center italic text-xs md:text-sm text-stone-400 pt-2">
            <p> - {title}</p>
            <p>|</p>
            <p>{writer} -</p>
          </div>

          <div className="flex flex-col gap-6 sm:px-5 lg:px-24">
            <div className="cols-span-1 lg:col-span-2 border-t-2 pt-10 p-5 md:p-0">
              <div className="flex gap-6 md:gap-0 flex-col-reverse md:justify-between w-full md:flex-row mt-5">
                <div>
                  <h2 className="font-oswald text-2xl text-stone-900 uppercase tracking-widest">
                    Ingredientes
                  </h2>
                  <ul className="p-2 mt-4 list-disc leading-loose">
                    {ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <p>
                    Autor: <span className="font-bold">{writer}</span>
                  </p>
                  <p>
                    Tempo de preparo: <span className="font-bold">{time}</span>
                  </p>
                  <p>
                    Dificuldade: <span className="font-bold">{difficult}</span>
                  </p>
                </div>
              </div>
              <div className="mt-10 pb-20">
                <h2 className="font-oswald text-2xl text-stone-900 uppercase tracking-widest">
                  Modo de Preparo
                </h2>
                <ul className="p-2 mt-4 list-decimal leading-loose">
                  {content
                    .split(". ")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .map((item, index) => (
                      <li key={index} className="py-1">
                        {item}
                      </li>
                    ))}
                </ul>
                {Object.keys(optionalItens).length > 0 && (
                  <OptionalItems optionalItens={optionalItens} />
                )}
              </div>
              <div className="z-20">
                <Ratings ratings={ratings} id={recipe.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CategorySidebar recipeCategory={recipeCategory} category={category} />
    </div>
  );
}

function OptionalItems({ optionalItens }) {
  return (
    <div>
      {Object.entries(optionalItens).map(([key, value]) => (
        <div key={key} className="flex flex-col gap-5 mt-10">
          <Divider title={key} />
          <div>
            <h4 className="font-oswald text-2xl text-stone-900 uppercase tracking-widest">
              Ingredientes
            </h4>
            <ul className="p-2 mt-4 list-disc leading-loose">
              {value.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-oswald text-2xl text-stone-900 uppercase tracking-widest">
              Modo de Preparo
            </h2>
            <ul className="p-2 mt-4 list-decimal leading-loose">
              {value.content
                .split(". ")
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
                .map((item, index) => (
                  <li key={index} className="py-1">
                    {item}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function Divider({ title }) {
  return (
    <div className="flex gap-5 items-center justify-center">
      <div className="w-full border-t-4 border-double "></div>
      <h3 className="font-oswald text-2xl text-stone-900 uppercase tracking-widest text-center">
        {title}
      </h3>
      <div className="border-t-4 w-full border-double"></div>
    </div>
  );
}

function CategorySidebar({ recipeCategory, category }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Função para selecionar aleatoriamente receitas
  const randomizeRecipes = (recipes) => {
    return [...recipes].sort(() => Math.random() - 0.5);
  };

  // Estado para manter a lista aleatória
  const [randomizedRecipes, setRandomizedRecipes] = useState([]);

  useEffect(() => {
    setRandomizedRecipes(randomizeRecipes(category));
  }, [category]);

  // Cálculos para paginação
  const totalPages = Math.ceil(randomizedRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRecipes = randomizedRecipes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Funções para mudar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        type: "just",
        stiffness: 90,
        damping: 30,
        delay: 1,
      }}
      className="md:-my-12 col-span-1 bg-gradient-to-r to-stone-200 from-stone-300 pt-20 shadow-2xl shadow-stone-900/50 z-10"
    >
      <div className="md:px-8 text-center indent-0">
        <h3 className="my-10 uppercase font-oswald tracking-widest text-stone-600">
          Escolha uma categoria
        </h3>
        <div className="w-full flex items-center">
          <ul className="flex flex-wrap justify-center gap-5">
            {recipeCategories.map((category) => (
              <li key={category}>
                <Link to={`/category/${category}`}>
                  <motion.img
                    className={`w-12 h-12 border border-stone-400 p-2 box hover:bg-yellow-500 ${
                      category === recipeCategory ? "bg-yellow-500" : ""
                    }`}
                    whileHover={{ scale: 1.2 }} // Escala ajustada para uma transição mais suave
                    whileTap={{ scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 1000,
                      damping: 20,
                    }}
                    src={recipeIcons[category]}
                    alt={`Ícone da categoria ${category}`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Aqui, exibimos as receitas aleatórias e paginadas */}
        <h3 className="my-10 uppercase font-oswald tracking-widest text-stone-600">
          Outras opções de {recipeCategory}
        </h3>
        <motion.div
          className="flex flex-col gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {selectedRecipes.map((item) => (
            <div key={item.id} className="shadow-xl text-white ">
              <RecipeCard recipe={item} />
            </div>
          ))}
        </motion.div>

        {/* Controles de paginação */}
        <div className="flex justify-center my-10">
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
    </motion.div>
  );
}

OptionalItems.propTypes = {
  optionalItens: PropTypes.array,
};
Divider.propTypes = {
  title: PropTypes.string,
};

CategorySidebar.propTypes = {
  recipeCategory: PropTypes.string,
  category: PropTypes.string,
};
