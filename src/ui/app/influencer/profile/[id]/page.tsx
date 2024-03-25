"use client";

import BackIcon from "@/public/svg/Back.svg";
import CategorySelectionModal from "@/src/components/categorySelectionModal";
import EmailVerifyModal from "@/src/components/profileComponents/emailVerifyModal";
import WalletsTable from "@/src/components/profileComponents/walletsTable";
import { notification } from "@/src/components/shared/notification";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { useAppSelector } from "@/src/hooks/useRedux";
import {
  deleteService,
  getService,
  postService,
  putService,
} from "@/src/services/httpServices";
import {
  DISPLAY_DATE_FORMAT,
  EMAIL_PRIVACY_TEXT,
  ROLE_NAME,
  TWITTER_PROMOTION_TEXT,
  XFLUENCER_PROMOTION_TEXT,
} from "@/src/utils/consts";
import { stringToColor } from "@/src/utils/helper";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import Services from "./_services";
import BookmarkIcon from "@mui/icons-material/Bookmark";

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

const debounce = (fn: Function, ms = 500) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const ProfileLayout = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const [twitterPromotionText, setTwitterPromotionText] = React.useState(
    XFLUENCER_PROMOTION_TEXT
  );
  const router = useRouter();
  const loggedInUser = useAppSelector((state) => state.user?.user);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  const [categoryOpen, setCategoryOpen] = React.useState<boolean>(false);
  const [openWalletConnectModal, setOpenWalletConnectModal] =
    React.useState<boolean>(false);
  const [wallets, setWallets] = React.useState<WalletType[]>([]);
  const [regions, setRegions] = React.useState<RegionType[]>([]);
  const [userRegion, setUserRegion] = React.useState<RegionType>();
  const [editibleBio, setEditibleBio] = React.useState<string>("");
  const [emailOpen, setEmailOpen] = React.useState<boolean>(false);
  const [promotionLoading, setPromotionLoading] =
    React.useState<boolean>(false);

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
    if (!emailOpen) {
      getUserDetails();
    }
  }, [emailOpen]);

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
    if (currentUser?.region) {
      const regionOfUser = regions.find(
        (item) => item.id === currentUser?.region?.region
      );
      setUserRegion(regionOfUser);
    }
    if (currentUser?.twitter_account?.description) {
      setEditibleBio(currentUser?.twitter_account?.description);
    }
  }, [currentUser]);

  const getUserDetails = async () => {
    const { isSuccess, message, data } = await getService(
      `/account/user/${params.id}/`
    );
    if (isSuccess) {
      setCurrentUser(data?.data);
      // TODO: Add the referral link to the twitterPromotionText and set it to the state
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
      label: "Posts",
      attribute: currentUser?.twitter_account?.tweet_count,
    },
  ];

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

  const handleChange = async (e: any) => {
    try {
      const { isSuccess, message } = await putService(
        `/account/user/${params?.id}/`,
        {
          twitter_account: {
            description: e.target.value,
          },
        }
      );
      if (isSuccess) {
        notification(message);
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeBookmark = async (id: string) => {
    const { isSuccess, message } = await deleteService(
      `/account/bookmarks/${id}/`
    );
    if (isSuccess) {
      notification("Bookmark removed successfully", "success");
      getUserDetails();
    } else {
      notification(message, "error");
    }
  };

  const addBookmark = async (id: string) => {
    const { isSuccess, message } = await postService(`/account/bookmarks/`, {
      target_user: id,
    });
    if (isSuccess) {
      notification("Bookmark added successfully", "success");
      getUserDetails();
    } else {
      notification(message, "error");
    }
  };

  const handleBookmark = () => {
    if (
      currentUser?.twitter_account?.is_bookmarked !== null &&
      currentUser?.twitter_account?.is_bookmarked !== undefined
    ) {
      if (currentUser?.twitter_account?.is_bookmarked) {
        removeBookmark(currentUser?.id);
      } else {
        addBookmark(currentUser?.id);
      }
    }
  };

  const promoteOnTwitter = async () => {
    try {
      setPromotionLoading(true);
      const { isSuccess, data, message } = await postService(
        `/account/promote-xfluencer/`,
        {
          text: twitterPromotionText,
        }
      );
      if (isSuccess) {
        notification(message);
        setCurrentUser(data?.data);
      } else {
        notification(message, "error");
      }
    } finally {
      setPromotionLoading(false);
    }
  };

  const debouncedHandleChange = debounce(handleChange, 1000);

  const updatedHandleChange = useCallback((e: any) => {
    setEditibleBio(e.target.value);
    debouncedHandleChange(e);
  }, []);

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
                      minWidth: "100%",
                      flexDirection: "column",
                      mt: "-120px",
                    }}
                  >
                    {currentUser?.twitter_account?.profile_image_url &&
                    !currentUser?.twitter_account?.profile_image_url.includes(
                      "default"
                    ) ? (
                      <>
                        <Avatar
                          sx={{
                            width: "100px",
                            height: "100px",
                            cursor: "pointer",
                            margin: "20px auto",
                          }}
                          src={currentUser?.twitter_account?.profile_image_url}
                        />
                      </>
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: stringToColor(
                            currentUser?.username ? currentUser?.username : ""
                          ),
                          width: "100px",
                          height: "100px",
                          cursor: "pointer",
                          margin: "20px auto",
                          fontSize: "50px",
                        }}
                      >
                        {currentUser?.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    )}

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

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontSize: "16px",
                          lineHeight: "19px",
                          color: "#000",
                        }}
                      >
                        <Link
                          href={`https://x.com/${currentUser?.twitter_account?.user_name}`}
                          target="_blank"
                          component={NextLink}
                          sx={{
                            color: "#676767",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          @{currentUser?.twitter_account?.user_name}
                        </Link>
                      </Typography>
                      {Number(currentUser?.twitter_account?.rating) > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle1">
                            &nbsp;
                            {`| ${currentUser?.twitter_account?.rating?.toFixed(
                              1
                            )}`}
                          </Typography>
                          <StarIcon
                            sx={{ color: "#FFC107", fontSize: "18px" }}
                          />
                        </Box>
                      )}
                      {currentUser?.twitter_account?.is_bookmarked !== null &&
                        currentUser?.twitter_account?.is_bookmarked !==
                          undefined &&
                        loggedInUser?.role?.name ===
                          ROLE_NAME.BUSINESS_OWNER && (
                          <Tooltip
                            title={
                              currentUser?.twitter_account?.is_bookmarked
                                ? "Remove Bookmark"
                                : "Add Bookmark"
                            }
                          >
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                e.isDefaultPrevented();
                                e.preventDefault();
                                handleBookmark();
                              }}
                            >
                              <BookmarkIcon
                                color={
                                  currentUser?.twitter_account?.is_bookmarked
                                    ? "primary"
                                    : "disabled"
                                }
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                    </Box>
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
                        <Typography>Joined X On</Typography>
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
                        {currentUser?.id === loggedInUser?.id ? (
                          <TextField
                            size="small"
                            fullWidth
                            multiline
                            rows={4}
                            color="secondary"
                            value={editibleBio}
                            onChange={updatedHandleChange}
                            sx={{
                              ".MuiOutlinedInput-notchedOutline": {
                                border: "1px solid black",
                                borderRadius: "24px",
                              },
                            }}
                            InputProps={{
                              inputProps: {
                                maxLength: 160,
                              },
                            }}
                            helperText={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {editibleBio ? editibleBio.length : 0} / 160
                              </Box>
                            }
                          />
                        ) : (
                          <Typography>
                            {currentUser?.twitter_account?.description
                              ? currentUser?.twitter_account?.description
                              : "No Bio Added"}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {currentUser?.id === loggedInUser?.id && (
                          <>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              Email ID
                            </Typography>
                            {currentUser?.email &&
                            currentUser?.email_verified_at ? (
                              <Typography>{currentUser?.email}</Typography>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  sx={{
                                    my: 1,
                                    background:
                                      "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                                    color: "black",
                                    border: "1px solid black",
                                    borderRadius: "20px",
                                  }}
                                  onClick={() => {
                                    setEmailOpen(true);
                                  }}
                                  fullWidth
                                >
                                  Add Email
                                </Button>
                              </Box>
                            )}
                            <Typography
                              sx={{
                                fontStyle: "italic",
                                fontSize: "12px",
                              }}
                            >
                              {EMAIL_PRIVACY_TEXT}
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          Region
                        </Typography>
                        {params?.id === loggedInUser?.id ? (
                          <>
                            <Select
                              key={userRegion?.id}
                              size="small"
                              fullWidth
                              value={userRegion?.regionName}
                              onChange={handleRegionSelect}
                              sx={{
                                ".MuiOutlinedInput-notchedOutline": {
                                  border: "1px solid black",
                                  borderRadius: "24px",
                                },
                              }}
                            >
                              {regions.map(
                                (item: RegionType, index: number) => {
                                  return (
                                    <MenuItem
                                      value={item?.regionName}
                                      key={index}
                                    >
                                      <em>{item?.regionName}</em>
                                    </MenuItem>
                                  );
                                }
                              )}
                            </Select>
                          </>
                        ) : (
                          <Typography>
                            {userRegion?.regionName ?? "No region added"}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            mt: 1,
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
                        {currentUser?.id === loggedInUser?.id && (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                my: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                }}
                              >
                                Share About Xfluencer
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {currentUser?.promoted_tweet_id ? (
                                <Link
                                  href={`https://x.com/${currentUser?.twitter_account?.user_name}/status/${currentUser?.promoted_tweet_id}`}
                                  target="_blank"
                                  component={NextLink}
                                  sx={{
                                    width: "100%",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                      background:
                                        "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                                      color: "black",
                                      border: "1px solid black",
                                      borderRadius: "20px",
                                    }}
                                    fullWidth
                                  >
                                    View Post On X
                                  </Button>
                                </Link>
                              ) : (
                                <>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    multiline
                                    color="secondary"
                                    sx={{
                                      ".MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid black",
                                        borderRadius: "24px",
                                      },
                                    }}
                                    disabled
                                    value={twitterPromotionText}
                                  />
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                      my: 2,
                                      background:
                                        "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                                      color: "black",
                                      border: "1px solid black",
                                      borderRadius: "20px",
                                    }}
                                    fullWidth
                                    onClick={promoteOnTwitter}
                                    disabled={promotionLoading}
                                  >
                                    {promotionLoading ? (
                                      <CircularProgress
                                        size={24}
                                        color="secondary"
                                      />
                                    ) : (
                                      "Post On X"
                                    )}
                                  </Button>
                                  <Typography
                                    sx={{
                                      fontStyle: "italic",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {TWITTER_PROMOTION_TEXT}
                                  </Typography>
                                </>
                              )}
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  {/* Only for the current logged in user */}
                  {params?.id === loggedInUser?.id && (
                    <WalletsTable
                      wallets={wallets}
                      setOpenWalletConnectModal={setOpenWalletConnectModal}
                      getWallets={getWallets}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={9} sm={12} lg={9}>
                {!(loggedInUser?.role.name == "influencer") ? (
                  <Image
                    src={BackIcon}
                    alt={"BackIcon"}
                    height={30}
                    style={{
                      marginTop: "16px",
                      marginLeft: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      router.back();
                    }}
                  />
                ) : null}

                <Box
                  sx={{
                    m: 2,
                    display: "flex",
                    columnGap: "4px",
                    alignItems: "flex-top",
                  }}
                >
                  {tabs.map((item) => (
                    <Typography variant="h4" key={item.value}>
                      {item.label}
                    </Typography>
                  ))}
                  {/* For dynamic routes pass props like this (In correspondence with Backend) */}
                  {/* <HelperButton
                    step={"services"}
                    isDynamic={true}
                    route={"/influencer/profile/[]"}
                  /> */}
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
      <EmailVerifyModal open={emailOpen} setOpen={setEmailOpen} />
    </Box>
  );
};

export default ProfileLayout;
