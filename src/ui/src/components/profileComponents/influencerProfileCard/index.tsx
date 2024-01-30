import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import { DISPLAY_DATE_FORMAT } from "@/src/utils/consts";
import EditIcon from "@mui/icons-material/Edit";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Select,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import WalletActionMenu from "../walletActionMenu";

type InfluencerProfileCardProps = {
  currentUser: UserType | null;
  paramsId: string;
  loggedInUser: UserType | null;
  regions: RegionType[];
  userRegion: RegionType | undefined;
  handleRegionSelect: (e: any) => Promise<void>;
  setCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenWalletConnectModal: React.Dispatch<React.SetStateAction<boolean>>;
  wallets: WalletType[];
  getWallets: () => Promise<void>;
};

export default function InfluencerProfileCard({
  currentUser,
  paramsId,
  loggedInUser,
  regions,
  userRegion,
  handleRegionSelect,
  setCategoryOpen,
  setOpenWalletConnectModal,
  wallets,
  getWallets,
}: InfluencerProfileCardProps) {
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

  return (
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
                {dayjs(currentUser?.twitter_account?.joined_at).format(
                  DISPLAY_DATE_FORMAT
                )}
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
                {dayjs(currentUser?.joined_at).format(DISPLAY_DATE_FORMAT)}
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
                  label={`${chip.attribute ? chip.attribute : 0} ${chip.label}`}
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
                {currentUser?.twitter_account?.description
                  ? currentUser?.twitter_account?.description
                  : "No Bio Added"}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                Region
              </Typography>
              {paramsId === loggedInUser?.id ? (
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
                    {regions.length === 0 && (
                      <MenuItem value="">
                        <em>No regions found</em>
                      </MenuItem>
                    )}
                    {regions.map((item: RegionType) => {
                      return (
                        <MenuItem value={item?.regionName}>
                          <em>{item?.regionName}</em>
                        </MenuItem>
                      );
                    })}
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
                    currentUser?.twitter_account?.account_categories?.length
                      ? currentUser?.twitter_account?.account_categories?.length
                      : 0
                  })`}
                </Typography>
                {paramsId === loggedInUser?.id && (
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
                {currentUser?.twitter_account?.account_categories?.length ===
                  0 && <Typography>No Categories Added</Typography>}
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
        {paramsId === loggedInUser?.id && (
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
                <Image src={Star_Coloured} alt={"Coloured Start"} height={30} />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: "bold" }}>
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
                  Connect Wallet
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
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        No Wallets Connected
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Table>
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
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              Action
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {wallets?.map((wallet) => (
                          <TableRow
                            key={wallet.id}
                            sx={{
                              backgroundColor: wallet.is_primary
                                ? "#D1EFF2"
                                : "",
                            }}
                          >
                            <TableCell>
                              <Typography>
                                {wallet.wallet_address_id}
                              </Typography>
                              {wallet.is_primary && (
                                <Chip
                                  sx={{
                                    backgroundColor: "#9AE3E9",
                                    color: "#000",
                                  }}
                                  label="Primary"
                                  size="small"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography>
                                {wallet?.wallet_provider_id
                                  ? `${
                                      wallet?.wallet_provider_id?.wallet_provider
                                        ?.charAt(0)
                                        .toUpperCase() +
                                      wallet?.wallet_provider_id?.wallet_provider?.slice(
                                        1
                                      )
                                    }`
                                  : "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <WalletActionMenu userWallet={wallet} getWallets={getWallets} />
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
  );
}
