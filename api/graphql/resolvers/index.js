import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import recipeResolver from "./recipe.resolver.js";
import ratingResolver from "./rating.resolver.js";

const mergedResolvers = mergeResolvers([
  userResolver,
  recipeResolver,
  ratingResolver,
]);

export default mergedResolvers;
