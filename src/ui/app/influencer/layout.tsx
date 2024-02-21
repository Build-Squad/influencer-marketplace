"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey } = useWallet();
  useEffect(() => {
    console.log("Influencer publicKey", publicKey);
  }, [publicKey]);

  return <div>{children}</div>;
}
