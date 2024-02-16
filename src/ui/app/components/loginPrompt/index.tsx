import CustomModal from "@/src/components/shared/customModal";
import { Box, Button, Grid, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import InfluencerLogin from "@/public/svg/Influencer_login.svg";
import BusinessLogin from "@/public/svg/Business_login.svg";
import ColouredStar from "@/public/svg/Star_Coloured.svg";
import Image from "next/image";
import { useAppSelector } from "@/src/hooks/useRedux";
import { useSearchParams } from "next/navigation";

type Props = {
  setLoginAs: Dispatch<SetStateAction<string>>;
};

export default function LoginPrompt({ setLoginAs }: Props) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.user);

  // Login prompt only opens if it's the first time user is visiting and is not logged in
  useEffect(() => {
    const queryLoginAs = searchParams.get("loginAs");
    if (!queryLoginAs && !user?.loggedIn) setOpen(true);
    else setOpen(false);
  }, [user?.loggedIn]);
  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 3,
        border: "1px solid black",
        textAlign: "left",
      }}
      customCloseButton={true}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          display={"flex"}
          justifyContent={"center"}
          sx={{ mb: 2 }}
        >
          <Image src={ColouredStar} alt={"Coloured Start"} height={30} />
          <Typography variant="h5" fontWeight={"bold"}>
            Tell us about yourself !
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Box sx={{ p: 1 }}>
            <Image
              src={InfluencerLogin}
              alt={"InfluencerLogin"}
              height={"235"}
            />
            <Typography variant="subtitle1" fontWeight={"bold"}>
              I am an Influencer on X
            </Typography>
            <Typography variant="subtitle1">
              You’ve built your own following on social, and now you’re looking
              to track and monetize your Influence. This the account your want
            </Typography>

            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                color: "black",
                border: "1px solid black",
                borderRadius: "20px",
                mt: 4,
              }}
              fullWidth
              onClick={() => {
                setLoginAs("Influencer");
                setOpen(false);
              }}
            >
              I am an Influencer
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Box sx={{ p: 1 }}>
            <Image src={BusinessLogin} alt={"BusinessLogin"} height={"235"} />
            <Typography variant="subtitle1" fontWeight={"bold"}>
              I am a Business
            </Typography>
            <Typography variant="subtitle1">
              You’ve built your own following on social, and now you’re looking
              to track and monetize your Influence. This the account your want
            </Typography>
            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                color: "black",
                border: "1px solid black",
                borderRadius: "20px",
                mt: 4,
              }}
              fullWidth
              onClick={() => {
                setLoginAs("Business");
                setOpen(false);
              }}
            >
              I am a Business
            </Button>
          </Box>
        </Grid>
      </Grid>
    </CustomModal>
  );
}
