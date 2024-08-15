import { Link, useParams } from "react-router-dom";
import { ALL_RECIPES } from "../graphql/queries/recipe.query";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Loading from "../helper/Loading";
import { motion } from "framer-motion";

export default function Category() {
  const { category } = useParams();
  const [searchCategory, { data, loading }] = useLazyQuery(ALL_RECIPES);

  useEffect(() => {
    const fetchData = () => {
      searchCategory({
        variables: {
          input: {
            category: category,
          },
        },
      });
    };
    fetchData();
  }, [category, searchCategory]);

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
    <div className="flex flex-col gap-8 font-noto p-10 bg-stone-50">
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
      <div className="bg-white p-5 drop-shadow-lg">
        <p className="my-4 text-xl font-medium">
          Encontrado: {data?.getRecipes.length} receitas
        </p>
        <motion.ul
          className="grid gap-10 grid-cols-2 md:grid-cols-3"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.9,
          }}
        >
          {data &&
            data.getRecipes.map((recipe) => (
              <li key={recipe.id} className="mb-5 max-h-72">
                <Link
                  to={`/recipe/${recipe.slug}`}
                  className="block w-full h-full text-start"
                >
                  <img
                    className="object-cover w-full h-[90%] relative z-20"
                    src={recipe.image}
                    alt={`Imagem da receita ${recipe.title}`}
                  />
                  <motion.p
                    className="pt-2 text-stone-600 relative z-10"
                    initial={{ opacity: 0, y: -200 }}
                    animate={{ opacity: 1, y: 0.0938398 }}
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
    </div>
  );
}
