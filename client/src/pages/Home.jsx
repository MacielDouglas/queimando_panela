import { useSelector } from "react-redux";
import HomeRecipe from "../components/HomeRecipe";
import BestRecipe from "../components/BestRecipe";
import UpdateUser from "../components/ImageUpload";

export default function Home() {
  console.log(import.meta.env.STORAGE_BUCKET);
  const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    console.log("User: ", user);

    if (!user) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div>
          <h1>BEm vindo, {user.name}</h1>
          <p>Admin: {user.isAdmin}</p>
          <p>Username: {user.username}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <div>
        <HomeRecipe />
        <BestRecipe />
        <h1>Home</h1>
      </div>
      {/* <Login /> */}
      <Profile />
      <UpdateUser />
    </div>
  );
}
