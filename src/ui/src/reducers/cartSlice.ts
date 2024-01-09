// A cart slice that will keep track of the current influencer for the order and the order's information

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OrderItem = {
  service: ServiceType;
  index: number;
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
  ind?: number;
};

type UpdateOrderItemPayloadType = {
  index: number;
  value: string;
  service_master_meta_data_id: string;
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
      const serviceWithUpdatedMetaData = {
        ...action.payload.service,
        service_master: {
          ...action.payload.service.service_master,
          service_master_meta_data:
            action.payload.service.service_master.service_master_meta_data.map(
              (item) => ({ ...item, value: null })
            ),
        },
      };
      state.orderItems.push({
        service: serviceWithUpdatedMetaData,
        index: state.orderItems.length,
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
      if (action.payload.ind !== undefined) {
        // If there is an index, remove the item at that index
        // Check that it is a valid index
        if (
          action.payload.ind < 0 ||
          action.payload.ind >= state.orderItems.length
        ) {
          return;
        }
        state.orderItems.splice(action.payload.ind, 1);
      } else {
        const index = state.orderItems.findIndex(
          (item) => item.service.id === action.payload?.service.id
        );

        // Check if the item exists before trying to remove it
        if (index === -1) {
          return;
        }

        // Always remove the item from the orderItems array
        state.orderItems.splice(index, 1);
      }
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

    // Update the value of the order item of the index
    updateFieldValues: (
      state,
      action: PayloadAction<UpdateOrderItemPayloadType>
    ) => {
      const orderItem = state.orderItems[action.payload.index];
      const serviceMasterMetaDataIndex =
        orderItem.service.service_master.service_master_meta_data.findIndex(
          (item) => item.id === action.payload.service_master_meta_data_id
        );
      if (serviceMasterMetaDataIndex !== -1) {
        const updatedServiceMasterMetaData = {
          ...orderItem.service.service_master.service_master_meta_data[
            serviceMasterMetaDataIndex
          ],
          value: action.payload.value,
        };
        orderItem.service.service_master.service_master_meta_data.splice(
          serviceMasterMetaDataIndex,
          1,
          updatedServiceMasterMetaData
        );
      }
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

export const { addOrderItem, removeOrderItem, resetCart, updateFieldValues } =
  cartSlice.actions;
