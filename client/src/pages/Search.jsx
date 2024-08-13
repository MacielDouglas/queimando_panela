import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import recipeIcons from "../assets/recipes/icons";
import {
  IoCloseSharp,
  IoPersonOutline,
  IoCalendarOutline,
  IoChatboxEllipsesOutline,
  IoChatboxOutline,
  IoClose,
} from "react-icons/io5";

export default function SearchModal({ isOpen, onClose }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const title = queryParams.get("title");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const { recipes } = useSelector((state) => state.recipes);

  useEffect(() => {
    if (title || category || searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter((recipe) => {
        const matchesCategory = category
          ? recipe.category.includes(category)
          : true;
        const matchesTitle = title
          ? recipe.title.toLowerCase().includes(title.toLowerCase())
          : true;
        const matchesQuery =
          recipe.title.toLowerCase().includes(query) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(query)
          );

        return matchesCategory && matchesTitle && matchesQuery;
      });
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes([]);
    }
  }, [title, category, searchQuery, recipes]);

  const totalPages = Math.ceil(filteredRecipes.length / 6);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * 6,
    currentPage * 6
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`fixed inset-0 bg-stone-800 bg-opacity-85 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <motion.div
        initial={{ y: "-100vh" }}
        animate={{ y: 0 }}
        exit={{ y: "100vh" }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative bg-stone-200 w-full max-w-5xl mx-auto h-screen overflow-y-auto p-6"
      >
        <div className="flex justify-between py-4">
          <h1 className="font-oswald uppercase text-xl tracking-widest">
            Pesquise Receitas
          </h1>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 text-4xl"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="relative mb-4 border-b pb-2">
          <input
            type="text"
            placeholder="Digite para pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <IoClose />
            </button>
          )}
          <p className="text-sm font-semibold text-stone-500 uppercase">
            {filteredRecipes.length} resultados
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {paginatedRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="flex flex-col sm:flex-row items-start sm:items-center pb-5 border-b border-b-stone-50"
            >
              <Link
                to={`recipe/${recipe.slug}`}
                className="w-full sm:w-1/4 mb-2 sm:mb-0 sm:mr-4"
                onClick={handleLinkClick}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-28 object-cover"
                />
              </Link>
              <div className="sm:w-1/2">
                <Link to={`recipe/${recipe.slug}`} onClick={handleLinkClick}>
                  <h3 className="text-xl font-semibold hover:text-stone-600">
                    {recipe.title}
                  </h3>
                </Link>
                <p className="text-gray-600">
                  {recipe.description.length > 60
                    ? recipe.description.substring(0, 50) + "..."
                    : recipe.description}
                </p>
              </div>
              <div className="text-sm gap-2 flex flex-col text-stone-500">
                <Link
                  to={`/category/${recipe.category}`}
                  className="hover:text-blue-600 flex items-center gap-2"
                  onClick={handleLinkClick}
                >
                  <img
                    className="w-4 h-4"
                    style={{
                      filter:
                        "invert(49%) sepia(11%) saturate(223%) hue-rotate(345deg) brightness(95%) contrast(87%)",
                    }}
                    src={recipeIcons[recipe.category]}
                    alt={`Ícone da categoria ${recipe.category}`}
                  />
                  {recipe.category}
                </Link>
                <span className="flex items-center gap-2">
                  <IoCalendarOutline />
                  {new Date(Number(recipe.createdAt)).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <IoPersonOutline /> {recipe.writer}
                </span>
                <span className="flex items-center gap-2">
                  {recipe.ratings.length > 0 ? (
                    <>
                      <IoChatboxEllipsesOutline />
                      Com comentários
                    </>
                  ) : (
                    <>
                      <IoChatboxOutline />
                      Sem comentários
                    </>
                  )}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                index + 1 === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
