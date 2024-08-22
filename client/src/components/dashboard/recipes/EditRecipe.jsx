import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import recipeCategories from "../../../constants/recipeCategories.js";
import recipeDifficulty from "../../../constants/recipeDifficulty.js";
import ImageFormUpload from "../../formularios/ImageFormUpload.jsx";
import FormField from "../../formularios/FormField.jsx";
import { getStorage, ref, deleteObject } from "firebase/storage";
import TextAreaField from "../../formularios/TextArealField.jsx";

import SelectField from "../../formularios/SelectField.jsx";
import useToast from "../../../hooks/useToast.js";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { UPDATE_RECIPE } from "../../../graphql/mutation/recipe.mutation.js";
import { recipeUpdate } from "../../../features/recipes/recipesSlice.js";

export default function EditRecipe({ id }) {
  const user = useSelector((state) => state.auth.user);
  const { recipes } = useSelector((state) => state.recipes);
  const recipe = recipes.find((recipe) => recipe.id === id);
  const [newUpdateRecipe] = useMutation(UPDATE_RECIPE, {
    onCompleted: async (data) => {
      dispatch(
        recipeUpdate({
          updateRecipeId: id,
          updatedRecipe: data.updateRecipe,
        })
      );
      navigate("/dashboard?tab=myRecipes");

      showSuccess(
        `A receita ${data.updateRecipe.title}, foi alterada com sucesso!!!`
      );
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newImage, setNewImage] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    category: recipe.category,
    content: recipe.content,
    description: recipe.description,
    difficult: recipe.difficult,
    image: recipe.image,
    ingredients: recipe.ingredients,
    ratings: recipe.ratings,
    time: recipe.time,
    title: recipe.title,
    writer: user.username,
    calda: recipe.calda || { ingredients: [], content: "" },
    recheio: recipe.recheio || { ingredients: [], content: "" },
    cobertura: recipe.cobertura || { ingredients: [], content: "" },
    massa: recipe.massa || { ingredients: [], content: "" },
  });

  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [showOptionalSections, setShowOptionalSections] = useState({
    calda: false,
    recheio: false,
    cobertura: false,
    massa: false,
  });

  useEffect(() => {
    if (imageFileUrl) {
      setFormData((prevData) => ({
        ...prevData,
        image: imageFileUrl,
      }));
    }
  }, [imageFileUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIngredientsChange = (e, index) => {
    const { value } = e.target;
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      ingredients: newIngredients,
    }));
  };

  const addIngredient = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, ""],
    }));
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      ingredients: newIngredients,
    }));
  };

  const storage = getStorage();
  const fileRef = ref(storage, imageFileUrl);
  const handleDeleteImage = async () => {
    if (imageFileUrl) {
      try {
        await deleteObject(fileRef);
        setImageFileUrl(null);
        setFormData((prevData) => ({
          ...prevData,
          image: "",
        }));
        console.log("Arquivo deletado com sucesso");
      } catch (error) {
        console.error("Erro ao deletar o arquivo: ", error);
      }
    }
  };

  const handleNewRecipe = async (e) => {
    e.preventDefault();
    const {
      title,
      content,
      ingredients,
      writer,
      difficult,
      description,
      category,
      time,
    } = formData;

    if (
      !title ||
      !content ||
      !ingredients ||
      !writer ||
      !difficult ||
      !description ||
      !category ||
      !time
    ) {
      return showError("Por favor, preencha todos os campos.");
    }

    try {
      const updateRecipeId = recipe.id;
      const updateRecipe = {
        title: formData.title,
        content: formData.content,
        image: imageFileUrl || recipe.image,
        category: formData.category,
        ingredients: formData.ingredients,
        difficult: formData.difficult,
        description: formData.description,
        time: formData.time,
        calda: formData.calda,
        recheio: formData.recheio,
        cobertura: formData.cobertura,
        massa: formData.massa,
      };
      await newUpdateRecipe({
        variables: {
          updateRecipeId,
          updateRecipe,
        },
      });
    } catch (error) {
      showError(error.message);
      console.error(error.message);
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      content: "",
      image: "",
      ingredients: [],
      writer: user.username,
      difficult: "",
      description: "",
      category: "",
      time: "",
      calda: { ingredients: [], content: "" },
      recheio: { ingredients: [], content: "" },
      cobertura: { ingredients: [], content: "" },
      massa: { ingredients: [], content: "" },
    });
    navigate("/dashboard?tab=myRecipes");
  };

  //optional Recipe
  const handleFieldChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleIngredientsChangeOptional = (e, section, index) => {
    const { value } = e.target;
    const newIngredients = [...formData[section].ingredients];
    newIngredients[index] = value;
    handleFieldChange(section, "ingredients", newIngredients);
  };

  const addIngredientOptional = (section) => {
    handleFieldChange(section, "ingredients", [
      ...formData[section].ingredients,
      "",
    ]);
  };

  const removeIngredientOptional = (section, index) => {
    const newIngredients = formData[section].ingredients.filter(
      (_, i) => i !== index
    );
    handleFieldChange(section, "ingredients", newIngredients);
  };

  const toggleOptionalSection = (section) => {
    setShowOptionalSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const renderOptionalFields = (sectionName, sectionLabel) => (
    <div className="flex-1 flex flex-col gap-4">
      <button
        type="button"
        onClick={() => toggleOptionalSection(sectionName)}
        className="font-semibold text-left"
      >
        {showOptionalSections[sectionName]
          ? `Esconder ${sectionLabel}`
          : `Adicionar ${sectionLabel}`}
      </button>

      {showOptionalSections[sectionName] && (
        <>
          <div className="flex flex-col gap-2">
            <label>Ingredientes - {sectionLabel}</label>
            {formData[sectionName].ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientsChangeOptional(e, sectionName, index)
                  }
                  className="p-2 border rounded flex-grow"
                />
                <button
                  type="button"
                  onClick={() => removeIngredientOptional(sectionName, index)}
                  className="p-2 border rounded bg-red-500 text-white"
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addIngredientOptional(sectionName)}
              className="p-2 border rounded bg-blue-500 text-white"
            >
              Adicionar Ingrediente
            </button>
          </div>
          <TextAreaField
            name={`${sectionName}-content`}
            label={`Modo de preparo - ${sectionLabel}`}
            value={formData[sectionName].content}
            handleChange={(e) =>
              handleFieldChange(sectionName, "content", e.target.value)
            }
          />
        </>
      )}
    </div>
  );

  return (
    <section className="flex flex-col w-full items-start font-noto px-4 sm:px-8 md:px-20 lg:px-40 xl:px-52 py-8 bg-stone-100 gap-10">
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
        Nova Receita
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.9,
        }}
        className="w-full"
      >
        <form
          className="w-full flex flex-col sm:flex-row md:flex-col lg:flex-row  gap-4"
          onSubmit={handleNewRecipe}
        >
          <div className="flex-1 flex gap-4  flex-col">
            <FormField
              name="title"
              label="Título da receita"
              type="text"
              value={formData.title}
              handleChange={handleChange}
              required
            />
            <TextAreaField
              name="description"
              label="Descrição - conte a história da receita"
              value={formData.description}
              handleChange={handleChange}
            />

            <div className="flex flex-col gap-2">
              <label>Ingredientes</label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientsChange(e, index)}
                    className="p-2 border rounded flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 border rounded bg-red-500 text-white"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="p-2 border rounded bg-blue-500 text-white"
              >
                Adicionar Ingrediente
              </button>
            </div>
            <TextAreaField
              name="content"
              label="Modo de preparo"
              value={formData.content}
              handleChange={handleChange}
            />
            <SelectField
              name="difficult"
              label="Dificuldade"
              value={formData.difficult}
              handleChange={handleChange}
              options={recipeDifficulty}
            />

            <SelectField
              name="category"
              label="Categoria"
              value={formData.category}
              handleChange={handleChange}
              options={recipeCategories}
            />
            <FormField
              name="time"
              label="Tempo (0:00 - 12:00)"
              type="time"
              value={formData.time}
              handleChange={handleChange}
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
              className="w-full flex flex-col  gap-4"
            >
              <p>Itens opcionais</p>
              {renderOptionalFields("calda", "Calda")}
              {renderOptionalFields("recheio", "Recheio")}
              {renderOptionalFields("cobertura", "Cobertura")}
              {renderOptionalFields("massa", "Massa")}
            </motion.div>
            <button
              type="submit"
              className="p-2 border rounded bg-green-500 text-white hidden sm:block md:hidden lg:block"
            >
              Salvar Receita
            </button>
            <button
              className="p-2 border rounded bg-red-500 text-white hidden sm:block md:hidden lg:block"
              onClick={() => clearForm()}
            >
              Voltar
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 ">
            <p className="font-semibold">Imagem</p>

            {!newImage ? (
              <>
                <div className="flex flex-col items-center gap-5 mb-5">
                  <img
                    src={recipe.image}
                    alt="Imagem da receita"
                    className="w-64 h-32 object-cover"
                  />
                  <button
                    className="p-2 rounded bg-slate-400"
                    onClick={() => setNewImage(true)}
                  >
                    Quer trocar imagem?
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-5 mb-5">
                <ImageFormUpload
                  imageFileUrl={imageFileUrl}
                  setImageFileUrl={setImageFileUrl}
                  handleDeleteImage={handleDeleteImage}
                />
                <button
                  className="p-2 rounded bg-slate-400"
                  onClick={() => setNewImage(false)}
                >
                  Não quero trocar imagem!
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="p-2 border rounded bg-green-500 text-white sm:hidden md:block lg:hidden"
          >
            Salvar Receita
          </button>
          <button
            className="p-2 border rounded bg-red-500 text-white sm:hidden md:block lg:hidden"
            onClick={() => clearForm()}
          >
            Voltar
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.5,
        }}
        className="flex gap-5 justify-center w-full flex-wrap"
      >
        <Link
          to={"/dashboard?tab=myRecipes"}
          className="border bg-slate-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-slate-100"
        >
          Receitas enviadas
        </Link>
        <Link
          to={"/dashboard?tab=saveRecipe"}
          className="border bg-stone-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-stone-100"
        >
          Receitas Salvas
        </Link>
      </motion.div>
    </section>
  );
  // return (
  //   <section className="flex flex-col w-full items-start font-noto px-4 sm:px-8 md:px-20 lg:px-40 xl:px-52 py-8 bg-stone-100 gap-10">
  //     <motion.h1
  //       initial={{ opacity: 0, y: -100 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{
  //         type: "spring",
  //         stiffness: 100,
  //         damping: 10,
  //         delay: 0.5,
  //       }}
  //       className="font-oswald text-4xl border-b w-full pb-3 border-b-stone-600"
  //     >
  //       Editar Receita
  //     </motion.h1>
  //     <motion.div
  //       initial={{ opacity: 0, x: -100 }}
  //       animate={{ opacity: 1, x: 0 }}
  //       transition={{
  //         type: "spring",
  //         stiffness: 100,
  //         damping: 10,
  //         delay: 0.9,
  //       }}
  //       className="w-full"
  //     >
  //       <form
  //         className="w-full flex flex-col sm:flex-row md:flex-col lg:flex-row  gap-4"
  //         onSubmit={handleNewRecipe}
  //       >
  //         <div className="flex-1 flex gap-4  flex-col">
  //           <FormField
  //             name="title"
  //             label="Título da receita"
  //             type="text"
  //             value={formData.title}
  //             handleChange={handleChange}
  //             required
  //           />
  //           <TextAreaField
  //             name="description"
  //             label="Descrição - conte a história da receita"
  //             value={formData.description}
  //             handleChange={handleChange}
  //           />

  //           <div className="flex flex-col gap-2">
  //             <label>Ingredientes</label>
  //             {formData.ingredients.map((ingredient, index) => (
  //               <div key={index} className="flex gap-2">
  //                 <input
  //                   type="text"
  //                   value={ingredient}
  //                   onChange={(e) => handleIngredientsChange(e, index)}
  //                   className="p-2 border rounded flex-grow"
  //                 />
  //                 <button
  //                   type="button"
  //                   onClick={() => removeIngredient(index)}
  //                   className="p-2 border rounded bg-red-500 text-white"
  //                 >
  //                   Remover
  //                 </button>
  //               </div>
  //             ))}
  //             <button
  //               type="button"
  //               onClick={addIngredient}
  //               className="p-2 border rounded bg-blue-500 text-white"
  //             >
  //               Adicionar Ingrediente
  //             </button>
  //           </div>
  //           <TextAreaField
  //             name="content"
  //             label="Modo de preparo"
  //             value={formData.content}
  //             handleChange={handleChange}
  //           />
  //           <SelectField
  //             name="difficult"
  //             label="Dificuldade"
  //             value={formData.difficult}
  //             handleChange={handleChange}
  //             options={recipeDifficulty}
  //           />

  //           <SelectField
  //             name="category"
  //             label="Categoria"
  //             value={formData.category}
  //             handleChange={handleChange}
  //             options={recipeCategories}
  //           />
  //           <FormField
  //             name="time"
  //             label="Tempo (0:00 - 12:00)"
  //             type="time"
  //             value={formData.time}
  //             handleChange={handleChange}
  //           />
  //         </div>
  //         <div className="flex-1 flex flex-col items-center gap-2 ">
  //           <p className="font-semibold">Imagem</p>

  //           {!newImage ? (
  //             <>
  //               <div className="flex flex-col items-center gap-5 mb-5">
  //                 <img
  //                   src={recipe.image}
  //                   alt="Imagem da receita"
  //                   className="w-64 h-32 object-cover"
  //                 />
  //                 <button
  //                   className="p-2 rounded bg-slate-400"
  //                   onClick={() => setNewImage(true)}
  //                 >
  //                   Quer trocar imagem?
  //                 </button>
  //               </div>
  //             </>
  //           ) : (
  //             <div className="flex flex-col gap-5 mb-5">
  //               <ImageFormUpload
  //                 imageFileUrl={imageFileUrl}
  //                 setImageFileUrl={setImageFileUrl}
  //                 handleDeleteImage={handleDeleteImage}
  //               />
  //               <button
  //                 className="p-2 rounded bg-slate-400"
  //                 onClick={() => setNewImage(false)}
  //               >
  //                 Não quero trocar imagem!
  //               </button>
  //             </div>
  //           )}

  //           <button
  //             type="submit"
  //             className="p-2 border rounded bg-green-500 text-white"
  //           >
  //             Salvar Edição de Receita
  //           </button>

  //           <button
  //             className="p-2 border rounded bg-red-500 text-white w-44"
  //             onClick={() => clearForm()}
  //           >
  //             Voltar
  //           </button>
  //         </div>
  //       </form>
  //     </motion.div>

  //     <motion.div
  //       initial={{ opacity: 0, y: 100 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{
  //         type: "spring",
  //         stiffness: 100,
  //         damping: 10,
  //         delay: 0.5,
  //       }}
  //       className="flex gap-5 justify-center w-full flex-wrap"
  //     >
  //       <Link
  //         to={"/dashboard?tab=myRecipes"}
  //         className="border bg-slate-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-slate-100"
  //       >
  //         Receitas enviadas
  //       </Link>
  //       <Link
  //         to={"/dashboard?tab=saveRecipe"}
  //         className="border bg-stone-700 w-48 py-2 text-center rounded-md border-transparent hover:border-white text-stone-100"
  //       >
  //         Receitas Salvas
  //       </Link>
  //     </motion.div>
  //   </section>
  // );
}

EditRecipe.propTypes = {
  id: PropTypes.string,
};
