import { Box, Button, Typography, LinearProgress } from "@mui/material";
import React from "react";

type Props = {};

export default function RightComponent({}: Props) {
  return (
    <Box
      sx={{
        padding: "16px 40px 16px 16px",
        height: "100%",
        border: "1px solid #D3D3D3",
        borderTop: "none",
      }}
    >
      <Button
        fullWidth
        variant={"contained"}
        color="secondary"
        sx={{
          borderRadius: "20px",
          fontWeight: "bold",
        }}
      >
        See Profile Preview
      </Button>

      <Box
        sx={{
          mt: 2,
          padding: "20px 16px 16px 16px",
          border: "1px solid #D3D3D3",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1">Information Added</Typography>
          <Typography variant="h4" fontWeight={"bold"}>
            18/20
          </Typography>
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={20}
              color="secondary"
            />
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Missing Details-</Typography>
          <ul style={{ color: "#626262" }}>
            <li>Lorem ipsum dolor sit amet</li>
            <li style={{ marginTop: "12px" }}>
              Consectetur eget ut ut commodo
            </li>
            <li style={{ marginTop: "12px" }}>nibh accumsan vestibulum sed</li>
            <li style={{ marginTop: "12px" }}>
              Volutpat nisi nisl sed odio lorem
            </li>
            <li style={{ marginTop: "12px" }}>Habitasse sapien vitae</li>
            <li style={{ marginTop: "12px" }}>nibh accumsan vestibulum sed</li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
}
