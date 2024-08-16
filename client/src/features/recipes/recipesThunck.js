import {
  fetchRecipesStart,
  fetchRecipesSuccess,
  fetchRecipesFailure,
  addRecipe,
  recipeUpdate,
  deleteRecipe,
} from "./recipesSlice";
import { ALL_RECIPES } from "../../graphql/queries/recipe.query";
import { client } from "../../apollo/client";
import {
  DELETE_RECIPE,
  NEW_RECIPE,
  UPDATE_RECIPE,
} from "../../graphql/mutation/recipe.mutation";

export const fetchRecipes = () => async (dispatch) => {
  dispatch(fetchRecipesStart());
  try {
    const { data } = await client.query({
      query: ALL_RECIPES,
      variables: { input: {} }, // Passa um objeto vazio como input
    });

    dispatch(fetchRecipesSuccess(data.getRecipes));
  } catch (error) {
    dispatch(fetchRecipesFailure(error.message));
  }
};

export const createRecipe = (newRecipe) => async (dispatch) => {
  try {
    const { data } = await client.mutate({
      mutation: NEW_RECIPE,
      variables: { newRecipe },
    });
    dispatch(addRecipe(data.createRecipe));
    return data.createRecipe.slug;
  } catch (error) {
    dispatch(fetchRecipesFailure(error.message));
  }
};

export const editRecipe =
  (updateRecipeId, updateRecipe) => async (dispatch) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_RECIPE,
        variables: { updateRecipeId, updateRecipe },
      });

      dispatch(
        recipeUpdate({ updateRecipeId, updatedRecipe: data.updateRecipe })
      );

      return data;
    } catch (error) {
      dispatch(fetchRecipesFailure(error.message));
    }
  };

export const removeRecipe = (id) => async (dispatch) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_RECIPE,
      variables: { recipeId: id },
    });

    console.log(data);

    dispatch(deleteRecipe(id));
  } catch (error) {
    dispatch(fetchRecipesFailure(error.message));
  }
};
