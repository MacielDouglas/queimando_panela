import { useParams } from "react-router-dom";
import { ALL_RECIPES } from "../graphql/queries/recipe.query";
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";

export default function Category() {
  const { category } = useParams();
  const [searchCategory, { data }] = useLazyQuery(ALL_RECIPES);

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

  console.log(data?.getRecipes);
  return (
    <div className="flex flex-col font-noto p-5">
      <h1 className="uppercase font-oswald text-2xl lg:text-[40px] font-bold text-center">
        {category}
      </h1>
      <div>
        <p>Encontramos: {data?.getRecipes.length} receitas</p>
      </div>
    </div>
  );
}
