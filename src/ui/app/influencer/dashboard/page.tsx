"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// Empty page as we have all the things in layout
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/influencer/dashboard/orders");
  }, []);

  return <></>;
}
