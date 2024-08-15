import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipes/recipesThunck";
import BestRecipeCard from "./cards/BestRecipeCard";
import { motion } from "framer-motion";
import maciel from "../assets/maciel_d.png";
import blog from "../assets/devLab.png";
import olimovies from "../assets/olindaImoveis.png";
import about from "../assets/about.png";
import cafe from "../assets/cafe.png";
import { Link } from "react-router-dom";

export default function BestRecipe() {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipes);
  const [bestRecipes, setBestRecipes] = useState([]);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (recipes.length > 0) {
      const topThreeRecipes = recipes.reduce((topThree, recipe) => {
        const totalRatings = recipe.ratings.reduce(
          (sum, rating) => sum + rating.rating,
          0
        );
        const averageRating =
          recipe.ratings.length > 0 ? totalRatings / recipe.ratings.length : 0;
        const commentCount = recipe.ratings.length;

        const newRecipe = { ...recipe, averageRating, commentCount };

        // Insere a receita ordenada dentro das top três
        if (topThree.length < 3) {
          topThree.push(newRecipe);
          topThree.sort((a, b) => {
            if (b.averageRating === a.averageRating) {
              return b.commentCount - a.commentCount;
            }
            return b.averageRating - a.averageRating;
          });
        } else {
          const lowestTopRecipe = topThree[2];
          if (
            averageRating > lowestTopRecipe.averageRating ||
            (averageRating === lowestTopRecipe.averageRating &&
              commentCount > lowestTopRecipe.commentCount)
          ) {
            topThree[2] = newRecipe;
            topThree.sort((a, b) => {
              if (b.averageRating === a.averageRating) {
                return b.commentCount - a.commentCount;
              }
              return b.averageRating - a.averageRating;
            });
          }
        }

        return topThree;
      }, []);

      setBestRecipes(topThreeRecipes);
    }
  }, [recipes]);

  return (
    <section className="w-full bg-stone-100 text-center py-28 px-10 flex flex-col md:flex-row gap-10">
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      <div className="flex flex-col gap-10 md:w-2/3">
        {bestRecipes.length > 0 ? (
          bestRecipes.map((recipe) => (
            <div key={recipe.id} className="flex-1">
              <BestRecipeCard recipe={recipe} />
            </div>
          ))
        ) : (
          <p>Não há receitas disponíveis.</p>
        )}
      </div>
      <motion.div
        className="bg-neutral-400 shadow-2xl flex flex-col w-full md:w-1/3 gap-20 p-10 md:justify-around"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.9,
        }}
      >
        <motion.article
          className="flex flex-col gap-10 text-noto font-semibold pb-10 border-b border-b-slate-500 group"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 1.2,
          }}
        >
          <h1 className="text-2xl md:my-10">Gostou dessa página?</h1>
          <Link
            className=""
            to="https://macield.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={maciel}
              alt="Imagem da página web Maciel D."
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
            />
            <p className="mt-10 group-hover:text-slate-600">
              Conheça Maciel D.
            </p>
          </Link>
        </motion.article>
        <motion.article
          className="flex flex-col gap-10 text-noto font-semibold pb-10 border-b border-b-slate-500 group"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.9,
          }}
        >
          <h1 className="text-2xl">Procurando Imóveis?</h1>
          <Link
            className=""
            to="https://macield.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={olimovies}
              alt="Imagem da página web Olinda Imóveis"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
            />
            <p className="mt-10 group-hover:text-slate-600">
              Visite Olinda Imóveis
            </p>
          </Link>
        </motion.article>
        <motion.article
          className="flex flex-col gap-10 text-noto font-semibold pb-10 border-b border-b-slate-500 group"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.9,
          }}
        >
          <h1 className="text-2xl">Gosta de tecnologia?</h1>
          <Link
            className=""
            to="https://macield.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={blog}
              alt="Imagem da página web, DevLab"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
            />
            <p className="mt-10 group-hover:text-slate-600">
              Acesse ao DevLab, blog
            </p>
          </Link>
        </motion.article>
        <motion.article
          className="flex flex-col gap-10 text-noto font-semibold pb-10 border-b border-b-slate-500 group"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.9,
          }}
        >
          <h1 className="text-2xl">Procurando indicações de filmes?</h1>
          <Link
            className=""
            to="https://aboutmovie.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={about}
              alt="Imagem da página web, About Movie"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
            />
            <p className="mt-10 group-hover:text-slate-600">
              Procure no About Movie
            </p>
          </Link>
        </motion.article>
        <motion.article
          className="flex flex-col gap-10 text-noto font-semibold pb-10 border-b border-b-slate-500 group"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.9,
          }}
        >
          <h1 className="text-2xl">Que tal um café?</h1>
          <Link
            className=""
            to="https://cafe-bourbon.web.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={cafe}
              alt="Imagem da página web Café Bourbon"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
            />
            <p className="mt-10 group-hover:text-slate-600">
              Acesse ao Café Bourbon
            </p>
          </Link>
        </motion.article>
      </motion.div>
    </section>
  );
}
