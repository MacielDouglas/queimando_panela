import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import queimando from "../assets/queimando_panela.svg";
import menu from "../assets/Menu.svg";
import close from "../assets/CloseMenu.svg";
import search from "../assets/search.svg";
import recipeIcons from "../assets/recipes/icons";
import { resetAuth } from "../features/auth/authSlice";
import { motion } from "framer-motion";
import Login from "../pages/Login";
import { PiUserDuotone } from "react-icons/pi";
import { ImExit } from "react-icons/im";
import recipeCategories from "../constants/recipeCategories.js";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);

  const toggleModal = () => setIsModalOpen((prevState) => !prevState);
  const showRecipeModal = () => setIsRecipeModalOpen(true);
  const hideRecipeModal = () => setIsRecipeModalOpen(false);

  const dispatch = useDispatch();

  const renderLink = (to, label) => (
    <Link to={to} className="hover:text-stone-500">
      {label}
    </Link>
  );

  const renderNavLink = (to, label) => (
    <Link to={to} className="hover:underline flex justify-between p-3">
      {label}
    </Link>
  );

  const handleReset = () => {
    dispatch(resetAuth());
  };

  return (
    <header className="bg-stone-50 w-full flex flex-col shadow-md">
      <div className="mx-5 flex justify-between lg:mx-20 gap-5 h-10 lg:items-center lg:h-12 font-noto text-stone-500">
        <p className="hidden lg:block">Bem vindo ao Queimando Panela!!!</p>
        <button onClick={toggleModal} className="lg:hidden">
          <img
            src={isModalOpen ? close : menu}
            className="h-6 p-1 "
            alt="Menu"
          />
        </button>
        <div className="flex gap-20 items-center">
          {user ? (
            <>
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
              <button onClick={handleReset}>
                <ImExit className="text-2xl hover:text-black " />
              </button>
            </>
          ) : (
            // <button onClick={() => setShowModalLogin(true)}>LOGIN</button>
            <Link to="/login" className="hidden lg:block hover:text-stone-900">
              <PiUserDuotone className="text-3xl" />
            </Link>
          )}
          <button onClick={toggleModal}>
            <img src={search} className="h-6" alt="Search" />
          </button>
        </div>
      </div>
      <hr className="border-stone-200" />
      <div className="flex mx-5 self-center items-center gap-10 text-[#1d1d1b] font-oswald font-semibold">
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 1,
          }}
          className="gap-4 hidden lg:flex"
        >
          {renderLink("/", "HOME")}
          <p className="text-stone-300">/</p>
          <div
            onMouseEnter={showRecipeModal}
            onMouseLeave={hideRecipeModal}
            className="relative"
          >
            {renderLink("/recipes", "RECEITAS")}
            {isRecipeModalOpen && (
              <div
                className="absolute top-full -left-20  w-56 bg-white border border-stone-200 shadow-2xl z-10"
                onMouseEnter={showRecipeModal}
                onMouseLeave={hideRecipeModal}
              >
                <ul className="flex flex-col ">
                  {recipeCategories.map((category) => (
                    <li
                      key={category}
                      className="flex items-center  hover:bg-yellow-400 p-2  hover:underline cursor-pointer group"
                    >
                      <img
                        src={recipeIcons[category]}
                        alt={category}
                        className="w-8 h-8 group-hover:w-12"
                      />
                      {renderNavLink(`/category/${category}`, category)}
                      <hr className="bg-black" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
        <Link to="/">
          <motion.img
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.5,
            }}
            src={queimando}
            className="w-72 p-2 hover:img-shadow "
            alt="Logo Receita"
          />
        </Link>
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 1,
          }}
          className="hidden lg:flex gap-3"
        >
          {renderLink("/about", "SOBRE")}
          <p className="text-stone-300">/</p>
          {renderLink("/contact", "CONTATO")}
        </motion.div>
      </div>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 mt-10 bg-black bg-opacity-50 z-50 flex justify-start font-oswald"
          onClick={toggleModal}
          initial={{ x: "-4%" }}
          whileInView={{ x: 0 }}
        >
          <div
            className="bg-white p-6 h-full w-2/3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col gap-4 text-xl w-full">
              <li>{renderNavLink("/", "Home")}</li>
              <hr />
              <li>{renderNavLink("/recipes", "Receitas")}</li>
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
        </motion.div>
      )}
      {showModalLogin && <Login setShowModalLogin={setShowModalLogin} />}
    </header>
  );
}
