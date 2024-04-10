"use client";

import WalletContextProvider from "@/src/components/shared/walletContextProvider";
import { AppStore, makeStore } from "@/src/store";
import { Inter } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import persistStore from "redux-persist/es/persistStore";
import { Persistor } from "redux-persist/es/types";
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
  const persistorRef = useRef<Persistor>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  if (!persistorRef.current) {
    // Create the persistor instance the first time this renders
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <html lang="en">
      <head>
        <title>Xfluencer Beta</title>
      </head>
      <body className={inter.className}>
        <SnackbarProvider
          maxSnack={5}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistorRef.current}>
              <ThemeRegistry options={{ key: "mui-theme" }}>
                <WalletContextProvider>
                  <Navbar />
                  {children}
                </WalletContextProvider>
              </ThemeRegistry>
            </PersistGate>
          </Provider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
