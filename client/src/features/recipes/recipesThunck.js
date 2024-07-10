import {
  fetchRecipesStart,
  fetchRecipesSuccess,
  fetchRecipesFailure,
} from "./recipesSlice";
import { ALL_RECIPES } from "./../../graphql/queries/recipe.query";
import { client } from "../../main";

export const fetchRecipes = () => async (dispatch) => {
  dispatch(fetchRecipesStart());
  try {
    const { data } = await client.query({ query: ALL_RECIPES });
    dispatch(fetchRecipesSuccess(data.getRecipes));
  } catch (error) {
    dispatch(fetchRecipesFailure(error.message));
  }
};
