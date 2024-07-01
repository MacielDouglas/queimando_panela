const ratingTypeDef = `#graphql

scalar JSON

type Rating {
    id: ID!
    recipeId: ID!
    userId: ID!
    rating: JSON
}

type Query {
    getRating(recipeId: ID!): Rating!
}

type Mutation {
    createRating(newRating: NewRatingInput!): Rating!
    deleteRating(recipeId: ID!): DeleteRatingResponse
}

type DeleteRatingResponse {
    success: Boolean!
    message:String!
}

input NewRatingInput {
    recipeId: String!
    userId: String
    rating: JSON
}
`;

export default ratingTypeDef;
