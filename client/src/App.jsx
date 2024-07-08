import { useQuery } from "@apollo/client";
import { ALL_RECIPES } from "./graphql/queries/recipe.query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./helper/ScrollTotop";
import Loading from "./helper/Loading";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";

export default function App() {
  const { data, loading, error } = useQuery(ALL_RECIPES);

  // if (loading) return <h1>Carregando</h1>;
  if (loading) return <Loading />;
  if (error) return <div>Erro</div>;

  console.log(data);
  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <div className="bg-gradient-to-b from-stone-50 to-gray-50">
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
    </BrowserRouter>
  );
}
