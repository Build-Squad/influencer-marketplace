"use client";
import React, { Fragment } from "react";
import Influencer_Banner from "@/public/svg/Influencer_Banner.svg";
import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import Arrow from "@/public/svg/Arrow.svg";
import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { ArrowCircleRightOutlined } from "@mui/icons-material";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { useAppSelector } from "@/src/hooks/useRedux";

type Props = {};

export default function Banner({}: Props) {
  const user = useAppSelector((state) => state.user);
  const { startTwitterAuthentication } = useTwitterAuth();
  return (
    <Fragment>
      <Grid
        container
        sx={{
          paddingTop: "48px",
          paddingX: "20px",
        }}
      >
        <Grid item xs={12} sm={7} md={5} lg={5}>
          <Image
            src={Star_Coloured}
            height={60}
            width={54}
            alt={"Coloured Start"}
          />
          <Typography variant="subtitle1" sx={{ marginTop: "32px" }}>
            Monetize your Twitter Influence
          </Typography>
          <Typography
            variant="h4"
            fontWeight={"bold"}
            sx={{ marginTop: "8px", lineHeight: "60px" }}
          >
            Connect, Create, Thrive:
            <br /> Amplify Your Twitter Influence with Business Collaborations!
            <Image src={Arrow} height={24} width={70} alt={"Coloured Star"} />
          </Typography>
          {user?.loggedIn ? null : (
            <Button
              color="secondary"
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: "28px",
                fontWeight: "bold",
                padding: "12px 32px",
                fontSize: "16px",
              }}
              size="large"
              onClick={startTwitterAuthentication}
              endIcon={<ArrowCircleRightOutlined />}
            >
              Connect with X
            </Button>
          )}

          <Box
            sx={{
              display: "flex",
              columnGap: "8px",
              alignItems: "center",
              marginTop: "80px",
              marginBottom: "40px",
            }}
          >
            {["Post", "Repost", "Thread"].map((it, index) => (
              <Button
                key={it}
                color="secondary"
                variant="outlined"
                sx={{ borderRadius: "16px", fontSize: "16px", paddingY: "0" }}
              >
                {it}
              </Button>
            ))}
            <Typography variant="subtitle1" fontWeight={"Bold"}>
              + Much More
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={7} md={7} lg={7} sx={{ position: "relative" }}>
          <Image
            src={Influencer_Banner}
            fill
            style={{ width: "100%" }}
            alt={"Influencer Banner"}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}
