import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ratingSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

const optionalSectionSchema = new Schema({
  ingredients: {
    type: [String],
  },
  content: {
    type: String,
  },
});

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
    writer: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    difficult: {
      type: String,
      enum: ["super fácil", "fácil", "médio", "difícil", "chef"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "acompanhamentos",
        "aves",
        "bolos",
        "carnes",
        "churrasco",
        "drinks",
        "fondues, musses e suflês",
        "massas",
        "pães",
        "peixes",
        "saladas",
        "sanduíches e salgados",
        "sobremesas e doces",
        "sopas",
        "sorvetes",
        "típicos",
        "tortas",
        "outros",
      ],
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    ratings: [ratingSchema],
    calda: {
      type: optionalSectionSchema,
    },
    recheio: {
      type: optionalSectionSchema,
    },
    cobertura: {
      type: optionalSectionSchema,
    },
    massa: {
      type: optionalSectionSchema,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

export default Recipe;

// import mongoose from "mongoose";

// const { Schema, model } = mongoose;

// const ratingSchema = new Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//   },
//   comment: {
//     type: String,
//   },
// });

// const recipeSchema = new Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     image: {
//       type: String,
//     },
//     ingredients: {
//       type: [String],
//       required: true,
//     },
//     writer: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//     },
//     difficult: {
//       type: String,
//       enum: ["super fácil", "fácil", "médio", "difícil", "chef"],
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     category: {
//       type: String,
//       enum: [
//         "acompanhamentos",
//         "aves",
//         "bolos",
//         "carnes",
//         "churrasco",
//         "drinks",
//         "fondues, musses e suflês",
//         "massas",
//         "pães",
//         "peixes",
//         "saladas",
//         "sanduíches e salgados",
//         "sobremesas e doces",
//         "sopas",
//         "sorvetes",
//         "típicos",
//         "tortas",
//         "outros",
//       ],
//       required: true,
//     },
//     time: {
//       type: String,
//       required: true,
//     },
//     ratings: [ratingSchema],
//   },
//   {
//     timestamps: true,
//   }
// );

// const Recipe = model("Recipe", recipeSchema);

// export default Recipe;
