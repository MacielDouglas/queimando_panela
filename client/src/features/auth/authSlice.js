import { createSlice } from "@reduxjs/toolkit";

const TOKEN_EXPIRATION_TIME = 3600000; // 1 hora em milissegundos

const clearExpirationTimeout = (state) => {
  if (state.tokenExpirationTimeout) {
    clearTimeout(state.tokenExpirationTimeout);
    state.tokenExpirationTimeout = null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    tokenExpirationTimeout: null,
  },
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
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
