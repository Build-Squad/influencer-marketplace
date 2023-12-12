import React from "react";
import { Toolbar, AppBar, Button, Box } from "@mui/material";
import Image from "next/image";

type Props = {
  authTwitterUser: () => {};
  logout: () => {};
  isUserAuthenticated: Boolean;
};

export default function Navbar({
  authTwitterUser,
  logout,
  isUserAuthenticated,
}: Props) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Toolbar
        component="nav"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ width: "33%" }}>
          <Image
            src={"/XFluencer_logo.png"}
            width="150"
            height="20"
            alt="bgimg"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            columnGap: "8px",
            width: "33%",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid black",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "inherit",
                border: "1px solid black",
              },
            }}
          >
            For Influencer
          </Button>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "black",
              color: "white",
              border: "1px solid black",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "black",
                border: "1px solid black",
              },
            }}
          >
            For Business
          </Button>
        </Box>
        <Box sx={{ width: "33%", textAlign: "right" }}>
          {isUserAuthenticated ? (
            <>
              <Button color="inherit" sx={{ fontSize: "12px" }}>
                Why XFluence
              </Button>
              <Button color="inherit" sx={{ fontSize: "12px" }}>
                How it works
              </Button>
              <Button color="inherit" sx={{ fontSize: "12px" }}>
                About
              </Button>
              <Button
                variant="outlined"
                sx={{
                  background:
                    "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "20px",
                  "&:hover": {
                    border: "1px solid black",
                  },
                }}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" sx={{ fontSize: "12px" }}>
                Why XFluence
              </Button>
              <Button color="inherit" sx={{ fontSize: "12px" }}>
                How it works
              </Button>
              <Button color="inherit" sx={{ fontSize: "12px" }}>
                About
              </Button>
              <Button
                variant="outlined"
                sx={{
                  background:
                    "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "20px",
                }}
                onClick={authTwitterUser}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
