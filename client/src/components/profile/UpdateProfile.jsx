import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import ImageFormUpload from "../formularios/ImageFormUpload";
import { useState } from "react";
import FormField from "../formularios/FormField";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../graphql/mutation/user.mutation";
import useToast from "../../hooks/useToast";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { resetAuth } from "../../features/auth/authSlice";

export default function UpdateProfile() {
  const user = useSelector((state) => state.auth.user);
  const [updateUser] = useMutation(UPDATE_USER);
  const navigate = useNavigate();

  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: "",
    profilePicture: imageFileUrl,
    password: "",
  });
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const storage = getStorage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (
        imageFileUrl &&
        user.profilePicture !==
          "https://firebasestorage.googleapis.com/v0/b/queimando-panela.appspot.com/o/perfil%2F1722454447282user.webp?alt=media&token=3dd585aa-5ce9-4bb3-9d46-5ecf11d1e60c"
      ) {
        const fileRef = ref(storage, user.profilePicture);
        try {
          await deleteObject(fileRef);
        } catch (e) {
          console.error("Erro ao deletar a imagem: ", e.message);
        }
      }
      await updateUser({
        variables: {
          updateUserId: user.id,
          updateUserInput: {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            profilePicture: imageFileUrl,
            password: formData.password,
          },
        },
      });
      showSuccess(
        "Alterado com sucesso. Faça o login novamente para ver as alterações"
      );
      handleReset();
    } catch (error) {
      setLoading(false);
      console.error(error.message);
      showError(error.message);
    }
  };

  const handleDeleteImage = async () => {
    if (!imageFileUrl) {
      navigate("/dashboard?tab=profile");
      return;
    }

    const fileRef = ref(storage, imageFileUrl);
    try {
      await deleteObject(fileRef);
      console.log("Arquivo deletado com sucesso");
    } catch (error) {
      console.error("Erro ao deletar o arquivo: ", error);
    }

    navigate("/dashboard?tab=profile");
  };

  const dispatch = useDispatch();
  const handleReset = () => {
    dispatch(resetAuth());
  };

  return (
    <section className="flex flex-col w-full items-center font-noto px-4 sm:px-8 md:px-20 lg:px-40 xl:px-52 py-8 bg-stone-100 gap-10">
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
        Editar o usuário
      </motion.h1>
      <form
        className="flex flex-col sm:flex-row justify-around sm:gap-10"
        onSubmit={handleSubmit}
      >
        <ImageFormUpload
          image={user.profilePicture}
          imageFileUrl={imageFileUrl}
          setImageFileUrl={setImageFileUrl}
        />
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.5,
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
            label="Username"
            type="text"
            name="username"
            value={formData.username}
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
            className="w-56 bg-transparent text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-white p-2 rounded disabled:bg-stone-800 disabled:text-stone-300 mb-4 mr-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Enviar"}
          </button>
          <button
            className="w-56  bg-red-500 text-white hover:bg-red-700 hover:text-white p-2 rounded disabled:bg-red-300 disabled:text-stone-300"
            type="button"
            disabled={loading}
            onClick={() => handleDeleteImage(imageFileUrl)}
          >
            Cancelar
          </button>
        </motion.div>
      </form>
    </section>
  );
}
