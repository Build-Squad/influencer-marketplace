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
            <Avatar
              alt="Influencer profile image"
              src={influencer?.profileUrl}
              variant="circular"
              sx={{
                height: "60px",
                width: "60px",
              }}
            />
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
                columnGap: "4px",
                mt: 2,
                overflow: "hidden",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Services:
              </Typography>
              {influencer?.services.length > 2 ? (
                <>
                  <Box sx={{ display: "flex" }}>
                    <Box sx={{ flex: 2 }}></Box>
                    <Box></Box>
                  </Box>
                  <Chip key={0} label={influencer?.services[0]} size="small" />
                  <Chip key={2} label={influencer?.services[1]} size="small" />
                  <Typography>
                    +{influencer?.services.length - 2} more
                  </Typography>
                </>
              ) : (
                influencer?.services.map((ser, index) => {
                  return <Chip key={ser} label={ser} size="small" />;
                })
              )}
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
