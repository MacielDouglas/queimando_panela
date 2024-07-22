import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./../features/auth/authActions";
import pan from "../assets/pan_kitchen.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import { NEW_USER } from "./../graphql/mutation/user.mutation";
import useToast from "../hooks/useToast";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const [newUser, { loading: mutationLoading, error }] = useMutation(NEW_USER);

  useEffect(() => {
    if (mutationLoading) {
      setLoading(true);
    }
    if (error) {
      showError(error.message);
    }
  }, [mutationLoading, error, showError]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resultAction = await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
      if (!loginUser.fulfilled.match(resultAction)) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleNewUser = async (e) => {
    e.preventDefault();
    const { name, email, confirmEmail, password, confirmPassword } = formData;
    if (!name || !email || !confirmEmail || !password || !confirmPassword) {
      return showError("Por favor, preencha todos os campos.");
    }
    if (email !== confirmEmail) {
      return showError("Os emails não conferem.");
    }
    if (password !== confirmPassword) {
      return showError("As senhas não conferem.");
    }
    const modifyEmail =
      email.split("@")[0] + Math.floor(1000 + Math.random() * 9000);
    try {
      setLoading(true);
      await newUser({
        variables: {
          user: {
            username: modifyEmail,
            email: email,
            password: password,
            name: name,
            profilePicture:
              "https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_640.png",
          },
        },
      });
      showSuccess(`Seja bem-vindo ${name}. Agora faça o seu login.`);
      setCadastro(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError(error.message);
      console.log(error);
    }
  };

  const isFormValid = () => {
    const { name, email, confirmEmail, password, confirmPassword } = formData;
    return (
      name &&
      email &&
      confirmEmail &&
      password &&
      confirmPassword &&
      email === confirmEmail &&
      password === confirmPassword
    );
  };

  return (
    <div
      className={`flex overflow-hidden font-noto bg-stone-50 ${
        !cadastro ? "h-[700px]" : "h-[950px]"
      }`}
    >
      <div className="flex-1 hidden sm:block">
        <img
          src={pan}
          className="object-cover object-center w-full h-full"
          alt="foto de uma pessoa ralando queijo em uma panela com alimento."
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        {!cadastro ? (
          <LoginSection
            formData={formData}
            handleChange={handleChange}
            handleLogin={handleLogin}
            setCadastro={setCadastro}
            loading={loading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        ) : (
          <SignupSection
            formData={formData}
            handleChange={handleChange}
            handleNewUser={handleNewUser}
            setCadastro={setCadastro}
            loading={loading}
            isFormValid={isFormValid}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}
      </div>
    </div>
  );
}

const LoginSection = ({
  formData,
  handleChange,
  handleLogin,
  setCadastro,
  loading,
  showPassword,
  setShowPassword,
}) => (
  <div className="w-full max-w-md p-8">
    <motion.div
      className="relative mb-1"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      }}
    >
      <div className="bg-yellow-400 w-6 h-6 rounded-md relative z-10"></div>
      <h1 className="text-4xl text-black font-oswald font-semibold absolute -top-5 left-2 z-20">
        Login
      </h1>
    </motion.div>
    <motion.p
      className="text-sm text-stone-600 mb-4"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      }}
    >
      Faça seu login em Queimando Panela, para publicar seus melhores pratos,
      favoritar suas receitas e salvar suas receitas preferidas.
    </motion.p>
    <motion.form
      onSubmit={handleLogin}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 1,
      }}
    >
      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        handleChange={handleChange}
      />
      <FormField
        label="Senha"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        handleChange={handleChange}
      />
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="form-checkbox"
          />
          <span className="ml-2 text-black">Mostrar Senha</span>
        </label>
      </div>
      <button
        className="w-56 bg-transparent text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-white p-2 rounded disabled:bg-stone-800 disabled:text-stone-300"
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : "Entrar"}
      </button>
    </motion.form>
    <motion.button
      type="button"
      className="w-56 bg-red-700 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:bg-red-500 disabled:bg-red-500 mt-4"
      disabled={loading}
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 1,
      }}
    >
      {loading ? "Loading..." : "Entrar com Google"}
    </motion.button>
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      }}
    >
      <h2 className="text-2xl text-black font-oswald font-semibold">
        Cadastre-se
      </h2>
      <div className="bg-yellow-400 rounded-sm w-10 h-1 mb-4"></div>
      <p className="text-sm text-stone-600 mb-4">
        Não tem uma conta? Cadastre-se agora{" "}
      </p>
      <button
        onClick={() => setCadastro(true)}
        className="w-56 bg-transparent text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-white p-2 rounded"
      >
        Cadastro
      </button>
    </motion.div>
  </div>
);

