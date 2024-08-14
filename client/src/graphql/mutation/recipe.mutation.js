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

export const UPDATE_RECIPE = gql`
  mutation updateRecipe(
    $updateRecipeId: ID!
    $updateRecipe: UpdateRecipeInput!
  ) {
    updateRecipe(id: $updateRecipeId, updateRecipe: $updateRecipe) {
      success
      message
      title
      slug
      category
      content
      description
      difficult
      image
      ingredients
      time
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId) {
      message
      success
    }
  }
`;

export const RATE_RECIPE = gql`
  mutation getRating($rateRecipe: NewRatingInput!) {
    rateRecipe(rateRecipe: $rateRecipe) {
      ratings {
        comment
        rating
        userId
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
