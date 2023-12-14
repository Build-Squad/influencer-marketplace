"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { loginStatusType } from "./utils/types";
import { useSearchParams } from "next/navigation";
import { getServicewithCredentials } from "@/src/services/httpServices";
import {
  LOGIN_STATUS_SUCCESS,
  LOGIN_STATUS_FAILED,
  LOGOUT_SUCCESS,
} from "@/src/utils/consts";
import axios from "axios";
import Navbar from "./components/navbar";

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
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Snackbar only if the user tries to login/signup
  const [loginStatus, setLoginStatus] = useState<loginStatusType>({
    status: "",
    message: "",
  });
  const params = useSearchParams();

  // Check if the cookie is present & login status.
  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    // Authenticate user based on cookie present on the browser
    try {
      const { isSuccess, data, message } = await getServicewithCredentials(
        "account/"
      );
      if (isSuccess) {
        setIsUserAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        setIsUserAuthenticated(false);
        localStorage.clear();
      }
    } catch (e) {
      setIsUserAuthenticated(false);
    }

    // Checking login status after redirecting back from authentication.
    try {
      const status = params.get("authenticationStatus");
      if (status) {
        setLoginStatus({
          status: status,
          message:
            status == "success" ? LOGIN_STATUS_SUCCESS : LOGIN_STATUS_FAILED,
        });
      }
    } catch (e) {
      console.log("Error while checking login status");
    }
  };

  const logout = async () => {
    try {
      // Deleting the cookie from the browser
      await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "logout/", {
        withCredentials: true,
      });
      setIsUserAuthenticated(false);
      setLoginStatus({
        status: "success",
        message: LOGOUT_SUCCESS,
      });
    } catch (e) {
      console.log("Error while logging out: ", e);
    }
  };

  // Redirect the user to twitter authentication URL.
  const authTwitterUser = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "auth-twitter-user/"
      );
      window.location.href = res.data.auth_url;
    } catch (e) {
      window.alert(e);
    }
  };
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
              authTwitterUser={authTwitterUser}
              logout={logout}
              isUserAuthenticated={isUserAuthenticated}
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
          </ThemeRegistry>
        </SnackbarProvider>
      </body>
    </html>
  );
}
