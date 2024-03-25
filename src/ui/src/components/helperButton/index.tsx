"use client";
import { htmlStringToComponent } from "@/src/utils/helper";
import { Box, Drawer, Tooltip, Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Close, InfoOutlined } from "@mui/icons-material";
import NotFound from "@/public/svg/not_found.svg";
import Image from "next/image";
import { postService } from "@/src/services/httpServices";
import { usePathname } from "next/navigation";

// The step prop should have a valid entry in the database corresponding to the route
type Props = {
  step: string;
  isDynamic?: boolean;
  route?: string;
};

export default function HelperButton({ step, isDynamic, route }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [helperStepData, setHelperStepData] = useState<any>();
  const [helperData, setHelperData] = React.useState<any>();

  React.useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const stepData = getStepData(step);
    setHelperStepData(htmlStringToComponent(stepData?.html_content));
  }, [open]);

  const getStepData = (stepName: string) => {
    return helperData?.find((item: any) => {
      return item.step == stepName;
    });
  };

  const fetchData = async () => {
    // If the route is dynamic, we need to pass in a custom route that BE will handle
    const route_name = isDynamic ? route : pathname;
    const { isSuccess, data } = await postService(`core/how-it-works-steps/`, {
      route: route_name,
    });
    if (isSuccess) {
      setHelperData(data?.data);
    }
  };

  return (
    <Fragment>
      <Tooltip title="Click here to know more!!!">
        <InfoOutlined
          onClick={() => setOpen(true)}
          sx={{ cursor: "pointer", fontSize: "16px" }}
        />
      </Tooltip>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor={"right"}
        sx={{ ".MuiPaper-root": { width: "30%" } }}
      >
        <Box sx={{ textAlign: "right", pt: 3, px: 2 }}>
          <Close onClick={() => setOpen(false)} sx={{ cursor: "pointer" }} />
        </Box>

        <Box sx={{ px: 2, height: "100%" }}>
          {helperStepData ?? (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ width: "100%", mt: 4, height: "80%" }}
              flexDirection={"column"}
            >
              <Image
                src={NotFound}
                alt="Error fetching data"
                style={{ height: "auto", width: "80%", minWidth: "200px" }}
              />
              <Typography sx={{ fontStyle: "italic" }}>
                Error fetching data, please try again later...
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </Fragment>
  );
}
