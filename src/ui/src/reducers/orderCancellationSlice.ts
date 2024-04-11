import { createSlice } from "@reduxjs/toolkit";

type OrderCancellationState = {
  cancellationInProgress: boolean;
};

const initialState: OrderCancellationState = {
  cancellationInProgress: false,
};

export const orderCancellationSlice = createSlice({
  name: "orderCancellation",
  initialState,
  reducers: {
    startCancellation: (state) => {
      state.cancellationInProgress = true;
    },
    endCancellation: (state) => {
      state.cancellationInProgress = false;
    },
  },
});

export const { startCancellation, endCancellation } =
  orderCancellationSlice.actions;
