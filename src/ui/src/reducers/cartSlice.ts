// A cart slice that will keep track of the current influencer for the order and the order's information

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OrderItem = {
  order_item: OrderItemType;
  index: number;
  service_id?: string;
};

type ServiceAdded = {
  service?: ServiceType;
  item: ServiceType | OrderItemType;
  quantity: number;
  platform_price: string;
};

type CartState = {
  orderId?: string | null;
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
  packageId: string;
  index: number;
};

type UpdateOrderItemPayloadType = {
  index: number;
  value: string;
  service_master_meta_data_id?: string;
  order_item_meta_data_id?: string;
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
        (item) => item.item?.package?.id === action.payload.service.package.id
      );

      if (serviceAdded) {
        // If the service exists, increment its quantity
        serviceAdded.quantity += 1;
        serviceAdded.platform_price = (
          parseFloat(serviceAdded.platform_price) +
          parseFloat(action.payload.service?.price?.toString()) +
          parseFloat(action.payload.service?.price?.toString()) *
            (parseFloat(action.payload.service?.platform_fees?.toString()) /
              100)
        )?.toString();
      } else {
        // If the service doesn't exist, push a new item to the servicesAdded array with quantity 1
        state.servicesAdded.push({
          service: action.payload.service,
          item: action.payload.service,
          quantity: 1,
          platform_price: (
            parseFloat(action.payload.service?.price?.toString()) +
            parseFloat(action.payload.service?.price?.toString()) *
              (parseFloat(action.payload.service?.platform_fees?.toString()) /
                100)
          )?.toString(),
        });
      }

      // Always push a new item to the orderItems array
      state.orderItems.push({
        order_item: {
          ...action.payload.service,
          id: undefined,
          platform_fee: action.payload.service.platform_fees,
          price: action.payload.service.platform_price,
          order_item_meta_data:
            action.payload.service.service_master.service_master_meta_data.map(
              (item) => {
                return {
                  service_master_meta_data_id: item.id,
                  value: null,
                  label: item.label,
                  span: item.span,
                  field_type: item.field_type,
                  min: item.min,
                  max: item.max,
                  placeholder: item.placeholder,
                  order: item.order,
                };
              }
            ),
        },
        service_id: action.payload.service.id,
        index: state.orderItems.length,
      });

      // Set influencer, orderTotal, and orderTotalCurrency here
      state.influencer = action.payload.influencer;
      state.orderTotal = state.orderItems.reduce((total, item) => {
        return total + Number(item.order_item.platform_price);
      }, 0);
      state.orderTotalCurrency = action.payload.service.currency;
    },

    removeOrderItem: (
      state,
      action: PayloadAction<RemoveOrderItemPayloadType>
    ) => {
      if (action.payload.index !== undefined) {
        // If there is an index, remove the item at that index
        // Check that it is a valid index
        if (
          action.payload.index < 0 ||
          action.payload.index >= state.orderItems.length
        ) {
          return;
        }
        state.orderItems.splice(action.payload.index, 1);
      }

      // Find the service in the servicesAdded array
      const serviceAdded = state.servicesAdded.find(
        (item) => item.item?.package?.id === action.payload.packageId
      );

      if (serviceAdded && serviceAdded.quantity > 1) {
        // If the service exists and its quantity is more than 1, decrement its quantity
        serviceAdded.quantity -= 1;
      } else if (serviceAdded && serviceAdded.quantity === 1) {
        // If the service exists and its quantity is 1, remove the service from the servicesAdded array
        state.servicesAdded = state.servicesAdded.filter(
          (item) => item.item?.package?.id === action.payload.packageId
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
        state.servicesAdded = [];
        return;
      }

      // Calculate the new orderTotal here
      state.orderTotal = state.orderItems.reduce((total, item) => {
        return total + Number(item.order_item.platform_price);
      }, 0);
    },

    // Update the value of the order item of the index
    updateFieldValues: (
      state,
      action: PayloadAction<UpdateOrderItemPayloadType>
    ) => {
      const orderItem = state.orderItems[action.payload.index];
      let orderItemMetaDataIndex = -1;
      if (action?.payload?.service_master_meta_data_id) {
        orderItemMetaDataIndex =
          orderItem.order_item.order_item_meta_data.findIndex(
            (item) =>
              item.service_master_meta_data_id ===
              action.payload.service_master_meta_data_id
          );
      } else {
        orderItemMetaDataIndex =
          orderItem.order_item.order_item_meta_data.findIndex(
            (item) => item.id === action.payload.order_item_meta_data_id
          );
      }
      if (orderItemMetaDataIndex !== -1) {
        const updatedOrderItemMetaData = {
          ...orderItem.order_item.order_item_meta_data[orderItemMetaDataIndex],
          value: action.payload.value,
        };
        orderItem.order_item.order_item_meta_data.splice(
          orderItemMetaDataIndex,
          1,
          updatedOrderItemMetaData
        );
      }
    },

    resetCart: (state) => {
      state.orderId = null;
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

    // Add this to your list of actions in your cart slice
    initializeCart: (
      state,
      action: PayloadAction<{
        orderId: string;
        influencer: UserType | null;
        orderItems: OrderItemType[];
      }>
    ) => {
      state.orderId = action.payload.orderId;
      state.influencer = action.payload.influencer;
      state.orderItems = action.payload.orderItems.map((item) => {
        return {
          order_item: {
            ...item,
            platform_fee: item.platform_fee,
            price: item.platform_price,
            platform_price: (
              parseFloat(item?.price?.toString()) +
              parseFloat(item?.price?.toString()) *
                (parseFloat(item?.platform_fee?.toString()) / 100)
            )?.toString(),
            order_item_meta_data: item.order_item_meta_data.map((item) => {
              return {
                id: item.id,
                value: item.value,
                label: item.label,
                span: item.span,
                field_type: item.field_type,
                min: item.min,
                max: item.max,
                placeholder: item.placeholder,
                order: item.order,
              };
            }),
          },
          service_id: undefined,
          index: state.orderItems.length,
        };
      });

      let servicesAdded: ServiceAdded[] = [];
      action.payload.orderItems.forEach((item) => {
        const serviceAdded = servicesAdded.find(
          (service) => service.item?.package.id === item.package.id
        );
        if (serviceAdded) {
          serviceAdded.quantity += 1;
          serviceAdded.platform_price = (
            parseFloat(serviceAdded.platform_price) +
            parseFloat(item?.price?.toString()) +
            parseFloat(item?.price?.toString()) *
              (parseFloat(item?.platform_fee?.toString()) / 100)
          )?.toString();
        } else {
          servicesAdded.push({
            item: {
              ...item,
            },
            quantity: 1,
            platform_price: (
              parseFloat(item?.price?.toString()) +
              parseFloat(item?.price?.toString()) *
                (parseFloat(item?.platform_fee?.toString()) / 100)
            )?.toString(),
          });
        }
      });

      state.servicesAdded = servicesAdded;

      state.orderTotal = state.orderItems.reduce((total, item) => {
        return total + Number(item.order_item.platform_price);
      }, 0);
      state.orderTotalCurrency = action.payload.orderItems[0].currency;
    },
  },
});

// Don't forget to export it
export const {
  addOrderItem,
  removeOrderItem,
  resetCart,
  updateFieldValues,
  initializeCart,
} = cartSlice.actions;

