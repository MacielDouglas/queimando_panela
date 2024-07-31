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
