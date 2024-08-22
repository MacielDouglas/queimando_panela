import { gql } from "@apollo/client";

export const ALL_RECIPES = gql`
  query recipeOne($input: RecipeFilters) {
    getRecipes(input: $input) {
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
        userId
      }
      cobertura {
        content
        ingredients
      }
      calda {
        content
        ingredients
      }
      massa {
        content
        ingredients
      }
      recheio {
        content
        ingredients
      }
      createdAt
    }
  }
`;
