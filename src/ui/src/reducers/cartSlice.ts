// A cart slice that will keep track of the current influencer for the order and the order's information

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OrderItem = {
  service: ServiceType;
};

type ServiceAdded = {
  service: ServiceType;
  quantity: number;
};

type CartState = {
  influencer: UserType | null;
  orderItems: OrderItem[];
  servicesAdded: ServiceAdded[];
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
  servicesAdded: [],
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
      // Check if the currency matches the orderTotalCurrency
      if (
        state.orderTotal > 0 &&
        state.orderTotalCurrency.id !== action.payload.service.currency.id
      ) {
        return;
      }

      // Find the service in the servicesAdded array
      const serviceAdded = state.servicesAdded.find(
        (item) => item.service.id === action.payload.service.id
      );

      if (serviceAdded) {
        // If the service exists, increment its quantity
        serviceAdded.quantity += 1;
      } else {
        // If the service doesn't exist, push a new item to the servicesAdded array with quantity 1
        state.servicesAdded.push({
          service: action.payload.service,
          quantity: 1,
        });
      }

      // Always push a new item to the orderItems array
      state.orderItems.push({
        service: action.payload.service,
      });

      // Set influencer, orderTotal, and orderTotalCurrency here
      state.influencer = action.payload.influencer;
      state.orderTotal = state.orderItems.reduce((total, item) => {
        return total + Number(item.service.platform_price);
      }, 0);
      state.orderTotalCurrency = action.payload.service.currency;
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

      // Always remove the item from the orderItems array
      state.orderItems.splice(index, 1);

      // Find the service in the servicesAdded array
      const serviceAdded = state.servicesAdded.find(
        (item) => item.service.id === action.payload.service.id
      );

      if (serviceAdded && serviceAdded.quantity > 1) {
        // If the service exists and its quantity is more than 1, decrement its quantity
        serviceAdded.quantity -= 1;
      } else if (serviceAdded && serviceAdded.quantity === 1) {
        // If the service exists and its quantity is 1, remove the service from the servicesAdded array
        state.servicesAdded = state.servicesAdded.filter(
          (item) => item.service.id !== action.payload.service.id
        );
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
        return total + Number(item.service.platform_price);
      }, 0);
    },

    resetCart: (state) => {
      state.influencer = null;
      state.orderItems = [];
      state.servicesAdded = [];
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