const SignupSection = ({
  formData,
  handleChange,
  handleNewUser,
  setCadastro,
  loading,
  isFormValid,
  showPassword,
  setShowPassword,
}) => (
  <div className="w-full max-w-md p-8">
    <motion.div
      className="relative mb-1"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      }}
    >
      <div className="bg-yellow-400 w-6 h-6 rounded-md relative z-10"></div>
      <h1 className="text-4xl text-black font-oswald font-semibold absolute -top-5 left-2 z-20">
        Cadastro
      </h1>
    </motion.div>
    <motion.p
      className="text-sm text-stone-600 mb-4"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      }}
    >
      Cadastre-se no Queimando Panela para publicar seus melhores pratos,
      favoritar suas receitas e salvar suas receitas preferidas.
    </motion.p>
    <motion.form
      onSubmit={handleNewUser}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 1,
      }}
    >
      <FormField
        label="Nome"
        type="text"
        name="name"
        value={formData.name}
        handleChange={handleChange}
      />
      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        handleChange={handleChange}
      />
      <FormField
        label="Confirmar Email"
        type="email"
        name="confirmEmail"
        value={formData.confirmEmail}
        handleChange={handleChange}
      />
      <FormField
        label="Senha"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        handleChange={handleChange}
      />
      <FormField
        label="Confirmar Senha"
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        value={formData.confirmPassword}
        handleChange={handleChange}
      />
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="form-checkbox"
          />
          <span className="ml-2 text-black">Mostrar Senha</span>
        </label>
      </div>
      <button
        className="w-56 bg-transparent text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-white p-2 rounded disabled:bg-stone-800 disabled:text-stone-300"
        type="submit"
        disabled={!isFormValid() || loading}
      >
        {loading ? "Cadastrando..." : "Cadastre-se"}
      </button>
    </motion.form>
    <motion.button
      type="button"
      className="w-56 bg-red-700 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:bg-red-500 disabled:bg-red-500 mt-4"
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 1,
      }}
    >
      Entrar com Google
    </motion.button>
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      }}
    >
      <h2 className="text-2xl text-black font-oswald font-semibold">Login</h2>
      <div className="bg-yellow-400 rounded-sm w-10 h-1 mb-4"></div>
      <p className="text-sm text-stone-600 mb-4">
        Já tem uma conta? Faça o login agora{" "}
      </p>
      <button
        onClick={() => setCadastro(false)}
        className="w-56 bg-transparent text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-white p-2 rounded"
      >
        Login
      </button>
    </motion.div>
  </div>
);

const FormField = ({ label, type, name, value, handleChange }) => (
  <div className="mb-4">
    <label className="block text-black mb-2" htmlFor={name}>
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={handleChange}
      className="w-full border bg-stone-100 border-stone-300 rounded-md px-4 py-2 focus:outline-none focus:bg-white focus:border-yellow-500 hover:border-yellow-300 hover:bg-white"
      required
    />
  </div>
);

LoginSection.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  setCadastro: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
};

SignupSection.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    confirmEmail: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNewUser: PropTypes.func.isRequired,
  setCadastro: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isFormValid: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
