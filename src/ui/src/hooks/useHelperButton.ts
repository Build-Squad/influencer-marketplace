"use client";
import { usePathname } from "next/navigation";
import { postService } from "../services/httpServices";
import React from "react";

// The hook fetches the particular route helperData and return the data to the helperButton Component.
// The helper button component then opens the drawer onto the screen with the selected step.

export default function useHelperButton() {
  const pathname = usePathname();
  const [helperData, setHelperData] = React.useState<any>();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { isSuccess, data } = await postService(`core/how-it-works-steps/`, {
      route: pathname,
    });
    if (isSuccess) {
      setHelperData(data?.data);
    }
  };

  const getStepData = (stepName: string) => {
    return helperData?.find((item: any) => {
      return item.step == stepName;
    });
  };

  return { getStepData };
}
