import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import recipeTypeDef from "./recipe.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDef, recipeTypeDef]);

export default mergedTypeDefs;
