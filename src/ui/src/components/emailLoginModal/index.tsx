"use client";

import React, { useEffect } from "react";
import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import Image from "next/image";
import CustomModal from "../shared/customModal";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { postService } from "@/src/services/httpServices";
import { notification } from "../shared/notification";
import CloseIcon from "@mui/icons-material/Close";

type EmailLoginModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  referralCode?: string;
};

export default function EmailLoginModal({
  open,
  setOpen,
  referralCode,
}: EmailLoginModalProps) {
  const [email, setEmail] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const [step, setStep] = React.useState(1);
  const [secondsLeft, setSecondsLeft] = React.useState(0);

  const requestOTP = async () => {
    if (!email) {
      notification("Please enter email", "error");
      return;
    }
    const { isSuccess, message } = await postService("account/otp/", {
      email,
      referral_code: referralCode,
    });
    if (isSuccess) {
      notification(message);
      setSecondsLeft(60);
      setStep(2);
    } else {
      notification(message, "error");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      notification("Please enter OTP", "error");
      return;
    }
    const { isSuccess, message } = await postService("account/otp/verify/", {
      email,
      otp,
    });
    if (isSuccess) {
      setEmail("");
      setOTP("");
      notification(message);
      setOpen(false);
      setStep(1);
    } else {
      notification(message ? message : "Invalid OTP", "error");
    }
  };

  useEffect(() => {
    let countdownTimer: number;
    if (secondsLeft > 0) {
      countdownTimer = window.setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000); // 1 second
    }
    return () => {
      clearTimeout(countdownTimer);
    };
  }, [secondsLeft]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setEmail("");
      setOTP("");
    }
  }, [open]);

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 0,
        border: "1px solid black",
      }}
      customCloseButton={true}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          sx={{
            display: { xs: "none", md: "block" },
            minHeight: "70vh",
            backgroundImage: "url(/login_image.png)",
            borderRadius: "16px 0px 0px 16px",
          }}
        ></Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              p: 1,
            }}
          >
            <Tooltip title="Close">
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              minHeight: "100%",
              p: 4,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Image src={Star_Coloured} alt={"Coloured Start"} height={30} />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: "bold" }}>
                Login
              </Typography>
            </Box>
            {step === 1 && (
              <>
                <Box sx={{ mt: 4 }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </FormLabel>
                  <TextField
                    type="email"
                    variant="outlined"
                    color="secondary"
                    sx={{
                      ".MuiInputBase-root": {
                        borderRadius: "24px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                      mt: 2,
                    }}
                    placeholder="Enter your Email"
                    size="small"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    sx={{
                      background:
                        "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                      color: "black",
                      border: "1px solid black",
                      borderRadius: "20px",
                      my: 4,
                    }}
                    fullWidth
                    onClick={requestOTP}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
            {step === 2 && (
              <>
                <Box sx={{ mt: 4 }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Enter OTP that you received on:
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "grey",
                        textAlign: "left",
                      }}
                    >
                      {email}
                      <Button
                        sx={{
                          color: "#0089EA",
                          textTransform: "none",
                        }}
                        onClick={() => {
                          setStep(1);
                        }}
                      >
                        Change Email?
                      </Button>
                    </Typography>
                  </FormLabel>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    {[...Array(6)].map((_, index) => (
                      <TextField
                        key={index}
                        id={`otp-input-${index}`}
                        variant="outlined"
                        color="secondary"
                        sx={{
                          ".MuiInputBase-root": {
                            borderRadius: 3,
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#c4c4c4",
                          },
                          width: "40px",
                          height: "50px",
                          "& input": {
                            textAlign: "center",
                            fontSize: "1.5rem",
                          },
                        }}
                        size="small"
                        value={otp[index]}
                        onChange={(e) => {
                          // Correct way to update the OTP
                          const otpArray = otp.split("");
                          otpArray[index] = e.target.value;
                          setOTP(otpArray.join(""));
                          // Also set the focus to the next input box
                          if (e.target.value.length === 1 && index !== 5) {
                            const nextInput = document.getElementById(
                              `otp-input-${index + 1}`
                            );
                            if (nextInput) {
                              nextInput.focus();
                            }
                          } else if (
                            e.target.value.length === 0 &&
                            index !== 0
                          ) {
                            const prevInput = document.getElementById(
                              `otp-input-${index - 1}`
                            );
                            if (prevInput) {
                              prevInput.focus();
                            }
                          } else {
                            const submitButton =
                              document.getElementById("verify-otp");
                            if (submitButton) {
                              submitButton.focus();
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    id="verify-otp"
                    variant="outlined"
                    sx={{
                      background:
                        "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                      color: "black",
                      border: "1px solid black",
                      borderRadius: "20px",
                      my: 4,
                    }}
                    fullWidth
                    onClick={verifyOTP}
                  >
                    Login
                  </Button>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "grey",
                      textAlign: "center",
                    }}
                  >
                    Did not receive OTP?
                    <Button
                      sx={{
                        color: "#0089EA",
                        textTransform: "none",
                      }}
                      onClick={requestOTP}
                      disabled={secondsLeft > 0}
                    >
                      {secondsLeft > 0
                        ? `Resend OTP in ${secondsLeft} seconds`
                        : "Resend OTP"}
                    </Button>
                  </Typography>
                </Box>
              </>
            )}
            <Box
              sx={{
                mt: 4,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "grey",
                  textAlign: "center",
                }}
              >
                By logging in, you agree to our Terms & Conditions and Privacy
                Policy
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </CustomModal>
  );
}
