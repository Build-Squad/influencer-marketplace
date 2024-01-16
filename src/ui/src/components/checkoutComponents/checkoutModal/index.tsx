"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckoutTable from "../checkoutTable";

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
            <Button
              variant="outlined"
              onClick={() => {
                handleClose();
              }}
              color="secondary"
              sx={{ borderRadius: 5, mx: 1 }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 5, mx: 1 }}
              fullWidth
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
