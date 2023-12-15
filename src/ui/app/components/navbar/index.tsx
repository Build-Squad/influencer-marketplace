import React from "react";
import { Toolbar, AppBar, Button, Box } from "@mui/material";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppBar position="static" sx={{ boxShadow: "none" }}>
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
            variant={pathname.includes("influencer") ? "contained" : "outlined"}
            color="secondary"
            sx={{
              borderRadius: "20px",
            }}
            onClick={() => {
              router.push("/influencer");
            }}
          >
            For Influencer
          </Button>
          <Button
            variant={pathname.includes("business") ? "contained" : "outlined"}
            color="secondary"
            sx={{
              borderRadius: "20px",
            }}
            onClick={() => {
              router.push("/business");
            }}
          >
            For Business
          </Button>
        </Box>
        <Box sx={{ width: "33%", textAlign: "right" }}>
          <Button color="inherit" sx={{ fontSize: "16px" }}>
            Why XFluence
          </Button>
          <Button color="inherit" sx={{ fontSize: "16px" }}>
            How it works
          </Button>
          <Button color="inherit" sx={{ fontSize: "16px" }}>
            About
          </Button>
          {isUserAuthenticated ? (
            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
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
          ) : (
            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                color: "black",
                border: "1px solid black",
                borderRadius: "20px",
              }}
              onClick={authTwitterUser}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
