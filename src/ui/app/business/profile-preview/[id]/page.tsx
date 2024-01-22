"use client";
import { notification } from "@/src/components/shared/notification";
import { getService } from "@/src/services/httpServices";
import React, { useEffect, useState } from "react";
import InfluencersCards from "../../components/influencersContainer/influencersCards";
import {
  Avatar,
  Box,
  Button,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { BasicBusinessDetailsType, UserDetailsType } from "../../profile/type";
import {
  LocationOn,
  Email,
  LocalPhone,
  Clear,
  LinkedIn,
  Language,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/hooks/useRedux";

type Props = {
  params: {
    id: string;
  };
};

const styles = {
  flexStyles: {
    display: "flex",
    columnGap: "8px",
    justifyContent: "space-between",
    textAlign: "right",
  },
};

const getProfileCompletedStatus: (businessDetails: any) => string = (
  businessDetails
) => {
  if (businessDetails) {
    let count = 0;
    if (businessDetails?.isTwitterAccountConnected) count += 5;
    if (businessDetails?.isWalletConnected) count += 5;
    count +=
      Object.values(businessDetails).filter((value) => value !== "").length - 5;

    return `${count} / ${10 + Object.keys(businessDetails).length - 5}`;
  }
  return "-";
};

const formatTwitterFollowers = (followersCount: any) => {
  if (followersCount >= 1000000) {
    // Convert to millions format
    return `${(followersCount / 1000000).toFixed(1)}M`;
  } else if (followersCount >= 1000) {
    // Convert to thousands format
    return `${(followersCount / 1000).toFixed(1)}K`;
  } else {
    // Leave as is
    return followersCount?.toString();
  }
};

export default function BusinessProfilePreview({ params }: Props) {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [collaborations, setCollaborations] = useState([]);
  const [businessDetails, setBusinessDetails] =
    useState<BasicBusinessDetailsType>();
  const user = useAppSelector((state) => state.user?.user);

  const router = useRouter();

  useEffect(() => {
    const percentage = getProgressPercentage();
    if (percentage === 100) {
      setIsProfileComplete(true);
    } else {
      setIsProfileComplete(false);
    }
  }, [businessDetails]);

  const getProgressPercentage = () => {
    const completionStringArr = getProfileCompletedStatus(businessDetails)
      .replace(/\s/g, "")
      .split("/");

    return (
      (parseInt(completionStringArr[0]) / parseInt(completionStringArr[1])) *
      100
    );
  };

  const getCollaborators = async (collaborationIds: string[] = []) => {
    const { isSuccess, data, message } = await getService(
      "/account/twitter-account/",
      {
        page_number: 1,
        page_size: 6,
        collaborationIds,
      }
    );
    if (isSuccess) {
      const filteredData = data?.data?.map((inf: any) => {
        return {
          id: inf.user_id,
          name: inf.name || "",
          twitterUsername: inf.user_name || "",
          profileUrl: inf.profile_image_url || "",
          services: inf.service_types
            ? inf.service_types.map((service: any) => service.serviceType)
            : [],

          followers: formatTwitterFollowers(inf.followers_count),
          minPrice:
            inf.service_types && inf.service_types.length > 0
              ? Math.min(
                  ...inf.service_types.map((service: any) => service.price)
                )
              : 0,
          maxPrice:
            inf.service_types && inf.service_types.length > 0
              ? Math.max(
                  ...inf.service_types.map((service: any) => service.price)
                )
              : 0,
        };
      });
      setCollaborations(filteredData);
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  const getAccount = async () => {
    try {
      const { isSuccess, message, data } = await getService(
        `/account/business-meta-data/${params?.id}/`
      );
      if (isSuccess) {
        setBusinessDetails({
          ...data?.data,
          isTwitterAccountConnected: !!user?.twitter_account,
          isWalletConnected: !!user?.wallets?.length,
        });
        getCollaborators(data?.data?.influencer_ids);
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);
  return (
    <Box
      sx={{
        pt: 2,
        px: 5,
        display: "flex",
        backgroundColor: "#FAFAFA",
        height: "94vh",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          padding: "16px 30px",
          backgroundColor: "#FFF",
          borderRadius: "16px",
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            alt={businessDetails?.business_name}
            src={businessDetails?.business_name}
            sx={{ width: 138, height: 138 }}
          />
          <Typography variant="h6" fontWeight={"bold"} sx={{ mt: 2 }}>
            {businessDetails?.business_name}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, display: "flex" }}>
            <LocationOn />
            {businessDetails?.headquarters}
          </Typography>
        </Box>
        <Box sx={{ ...styles.flexStyles, mt: 2 }}>
          <Typography variant="subtitle1">Founded In </Typography>
          <Typography variant="subtitle1" fontWeight={"bold"}>
            {businessDetails?.founded}
          </Typography>
        </Box>
        <Box sx={styles.flexStyles}>
          <Typography variant="subtitle1">Headquarters </Typography>
          <Typography variant="subtitle1" fontWeight={"bold"}>
            {businessDetails?.headquarters}
          </Typography>
        </Box>
        <Box sx={styles.flexStyles}>
          <Typography variant="subtitle1">Industry </Typography>
          <Typography variant="subtitle1" fontWeight={"bold"}>
            {businessDetails?.industry}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={"bold"} sx={{ mb: 2 }}>
            Contact Details
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
          >
            <Email />
            {businessDetails?.user_email}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
          >
            <LocalPhone />
            {businessDetails?.phone}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
          >
            <Language />
            {businessDetails?.website}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
          >
            <Clear />
            {businessDetails?.twitter_account}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
          >
            <LinkedIn />
            {businessDetails?.linked_in}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          padding: "16px 30px",
          flex: 2.5,
        }}
      >
        <Box
          sx={{
            padding: "16px",
            backgroundColor: "#FFF",
            borderRadius: "16px",
          }}
        >
          <Typography fontWeight="bold">About</Typography>
          <Typography>{businessDetails?.bio}</Typography>
        </Box>
        <Box sx={{ padding: "16px" }}>
          <Typography fontWeight="bold">Collaborators</Typography>
          <Grid
            container
            spacing={3}
            mt={0}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            {collaborations.map((inf, index) => (
              <InfluencersCards influencer={inf} key={index} />
            ))}
          </Grid>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          margin: "20px",
        }}
      >
        {user?.role?.name === "business_owner" ? (
          <Button
            fullWidth
            variant={"contained"}
            color="secondary"
            sx={{
              borderRadius: "20px",
            }}
            onClick={() => {
              router.push("/business/profile?tab=wallet");
            }}
          >
            Edit Profile
          </Button>
        ) : null}

        <Box
          sx={{
            mt: 2,
            padding: "20px",
            backgroundColor: "#FFF",
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Information Added</Typography>
            <Typography
              variant="h6"
              fontWeight={"bold"}
              sx={{ color: isProfileComplete ? "#4AA785" : "black" }}
            >
              {getProfileCompletedStatus(businessDetails)}
            </Typography>
          </Box>

          {isProfileComplete ? (
            <LinearProgress
              variant="determinate"
              value={getProgressPercentage()}
              sx={{
                "& .MuiLinearProgress-bar": { backgroundColor: "#4AA785" },
              }}
            />
          ) : (
            <LinearProgress
              variant="determinate"
              value={getProgressPercentage()}
              color="secondary"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
