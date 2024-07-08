import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Storage padrão do Redux Persist
import storage from "redux-persist/lib/storage";

// Reducers importados
import authReducer from "../features/auth/authSlice";

// Configuração do Redux Persist
const persistConfig = {
  key: "root",
  storage,
};

// Combinação dos reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Persistência do reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuração da store com middleware para ações ignoradas
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Exportação do persistor e da store
export const persistor = persistStore(store);
export default store;
