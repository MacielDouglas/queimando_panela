import { gql } from "@apollo/client";

export const NEW_USER = gql`
  mutation newUser($user: NewUserInput!) {
    createUser(user: $user) {
      id
      username
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($updateUserId: ID!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $updateUserId, updateUserInput: $updateUserInput) {
      message
      success
    }
  }
`;

export const LOGIN_GOOGLE = gql`
  mutation userGoogle($user: UserGoogle!) {
    loginGoogle(user: $user) {
      isAdmin
      profilePicture
      username
      name
      id
      mySavedRecipes
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation saveRecipe($savedRecipe: [NewSavedRecipeInput]!) {
    myRecipesSave(savedRecipe: $savedRecipe) {
      success
      message
    }
  }
`;
