import { useSelector } from "react-redux";
import Loading from "../helper/Loading";
import Login from "./Login";
export default function Home() {
  const loading = true;

  const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    console.log("User: ", user);

    if (!user) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1>BEm vindo, {user.name}</h1>
        <p>Admin: {user.isAdmin}</p>
        <p>Username: {user.username}</p>
      </div>
    );
  };

  return (
    <div className="bg-orange-100">
      <h1>Home</h1>
      <Login />
      <Profile />
      {/* {loading && <Loading />} */}
    </div>
  );
}
