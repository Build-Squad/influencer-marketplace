"use client";
import { notification } from "@/src/components/shared/notification";
import { getService } from "@/src/services/httpServices";
import React, { useEffect, useState } from "react";
import InfluencersCards from "../../components/influencersContainer/influencersCards";
import BackIcon from "@/public/svg/Back.svg";
import {
  Avatar,
  Box,
  Button,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { BasicBusinessDetailsType } from "../../profile/type";
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
import Image from "next/image";
import NotFound from "@/public/svg/not_found.svg";
import { stringToColor } from "@/src/utils/helper";
import { BADGES } from "@/src/utils/consts";
import { getProfileCompletedStatus } from "@/src/services/profileCompletion";

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
  notAddedStyles: {
    fontWeight: "normal",
    color: "grey",
    fontSize: "14px",
  },
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
  const [businessDetails, setBusinessDetails] = useState<any>();
  const user = useAppSelector((state) => state.user?.user);

  const router = useRouter();

  useEffect(() => {
    getAccount();
  }, []);

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

    console.log(completionStringArr);

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
        page_size: 5,
        collaborationIds: collaborationIds.length ? collaborationIds : ["nil"],
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
          rating: inf.rating,
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
        });
        getCollaborators(data?.data?.influencer_ids);
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  const getCurrentBadgeIndex = () => {
    const per = getProgressPercentage();
    return per <= 25 ? 0 : per <= 50 ? 1 : per <= 75 ? 2 : per <= 100 ? 3 : 0;
  };

  return (
    <Box sx={{ backgroundColor: "#FAFAFA" }}>
      <Image
        src={BackIcon}
        alt={"BackIcon"}
        height={30}
        style={{ marginTop: "16px", marginLeft: "40px", cursor: "pointer" }}
        onClick={() => {
          router.back();
        }}
      />
      <Box
        sx={{
          pt: 1,
          px: 5,
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
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
            {!!businessDetails?.user_twitter_profile_image ? (
              <Avatar
                alt={"Business Account Image"}
                src={businessDetails?.user_twitter_profile_image}
                sx={{
                  width: 138,
                  height: 138,
                }}
              />
            ) : (
              <Avatar
                alt={businessDetails?.user_account?.username}
                src={businessDetails?.user_account?.username}
                sx={{
                  width: 138,
                  height: 138,
                  bgcolor: stringToColor(
                    businessDetails?.user_account?.username ?? ""
                  ),
                }}
              />
            )}

            <Typography variant="h6" fontWeight={"bold"} sx={{ mt: 2 }}>
              {!businessDetails?.business_name ||
              businessDetails?.business_name == "" ? (
                <i style={styles.notAddedStyles}>-</i>
              ) : (
                businessDetails?.business_name
              )}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, display: "flex" }}>
              <LocationOn />
              {!businessDetails?.headquarters ||
              businessDetails?.headquarters == "" ? (
                <i style={styles.notAddedStyles}>Location Not Added</i>
              ) : (
                businessDetails?.headquarters
              )}
            </Typography>
          </Box>
          <Box sx={{ ...styles.flexStyles, mt: 2 }}>
            <Typography variant="subtitle1">Founded In </Typography>
            <Typography variant="subtitle1" fontWeight={"bold"}>
              {!businessDetails?.founded || businessDetails?.founded == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.founded
              )}
            </Typography>
          </Box>
          <Box sx={styles.flexStyles}>
            <Typography variant="subtitle1">Headquarters </Typography>
            <Typography variant="subtitle1" fontWeight={"bold"}>
              {!businessDetails?.headquarters ||
              businessDetails?.headquarters == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.headquarters
              )}
            </Typography>
          </Box>
          <Box sx={styles.flexStyles}>
            <Typography variant="subtitle1">Industry </Typography>
            <Typography variant="subtitle1" fontWeight={"bold"}>
              {!businessDetails?.industry || businessDetails?.industry == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.industry
              )}
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
              {!businessDetails?.user_email ||
              businessDetails?.user_email == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.user_email
              )}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
            >
              <LocalPhone />
              {!businessDetails?.phone || businessDetails?.phone == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.phone
              )}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
            >
              <Language />
              {!businessDetails?.website || businessDetails?.website == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.website
              )}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
            >
              <Clear />
              {!businessDetails?.twitter_account ||
              businessDetails?.twitter_account == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.twitter_account
              )}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
            >
              <LinkedIn />
              {!businessDetails?.linked_in ||
              businessDetails?.linked_in == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.linked_in
              )}
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
            <Typography>
              {!businessDetails?.bio || businessDetails?.bio == "" ? (
                <i style={styles.notAddedStyles}>Not Added</i>
              ) : (
                businessDetails?.bio
              )}
            </Typography>
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
              {!!collaborations.length ? (
                collaborations.map((inf, index) => (
                  <InfluencersCards
                    influencer={inf}
                    key={index}
                    sx={{ minWidth: "320px" }}
                  />
                ))
              ) : (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{ width: "100%", mt: 4 }}
                  flexDirection={"column"}
                >
                  <Image
                    src={NotFound}
                    alt="NotFound"
                    style={{ height: "auto", width: "50%", minWidth: "200px" }}
                  />
                  <Typography sx={{ fontStyle: "italic" }}>
                    No Collaborations Found!
                  </Typography>
                </Box>
              )}
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            margin: "20px",
          }}
        >
          {user?.id == params?.id ? (
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
          <Box
            sx={{
              mt: 2,
              padding: "20px",
              backgroundColor: "#FFF",
              borderRadius: "16px",
            }}
          >
            <Typography fontWeight={"bold"}>Badges</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                columnGap: "16px",
                alignItems: "center",
                mt: 2,
              }}
            >
              {BADGES.map((badge, index) => {
                return (
                  <Box>
                    <Image
                      src={
                        getCurrentBadgeIndex() === index
                          ? badge.icon
                          : badge.blurredIcon
                      }
                      alt={badge.name}
                      style={{
                        width:
                          getCurrentBadgeIndex() === index ? "54px" : "40px",
                        height:
                          getCurrentBadgeIndex() === index ? "54px" : "40px",
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
            <Typography fontWeight={"bold"} sx={{ mt: 2 }}>
              {BADGES[getCurrentBadgeIndex()].name}
            </Typography>
            {user?.id == params?.id ? (
              isProfileComplete ? (
                <Typography variant="subtitle1" sx={{ color: "#626262" }}>
                  Profile complete! Enjoy your upgraded badge & enhanced
                  platform experience.
                </Typography>
              ) : (
                <Typography variant="subtitle1" sx={{ color: "#626262" }}>
                  Complete missing details on your profile to upgrade your
                  Badge.
                </Typography>
              )
            ) : (
              <Typography variant="subtitle1" sx={{ color: "#626262" }}>
                {BADGES[getCurrentBadgeIndex()].description}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
