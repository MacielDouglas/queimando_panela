import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    name: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    mySavedRecipes: { type: [String] },
  },

  { timestamps: true }
);

const User = model("User", userSchema);

export default User;

// const savedRecipesSchema = new Schema({
//   recipeId: {
//     type: String,
//     required: true,
//   },
// });
