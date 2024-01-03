// A cart slice that will keep track of the current influencer for the order and the order's information

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OrderItem = {
  service: ServiceType;
  quantity: number;
};

type CartState = {
  influencer: UserType | null;
  orderItems: OrderItem[];
  orderTotal: number;
  orderTotalCurrency: CurrencyType;
};

type AddOrderItemPayloadType = {
  influencer: UserType | null;
  service: ServiceType;
};

type RemoveOrderItemPayloadType = {
  service: ServiceType;
};

const initialState: CartState = {
  influencer: null,
  orderItems: [],
  orderTotal: 0,
  orderTotalCurrency: {
    id: "",
    name: "",
    symbol: "",
    country: null,
  },
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addOrderItem: (state, action: PayloadAction<AddOrderItemPayloadType>) => {
      const orderItemExists = state.orderItems.some(
        (item) => item.service.id === action.payload.service.id
      );

      if (!orderItemExists) {
        // Check if the currency matches the orderTotalCurrency
        if (
          state.orderTotal > 0 &&
          state.orderTotalCurrency.id !== action.payload.service.currency.id
        ) {
          return;
        }
        state.orderItems.push({
          service: action.payload.service,
          quantity: 1,
        });

        // Set influencer, orderTotal, and orderTotalCurrency here
        state.influencer = action.payload.influencer;
        state.orderTotal = state.orderItems.reduce((total, item) => {
          return (
            total + Number(item.service.platform_price) * Number(item.quantity)
          );
        }, 0);
        state.orderTotalCurrency = action.payload.service.currency;
      } else {
        const index = state.orderItems.findIndex(
          (item) => item.service.id === action.payload.service.id
        );

        state.orderItems[index].quantity += 1;

        // Update orderTotal here
        state.orderTotal = state.orderItems.reduce((total, item) => {
          return (
            total + Number(item.service.platform_price) * Number(item.quantity)
          );
        }, 0);
      }
    },

    removeOrderItem: (
      state,
      action: PayloadAction<RemoveOrderItemPayloadType>
    ) => {
      const index = state.orderItems.findIndex(
        (item) => item.service.id === action.payload?.service.id
      );

      // Check if the item exists before trying to remove it
      if (index === -1) {
        return;
      }

      // Update the quantity of the order item
      state.orderItems[index].quantity -= 1;

      // If the quantity is 0, remove the order item from the orderItems array
      if (state.orderItems[index].quantity === 0) {
        state.orderItems.splice(index, 1);
      }

      // If there are no more order items, reset influencer, orderTotal, and orderTotalCurrency here
      if (state.orderItems.length === 0) {
        state.influencer = null;
        state.orderTotal = 0;
        state.orderTotalCurrency = {
          id: "",
          name: "",
          symbol: "",
          country: null,
        };
        return;
      }

      // Calculate the new orderTotal here
      state.orderTotal = state.orderItems.reduce((total, item) => {
        return (
          total + Number(item.service.platform_price) * Number(item.quantity)
        );
      }, 0);
    },

    resetCart: (state) => {
      state.influencer = null;
      state.orderItems = [];
      state.orderTotal = 0;
      state.orderTotalCurrency = {
        id: "",
        name: "",
        symbol: "",
        country: null,
      };
    },
  },
});

export const { addOrderItem, removeOrderItem, resetCart } = cartSlice.actions;
