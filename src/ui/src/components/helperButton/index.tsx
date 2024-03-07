import { htmlStringToComponent } from "@/src/utils/helper";
import { Box, Drawer, Tooltip } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Close, InfoOutlined } from "@mui/icons-material";
import useHelperButton from "@/src/hooks/useHelperButton";

// The step prop should have a valid entry in the database corresponding to the route
type Props = {
  step: string;
};

export default function HelperButton({ step }: Props) {
  const [open, setOpen] = useState(false);
  const { getStepData } = useHelperButton();
  const [helperStepData, setHelperStepData] = useState("");

  useEffect(() => {
    const stepData = getStepData(step);
    setHelperStepData(stepData?.html_content);
  }, [open]);

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
        sx={{ ".MuiPaper-root": { maxWidth: "30%" } }}
      >
        <Box sx={{ textAlign: "right", pt: 3, px: 2 }}>
          <Close onClick={() => setOpen(false)} sx={{ cursor: "pointer" }} />
        </Box>

        <Box sx={{ px: 2 }}>{htmlStringToComponent(helperStepData)}</Box>
      </Drawer>
    </Fragment>
  );
}
