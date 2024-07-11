import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  if (!recipe) return null;
  return (
    <>
      <Link to={recipe.slug} className="relative group">
        <img
          src={recipe.image}
          className="object-cover w-full h-full brightness-90 group-hover:brightness-75"
          alt={`Imagem da receita ${recipe.title}`}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white w-full h-full">
          <p className="text-2xl mt-20 md:mt-40 font-oswald lg:text-3xl border-t border-b p-3">
            {recipe.title.toUpperCase()}
          </p>

          <button className="px-3 font-noto text-xs py-2 bg-transparent border hover:bg-white hover:text-black mt-5 ">
            VEJA A RECEITA
          </button>
        </div>
      </Link>
    </>
  );
}
