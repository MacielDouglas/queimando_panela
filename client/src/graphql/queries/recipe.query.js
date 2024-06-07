import { gql } from "@apollo/client";

export const ALL_RECIPES = gql`
  query allRecipes {
    getRecipes {
      id
      title
      content
      category
      slug
      image
      ingredients
      writer
      createdAt
    }
  }
`;
