// import { useState } from "react";
import { Link } from "react-router-dom";
import queimando from "../assets/queimando_panela.svg";
import { BsEnvelope, BsLinkedin, BsGithub, BsTwitterX } from "react-icons/bs";
import { motion } from "framer-motion";
// import recipeIcons from "../assets/recipes/icons";

// const recipeCategories = [
//   "acompanhamentos",
//   "aves",
//   "bolos",
//   "carnes",
//   "churrasco",
//   "drinks",
//   "fondues, musses e suflês",
//   "massas",
//   "pães",
//   "peixes",
//   "saladas",
//   "sanduíches e salgados",
//   "sobremesas e doces",
//   "sopas",
//   "sorvetes",
//   "típicos",
//   "tortas",
//   "outros",
// ];

export default function Footer() {
  // const [hoveredCategory, setHoveredCategory] = useState(null);

  // const renderNavLink = (to, label, category) => (
  //   <Link
  //     to={to}
  //     className="hover:underline justify-between p-3 hidden group-hover:block no-underline text-xs"
  //   >
  //     {label}
  //   </Link>
  // );

  return (
    <footer className="bg-yellow-400 p-10 max-w-full rounded-2xl m-10 flex flex-col lg:flex-row font-noto">
      <div className="lg:flex-1 flex flex-col text-sm gap-4 items-center lg:items-start">
        <Link to="/">
          <motion.img
            src={queimando}
            alt="Logotipo do site queimando panela."
            className="h-24 self-center hover:img-shadow"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.5,
            }}
          />
        </Link>
        {/* <div className="border-b-2 pb-8 border-black group border flex flex-col items-center justify-between">
          <ul className="flex flex-wrap items-center gap-4 w-full h-20 ">
            {recipeCategories.map((category) => (
              <li
                key={category}
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link>
                  <img
                    className="w-6 h-6 hover:h-16 hover:w-16 group border"
                    src={recipeIcons[category]}
                    alt={`Ícone da categoria ${category}`}
                  />
                </Link>
              </li>
            ))}
          </ul>
          {hoveredCategory && (
            <p className="text-2xl font-semibold">{hoveredCategory}</p>
          )}
        </div> */}
        <motion.div
          className="w-full flex flex-col gap-12"
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.9,
          }}
        >
          <p>
            Junte-se agora ao{" "}
            <span className="font-semibold">Queimado Panela</span> e embarque
            numa viagem culinária para explorar, criar e saborear receitas
            incríveis
          </p>
          <Link
            to="/login"
            className="border border-yellow-950 hover:bg-yellow-950 hover:text-white  self-center text-center py-3 px-6 text-sm"
          >
            registrar
          </Link>
          <p className="text-xs text-yellow-900 hidden lg:block">
            <span className="font-semibold">Queimado Panela.</span> © Alguns
            direitos reservados
          </p>
        </motion.div>
      </div>
      <motion.div
        className="lg:flex-1 flex flex-col justify-between mt-6 text-sm"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 1.2,
        }}
      >
        <div className="flex justify-between  pl-3 flex-wrap gap-10 lg:gap-0">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Algumas receitas:</p>
            <Link className="hover:text-yellow-800">Todas</Link>
            <Link className="hover:text-yellow-800">Aves</Link>
            <Link className="hover:text-yellow-800">Carnes</Link>
            <Link className="hover:text-yellow-800">Massas</Link>
            <Link className="hover:text-yellow-800">Drinks</Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-semibold">Sobre:</p>
            <Link
              to="https://macield.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              Meu Portfólio
            </Link>
            <Link
              className="hover:text-yellow-800"
              to="https://github.com/MacielDouglas"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold">Acesse outros projetos:</p>
            <Link
              to="https://devlabblog.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              DevLab, blog
            </Link>
            <Link
              to="https://aboutmovie.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              About Movie
            </Link>
            <Link
              to="https://imobiliaria-olinda.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              Olinda Imóveis
            </Link>
          </div>
        </div>
        <div className="border-t border-yellow-950 flex justify-between p-4 flex-wrap gap-3 lg:gap-0 mt-10 lg:mt-0">
          <p className="text-sm text-yellow-900">Desenvolvido por Maciel D.</p>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Link
              to="https://github.com/MacielDouglas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              <BsGithub className="text-2xl" />
            </Link>
            <Link
              to="https://www.linkedin.com/in/douglas-maciel-4943461b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              <BsLinkedin className="text-2xl" />
            </Link>
            <Link
              to="https://twitter.com/Maciel_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              <BsTwitterX className="text-2xl" />
            </Link>
            <Link
              to="mailto:maciel.d.dev@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-800"
            >
              <BsEnvelope className="text-2xl" />
            </Link>
          </div>
          <p className="text-xs text-yellow-900  lg:hidden mt-4">
            <span className="font-semibold">Queimado Panela.</span> © Alguns
            direitos reservados
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
