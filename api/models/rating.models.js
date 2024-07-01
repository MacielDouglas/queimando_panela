import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ratingSchema = new Schema(
  {
    recipeId: {
      type: String,
      required: true,
      unique: true,
    },
    rating: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Rating = model("Rating", ratingSchema);

export default Rating;
