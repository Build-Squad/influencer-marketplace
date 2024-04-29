"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { initializeCart, resetCart } from "@/src/reducers/cartSlice";
import { getService, postService } from "@/src/services/httpServices";
import { ORDER_STATUS } from "@/src/utils/consts";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey } = useWallet();
  const router = useRouter();
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

  // Restrict access to landing page for logged out user
  const loginStatus = async () => {
    try {
      const { isSuccess } = await getService("account/");
      if (!isSuccess) {
        router.push("/login?role=Business");
      }
    } catch (error) {
      router.push("/login?role=Business");
    }
  };

  useEffect(() => {
    loginStatus();
  }, []);

  return <div>{children}</div>;
}
