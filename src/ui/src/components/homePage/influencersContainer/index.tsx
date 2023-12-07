import { Box, Typography, Grid } from "@mui/material";
import React, { useState } from "react";
import InfluencersCards from "./influencersCards";
import { TopInfluencersType } from "./types";

type Props = {};

const dummyData: Array<TopInfluencersType> = [
  {
    name: "Parikshit Singh",
    twitterUsername: "ParikshitSingh567",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Story", "Post", "Repost", "Thread"],
    location: "Hyderabad, India",
    minPrice: 100,
    maxPrice: 500,
  },
  {
    name: "Shyam Visamsetty",
    twitterUsername: "shyamvisamsetty",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Post", "Repost", "Thread"],
    location: "Madrid, Spain",
    minPrice: 100,
    maxPrice: 200,
  },
  {
    name: "Mudit Sethi",
    twitterUsername: "alphamudit",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Like", "Repost", "Thread"],
    location: "Punjab, India",
    minPrice: 1200,
    maxPrice: 2800,
  },
  {
    name: "Laxmi Jangid",
    twitterUsername: "laxjangid1",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Post", "Repost", "Thread", "Post"],
    location: "Madrid, Spain",
    minPrice: 11200,
    maxPrice: 34400,
  },
  {
    name: "Parikshit Singh",
    twitterUsername: "ParikshitSingh567",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Story", "Post", "Repost", "Thread"],
    location: "Hyderabad, India",
    minPrice: 100,
    maxPrice: 500,
  },
  {
    name: "Shyam Visamsetty",
    twitterUsername: "shyamvisamsetty",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Post", "Repost", "Thread"],
    location: "Madrid, Spain",
    minPrice: 100,
    maxPrice: 200,
  },
  {
    name: "Mudit Sethi",
    twitterUsername: "alphamudit",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Like", "Repost", "Thread"],
    location: "Punjab, India",
    minPrice: 1200,
    maxPrice: 2800,
  },
  {
    name: "Laxmi Jangid",
    twitterUsername: "laxjangid1",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Post", "Repost", "Thread", "Post"],
    location: "Madrid, Spain",
    minPrice: 11200,
    maxPrice: 34400,
  },
  {
    name: "Parikshit Singh",
    twitterUsername: "ParikshitSingh567",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Story", "Post", "Repost", "Thread"],
    location: "Hyderabad, India",
    minPrice: 100,
    maxPrice: 500,
  },
  {
    name: "Shyam Visamsetty",
    twitterUsername: "shyamvisamsetty",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Post", "Repost", "Thread"],
    location: "Madrid, Spain",
    minPrice: 100,
    maxPrice: 200,
  },
  {
    name: "Mudit Sethi",
    twitterUsername: "alphamudit",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Like", "Repost", "Thread"],
    location: "Punjab, India",
    minPrice: 1200,
    maxPrice: 2800,
  },
  {
    name: "Laxmi Jangid",
    twitterUsername: "laxjangid1",
    profileUrl:
      "https://s3-alpha-sig.figma.com/img/2b53/6020/47fc208363db26717a7481b15fc1b2c8?Expires=1702857600&Signature=e9f~JU2Fgdumig1v9K8NB7CRLRVzekdefweQIzFOLi8V~PoVtV8xNDR4Bdj~ishIjEUf3D8vjUzmx6eT0cUlC6ry5P7aOb7VVsUTsJchSyaAqVPiuHIrvtVvBOalo9936YYDJ447dnrHi8UAId9fNBduQWDjIZM6xwJ8J-bVzB~OBWupJ9EQKtumGHaYHSLUS3OfJ9f2VGTlHNR2CSjf9trTa~atoGB5qNHFGXEhHpKFXlnkb753~groIByX1cXVQzKPiAc3tPtLnnSX1NvgF9HTj2chO7~vJue4Hf8isYrqmXU0dD~jQR3IHMvxfNk-2IzAwnbtqLAhBVakUBAJwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    services: ["Post", "Repost", "Thread", "Post"],
    location: "Madrid, Spain",
    minPrice: 11200,
    maxPrice: 34400,
  },
];

export default function InfluencersContainer({}: Props) {
  const [topInfluencers, setTopInfluencers] =
    useState<TopInfluencersType[]>(dummyData);
  return (
    <>
      <Typography variant="h5">Top Influencers</Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: "#505050",
        }}
      >
        Lorem ipsum dolor sit amet consectetur. Lacinia nisi aliquet nulla
        ornare amet.
      </Typography>
      <Grid
        container
        spacing={3}
        mt={4}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {topInfluencers.map((inf, index) => {
          return <InfluencersCards influencer={inf} key={index} />;
        })}
      </Grid>
    </>
  );
}
