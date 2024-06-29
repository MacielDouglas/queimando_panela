import Recipe from "../../models/recipe.models.js";
import { existing, verifyAuthorization } from "../../utils/utils.js";
import slugify from "slugify";

const buildQuery = (input) => {
  const query = {};
  if (input) {
    const { category, title, writer } = input;
    if (category) {
      query.category = category;
    }
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (writer) {
      query.writer = { $regex: writer, $options: "i" };
    }
  }
  return query;
};

const generateSlug = (title) => {
  return (
    Math.random().toString(9).slice(-4) + "-" + slugify(title, { lower: true })
  );
};

const recipeResolver = {
  Query: {
    getRecipes: async (_, { slug, input }) => {
      try {
        if (slug) {
          const recipe = await Recipe.findOne({ slug }).exec();
          if (!recipe) {
            throw new Error("Receita não encontrada");
          }
          return [recipe]; // Retorna um array com a receita encontrada
        } else {
          const query = buildQuery(input);
          const recipes = await Recipe.find(query).exec();
          return recipes;
        }
      } catch (error) {
        throw new Error(`Erro ao buscar as receitas: ${error.message}`);
      }
    },
  },

  Mutation: {
    createRecipe: async (_, { newRecipe }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken)
          throw new Error(
            "Você não tem permissão para criar uma receita, faça login corretamente."
          );

        const existingRecipe = await Recipe.findOne({ title: newRecipe.title });
        if (
          existingRecipe &&
          existingRecipe.content.length === newRecipe.content.length
        ) {
          throw new Error("Desculpe, mas já existe uma receita igual a essa");
        }

        const recipe = new Recipe({
          ...newRecipe,
          userId: decodedToken.userId,
          writer: decodedToken.username,
          slug: generateSlug(newRecipe.title),
        });

        await recipe.save();
        return recipe;
      } catch (error) {
        throw new Error(`Erro ao criar uma nova receita: ${error.message}`);
      }
    },

    deleteRecipe: async (_, { recipeId }, { req }) => {
      const decodedToken = verifyAuthorization(req);
      if (!decodedToken)
        throw new Error("Você não tem permissão para excluir essa postagem.");

      const recipe = await existing(recipeId, "receita");
      if (recipe.userId !== decodedToken.userId) {
        throw new Error("Você não tem autorização para deletar essa receita.");
      }

      await Recipe.findByIdAndDelete(recipeId);

      return {
        success: true,
        message: `A receita: ${recipe.title}, foi removida com sucesso.`,
      };
    },

    updateRecipe: async (_, { id, updateRecipe }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken)
          throw new Error("Você não tem permissão para excluir essa postagem.");

        const recipe = await Recipe.findById(id);
        if (recipe.userId !== decodedToken.userId) {
          throw new Error(
            "Você não tem autorização para deletar essa receita."
          );
        }
        const updatableFields = [
          "title",
          "content",
          "image",
          "category",
          "ingredients",
          "difficult",
          "description",
          "type",
          "time",
        ];

        updatableFields.forEach((field) => {
          if (updateRecipe[field] !== undefined && updateRecipe[field] !== "") {
            if (field === "ingredients") {
              if (
                (Array.isArray(updateRecipe.ingredients) &&
                  updateRecipe.ingredients.length > 1) ||
                (updateRecipe.ingredients.length === 1 &&
                  updateRecipe.ingredients[0] !== "")
              ) {
                recipe[field] = updateRecipe[field];
              }
            } else {
              if (field === "title") {
                recipe["slug"] = generateSlug(updateRecipe.title);
              }
              recipe[field] = updateRecipe[field];
            }
          }
        });

        await recipe.save();

        return {
          success: true,
          message: `A receita ${recipe.title}, foi alterada com sucesso`,
          title: recipe.title,
          content: recipe.content,
          category: recipe.category,
          slug: recipe.slug,
          ingredients: recipe.ingredients,
          image: recipe.image,
          difficult: recipe.difficult,
          description: recipe.description,
          time: recipe.time,
        };
      } catch (error) {
        throw new Error(`Erro ao atualizar a receita: ${error.message}`);
      }
    },
  },
};

export default recipeResolver;
