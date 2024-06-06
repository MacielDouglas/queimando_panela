import mongoose from "mongoose";

const { Schema, model } = mongoose;

const recipeSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    writer: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

export default Recipe;
