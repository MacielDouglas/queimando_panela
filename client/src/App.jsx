import { useQuery } from "@apollo/client";
import { ALL_RECIPES } from "./graphql/queries/recipe.query";

export default function App() {
  const { data, loading, error } = useQuery(ALL_RECIPES);

  if (loading) return <div>Carregando</div>;
  if (error) return <div>Erro</div>;

  console.log(data);
  return (
    <div className="font-extrabold text-2xl ">
      {data.getRecipes.map((recipe) => (
        <div key={recipe.id} className="mb-4">
          <p>Title: {recipe.title}</p>
          <p>Category: {recipe.category}</p>
          <p>ID: {recipe.id}</p>
          <p>Image: {recipe.image}</p>
          <p>slug: {recipe.slug}</p>
          <p>Writer: {recipe.writer}</p>
          <p>Ingredientes: {recipe.ingredients}</p>
        </div>
      ))}
    </div>
  );
}
