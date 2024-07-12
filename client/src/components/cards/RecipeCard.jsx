import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function RecipeCard({ recipe, extraClasses = "" }) {
  return (
    <Link
      to={recipe.slug}
      className={`bg-cover bg-center group flex flex-col relative ${extraClasses}`}
    >
      <img
        src={recipe.image}
        className="object-cover w-full h-full brightness-90 group-hover:brightness-75"
        alt={`Imagem da receita ${recipe.title}`}
      />
      <div className="absolute w-full h-full flex flex-col justify-center lg:justify-end  border">
        <p className="mx-auto text-2xl font-oswald lg:text-3xl border-t border-b p-3 text-center">
          {recipe.title.toUpperCase()}
        </p>
        <button className="mx-auto px-3 font-noto text-xs py-2 bg-transparent border hover:bg-white hover:text-black mt-5 text-center lg:mb-20">
          VEJA A RECEITA
        </button>
      </div>
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
