"use client";

import CategorySelectionModal from "@/src/components/categorySelectionModal";
import EmailLoginModal from "@/src/components/emailLoginModal";
import SnackbarComp from "@/src/components/shared/snackBarComp";
import WalletContextProvider from "@/src/components/shared/walletContextProvider";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { AppStore, makeStore } from "@/src/store";
import { Inter } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { useRef, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import ThemeRegistry from "./ThemeRegistry";
import Navbar from "./components/navbar";
import "./globals.css";
import { loginStatusType } from "./utils/types";

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
  const persistor = persistStore(storeRef.current);
  const params = useSearchParams();
  // Snackbar only if the user tries to login/signup
  const [loginStatus, setLoginStatus] = useState<loginStatusType>({
    status: "",
    message: "",
  });

  const [emailOpen, setEmailOpen] = useState<boolean>(false);
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
  const [walletOpen, setWalletOpen] = useState<boolean>(false);

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
            horizontal: "right",
          }}
          preventDuplicate
        >
          <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeRegistry options={{ key: "mui-theme" }}>
                <WalletContextProvider>
                  <Navbar
                    setEmailOpen={setEmailOpen}
                    setCategoryOpen={setCategoryOpen}
                    setWalletOpen={setWalletOpen}
                    setLoginStatus={setLoginStatus}
                    emailOpen={emailOpen}
                    walletOpen={walletOpen}
                    categoryOpen={categoryOpen}
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
                  <WalletConnectModal
                    open={walletOpen}
                    setOpen={setWalletOpen}
                  />
                </WalletContextProvider>
              </ThemeRegistry>
            </PersistGate>
          </Provider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
