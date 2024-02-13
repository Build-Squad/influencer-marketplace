"use client";
import React, { Fragment, useEffect, useState } from "react";
import Banner from "./components/banner";
import AnalyticsContainer from "../components/analyticsContainer";
import Footer from "@/src/components/shared/footer";
import { Box, Typography } from "@mui/material";
import GuideContainer from "./components/guideContainer";
import FAQSection from "./components/faqSection";
import ElevateSection from "./components/elevateSection";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPrompt from "../components/loginPrompt";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";

type Props = {};

export default function Influencer({}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loginAs, setLoginAs] = useState("");
  const { isTwitterUserLoggedIn } = useTwitterAuth();

  useEffect(() => {
    const queryLoginAs = searchParams.get("loginAs");
    if (!queryLoginAs && !isTwitterUserLoggedIn) setOpen(true);
    else setOpen(false);
  }, [isTwitterUserLoggedIn]);

  useEffect(() => {
    if (loginAs == "Business") router.push("/business?loginAs=Business");
  }, [loginAs]);
  return (
    <Fragment>
      <Banner />
      <AnalyticsContainer />
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
          textAlign: "center",
        }}
      >
        <GuideContainer />
      </Box>
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
          textAlign: "center",
        }}
      >
        <ElevateSection />
      </Box>
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
          textAlign: "center",
        }}
      >
        <FAQSection />
      </Box>

      <Footer />
      <LoginPrompt open={open} setOpen={setOpen} setLoginAs={setLoginAs} />
    </Fragment>
  );
}
