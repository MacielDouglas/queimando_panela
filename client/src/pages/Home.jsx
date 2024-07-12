import { useSelector } from "react-redux";
import Login from "./Login";
import HomeRecipe from "../components/HomeRecipe";

export default function Home() {
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
    <div className="relative min-h-screen bg-pattern bg-cover">
      <div>
        <HomeRecipe />
        <h1>Home</h1>
      </div>
      <Login />
      <Profile />
    </div>
  );
}
