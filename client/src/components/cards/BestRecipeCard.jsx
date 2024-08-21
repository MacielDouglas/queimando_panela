import { Link } from "react-router-dom";
import recipeIcons from "./../../assets/recipes/icons";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function BestRecipeCard({ recipe }) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <>
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <IoStarSharp key={`full-${index}`} className="text-yellow-400 " />
          ))}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <IoStarOutline key={`empty-${index}`} className="text-yellow-400" />
          ))}
      </>
    );
  };

  return (
    <div className=" lg:w-full bg-white flex flex-col font-noto p-10 gap-5 text-stone-900 shadow-lg">
      <h1 className="font-oswald text-2xl lg:text-[40px] font-bold ">
        {recipe.title}
      </h1>

      <motion.div
        className="  flex justify-center  h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:4px_4px]  text-sm md:text-xl"
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
            to={`category/${recipe.category}`}
          >
            <img
              className="w-4 h-4"
              src={recipeIcons[recipe.category]}
              alt={`Ícone da categoria ${recipe.category}`}
            />
            <p className="uppercase font  tracking-wider">{recipe.category}</p>
          </Link>
          <div className="flex gap-1">{renderStars(recipe.averageRating)}</div>
        </div>
      </motion.div>
      <div>
        <motion.p
          className="text-stone-800 pb-4 text-sm lg:text-lg 
        "
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            type: "just",
            stiffness: 90,
            damping: 30,
            delay: 1,
          }}
        >
          {recipe.description}
        </motion.p>
        <motion.img
          src={recipe.image}
          alt={`imagem da receita ${recipe.title}`}
          className="w-full"
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
          <p> - {recipe.title}</p>
          <p>|</p>
          <p>{recipe.writer}</p>
        </div>
      </div>
      <Link
        to={`recipe/${recipe.slug}`}
        className="border border-stone-300 hover:bg-stone-950 hover:text-white mt-4  py-3 px-6  rounded-3xl self-center  text-xs md:text-sm "
      >
        VEJA A RECEITA
      </Link>
    </div>
  );
}

BestRecipeCard.propTypes = {
  recipe: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    writer: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    averageRating: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  extraClasses: PropTypes.string,
};
