import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
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
        Perfil do usuário
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
        <img
          className="rounded-full h-24 w-24 border border-white"
          src={user.profilePicture}
          alt={`Foto do usuário ${user.name}`}
        />
        <div className="flex flex-col gap-1">
          <p className="font-oswald text-2xl font-semibold flex gap-2 items-center">
            {user.name}{" "}
            <span className="bg-stone-900 rounded-md py-1 px-3 font-noto text-xs text-slate-50 font-normal">
              {user.isAdmin ? "admin" : "user"}
            </span>
          </p>
          <p className="text-sm text-stone-500">username: {user.username}</p>
        </div>
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
        className="flex gap-5 justify-center lg:justify-between w-full flex-wrap"
      >
        <button className="border bg-yellow-400 w-48 py-2 rounded-md border-transparent hover:border-white text-yellow-950">
          Enviar Receita
        </button>
        <button className="border bg-slate-700 w-48 py-2 rounded-md border-transparent hover:border-white text-slate-100">
          Receitas enviadas
        </button>
        <button className="border bg-stone-700 w-48 py-2 rounded-md border-transparent hover:border-white text-stone-100">
          Receitas Salvas
        </button>
      </motion.div>
    </section>
  );
}
