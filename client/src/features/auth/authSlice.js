import { createSlice } from "@reduxjs/toolkit";

const TOKEN_EXPIRATION_TIME = 3600000; // 1 hora em milissegundos

const clearExpirationTimeout = (state) => {
  if (state.tokenExpirationTimeout) {
    clearTimeout(state.tokenExpirationTimeout);
    state.tokenExpirationTimeout = null;
  }
};

const initialState = {
  user: null,
  tokenExpirationTimeout: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      clearExpirationTimeout(state);
      state.tokenExpirationTimeout = setTimeout(() => {
        state.user = null;
        state.tokenExpirationTimeout = null;
      }, TOKEN_EXPIRATION_TIME);
    },
    clearUser: (state) => {
      state.user = null;
      clearExpirationTimeout(state);
    },
    resetAuth: () => initialState,
  },
});

export const { setUser, clearUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
