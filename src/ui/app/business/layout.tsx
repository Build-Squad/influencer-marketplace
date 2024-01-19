"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { initializeCart, resetCart } from "@/src/reducers/cartSlice";
import { postService } from "@/src/services/httpServices";
import { ORDER_STATUS } from "@/src/utils/consts";
import React, { useEffect } from "react";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const getCurrentDraftOrder = async () => {
    const { isSuccess, data, message } = await postService(
      `orders/order-list/`,
      {
        status: [ORDER_STATUS.DRAFT],
      }
    );
    if (isSuccess) {
      if (data?.data?.length > 0) {
        const order = data?.data[0];
        if (cart?.orderId && cart?.orderId === order.id) {
          return;
        }
        dispatch(
          initializeCart({
            orderId: order.id,
            influencer: order.order_item_order_id[0].package.influencer,
            orderItems: order.order_item_order_id,
          })
        );
      } else {
        if (cart?.orderId) {
          dispatch(resetCart());
        }
      }
    }
  };

  useEffect(() => {
    if (user?.loggedIn) {
      getCurrentDraftOrder();
    }
  }, [user?.loggedIn]);

  return <div>{children}</div>;
}
