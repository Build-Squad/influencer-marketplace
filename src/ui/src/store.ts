import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./reducers/userSlice";
import { cartSlice } from "./reducers/cartSlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "./storage";

const userPersistConfig = {
  key: "user",
  storage: storage,
  whitelist: ["user"],
  blacklist: ["navigation"],
  timeout: 1000,
};

const cartPersistConfig = {
  key: "cart",
  storage: storage,
  whitelist: ["cart"],
  blacklist: ["navigation"],
  timeout: 1000,
};

const persistedUserReducer = persistReducer(
  userPersistConfig,
  userSlice.reducer
);
const persistedCartReducer = persistReducer(
  cartPersistConfig,
  cartSlice.reducer
);

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      user: persistedUserReducer,
      cart: persistedCartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
