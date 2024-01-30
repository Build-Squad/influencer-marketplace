"use client";

import CategorySelectionModal from "@/src/components/categorySelectionModal";
import InfluencerProfileCard from "@/src/components/profileComponents/influencerProfileCard";
import { notification } from "@/src/components/shared/notification";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { useAppSelector } from "@/src/hooks/useRedux";
import { getService, postService } from "@/src/services/httpServices";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Services from "./_services";

const tabs = [
  {
    value: "services",
    label: "Services",
  },
];

const ProfileLayout = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const loggedInUser = useAppSelector((state) => state.user?.user);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  const [categoryOpen, setCategoryOpen] = React.useState<boolean>(false);
  const [openWalletConnectModal, setOpenWalletConnectModal] =
    React.useState<boolean>(false);
  const [wallets, setWallets] = React.useState<WalletType[]>([]);
  const [regions, setRegions] = React.useState<RegionType[]>([]);
  const [userRegion, setUserRegion] = React.useState<RegionType>();

  useEffect(() => {
    if (params.id) {
      getUserDetails();
    }
  }, [params.id]);

  useEffect(() => {
    if (!categoryOpen) {
      getUserDetails();
    }
  }, [categoryOpen]);

  useEffect(() => {
    if (
      !openWalletConnectModal &&
      params.id &&
      params?.id === loggedInUser?.id
    ) {
      getWallets();
    }
  }, [openWalletConnectModal, params.id, loggedInUser?.id]);

  useEffect(() => {
    getRegions();
  }, []);

  useEffect(() => {
    if (currentUser?.region?.length) {
      const regionOfUser = regions.find(
        (item) => item.id === currentUser?.region?.[0].region
      );
      setUserRegion(regionOfUser);
    }
  }, [currentUser]);

  const getUserDetails = async () => {
    const { isSuccess, message, data } = await getService(
      `/account/user/${params.id}/`
    );
    if (isSuccess) {
      setCurrentUser(data?.data);
    } else {
      notification(message ? message : "Error fetching user details", "error");
    }
  };

  const getWallets = async () => {
    const { isSuccess, message, data } = await getService(`/account/wallets/`);
    if (isSuccess) {
      setWallets(data?.data);
    }
  };

  const getRegions = async () => {
    const { isSuccess, message, data } = await getService(
      `/core/regions-master/`
    );
    if (isSuccess) {
      setRegions(data?.data);
    } else {
      // notification(message ? message : "Error fetching Regions", "error");
    }
  };

  const handleRegionSelect = async (e: any) => {
    const selectedRegion: RegionType | undefined = regions.find(
      (region) => region.regionName === e.target.value
    );

    const { isSuccess, data, message } = await postService(
      "/account/account-region/",
      {
        user_id: currentUser?.id,
        region_id: selectedRegion?.id,
      }
    );
    if (isSuccess) {
      setUserRegion(selectedRegion);
      notification(message);
    } else {
      notification(
        message ? message : "Something went wrong, please try again later",
        "error"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                backgroundImage: "url(/profileBanner.png)",
                border: "1px solid #000",
                borderTop: "none",
                display: "flex",
                minHeight: "200px",
                width: "100%",
                flexDirection: "column",
                "@media (max-width: 991px)": {
                  maxWidth: "100%",
                },
              }}
            ></Box>
            <Grid container spacing={2}>
              <InfluencerProfileCard
                currentUser={currentUser}
                loggedInUser={loggedInUser}
                paramsId={params.id ? params.id : ""}
                regions={regions}
                userRegion={userRegion}
                handleRegionSelect={handleRegionSelect}
                setCategoryOpen={setCategoryOpen}
                setOpenWalletConnectModal={setOpenWalletConnectModal}
                wallets={wallets}
                getWallets={getWallets}
              />
              <Grid item xs={12} md={9} sm={12} lg={9}>
                <Box
                  sx={{
                    m: 2,
                  }}
                >
                  {tabs.map((item) => (
                    <Typography variant="h4" key={item.value}>
                      {item.label}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ p: 2 }}>
                  <Services
                    currentInfluencer={currentUser}
                    id={params.id}
                    wallets={wallets}
                    setOpen={setOpenWalletConnectModal}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <WalletConnectModal
        open={openWalletConnectModal}
        setOpen={setOpenWalletConnectModal}
        connect={true}
        onlyAddress={true}
      />
      <CategorySelectionModal
        open={categoryOpen}
        setOpen={setCategoryOpen}
        addedCategoryObjects={currentUser?.twitter_account?.account_categories}
        addedCategories={
          currentUser?.twitter_account?.account_categories?.map(
            (category) => category.category.id
          ) || []
        }
      />
    </Box>
  );
};

export default ProfileLayout;
