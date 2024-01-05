"use client";

import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import CategorySelectionModal from "@/src/components/categorySelectionModal";
import { notification } from "@/src/components/shared/notification";
import WalletConnectModal from "@/src/components/walletConnectModal";
import { useAppSelector } from "@/src/hooks/useRedux";
import { getService } from "@/src/services/httpServices";
import { DISPLAY_DATE_FORMAT } from "@/src/utils/consts";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import NextLink from "next/link";
import React, { useEffect } from "react";
import Services from "./_services";

const tabs = [
  {
    value: "services",
    label: "Services",
  },
  // {
  //   value: "packages",
  //   label: "Packages",
  // },
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

  const chips = [
    {
      label: "Followers",
      attribute: currentUser?.twitter_account?.followers_count,
    },
    {
      label: "Following",
      attribute: currentUser?.twitter_account?.following_count,
    },
    {
      label: "Tweets",
      attribute: currentUser?.twitter_account?.tweet_count,
    },
  ];

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
              <Grid item xs={12} md={3} sm={12} lg={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    m: 2,
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
                      backgroundColor: "#FFF",
                      zIndex: "1",
                      display: "flex",
                      maxWidth: "100%",
                      flexDirection: "column",
                      mt: "-120px",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "100px",
                        height: "100px",
                        margin: "20px auto",
                      }}
                      src={currentUser?.twitter_account?.profile_image_url}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontSize: "24px",
                          fontWeight: "bold",
                          lineHeight: "29px",
                        }}
                      >
                        {currentUser?.first_name} {currentUser?.last_name}
                      </Typography>
                      {currentUser?.twitter_account?.verified ? (
                        <VerifiedIcon
                          sx={{
                            color: "#1DA1F2",
                            fontSize: "20px",
                            marginLeft: "5px",
                          }}
                        />
                      ) : (
                        <NewReleasesIcon
                          sx={{
                            color: "#f50057",
                            fontSize: "20px",
                            marginLeft: "5px",
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: "16px",
                        lineHeight: "19px",
                        color: "#000",
                        mt: 1,
                      }}
                    >
                      <Link
                        href={`https://x.com/${currentUser?.twitter_account?.user_name}`}
                        target="_blank"
                        component={NextLink}
                        sx={{
                          color: "#000",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        @{currentUser?.twitter_account?.user_name}
                      </Link>
                    </Typography>
                    <Typography
                      sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        textAlign: "center",
                        fontSize: "16px",
                        lineHeight: "19px",
                        color: "#000",
                        mt: 1,
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: "16px", color: "#000", ml: 1 }}
                      />{" "}
                      {currentUser?.twitter_account?.location}
                    </Typography>
                    {currentUser?.twitter_account?.url && (
                      <Typography
                        sx={{
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          textAlign: "center",
                          fontSize: "16px",
                          lineHeight: "19px",
                          color: "#000",
                          mt: 1,
                        }}
                      >
                        <OpenInNewIcon
                          sx={{ fontSize: "16px", color: "#000", ml: 1 }}
                        />{" "}
                        <Link
                          href={currentUser?.twitter_account?.url}
                          target="_blank"
                          component={NextLink}
                          sx={{
                            color: "#000",
                            ml: 1,
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Website
                        </Link>
                      </Typography>
                    )}
                    {/* {params?.id !== loggedInUser?.id && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<TelegramIcon />}
                          sx={{
                            borderRadius: "20px",
                            mx: 2,
                          }}
                          fullWidth
                        >
                          Message
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<BookmarkIcon />}
                          sx={{
                            borderRadius: "20px",
                            mx: 2,
                          }}
                          fullWidth
                        >
                          Save
                        </Button>
                      </Box>
                    )} */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Joined Twitter On</Typography>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {dayjs(
                            currentUser?.twitter_account?.joined_at
                          ).format(DISPLAY_DATE_FORMAT)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            lineHeight: "29px",
                          }}
                        >
                          Joined Xfluencer On
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {dayjs(currentUser?.joined_at).format(
                            DISPLAY_DATE_FORMAT
                          )}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          flexWrap: "wrap",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {chips.map((chip) => (
                          <Chip
                            key={chip.attribute}
                            label={`${chip.attribute ? chip.attribute : 0} ${
                              chip.label
                            }`}
                            sx={{
                              borderRadius: "20px",
                              m: 1,
                            }}
                          />
                        ))}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          Bio
                        </Typography>
                        <Typography>
                          {currentUser?.twitter_account?.description}
                        </Typography>
                      </Box>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            {`Categories (${
                              currentUser?.twitter_account?.account_categories
                                ?.length
                                ? currentUser?.twitter_account
                                    ?.account_categories?.length
                                : 0
                            })`}
                          </Typography>
                          {params?.id === loggedInUser?.id && (
                            <IconButton
                              onClick={() => {
                                setCategoryOpen(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          {currentUser?.twitter_account?.account_categories
                            ?.length === 0 && (
                            <Typography>No Categories Added</Typography>
                          )}
                          {currentUser?.twitter_account?.account_categories?.map(
                            (category) => (
                              <Chip
                                key={category.id}
                                label={category.category.name}
                                sx={{
                                  borderRadius: "20px",
                                  m: 1,
                                }}
                              />
                            )
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {/* Only for the current logged in user */}
                  {params?.id === loggedInUser?.id && (
                    <Box
                      sx={{
                        borderRadius: "16px",
                        boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
                        backgroundColor: "#FFF",
                        zIndex: "1",
                        display: "flex",
                        minWidth: "100%",
                        flexDirection: "column",
                        mt: 4,
                        p: 2,
                        maxWidth: "100%",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "flex-start" }}
                        >
                          <Image
                            src={Star_Coloured}
                            alt={"Coloured Start"}
                            height={30}
                          />
                          <Typography
                            variant="h5"
                            sx={{ ml: 2, fontWeight: "bold" }}
                          >
                            Web3 Wallets
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography variant="body1">
                            {/* Text about connecting wallets */}
                            Connect your wallet to receive payments in crypto
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            sx={{
                              borderRadius: 6,
                            }}
                            onClick={() => {
                              setOpenWalletConnectModal(true);
                            }}
                          >
                            Add Wallet
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          {wallets?.length === 0 ? (
                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  minHeight: "200px",
                                }}
                              >
                                <Image
                                  src={"/wallets.png"}
                                  alt={"Wallet"}
                                  height={100}
                                  width={100}
                                />
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "center" }}
                                >
                                  No Wallets Connected
                                </Typography>
                              </Box>
                            </>
                          ) : (
                            <>
                              <Table
                                sx={{
                                  maxWidth: "100%",
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <Typography
                                        sx={{
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Address
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        sx={{
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Wallet
                                      </Typography>
                                    </TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {wallets?.map((wallet) => (
                                    <TableRow key={wallet.id}>
                                      <TableCell>
                                        <Typography>
                                          {wallet.wallet_address_id.slice(
                                            0,
                                            10
                                          )}
                                          {"..."}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography>
                                          {wallet?.wallet_provider_id?.wallet_provider
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            wallet?.wallet_provider_id?.wallet_provider?.slice(
                                              1
                                            )}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography>
                                          {wallet.is_primary && (
                                            <Chip
                                              label="Primary"
                                              sx={{
                                                borderRadius: "20px",
                                                m: 1,
                                              }}
                                              color="primary"
                                            />
                                          )}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Grid>
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
