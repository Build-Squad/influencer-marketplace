import { notification } from "@/src/components/shared/notification";
import { getService } from "@/src/services/httpServices";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { CopyAll, PersonAdd } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import { DISPLAY_DATE_FORMAT } from "@/src/utils/consts";
import NoData from "@/public/no_data.jpg";
import Image from "next/image";

type Props = {};

const REFERAL_GUIDE = [
  "Share your unique referral link to an influential individual in the Xfluencer community.",
  "Your referral joins Xfluencer, they will receive rewards, and so will you.",
  "The rewards will be based on the number of followers the new user has in the following manner - ",
];

export default function Referrals({}: Props) {
  const [referralLink, setReferralLink] = React.useState<string>("");
  const [userReferrals, setUserReferrals] =
    React.useState<UserReferralsType[]>();

  React.useEffect(() => {
    getUserReferralLink();
    getUserReferrals();
  }, []);

  const getUserReferrals = async () => {
    const { isSuccess, message, data } = await getService(
      `/reward/user-referrals/`,
      {
        page_size: 15,
        page_number: 1,
      }
    );
    if (isSuccess) {
      setUserReferrals(data?.data);
    } else {
      notification(
        message ? message : "Error fetching user referrals",
        "error"
      );
    }
  };

  const getUserReferralLink = async () => {
    const { isSuccess, message, data } = await getService(
      `/reward/referral-link/`
    );
    if (isSuccess) {
      setReferralLink(data?.data?.referralLink);
    } else {
      notification(
        message ? message : "Error fetching user referral link",
        "error"
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        notification("Copied to clipboard!");
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const getTotalEarnings = () => {
    if (userReferrals) {
      return userReferrals.reduce((acc, curr) => {
        return acc + curr?.referred_by_reward_point?.points;
      }, 0);
    } else return 0;
  };

  return (
    <Grid
      container
      spacing={1}
      columnSpacing={{ xs: 3, sm: 3, md: 3, lg: 3 }}
      justifyContent={"space-between"}
    >
      {/* Middle Container */}
      <Grid item xs={12} sm={12} md={7.5} lg={7.5}>
        <Grid
          container
          sx={{
            p: 3,
            boxShadow: "0px 4px 31px 0px #00000014",
            borderRadius: "24px",
          }}
        >
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Typography variant="h4" fontWeight={"bold"}>
              {userReferrals ? userReferrals.length : 0}
            </Typography>
            <Typography>Total Referrals</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Typography variant="h4" fontWeight={"bold"}>
              {getTotalEarnings()} Tokens
            </Typography>
            <Typography>Total Earnings</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={"bold"} sx={{ mt: 2 }}>
              Share your referral link
            </Typography>
            <Box
              sx={{
                mt: 2,
                py: 1,
                px: 3,
                backgroundColor: "#A2E5EB66",
                borderRadius: "24px",
                width: "100%",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {referralLink}
                <IconButton onClick={copyToClipboard}>
                  <CopyAll fontSize="small" />
                </IconButton>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* Section for influencer's you've (current user) referred */}
        <Grid
          container
          sx={{
            mt: 3,
            p: 3,
            boxShadow: "0px 4px 31px 0px #00000014",
            borderRadius: "24px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            My Referrals
          </Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Influencer</TableCell>
                  <TableCell>Date of Joining</TableCell>
                  <TableCell>Rewards Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!userReferrals?.length ? (
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell colSpan={3}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={NoData}
                          alt="no referrals"
                          style={{ height: "60%", maxWidth: "60%" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: "italic" }}
                        >
                          No referral points. Start referring influencers to
                          earn points.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  userReferrals.map((referral) => {
                    return (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          @{referral?.user_account?.username}
                        </TableCell>
                        <TableCell>
                          {dayjs(referral?.user_account?.date_joined).format(
                            DISPLAY_DATE_FORMAT
                          )}
                        </TableCell>

                        <TableCell>
                          {referral?.referred_by_reward_point?.points}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Right Side Container */}
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            sx={{
              p: 3,
              boxShadow: "0px 4px 31px 0px #00000014",
              borderRadius: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PersonAdd fontSize="large" />
              <Typography variant="h6" fontWeight={"bold"}>
                How to Refer Influencers ?
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 2,
                py: 3,
                pl: 2,
                pr: 1,
                border: "1px solid black",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                rowGap: "36px",
              }}
            >
              {REFERAL_GUIDE.map((step, ind) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      columnGap: "8px",
                      justifyContent: "flex-start",
                      alignItems: "start",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        borderRadius: "100%",
                        px: 1,
                        mt:0.5,
                        color: "white",
                        backgroundColor: "black",
                        height: "fit-content",
                        fontSize: "14px",
                      }}
                    >
                      {ind + 1}
                    </Box>
                    <Typography>{step}</Typography>
                  </Box>
                );
              })}
              <ul style={{ marginTop: "0px" }}>
                <li>Upto 100 followers - 100 points</li>
                <li>1000 followers - 200 points</li>
                <li>10000 followers - 500 points</li>
                <li>100000 followers - 1000 points</li>
                <li>More than 1000000 followers - 10000 points</li>
              </ul>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    pt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid black",
                  }}
                >
                  {referralLink}
                  <IconButton onClick={copyToClipboard}>
                    <CopyAll fontSize="small" />
                  </IconButton>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
