import { useState } from "react";
import { Link } from "react-router-dom";
import receita from "../assets/Receita.svg";
import menu from "../assets/Menu.svg";
import close from "../assets/CloseMenu.svg";

export default function Header() {
  const user = false; // Defina o estado do usuário conforme necessário
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="h-10 bg-gradient-to-b from-orange-500 to-primary flex justify-between items-center mx-auto">
      <div>
        <img src={receita} className="h-8 p-1 ml-2" alt="Logo Receita" />
      </div>
      <div>
        <button onClick={toggleModal}>
          <img src={menu} className="h-7 p-1 mr-2" alt="Menu" />
        </button>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 rounded-l-lg h-full w-2/3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={toggleModal} className="self-end">
              <img src={close} className="h-8 p-1 mr-2" alt="Close Menu" />
            </button>
            <ul className="flex flex-col gap-4 text-xl w-full mt-4">
              <li>
                <Link to="/" className="hover:underline flex justify-between">
                  Home
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  to="/about"
                  className="hover:underline flex justify-between"
                >
                  Sobre
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  to="/projects"
                  className="hover:underline flex justify-between"
                >
                  Projetos
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  to="/portfolio"
                  className="hover:underline flex justify-between"
                >
                  Portfólio
                </Link>
              </li>
              {user ? (
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
              ) : null}
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
                  <Link
                    to="/login"
                    className="hover:underline flex justify-between"
                  >
                    LOGIN
                  </Link>
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

// import receita from "../assets/Receita.svg";
// import menu from "../assets/Menu.svg";
// import close from "../assets/CloseMenu.svg";
// import { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";

// export default function Header() {
//   const user = false;
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen);
//   };

//   return (
//     <header className="h-10 bg-gradient-to-b from-orange-500 to-primary flex mx-auto justify-between items-center">
//       <div>
//         <img src={receita} className="h-8 p-1 ml-2" alt="" />
//       </div>
//       <div>
//         <button onClick={toggleModal}>
//           <img src={menu} className="h-8 p-1 mr-2" alt="" />
//         </button>
//       </div>
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
//           onClick={toggleModal}
//         >
//           <div
//             className="bg-white p-6 rounded-l-lg h-full w-2/3 flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <ul
//               className="flex flex-col gap-4 text-xl w-full "
//               onClick={() => setIsModalOpen(false)}
//             >
//               <li>
//                 <Link to="/" className="hover:underline flex justify-between">
//                   Home
//                   {/* <IoHomeOutline className="text-2xl" /> */}
//                 </Link>
//               </li>
//               <hr />
//               <li>
//                 <Link
//                   to="/about"
//                   className="hover:underline flex justify-between"
//                 >
//                   Sobre
//                   {/* <MdOutlineAssignment className="text-2xl" /> */}
//                 </Link>
//               </li>
//               <hr />
//               <li>
//                 <Link
//                   to="/projects"
//                   className="hover:underline flex justify-between"
//                 >
//                   Projetos
//                   {/* <MdLightbulbOutline className="text-2xl" /> */}
//                 </Link>
//               </li>
//               <hr />
//               <li>
//                 <Link
//                   to="/projects"
//                   className="hover:underline flex justify-between hover:text-black"
//                 >
//                   Portfólio
//                   {/* <MdOutlineDashboard className="text-2xl" /> */}
//                 </Link>
//               </li>
//               {user ? (
//                 <>
//                   <hr />
//                   <li>
//                     <Link
//                       to="/dashboard?tab=profile"
//                       className="hover:underline flex justify-between hover:text-black"
//                     >
//                       {/* Perfil {user.name} <MdPermIdentity className="text-2xl" /> */}
//                       Perfil de {user.name}{" "}
//                       <img
//                         src={user.profilePicture}
//                         className="w-7 h-7 rounded-full border border-white"
//                         alt={`Imagem do usuário: ${user.name}`}
//                       />
//                     </Link>
//                   </li>
//                 </>
//               ) : null}
//               <hr />
//               <li>
//                 {user ? (
//                   <button
//                     // onClick={logOff}
//                     className="text-red-500 hover:text-red-700 w-full text-left flex justify-between"
//                   >
//                     Sair
//                     {/* <MdLogout className="text-2xl inline-block" /> */}
//                   </button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="hover:underline flex justify-between"
//                   >
//                     LOGIN
//                     {/* <MdLogin className="text-2xl" /> */}
//                   </Link>
//                 )}
//               </li>
//               <hr />
//             </ul>
//             {/* {!isSearchPage && (
//               <div className=" flex flex-col gap-2 text-sm mt-5">
//                 <h3 className="mb-3 sm:mb-5 text-xl font-semibold text-gray-500">
//                   Pesquise por...
//                 </h3>

//                 <div onClick={toggleModal}>
//                   <CategoryList uniqueCategories={uniqueCategories} />
//                 </div>
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleSearchSubmit();
//                   }}
//                 >
//                   <label htmlFor="title"></label>
//                   <input
//                     type="text"
//                     id="title"
//                     name="titulo"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Digite algo..."
//                     className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:border-blue-500 mb-3"
//                   />
//                 </form>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <button
//                     onClick={handleSearchSubmit}
//                     className="bg-blue-500 p-2 sm:p-3 rounded-md text-red-50 flex-1 flex items-center gap-2 justify-center"
//                   >
//                     <MdSearch className="text-xl mt-1 cursor-pointer hover:text-gray-900" />
//                     Pesquisar!
//                   </button>
//                 </div>
//               </div>
//             )} */}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
