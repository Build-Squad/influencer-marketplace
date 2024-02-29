"use client";
import React, { Fragment, useEffect, useState } from "react";
import Banner from "./components/banner";
import AnalyticsContainer from "../components/analyticsContainer";
import Footer from "@/src/components/shared/footer";
import { Box } from "@mui/material";
import GuideContainer from "./components/guideContainer";
import FAQSection from "./components/faqSection";
import ElevateSection from "./components/elevateSection";
import { useRouter } from "next/navigation";
import ScrollTop from "@/public/svg/ScrollTop.svg";
import Image from "next/image";

type Props = {};

export default function Influencer({}: Props) {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        // Adjust this value as needed
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Fragment>
      <Banner />
      <AnalyticsContainer role={"business"}/>
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
      {isVisible && (
        <div
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "6px",
            right: "16px",
            cursor: "pointer",
            zIndex: "10",
          }}
        >
          <Image src={ScrollTop} alt="ScrollTop" height={50} />
        </div>
      )}
      
    </Fragment>
  );
}
