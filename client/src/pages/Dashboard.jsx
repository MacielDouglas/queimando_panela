import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import DashSidebar from "../components/DashSidebar";
import Profile from "./Profile";
import DashSidebar from "../components/dashboard/DashSidebar";
// import CreatePost from "./CreatePost";
// import DashPosts from "./../components/DashPosts";
// import UpdatePost from "./UpdatePost";

export default function Dashboard() {
  const location = useLocation();

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || ""
  );

  // Efeito para atualizar a aba com base nos parâmetros da URL
  useEffect(() => {
    // Extrair o valor do parâmetro "tab" da URL
    const tabFromUrl = new URLSearchParams(location.search).get("tab");

    // Definir a aba com base no valor da URL, ou manter vazio se não estiver presente
    setTab(tabFromUrl || "");
  }, [location.search]);

  // Função para extrair o ID do post da URL
  //   const getPostIdFromTab = () => {
  //     const match = tab.match(/^\/update-post\/(.+)/);
  //     return match ? match[1] : null;
  //   };

  //   const postSlug = getPostIdFromTab();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-200">
      <div className="md:w-56">{<DashSidebar />}</div>
      {tab === "profile" && <Profile />}
      {/* {tab === "posts" && <DashPosts />} */}
      {/* {tab === "newPost" && <CreatePost />} */}
      {/* {postSlug && <UpdatePost postSlug={postSlug} />} */}
    </div>
  );
}
