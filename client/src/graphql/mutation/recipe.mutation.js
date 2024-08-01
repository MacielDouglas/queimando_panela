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
