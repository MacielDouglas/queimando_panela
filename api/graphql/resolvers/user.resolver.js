import User from "../../models/user.models.js";
import bcrypt from "bcryptjs";
import {
  createToken,
  setTokenCookie,
  sanitizeUser,
  validateUserCredentials,
  verifyAuthorization,
  existing,
} from "../../utils/utils.js";

const userResolver = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const user = await existing(id, "usuario");
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
            "Este email está em uso. Por favor, use outro email."
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
          "https://firebasestorage.googleapis.com/v0/b/queimando-panela.appspot.com/o/perfil%2F1722454447282user.webp?alt=media&token=3dd585aa-5ce9-4bb3-9d46-5ecf11d1e60c";

        const newUser = new User({
          ...user,
          password: hashedPassword,
          profilePicture: photo,
        });

        await newUser.save();
        return sanitizeUser(newUser);
      } catch (error) {
        throw new Error(`Erro ao criar novo usuário: ${error.message}`);
      }
    },

    deleteUser: async (_, { id }, { res, req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken)
          throw new Error("Você não tem permissão para excluir esse usuário.");

        const user = await existing(id, "usuario");
        await User.findByIdAndDelete(user.id);
        res.clearCookie("access_token");

        return {
          success: true,
          message: `Usuário: ${user.username}, foi excluído com sucesso.`,
        };
      } catch (error) {
        throw new Error(`Erro ao excluir usuário: ${error.message}`);
      }
    },

    updateUser: async (_, { id, updateUserInput }, { req }) => {
      try {
        // const user = await existingUser(id);
        const user = await existing(id, "usuario");

        const decodedToken = verifyAuthorization(req);
        if (!decodedToken || decodedToken.userId !== user.id) {
          throw new Error("Você não tem permissão para alterar esse usuário.");
        }

        const userUpdate = {};

        const { username, email, password, profilePicture, name } =
          updateUserInput;

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

        const updatedUser = await existing(id, "usuario");
        // const updatedUser = await existingUser(id);

        return {
          ...sanitizeUser(updatedUser),
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
