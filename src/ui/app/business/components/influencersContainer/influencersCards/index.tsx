import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Link,
  Tooltip,
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

const ServiceChipsComponent = ({ services }: { services: string[] }) => {
  if (services.length == 1) {
    return <Chip label={services[0]} size="small" />;
  } else {
    return (
      <Box
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          columnGap: "4px",
        }}
      >
        <Chip label={services[0]} size="small" sx={{ maxWidth: "70%" }} />
        <Tooltip
          title={
            <React.Fragment>
              <ul style={{ margin: 0, padding: 10 }}>
                {services.slice(1).map((ser: string, ind: number) => {
                  return <li key={ind}>{ser}</li>;
                })}
              </ul>
            </React.Fragment>
          }
          enterDelay={300}
          leaveDelay={200}
        >
          <Typography
            variant="caption"
            fontWeight={"bold"}
            sx={{ color: "#0089EA", cursor: "pointer" }}
          >
            +{services.length - 1} more
          </Typography>
        </Tooltip>
      </Box>
    );
  }
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
            <Typography
              gutterBottom
              variant="subtitle1"
              fontWeight={"bold"}
              sx={{
                width: "95%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
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
                columnGap: "4px",
              }}
            >
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Services:
              </Typography>
              <ServiceChipsComponent services={influencer?.services} />
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
