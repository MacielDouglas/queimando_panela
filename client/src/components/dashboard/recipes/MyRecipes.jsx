import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../../../helper/Loading";

export default function MyRecipes() {
  const user = useSelector((state) => state.auth.user);
  const { recipes, loading } = useSelector((state) => state.recipes);

  const myRecipes = recipes.filter((recipe) => recipe.userId === user.id);

  if (loading) return <Loading />;

  return (
    // <section className="flex flex-col w-full items-start font-noto px-4 sm:px-8 md:px-20  py-8 bg-stone-100 gap-10">
    <section className="max-w-4xl mx-auto m-3  w-full  flex flex-col items-center gap-4">
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
        Minhas Receitas Enviadas: {myRecipes.length}
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
        className="overflow-x-auto w-full"
      >
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-full bg-gradient-to-b from-gray-100 to-gray-300 border-b">
              <th className="px-4 text-left">image</th>
              <th className="px-4 text-left">Título</th>
              <th className="px-4 text-left">Data</th>
              <th className="p-4 text-left">Categoria</th>
              <th className="px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {myRecipes.map((recipe) => (
              <tr key={recipe.id} className="border-b hover:bg-gray-100">
                <td className="p-4">
                  <Link to={`/recipe/${recipe.slug}`}>
                    <img
                      src={recipe.image}
                      alt={`imagem da recita ${recipe.title}`}
                      className="w-20 h-10 object-cover bg-stone-500"
                    />
                  </Link>
                </td>
                <td className="px-4 hover:font-semibold">
                  {" "}
                  <Link to={`/recipe/${recipe.slug}`}>{recipe.title} </Link>
                </td>
                <td className="px-4 text-xs">
                  {new Date(Number(recipe.createdAt)).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </td>
                <td className="p-4 hover:font-semibold">
                  <Link to={`/search?category=${recipe.category}`}>
                    {recipe.category}
                  </Link>
                </td>
                <td className="p-5 flex gap-2">
                  <button className="border py-1 px-3 rounded-md text-blue-600 hover:text-white hover:bg-blue-500 ">
                    Editar
                  </button>
                  <button className="border py-1 px-3 rounded-md text-red-600 hover:text-white hover:bg-red-500 mr-2">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        className="flex gap-5 justify-center w-full flex-wrap"
      >
        <Link
          to={"/dashboard?tab=newRecipe"}
          className="border bg-yellow-400 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-yellow-950"
        >
          Criar Receita
        </Link>

        <Link
          to={"/dashboard?tab=saveRecipe"}
          className="border bg-stone-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-stone-100"
        >
          Receitas Salvas
        </Link>
      </motion.div>
    </section>
  );
}

// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import Loading from "../../../helper/Loading";

// export default function MyRecipes() {
//   const user = useSelector((state) => state.auth.user);
//   const { recipes, loading } = useSelector((state) => state.recipes);

//   const myRecipes = recipes.filter((recipe) => recipe.userId === user.id);

//   if (loading) return <Loading />;

//   return (
//     <section className="flex flex-col w-full items-start font-noto px-4 sm:px-8 md:px-20 lg:px-40 xl:px-52 py-8 bg-stone-100 gap-10">
//       <motion.h1
//         initial={{ opacity: 0, y: -100 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{
//           type: "spring",
//           stiffness: 100,
//           damping: 10,
//           delay: 0.5,
//         }}
//         className="font-oswald text-4xl border-b w-full pb-3 border-b-stone-600"
//       >
//         Minhas Receitas Enviadas
//       </motion.h1>
//       <motion.div
//         initial={{ opacity: 0, x: -100 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{
//           type: "spring",
//           stiffness: 100,
//           damping: 10,
//           delay: 0.9,
//         }}
//         className="flex items-center justify-between gap-10 flex-wrap"
//       >
//         <div className="text-wrap">
//           <p>
//             Total de receitas:{" "}
//             <span className="text-xl font-semibold">{myRecipes.length}</span>
//           </p>
//         </div>
//         <div className="flex flex-col gap-3 bg-stone-200 p-2">
//           {myRecipes &&
//             myRecipes.map((recipe) => (
//               <div key={recipe.id} className="flex gap-4 items-center">
//                 <img
//                   src={recipe.image}
//                   alt={`imagem da recita ${recipe.title}`}
//                   className="object-cover h-14 w-14"
//                 />
//                 <p>{recipe.title}</p>
//                 <p>
//                   {new Date(Number(recipe.createdAt)).toLocaleDateString(
//                     "pt-BR",
//                     {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                     }
//                   )}
//                 </p>
//                 <div>
//                   <button>editar</button>
//                   <button>deletar</button>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </motion.div>
//       <motion.div
//         initial={{ opacity: 0, y: 100 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{
//           type: "spring",
//           stiffness: 100,
//           damping: 10,
//           delay: 0.5,
//         }}
//         className="flex gap-5 justify-center w-full flex-wrap"
//       >
//         <Link
//           to={"/dashboard?tab=newRecipe"}
//           className="border bg-yellow-400 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-yellow-950"
//         >
//           Criar Receita
//         </Link>

//         <Link
//           to={"/dashboard?tab=saveRecipe"}
//           className="border bg-stone-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-stone-100"
//         >
//           Receitas Salvas
//         </Link>
//       </motion.div>
//     </section>
//   );
// }
