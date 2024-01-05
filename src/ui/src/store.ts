import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./reducers/userSlice";
import { cartSlice } from "./reducers/cartSlice";
import { persistReducer } from "redux-persist";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage: storage,
};

const persistedUserReducer = persistReducer(persistConfig, userSlice.reducer);
const persistedCartReducer = persistReducer(persistConfig, cartSlice.reducer);

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      user: persistedUserReducer,
      cart: persistedCartReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
