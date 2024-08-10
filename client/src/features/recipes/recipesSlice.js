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
  addRating,
  deleteRatingSuccess,
  deleteRatingFailure,
  editRating,
} = recipesSlice.actions;
export default recipesSlice.reducer;
