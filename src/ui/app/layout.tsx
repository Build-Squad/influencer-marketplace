"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { SnackbarProvider } from "notistack";

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
            {children}
          </ThemeRegistry>
        </SnackbarProvider>
      </body>
    </html>
  );
}
