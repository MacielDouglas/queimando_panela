import { useState } from "react";
import { useSelector } from "react-redux";

const ImageUpload = () => {
  const user = useSelector((state) => state.auth.user);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
        alert("Imagem enviada com sucesso!");
      } else {
        alert("Erro ao enviar a imagem.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar a imagem.");
    }
  };

  console.log("User do ImageUpload", user?.id);

  return (
    <>
      <div>
        <h2>Upload Segundo de Imagem</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Enviar</button>
        </form>
        {imageUrl && (
          <div>
            <h3>Imagem Enviada:</h3>
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{ width: "300px", height: "auto" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
