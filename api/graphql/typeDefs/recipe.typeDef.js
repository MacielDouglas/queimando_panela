const recipeTypeDef = `#graphql

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
}

type Query {
    getRecipes(slug: String, input: RecipeFilters): [Recipe]!
}

type Mutation {
    createRecipe(newRecipe: NewRecipeInput!): Recipe
    deleteRecipe(recipeId: ID!): DeleteRecipeResponse
    updateRecipe(id: ID!, updateRecipe: UpdateRecipeInput!): UpdateRecipeResponse
}

input NewRecipeInput{
    userId: String
    title: String!
    content: String!
    image: String!
    category: String!
    writer: String
    ingredients: [String!]
}

input RecipeFilters {
    title: String
    category: String
}

type DeleteRecipeResponse {
    success: Boolean!
    message: String!
}

input UpdateRecipeInput {
    title: String
    content: String
    image: String
    category: String
    ingredients: [String]
    slug: String
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

}
`;

export default recipeTypeDef;
