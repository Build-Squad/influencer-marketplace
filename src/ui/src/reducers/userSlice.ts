// A slice that will keep track of the login status of the user and the user's information

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type UserState = {
  loggedIn: boolean;
  user: UserType | null;
};

const initialState: UserState = {
  loggedIn: false,
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginReducer: (state, action: PayloadAction<UserType>) => {
      state.loggedIn = true;
      state.user = action.payload;
    },
    logoutReducer: (state) => {
      state.loggedIn = false;
      state.user = null;
    },
  },
});

export const { loginReducer, logoutReducer } = userSlice.actions;
