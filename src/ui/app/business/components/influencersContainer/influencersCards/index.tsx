import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Link,
} from "@mui/material";
import React from "react";
import { TopInfluencersType } from "../types";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { stringToColor } from "@/src/utils/helper";

type Props = {
  influencer: TopInfluencersType;
  sx?: any;
};

export default function InfluencersCards({ influencer, sx = {} }: Props) {
  const router = useRouter();
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={2.8}
      lg={2.8}
      key={influencer?.twitterUsername}
      sx={sx}
    >
      <Link
        href={`/influencer/profile/${influencer?.id}`}
        component={NextLink}
        sx={{
          textDecoration: "none",
        }}
      >
        <Card
          sx={{
            cursor: "pointer",
            borderRadius: "16px",
            boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {influencer?.profileUrl &&
            !influencer?.profileUrl?.includes("default") ? (
              <Avatar
                alt="Influencer profile image"
                src={influencer?.profileUrl}
                variant="circular"
                sx={{
                  height: "60px",
                  width: "60px",
                }}
              />
            ) : (
              <Avatar
                alt="Influencer profile image"
                variant="circular"
                sx={{
                  bgcolor: stringToColor(
                    influencer?.twitterUsername
                      ? influencer?.twitterUsername
                      : ""
                  ),
                  height: "60px",
                  width: "60px",
                }}
              >
                {influencer?.twitterUsername?.charAt(0)?.toUpperCase()}
              </Avatar>
            )}
            <Typography gutterBottom variant="subtitle1" fontWeight={"bold"}>
              {influencer?.name}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "#676767" }}
            >
              @{influencer?.twitterUsername}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1" fontWeight={"bold"} mr={1}>
                Services:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: "4px",
                  overflowX: "auto",
                  maxWidth: "100%",
                  // "&::-webkit-scrollbar": {
                  //   height: "5px",
                  // },
                  // "&::-webkit-scrollbar-thumb": {
                  //   background: "grey",
                  // },
                }}
              >
                {influencer?.services.map((ser, index) => (
                  <Chip key={ser} label={ser} size="small" />
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "34px",
                width: "100%",
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  Followers:
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={"light"}
                  sx={{ ml: 1 }}
                >
                  {influencer?.followers}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                {`${influencer?.minPrice} - ${influencer?.maxPrice}`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}
