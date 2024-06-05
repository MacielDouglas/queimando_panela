import User from "../../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const existingUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Usuário não encontrado.");

  return user;
};

const setTokenCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });
};

const sanitizeUser = (user) => {
  const { _id, isAdmin, username, profilePicture, name } = user;
  return { id: _id, isAdmin, username, profilePicture, name };
};

const validateUserCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Credenciais inválidas.");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error("Credenciais inválidas.");

  return user;
};

const verifyAuthorization = (req) => {
  const authorizationHeader = req.headers.cookie;
  if (!authorizationHeader) {
    throw new Error("Token de autorização não fornecido.");
  }

  const token = authorizationHeader.split("access_token=")[1];

  if (!token) {
    throw new Error("Token de autorização inválido.");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken;
};

const userResolver = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const user = await existingUser(id);
        return sanitizeUser(user);
      } catch (error) {
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }
    },

    loginUser: async (_, { email, password }, { res }) => {
      try {
        const user = await validateUserCredentials(email, password);

        const token = createToken(user);
        setTokenCookie(res, token);

        return sanitizeUser(user);
      } catch (error) {
        console.error(`Erro ao fazer login: ${error.message}`);
        throw new Error(`Erro ao fazer login: ${error.message}`);
      }
    },

    logoutUser: (_, __, { res }) => {
      try {
        res.clearCookie("access_token");
        return {
          success: true,
          message: "O usuário foi desconectado com sucesso!!!",
        };
      } catch (error) {
        throw new Error(`Erro ao desconectar o usuário: ${error.message}`);
      }
    },
  },

  Mutation: {
    createUser: async (_, { user }) => {
      try {
        const existingEmail = await User.findOne({ email: user.email });
        if (existingEmail)
          throw new Error(
            `Este email está em uso. Por favor, use outro email.`
          );

        const existingUsername = await User.findOne({
          username: user.username,
        });

        if (existingUsername)
          throw new Error(
            "Este username está em uso, por favor escolha outro nome de usuário."
          );

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const photo =
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

        const newUser = new User({
          ...user,
          password: hashedPassword,
          profilePicture: photo,
        });

        await newUser.save();
        return newUser;
      } catch (error) {
        throw new Error(`Erro ao criar novo usuário: ${error.message}`);
      }
    },

    deleteUser: async (_, { id }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken)
          throw new Error("Você não tem permissão para excluir esse usuário.");

        const user = await existingUser(id);

        await User.findByIdAndDelete(user.id);

        return {
          success: true,
          message: `Usuário: ${existingUser.username}, foi excluído com sucesso.`,
        };
      } catch (error) {
        throw new Error(`Erro ao excluir usuário: ${error.message}`);
      }
    },

    updateUser: async (_, { id, updateUser }, { req }) => {
      try {
        const user = await existingUser(id);

        const decodedToken = verifyAuthorization(req);
        if (!decodedToken || decodedToken.userId !== user.id) {
          throw new Error("Você não tem permissão para alterar esse usuário.");
        }

        const userUpdate = {};
        const { username, email, password, profilePicture, name } = updateUser;

        if (password && password.trim()) {
          userUpdate.password = await bcrypt.hash(password, 10);
        }

        if (username && username.trim()) {
          userUpdate.username = username;
        }

        if (email && email.trim()) {
          userUpdate.email = email;
        }

        if (profilePicture && profilePicture.trim()) {
          userUpdate.profilePicture = profilePicture;
        }

        if (name && name.trim()) {
          userUpdate.name = name;
        }

        await User.findByIdAndUpdate(id, userUpdate);

        const updatedUser = await existingUser(id);

        return {
          username: updatedUser.username,
          isAdmin: updatedUser.isAdmin,
          profilePicture: updatedUser.profilePicture,
          name: updatedUser.name,
          success: true,
          message: "Usuário atualizado com sucesso.",
        };
      } catch (error) {
        console.error(`Erro ao atualizar usuário: ${error.message}`);
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
      }
    },
  },
};

export default userResolver;
