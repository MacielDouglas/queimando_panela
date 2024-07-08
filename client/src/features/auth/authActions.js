import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOGIN_USER } from "../../graphql/queries/user.query";
import { client } from "../../main";
import { setUser } from "./authSlice";
import useToast from "../../hooks/useToast";

/**
 * Async thunk action for logging in a user.
 *
 * @param {Object} credentials - The user's login credentials.
 * @param {Object} thunkAPI - The thunk API object provided by Redux Toolkit.
 * @returns {Object} - The logged in user data or an error message.
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    const { showSuccess, showError } = useToast();
    try {
      const { data } = await client.query({
        query: LOGIN_USER,
        variables: credentials,
        fetchPolicy: "no-cache",
      });

      const userData = data.loginUser;

      // Dispatch login success action
      thunkAPI.dispatch(setUser(userData));
      showSuccess(`Seja bem vindo, ${userData.name}!`);

      console.log("DATA_authActions:", data);
      return userData;
    } catch (error) {
      // Log and return a more descriptive error message
      showError(`Erro ao fazer login, ${error.message}`);

      console.error("Login failed:", error.message);
      return thunkAPI.rejectWithValue("Failed to login. Please try again.");
    }
  }
);
