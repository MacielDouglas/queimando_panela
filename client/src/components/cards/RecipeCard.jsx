import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function RecipeCard({ recipe, extraClasses = "" }) {
  return (
    <Link
      to={recipe.slug}
      className={`bg-cover bg-center group  flex flex-col relative ${extraClasses}`}
    >
      <motion.img
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 0.7,
        }}
        src={recipe.image}
        className="object-cover w-full h-full brightness-90 group-hover:brightness-[60%]"
        alt={`Imagem da receita ${recipe.title}`}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.8,
        }}
        className="absolute w-full h-full flex flex-col justify-center lg:justify-end "
      >
        <p className="mx-auto text-2xl font-oswald lg:text-3xl border-t  border-b p-3 text-center">
          {recipe.title.toUpperCase()}
        </p>
        <button className="mx-auto px-3 font-noto text-xs py-2 bg-transparent border hover:bg-white hover:text-black mt-5 text-center lg:mb-20">
          VEJA A RECEITA
        </button>
      </motion.div>
    </Link>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  extraClasses: PropTypes.string,
};
