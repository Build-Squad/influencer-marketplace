import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./reducers/userSlice";
import { cartSlice } from "./reducers/cartSlice";
import { orderCancellationSlice } from "./reducers/orderCancellationSlice";
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
};

const cartPersistConfig = {
  key: "cart",
  storage: storage,
};

const orderCancellationPersistConfig = {
  key: "orderCancellation",
  storage: storage,
};

const persistedUserReducer = persistReducer(
  userPersistConfig,
  userSlice.reducer
);
const persistedCartReducer = persistReducer(
  cartPersistConfig,
  cartSlice.reducer
);

const persistedOrderCancellationReducer = persistReducer(
  orderCancellationPersistConfig,
  orderCancellationSlice.reducer
);

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      user: persistedUserReducer,
      cart: persistedCartReducer,
      orderCancellation: persistedOrderCancellationReducer,
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
