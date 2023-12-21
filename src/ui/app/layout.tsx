"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { loginStatusType } from "./utils/types";
import { useSearchParams } from "next/navigation";
import Navbar from "./components/navbar";
import SnackbarComp from "@/src/components/shared/snackBarComp";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { LOGIN_STATUS_FAILED, LOGIN_STATUS_SUCCESS } from "@/src/utils/consts";
import EmailLoginModal from "@/src/components/emailLoginModal";
import CategorySelectionModal from "@/src/components/categorySelectionModal";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Influencer Marketplace",
  description: "Influencer Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useSearchParams();
  // Snackbar only if the user tries to login/signup
  const [loginStatus, setLoginStatus] = useState<loginStatusType>({
    status: "",
    message: "",
  });

  const [emailOpen, setEmailOpen] = useState<boolean>(false);
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);

  // Twitter authentication hook
  const {
    isTwitterUserLoggedIn,
    startTwitterAuthentication,
    logoutTwitterUser,
    checkTwitterUserAuthentication,
  } = useTwitterAuth();

  useEffect(() => {
    const status = params.get("authenticationStatus");
    if (status) {
      setLoginStatus({
        status,
        message:
          status == "success" ? LOGIN_STATUS_SUCCESS : LOGIN_STATUS_FAILED,
      });
      setCategoryOpen(true);
    }
  }, [isTwitterUserLoggedIn]);

  useEffect(() => {
    if (!emailOpen) {
      checkTwitterUserAuthentication();
    }
  }, [emailOpen]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarProvider
          maxSnack={5}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          preventDuplicate
        >
          <ThemeRegistry options={{ key: "mui-theme" }}>
            <Navbar
              authUser={startTwitterAuthentication}
              logout={logoutTwitterUser}
              loginStatus={isTwitterUserLoggedIn}
              setEmailOpen={setEmailOpen}
            />
            {children}
            {loginStatus.status ? (
              <SnackbarComp
                variant={loginStatus.status}
                message={<>{loginStatus.message}</>}
                updateParentState={() => {
                  setLoginStatus({
                    status: "",
                    message: "",
                  });
                }}
              />
            ) : null}
            <EmailLoginModal open={emailOpen} setOpen={setEmailOpen} />
            <CategorySelectionModal
              open={categoryOpen}
              setOpen={setCategoryOpen}
            />
          </ThemeRegistry>
        </SnackbarProvider>
      </body>
    </html>
  );
}
