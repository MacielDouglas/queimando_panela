import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import queimando from "../assets/queimando_panela.svg";
import menu from "../assets/Menu.svg";
import close from "../assets/CloseMenu.svg";
import search from "../assets/search.svg";
import recipeIcons from "../assets/recipes/icons";

const recipeCategories = [
  "acompanhamentos",
  "aves",
  "bolos",
  "carnes",
  "churrasco",
  "drinks",
  "fondues, musses e suflês",
  "massas",
  "pães",
  "peixes",
  "saladas",
  "sanduíches e salgados",
  "sobremesas e doces",
  "sopas",
  "sorvetes",
  "típicos",
  "tortas",
  "outros",
];

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prevState) => !prevState);
  const showRecipeModal = () => setIsRecipeModalOpen(true);
  const hideRecipeModal = () => setIsRecipeModalOpen(false);

  const renderLink = (to, label) => (
    <Link to={to} className="hover:text-gray-500">
      {label}
    </Link>
  );

  const renderNavLink = (to, label) => (
    <Link to={to} className="hover:underline flex justify-between p-3">
      {label}
    </Link>
  );

  return (
    <header className="bg-sky-50 w-full flex flex-col shadow-sm">
      <div className="mx-5 flex justify-between lg:mx-20 gap-5 h-10 lg:items-center lg:h-14 font-noto text-gray-500">
        <p className="hidden lg:block">Bem vindo ao Queimando Panelas!!!</p>
        <button onClick={toggleModal} className="lg:hidden">
          <img
            src={isModalOpen ? close : menu}
            className="h-6 p-1"
            alt="Menu"
          />
        </button>
        <div className="flex gap-20 items-center">
          {user ? (
            <Link
              to="/dashboard?tab=profile"
              className="hover:underline hidden lg:flex items-center gap-2"
            >
              Perfil de {user.name}
              <img
                src={user.profilePicture}
                className="w-7 h-7 rounded-full border border-white"
                alt={`Imagem do usuário: ${user.name}`}
              />
            </Link>
          ) : (
            <Link to="/login" className="hidden lg:block hover:text-gray-900">
              LOGIN
            </Link>
          )}
          <button onClick={toggleModal}>
            <img src={search} className="h-6" alt="Search" />
          </button>
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="flex mx-5 self-center items-center gap-10 text-[#1d1d1b] font-oswald font-semibold">
        <div className="gap-4 hidden lg:flex">
          {renderLink("/home", "HOME")}
          <p className="text-gray-300">/</p>
          <div
            onMouseEnter={showRecipeModal}
            onMouseLeave={hideRecipeModal}
            className="relative"
          >
            {renderLink("/recipe", "RECEITAS")}
            {isRecipeModalOpen && (
              <div
                className="absolute top-full -left-20  w-56 bg-white border border-gray-200 shadow-2xl z-10"
                onMouseEnter={showRecipeModal}
                onMouseLeave={hideRecipeModal}
              >
                <ul className="flex flex-col ">
                  {recipeCategories.map((category) => (
                    <li
                      key={category}
                      className="flex items-center  hover:bg-gray-200 p-2 hover:underline cursor-pointer"
                    >
                      <img
                        src={recipeIcons[category]}
                        alt={category}
                        className="w-8 h-8"
                      />
                      {renderNavLink(`/recipe/${category}`, category)}
                      <hr className="bg-black" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <Link to="/">
          <img src={queimando} className="h-36 p-2" alt="Logo Receita" />
        </Link>
        <div className="hidden lg:flex gap-3">
          {renderLink("/about", "SOBRE")}
          <p className="text-gray-300">/</p>
          {renderLink("/contact", "CONTATO")}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-start font-oswald"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 h-full w-2/3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col gap-4 text-xl w-full">
              <li>{renderNavLink("/", "Home")}</li>
              <hr />
              <li>{renderNavLink("/recipe", "Receitas")}</li>
              <hr />
              <li>{renderNavLink("/about", "Sobre")}</li>
              <hr />
              <li>{renderNavLink("/contact", "Contato")}</li>
              {user && (
                <>
                  <hr />
                  <li>
                    <Link
                      to="/dashboard?tab=profile"
                      className="hover:underline flex justify-between"
                    >
                      Perfil de {user.name}
                      <img
                        src={user.profilePicture}
                        className="w-7 h-7 rounded-full border border-white"
                        alt={`Imagem do usuário: ${user.name}`}
                      />
                    </Link>
                  </li>
                </>
              )}
              <hr />
              <li>
                {user ? (
                  <button
                    // onClick={logOff}
                    className="text-red-500 hover:text-red-700 w-full text-left flex justify-between"
                  >
                    Sair
                  </button>
                ) : (
                  renderNavLink("/login", "Login")
                )}
              </li>
              <hr />
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
