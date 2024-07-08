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
    <form onSubmit={handleLogin}>
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
  );
}
