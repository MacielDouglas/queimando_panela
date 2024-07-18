import { gql } from "@apollo/client";

export const NEW_USER = gql`
  mutation newUser($user: NewUserInput!) {
    createUser(user: $user) {
      id
      username
    }
  }
`;
