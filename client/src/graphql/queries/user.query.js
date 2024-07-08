import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
      name
      isAdmin
      username
      profilePicture
    }
  }
`;
