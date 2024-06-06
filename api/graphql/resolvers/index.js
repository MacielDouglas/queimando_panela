import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import recipeResolver from "./recipe.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, recipeResolver]);

export default mergedResolvers;
