"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { initializeCart, resetCart } from "@/src/reducers/cartSlice";
import { postService } from "@/src/services/httpServices";
import { ORDER_STATUS } from "@/src/utils/consts";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey } = useWallet();
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const getCurrentDraftOrder = async () => {
    const { isSuccess, data } = await postService(`orders/order-list/`, {
      status: [ORDER_STATUS.DRAFT],
    });
    if (isSuccess) {
      if (data?.data?.orders?.length > 0) {
        const order = data?.data?.orders[0];
        if (cart?.orderId && cart?.orderId === order.id) {
          return;
        }
        dispatch(
          initializeCart({
            order_number: order.order_number,
            orderId: order.id,
            influencer: order.order_item_order_id[0].package.influencer,
            orderItems: order.order_item_order_id,
            influencer_wallet: order?.influencer_wallet,
            buyer_wallet: order?.buyer_wallet,
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
