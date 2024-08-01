import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SaveRecipes() {
  return (
    <section className="flex flex-col w-full items-start font-noto px-4 sm:px-8 md:px-20 lg:px-40 xl:px-52 py-8 bg-stone-100 gap-10">
      <motion.h1
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.5,
        }}
        className="font-oswald text-4xl border-b w-full pb-3 border-b-stone-600"
      >
        Receitas Salvas
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.9,
        }}
        className="flex items-center justify-between gap-10 flex-wrap"
      >
        <div className="flex flex-col gap-1"></div>
        <Link
          to="/dashboard?tab=updateProfile"
          className="text-xs border  p-2 border-stone-800 hover:bg-stone-800 hover:text-stone-100 rounded-md"
        >
          editar
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 1,
        }}
        className="flex gap-4 uppercase text-xs flex-wrap"
      >
        <div className="text-wrap">
          <p>Total de receitas</p>
          <p className="text-xl font-semibold">292</p>
        </div>
        <div>
          <p>Total de comentários</p>
          <p className="text-xl font-semibold">32</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.5,
        }}
        className="flex gap-5 justify-center  w-full flex-wrap"
      >
        <Link
          to={"/dashboard?tab=newRecipe"}
          className="border bg-yellow-400 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-yellow-950"
        >
          Criar Receita
        </Link>
        <Link
          to={"/dashboard?tab=myRecipes"}
          className="border bg-slate-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-slate-100"
        >
          Receitas enviadas
        </Link>
        {/* <Link
          to={"/dashboard?tab=saveRecipe"}
          className="border bg-stone-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-stone-100"
        >
          Receitas Salvas
        </Link> */}
      </motion.div>
    </section>
  );
}
