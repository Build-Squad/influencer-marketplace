"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckoutTable from "../checkoutTable";
import { resetCart } from "@/src/reducers/cartSlice";
import { deleteService } from "@/src/services/httpServices";
import { notification } from "../../shared/notification";
import { useState } from "react";
import { ConfirmCancel } from "../../shared/confirmCancel";

type CheckoutModalProps = {
  open: boolean;
  handleClose: () => void;
  currentInfluencer: UserType | null;
};

const CheckoutModal = ({
  open,
  handleClose,
  currentInfluencer,
}: CheckoutModalProps) => {
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const deleteOrder = async () => {
    try {
      if (!cart?.orderId) {
        dispatch(resetCart());
        return;
      }
      setLoading(true);
      const { isSuccess, message } = await deleteService(
        `/orders/order/${cart?.orderId}/`
      );
      if (isSuccess) {
        notification("Order cancelled successfully!", "success");
        dispatch(resetCart());
      } else {
        notification(message, "error", 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: open ? "block" : "none",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          bottom: 10,
          right: 10,
          width: "400px",
          Height: "400px",
          bgcolor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "white",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
            }}
          >
            <CheckoutTable />
          </Box>
          <Box
            sx={{
              width: "100%",
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <ConfirmCancel
              title="this order"
              onConfirm={() => {
                deleteOrder();
                handleClose();
              }}
              loading={loading}
              hide
              sx={{
                width: "100%",
                mx: 1,
              }}
              deleteElement={
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ borderRadius: 5 }}
                  fullWidth
                  disabled={loading}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ borderRadius: 5, mx: 1 }}
              disabled={cart?.orderItems.length === 0}
              onClick={() => {
                router.push("/business/checkout");
              }}
            >
              Proceed
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutModal;
