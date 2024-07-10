import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "./../features/auth/authActions";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispacth = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispacth(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Login successful: ", resultAction.payload);
      } else {
        console.log("Login failed: ", resultAction.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white flex flex-col items-center w-96 h-96 max-w-3xl mx-auto shadow-sm">
      <h1>akdçsfj açlsfja</h1>
      <p>akdj façksf ja~kjf kaç~sdf ja~</p>
      <form onSubmit={handleLogin} className="bg-orange-500 absolute border">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
