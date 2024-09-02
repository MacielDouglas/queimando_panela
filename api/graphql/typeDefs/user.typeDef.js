const userTypeDef = `#graphql

type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean!
    name: String!
    mySavedRecipes: [String]
}

type SavedRecipe {
    recipeId: ID!
}

type Query {
    getUser(id: ID!): User
    loginUser(email: String!, password: String!): LoginResponse!
    logoutUser: LogoutResponse!
}

type LoginResponse {
    token: String!
    id: ID!
    username: String!
    profilePicture: String!
    isAdmin: Boolean!
    name: String!
    mySavedRecipes: [String]
}

type LogoutResponse {
    success: Boolean!
    message: String!
}

type Mutation {
    createUser(user: NewUserInput!): User
    deleteUser(id: ID!): DeleteUserResponse
    updateUser(id: ID!, updateUserInput: UpdateUserInput!): UpdateUserResponse!
    loginGoogle(user: UserGoogle!): LoginResponse!
    myRecipesSave(savedRecipe: [NewSavedRecipeInput]!): MyRecipeResponse
}

input NewUserInput {
    username: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean
    name: String!
}



type DeleteUserResponse {
    success: Boolean!
    message: String!
}

type MyRecipeResponse {
    success: Boolean!
    message: String!
}

input UpdateUserInput {
    username: String
    email: String
    password: String
    profilePicture: String
    name: String
}

type UpdateUserResponse {
    success: Boolean!
    message: String
    username: String
    profilePicture: String
    isAdmin: Boolean
    name: String
}

input UserGoogle {
  displayName: String!
  email: String!
  profilePicture: String!
  name: String

}

input NewSavedRecipeInput {
    recipeId: String!
}
`;

export default userTypeDef;
