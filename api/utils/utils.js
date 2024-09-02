import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import Recipe from "../models/recipe.models.js";

export const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
      username: user.username,
      mySavedRecipes: user.mySavedRecipes,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const existing = async (id, type) => {
  const models = {
    usuario: User,
    receita: Recipe,
  };

  const Model = models[type];

  if (!Model) {
    throw new Error("Tipo inválido!");
  }

  const document = await Model.findById(id);

  if (!document) {
    throw new Error(
      `${type.charAt(0).toUpperCase() + type.slice(1)} não encontrado.`
    );
  }
  return document;
};

export const setTokenCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });
};

export const sanitizeUser = (user) => {
  const { _id, isAdmin, username, profilePicture, name, mySavedRecipes } = user;
  return {
    id: _id,
    isAdmin,
    username,
    profilePicture,
    name,
    mySavedRecipes,
  };
};

export const validateUserCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Credenciais inválidas.");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error("Credenciais inválidas.");

  return user;
};

export const verifyAuthorization = (req) => {
  const authorizationHeader = req.headers.cookie;
  if (!authorizationHeader)
    throw new Error("Token de autorização não fornecido.");

  const token = authorizationHeader.split("access_token=")[1];
  if (!token) throw new Error("Token de autorização inválido.");

  return jwt.verify(token, process.env.JWT_SECRET);
};
