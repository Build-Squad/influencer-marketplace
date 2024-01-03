import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import React from "react";
import { TopInfluencersType } from "../types";
import { LocationOn } from "@mui/icons-material";

type Props = {
  influencer: TopInfluencersType;
};

export default function InfluencersCards({ influencer }: Props) {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={2.8}
      lg={2.8}
      key={influencer?.twitterUsername}
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
            }}
          >
            <Typography variant="subtitle1" fontWeight={"bold"}>
              Services:
            </Typography>
            {influencer?.services.map((ser) => {
              return <Chip key={ser} label={ser} size="small" />;
            })}
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
              <LocationOn fontSize="small" sx={{ color: "#676767" }} />
              <Typography variant="subtitle1" fontWeight={"light"}>
                {influencer?.location}
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={"bold"}>
              {`${influencer?.minPrice}$ - ${influencer?.maxPrice}$`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
