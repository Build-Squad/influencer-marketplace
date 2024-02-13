import CustomModal from "@/src/components/shared/customModal";
import { Box, Button, Grid, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setLoginAs: Dispatch<SetStateAction<string>>;
};

export default function LoginPrompt({ open, setOpen, setLoginAs }: Props) {
  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 0,
        border: "1px solid black",
      }}
      customCloseButton={true}
    >
      <Grid container>
        <Grid item xs={12} md={6} lg={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={"bold"}>
              Are you a Business Owner?
            </Typography>
            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                color: "black",
                border: "1px solid black",
                borderRadius: "20px",
                my: 4,
              }}
              fullWidth
              onClick={() => {
                setLoginAs("Business");
                setOpen(false);
              }}
            >
              Login as Business
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={"bold"}>
              Are you an Influencer?
            </Typography>
            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                color: "black",
                border: "1px solid black",
                borderRadius: "20px",
                my: 4,
              }}
              fullWidth
              onClick={() => {
                setLoginAs("Influencer");
                setOpen(false);
              }}
            >
              Login as Influencer
            </Button>
          </Box>
        </Grid>
      </Grid>
    </CustomModal>
  );
}
