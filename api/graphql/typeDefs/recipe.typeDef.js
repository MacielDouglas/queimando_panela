const recipeTypeDef = `#graphql

scalar JSON

type Recipe {
    id: ID!
    userId: ID!
    title: String!
    content: String!
    image: String!
    category: String!
    slug: String!
    createdAt: String
    writer: String!
    ingredients: [String!]
    difficult: String!
    description: String!
    time: String!
    ratings: [Rating]
}

type Rating {
    userId: ID!
    rating: Float!
    comment: String
}

type Query {
    getRecipes(input: RecipeFilters): [Recipe]!
}

type Mutation {
    createRecipe(newRecipe: NewRecipeInput!): Recipe
    deleteRecipe(recipeId: ID!): DeleteRecipeResponse
    updateRecipe(id: ID!, updateRecipe: UpdateRecipeInput!): UpdateRecipeResponse
    rateRecipe(newRating: NewRatingInput!): Recipe
    deleteRate(recipeId: ID!, userId: ID!): DeleteRecipeResponse
}

input NewRecipeInput {
    userId: String
    title: String!
    content: String!
    image: String!
    category: String!
    writer: String
    ingredients: [String!]
    difficult: String!
    description: String!
    time: String!
}

input RecipeFilters {
    slug: String
    title: String
    category: String
    ingredients: String
}

type DeleteRecipeResponse {
    success: Boolean!
    message: String!
}

input UpdateRecipeInput {
    title: String
    content: String
    image: String
    category: String!
    ingredients: [String]
    slug: String
    difficult: String
    description: String
    time: String
}

type UpdateRecipeResponse {
    success: Boolean!
    message: String!
    title: String
    content: String
    image: String
    category: String
    ingredients: [String]
    slug: String
    difficult: String
    description: String
    time: String
}

input NewRatingInput {
    recipeId: String!
    userId: String
    score: Float!
    comment: String!
}
`;

export default recipeTypeDef;
