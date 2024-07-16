import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./../features/auth/authActions";
import pan from "../assets/pan_kitchen.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispacth = useDispatch();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
    <div className="min-h-screen p-14  bg-cover ">
      <div className="p-14 mx-auto max-w-96 sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-gray-100 rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-5 ">
          <div className="flex-1">
            <img
              src={pan}
              className="object-cover rounded-lg hidden md:block"
            />
            <h1 className="text-center text-gray-800 mb-2 text-3xl font-bold font-oswald md:hidden">
              Seja bem vindo ao Queimando Panelas
            </h1>
            <p className="text-gray-500 md:hidden">
              Faça o login para publicar receita, comentar e pontuar.
            </p>
          </div>
          <div className="flex-1">
            <h1 className="text-center mb-2 text-3xl font-bold font-oswald hidden md:block">
              Seja bem vindo ao Queimando Panelas
            </h1>
            <p className="text-gray-500 md:block hidden mb-4">
              Faça o login para publicar receita, comentar e pontuar.
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-gray-600 font-medium text-sm"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-gray-600 font-medium text-sm"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gray-800 text-white rounded-md py-2 px-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-600 disabled:bg-gray-600"
                // disabled={loading}
              >
                {/* {loading ? "Loading..." : "Entrar"} */}
                Entrar
              </button>
            </form>
            <button
              type="submit"
              className="bg-red-700 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:bg-red-500 disabled:bg-red-500 w-full mt-4"
              // disabled={loading}
            >
              {/* {loading ? "Loading..." : "Entrar"} */}
              Entrar com Google
            </button>
            <div className="flex flex-col gap-2 text-sm mt-2 sm:flex-row">
              <p className="text-gray-500">Ainda não tem uma conta?</p>
              <Link
                to="/sign-up"
                className="text-blue-700 hover:underline font-medium"
              >
                Inscreva-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
