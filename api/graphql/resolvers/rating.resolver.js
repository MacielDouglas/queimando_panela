import Rating from "../../models/rating.models.js";
import Recipe from "../../models/recipe.models.js";
import { verifyAuthorization } from "../../utils/utils.js";
import GraphQLJSON from "graphql-type-json";

const ratingResolver = {
  JSON: GraphQLJSON,

  Query: {
    getRating: async (_, { recipeId }) => {
      try {
        if (recipeId) {
          const rating = await Rating.findOne({ recipeId }).exec();
          return rating;
        }
      } catch (error) {
        throw new Error(`Erro ao buscar pontuações: ${error.message}`);
      }
    },
  },

  Mutation: {
    createRating: async (_, { newRating }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken)
          throw new Error(
            "Você não tem permissão para pontuar uma receita, faça login corretamente."
          );

        const existingRecipe = await Recipe.findById(newRating.recipeId);
        if (!existingRecipe) {
          throw new Error("Desculpe, mas não encontramos essa receita.");
        }

        await Rating.findOneAndUpdate(
          { recipeId: newRating.recipeId },
          { $set: { [`rating.${decodedToken.userId}`]: newRating.rating } },
          { new: true, upsert: true }
        );
        return {
          userId: decodedToken.userId,
          rating: newRating.rating,
        };
      } catch (error) {
        throw new Error(`Erro ao pontuar a receita: ${error.message}`);
      }
    },

    // deleteRating: async (_, { recipeId }, { req }) => {
    //   try {
    //     const decodedToken = verifyAuthorization(req);
    //     if (!decodedToken)
    //       throw new Error(
    //         "Você não tem permissão para deletar a pontuação da receita, faça login corretamente."
    //       );

    //     await Rating.findOneAndUpdate(
    //       { recipeId },
    //       { $unset: { [`rating.${decodedToken.userId}`]: "" } },
    //       { new: true }
    //     );

    //     return {
    //       success: true,
    //       message: "Pontuação deletada com sucesso",
    //     };
    //   } catch (error) {
    //     throw new Error(`Erro ao deletar a pontuação: ${error.message}`);
    //   }
    // },
  },
};

export default ratingResolver;
