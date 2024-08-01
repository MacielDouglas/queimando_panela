import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import useToast from "./../../hooks/useToast";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function ImageFormUpload({
  image,
  imageFileUrl,
  setImageFileUrl,
  type,
  handleDeleteImage,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const { showSuccess, showError } = useToast();

  const recipeImage =
    "https://firebasestorage.googleapis.com/v0/b/queimando-panela.appspot.com/o/recipe%2F1722535207622receita_cozinhando.jpg?alt=media&token=243cb3c2-b0b6-4cf3-b20c-41449fcdd35c";

  const filePickerRef = useRef();

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // Função para upload da imagem para o Firebase Storage
  const uploadImage = async () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(
      storage,
      `${type === "profile" ? "perfil/" : "recipe/"}${fileName}`
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Evento para acompanhar o progresso do upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Não foi possível fazer upload da imagem (o arquivo deve ter menos de 2 MB)"
        );
        showError(
          "Não foi possível fazer upload da imagem (o arquivo deve ter menos de 2 MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        // Upload concluído com sucesso
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadProgress(100);
        });
        showSuccess("Imagem carregada com sucesso!");
      }
    );
  };

  return (
    <div className="flex itens-center  flex-col gap-6 w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={filePickerRef}
        hidden
      />
      <div
        className={` relative flex justify-center cursor-pointer  overflow-hidden mb-4 ${
          type === "profile"
            ? "rounded-full w-52 h-52 sm:w-48 sm:h-48 lg:w-64 lg:h-64 shadow-xl"
            : ""
        }`}
        onClick={() => filePickerRef.current.click()}
      >
        {type === "profile" ? (
          <>
            <motion.img
              src={imageFileUrl || image}
              alt={`Imagem ${type === "profile" ? "do usuário" : "da receita"}`}
              className={`${
                type === "profile" ? "rounded-full" : ""
              } w-full h-full object-fill hover:object-cover border-8 border-[lightgray]`}
              initial={{ opacity: 0.6 }}
              animate={{
                opacity:
                  `${imageFileUrl ? imageFileUploadProgress : 100}` / 100,
              }}
            />
            {imageFileUploadProgress > 0 && imageFileUploadProgress < 100 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
              >
                <motion.div
                  className="text-yellow-500 font-bold text-lg"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                >
                  {imageFileUploadProgress}%
                </motion.div>
              </motion.div>
            )}
          </>
        ) : (
          <div
            className="flex flex-col items-center gap-4"
            onClick={handleDeleteImage}
          >
            <motion.div
              initial={{ backgroundColor: "#2d3748" }}
              animate={{
                backgroundColor: imageFileUploadProgress
                  ? `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                  : "#455267",
              }}
              className="  bg-slate-400 rounded p-2"
            >
              Adicionar imagem
            </motion.div>
            <motion.img
              src={imageFileUrl || recipeImage}
              alt={`Imagem da receita`}
              className="w-full h-40 object-contain rounded-lg"
              initial={{ opacity: 0.6 }}
              animate={{
                opacity:
                  `${imageFileUrl ? imageFileUploadProgress : 100}` / 100,
              }}
            />
          </div>
        )}
      </div>
      {imageFileUploadError && (
        <p className="text-red-700 text-wrap">{imageFileUploadError}</p>
      )}
    </div>
  );
}

ImageFormUpload.propTypes = {
  image: PropTypes.string,
  imageFileUrl: PropTypes.string,
  setImageFileUrl: PropTypes.func.isRequired,
  type: PropTypes.string,
  handleDeleteImage: PropTypes.func,
};
