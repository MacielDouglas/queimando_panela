import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GET_USER } from "../graphql/queries/user.query";
import { PropTypes } from "prop-types";
import Loading from "../helper/Loading";
import StarsRender from "./others/StarsRender";
import TextAreaField from "./formularios/TextArealField";
import {
  DELETE_RATING,
  RATE_RECIPE,
} from "../graphql/mutation/recipe.mutation";
import useToast from "../hooks/useToast";
import Modal from "./modal/Modal";
import { ALL_RECIPES } from "../graphql/queries/recipe.query";

export default function Ratings({ ratings, id }) {
  const user = useSelector((state) => state.auth.user);
  const [getUser, { loading }] = useLazyQuery(GET_USER);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [users, setUsers] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { showSuccess, showError } = useToast();

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const [rateRecipe] = useMutation(RATE_RECIPE);

  const [deleteRating] = useMutation(DELETE_RATING);

  const handleNewRating = async (e) => {
    e.preventDefault();
    if (!userRating || !comment)
      return showError("Por favor, adicione uma avaliação para enviar.");

    try {
      await rateRecipe({
        variables: {
          rateRecipe: {
            recipeId: id,
            score: userRating,
            comment: comment,
            userId: user.id,
          },
        },
      });
      showSuccess("Comentário enviado com sucesso!");
      setIsEditModalOpen(false);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteRating = async () => {
    try {
      await deleteRating({
        variables: { recipeId: id, userId: user.id },
      });
      setIsDeleteModalOpen(false);
      showSuccess("Comentário deletado com sucesso!");
    } catch (error) {
      showError(error.message);
    }
  };

  // Estado para armazenar dados do usuário
  useEffect(() => {
    // Função para buscar e armazenar dados do usuário
    const fetchUser = async (userId) => {
      try {
        const { data } = await getUser({ variables: { getUserId: userId } });
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: data.getUser }));
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    // Buscar dados dos usuários que ainda não estão no estado
    ratings.forEach((rating) => {
      if (!users[rating.userId]) {
        fetchUser(rating.userId);
      }
    });
  }, [ratings, users, getUser]);

  if (loading) return <Loading />;

  return (
    <div className="bg-slate-400 -mx-14 -mb-20 font-noto p-10 z-30 relative">
      <h1 className="font-oswald text-xl uppercase tracking-widest text-center pb-5">
        Avaliações encontradas: {ratings.length}
      </h1>
      <div className="">
        {ratings.length > 0 ? (
          <div className="w-full flex  flex-col gap-4">
            {ratings.map((rating, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 text-xs border-b-[0.01rem] pb-1"
              >
                <div className="flex gap-4">
                  <p className="italic font-semibold text-stone-600">
                    {users[rating.userId]
                      ? "@" + users[rating.userId].username
                      : "Carregando..."}
                  </p>
                  <p>-</p>
                  <div className="flex items-center gap-1">
                    <StarsRender rating={rating.rating} />
                  </div>
                  {rating.userId === user.id && (
                    <>
                      <button
                        onClick={() => {
                          setComment(rating.comment);
                          setUserRating(rating.rating);
                          setIsEditModalOpen(true);
                        }}
                        className="text-stone-700 hover:text-stone-950"
                      >
                        editar
                      </button>
                      <button
                        className="text-red-700 hover:text-rose-950"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        deletar
                      </button>
                    </>
                  )}
                </div>
                <p className="text-wrap text-base">{rating.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <h2>Não tem avaliações.</h2>
          </>
        )}
        {ratings.some((rating) => rating.userId === user.id)}
        {user ? (
          ratings.some((rating) => rating.userId === user.id) ? (
            <div className="pt-10">
              <h3 className="font-oswald text-lg uppercase tracking-widest text-center pb-5">
                Obrigado por ter avaliado essa receita
              </h3>
            </div>
          ) : (
            <div className="pt-10">
              <h3 className="font-oswald text-lg uppercase tracking-widest text-center pb-5">
                Faça uma avaliação
              </h3>
              <form onSubmit={handleNewRating}>
                <div className="flex gap-1 cursor-pointer text-2xl pb-5">
                  <StarsRender
                    rating={userRating}
                    setUserRating={setUserRating}
                  />
                </div>
                <TextAreaField
                  name="comment"
                  label="Comentário - conte o que você achou da receita..."
                  value={comment}
                  handleChange={handleCommentChange}
                  maxLength={250}
                />
                <button
                  className="py-2 px-4 border border-transparent hover:border-white bg-stone-700 text-white disabled:bg-stone-500 disabled:hover:border-transparent"
                  disabled={comment === "" && userRating === 0}
                >
                  Enviar Avaliação
                </button>
              </form>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-4 mt-12">
            <p>Faça login para enviar uma avaliação</p>
            <Link
              to="/login"
              className="p-2 bg-stone-700 text-white w-40 text-center"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Editar Comentário</h2>
        <form onSubmit={handleNewRating}>
          <div className="flex gap-1 cursor-pointer text-2xl pb-5">
            <StarsRender rating={userRating} setUserRating={setUserRating} />
          </div>
          <TextAreaField
            name="comment"
            label="Comentário - conte o que você achou da receita..."
            value={comment}
            handleChange={handleCommentChange}
            maxLength={250}
          />
          <div className="flex justify-end gap-4">
            <button
              className="py-2 px-4 border border-transparent hover:border-white bg-stone-700 text-white disabled:bg-stone-500 disabled:hover:border-transparent"
              disabled={comment === "" && userRating === 0}
            >
              Atualizar Avaliação
            </button>
            <button
              className="py-2 px-4 bg-red-700 text-white"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Confirmar Exclusão</h2>
        <p>Você tem certeza que quer excluir seu comentário?</p>
        <div className="flex justify-end gap-4">
          <button
            className="py-2 px-4 bg-red-700 text-white"
            onClick={handleDeleteRating}
          >
            Deletar
          </button>
          <button
            className="py-2 px-4 bg-gray-500 text-white"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}

Ratings.propTypes = {
  ratings: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
};
