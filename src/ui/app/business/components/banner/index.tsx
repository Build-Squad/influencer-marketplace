"use client";
import React from "react";
import {
  Box,
  Button,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { BannerFilterSchema, BannerFilterInitialValues } from "./validation";
import Image from "next/image";
import Arrow from "@/public/svg/Arrow.svg";
import Star from "@/public/svg/Star.svg";
import FiltersComponent from "@/src/components/shared/filtersComponent";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

type Props = {};

export default function Banner({}: Props) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: BannerFilterInitialValues,
    onSubmit: (values) => {
      localStorage.setItem("filterData", JSON.stringify(values));
      router.push("business/explore");
    },
    validationSchema: BannerFilterSchema,
  });
  return (
    <Box
      sx={{
        border: "1px solid #000",
        borderTop: "none",
        backgroundImage: "url(/Business_Landing_page.png)",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        paddingY: "82px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          columnGap: "4px",
        }}
      >
        <Image
          src={Star}
          height={40}
          width={34}
          alt=""
          style={{ marginBottom: "8px" }}
        />
        <Typography variant="body1">
          Strategically Match Your Business with X's Finest Influencers.
        </Typography>
      </Box>
      <Box
        sx={{
          width: "60%",
          textAlign: "center",
          mt: 1,
          display: "flex",
          alignItems: "flex-end",
          columnGap: "8px",
        }}
      >
        <Typography variant="h4" fontWeight={"bold"}>
          Connecting Businesses with X Influencers for maximum impact
          <Image
            src={Arrow}
            height={24}
            width={70}
            alt=""
            style={{ marginLeft: "8px" }}
          />
        </Typography>
      </Box>

      {/* Filters Container */}
      <Box
        sx={{
          mt: 5,
          px: 5,
          py: 3,
          width: "60%",
          background: "rgba(255, 255, 255, 0.51)",
          borderRadius: "16px",
          backdropFilter: "blur(5px)",
          boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={1}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item xs={6} sm={6} md={6} lg={5}>
              <TextField
                color="secondary"
                name="platform"
                value="Twitter"
                disabled
                sx={{
                  cursor: "not-allowed",
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                    backgroundColor: "white",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "1px solid black",
                  },
                }}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={5}>
              <FiltersComponent formik={formik} type={"CATEGORIES"} />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={2}>
              <Button
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: "12px",
                  fontWeight: "bold",
                  px: 5,
                  py: 1,
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h6">
          How can Xfluencer add to the success of your business?
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            columnGap: "8px",
            mt: 2,
          }}
        >
          {[
            "Post",
            "Thread",
            "Like",
            "Reply",
            "Pinned Tweet",
            "Quote a Post",
          ].map((it: string, ind: number) => {
            return (
              <Button
                key={ind}
                variant={"outlined"}
                color="secondary"
                sx={{
                  borderRadius: "24px",
                  border: "1px solid #7B7B7B",
                  background: "rgba(255, 255, 255, 0.40)",
                  fontSize: "20px",
                }}
              >
                {it}
              </Button>
            );
          })}
          <Typography variant="h6" fontWeight={"bold"}>
            + Much More
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
