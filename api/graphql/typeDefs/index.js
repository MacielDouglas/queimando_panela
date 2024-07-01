import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import recipeTypeDef from "./recipe.typeDef.js";
import ratingTypeDef from "./rating.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([
  userTypeDef,
  recipeTypeDef,
  ratingTypeDef,
]);

export default mergedTypeDefs;
