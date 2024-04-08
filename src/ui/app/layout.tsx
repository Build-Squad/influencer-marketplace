"use client";

import WalletContextProvider from "@/src/components/shared/walletContextProvider";
import { AppStore, makeStore } from "@/src/store";
import { Inter } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { useRef } from "react";
import { Provider } from "react-redux";
import ThemeRegistry from "./ThemeRegistry";
import Navbar from "./components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <html lang="en">
      <head>
        <title>Xfluencer Beta</title>
      </head>
      <body className={inter.className}>
        <Provider store={storeRef.current}>
          <SnackbarProvider
            maxSnack={5}
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            preventDuplicate
          >
            <ThemeRegistry options={{ key: "mui-theme" }}>
              <WalletContextProvider>
                <Navbar />
                {children}
              </WalletContextProvider>
            </ThemeRegistry>
          </SnackbarProvider>
        </Provider>
      </body>
    </html>
  );
}
