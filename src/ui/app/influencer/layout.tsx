"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getService } from "@/src/services/httpServices";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Restrict access to landing page for logged out user
  const loginStatus = async () => {
    try {
      const { isSuccess } = await getService("account/");
      if (!isSuccess) {
        router.push("/login?role=Influencer");
      }
    } catch (error) {
      router.push("/login?role=Influencer");
    }
  };

  useEffect(() => {
    loginStatus();
  }, []);

  return <div>{children}</div>;
}
