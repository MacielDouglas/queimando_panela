const userTypeDef = `#graphql

type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean!
    name: String!
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
}

type LogoutResponse {
    success: Boolean!
    message: String!
}

type Mutation {
    createUser(user: NewUserInput!): User
}

input NewUserInput {
    username: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean
    name: String!
}
`;

export default userTypeDef;
