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

type Props = {};

const REFERAL_GUIDE = [
  "Share your unique referral link to an influential individual in the Xfluencer community.",
  "Your referral joins Xfluencer and establishes their services on the platform.",
  "Upon the successful sale of their first service to a business, you earn a 1% commission from the platform fee levied on the purchasing business.",
  "Additionally, your referral receives a 0.5% share of the transaction fees for their initial five orders as an Xfluencer, in addition to their listed service price.",
];

export default function Referrals({}: Props) {
  const [referralLink, setReferralLink] = React.useState<string>("");

  React.useEffect(() => {
    getUserReferralLink();
  }, []);

  const getUserReferralLink = async () => {
    const { isSuccess, message, data } = await getService(
      `/referrals/referral-link/`
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
              0
            </Typography>
            <Typography>Total Referrals</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Typography variant="h4" fontWeight={"bold"}>
              0 Tokens
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
