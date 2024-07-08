import { gql } from "@apollo/client";

export const ALL_RECIPES = gql`
  query recipes {
    getRecipes {
      category
      content
      description
      difficult
      id
      image
      ingredients
      slug
      title
      time
      userId
      writer
      ratings {
        rating
        comment
      }
      createdAt
    }
  }
`;
