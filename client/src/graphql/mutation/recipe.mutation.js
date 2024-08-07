import { gql } from "@apollo/client";

export const NEW_RECIPE = gql`
  mutation newRecipe($newRecipe: NewRecipeInput!) {
    createRecipe(newRecipe: $newRecipe) {
      title
      description
      difficult
      category
      content
      image
      ingredients
      writer
      userId
      time
    }
  }
`;

export const GET_RATING = gql`
  mutation getRating($newRating: NewRatingInput!) {
    rateRecipe(newRating: $newRating) {
      ratings {
        comment
        rating
      }
    }
  }
`;

export const DELETE_RATING = gql`
  mutation deleteRating($recipeId: ID!, $userId: ID!) {
    deleteRate(recipeId: $recipeId, userId: $userId) {
      message
      success
    }
  }
`;
