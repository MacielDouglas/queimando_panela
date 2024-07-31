import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import useToast from "./../../hooks/useToast";
import PropTypes from "prop-types";

export default function ImageFormUpload({
  image,
  imageFileUrl,
  setImageFileUrl,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const { showSuccess, showError } = useToast();

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
    // setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, `perfil/${fileName}`);
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
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={filePickerRef}
        hidden
      />
      <div
        className="relative w-52 h-52 sm:w-48 sm:h-48 lg:w-64 lg:h-64 self-center sm:self-start  cursor-pointer shadow-md overflow-hidden rounded-full "
        onClick={() => filePickerRef.current.click()}
      >
        {imageFileUploadProgress > 0 && (
          <CircularProgressbar
            value={imageFileUploadProgress || 0}
            text={`${imageFileUploadProgress}%`}
            strokeWidth={5}
            styles={{
              root: {
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              },
              path: {
                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
              },
              text: {
                fill: "white",
                fontSize: "16px",
                textAnchor: "middle",
                dominantBaseline: "central",
              },
            }}
          />
        )}
        <img
          src={imageFileUrl || image}
          alt="imagem do usuário"
          className={`rounded-full w-full h-full object-fil hover:object-cover border-8 border-[lightgray] ${
            imageFileUploadProgress &&
            imageFileUploadProgress < 100 &&
            "opacity-60"
          }`}
        />
      </div>
      {imageFileUploadError && (
        <p className="text-red-700">{imageFileUploadError}</p>
      )}
    </>
  );
}

ImageFormUpload.propTypes = {
  image: PropTypes.string.isRequired,
  imageFileUrl: PropTypes.string,
  setImageFileUrl: PropTypes.func,
};
