import { createSlice } from "@reduxjs/toolkit";

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    recipes: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchRecipesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecipesSuccess: (state, action) => {
      state.loading = false;
      state.recipes = action.payload;
    },
    fetchRecipesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addRecipe: (state, action) => {
      state.recipes.push(action.payload);
    },
    recipeUpdate: (state, action) => {
      const { updateRecipeId, updatedRecipe } = action.payload;

      if (!state.recipes) {
        console.error("State.recipes está undefined.");
        return;
      }

      const index = state.recipes.findIndex(
        (recipe) => recipe.id === updateRecipeId
      );

      if (index === -1) {
        console.error("Receita não encontrada para atualização.");
        return;
      }

      state.recipes[index] = {
        ...state.recipes[index], // Manter outros atributos inalterados
        ...updatedRecipe, // Substituir os campos fornecidos
      };
    },

    deleteRecipe: (state, action) => {
      const id = action.payload;
      state.recipes = state.recipes.filter((recipe) => recipe.id !== id);
    },
    addRating: (state, action) => {
      const { recipeId, newRating } = action.payload;
      const recipe = state.recipes.find((recipe) => recipe.id === recipeId);
      if (recipe) {
        recipe.ratings.push(newRating);
      }
    },
    deleteRatingSuccess: (state, action) => {
      const { recipeId, userId } = action.payload;
      const recipe = state.recipes.find((recipe) => recipe.id === recipeId);
      if (recipe) {
        recipe.ratings = recipe.ratings.filter(
          (rating) => rating.userId !== userId
        );
      }
    },
    deleteRatingFailure: (state, action) => {
      state.error = action.payload;
    },

    editRating: (state, action) => {
      const { recipeId, userId, updatedRating } = action.payload;
      const recipe = state.recipes.find((recipe) => recipe.id === recipeId);
      if (recipe) {
        const ratingIndex = recipe.ratings.findIndex(
          (rating) => rating.userId === userId
        );
        if (ratingIndex !== -1) {
          recipe.ratings[ratingIndex] = updatedRating;
        }
      }
    },
  },
});

export const {
  fetchRecipesStart,
  fetchRecipesSuccess,
  fetchRecipesFailure,
  addRecipe,
  recipeUpdate,
  deleteRecipe,
  addRating,
  deleteRatingSuccess,
  deleteRatingFailure,
  editRating,
} = recipesSlice.actions;
export default recipesSlice.reducer;
