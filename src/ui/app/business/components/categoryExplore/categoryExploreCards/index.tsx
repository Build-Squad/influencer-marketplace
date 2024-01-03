import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
} from "@mui/material";
import React from "react";
import { CategoriesType } from "../types";
import Arrow from "@/public/svg/Arrow.svg";
import Image from "next/image";

type Props = {
  category: CategoriesType;
};

export default function CategoryExploreCards({ category }: Props) {
  return (
    <Grid item xs={12} sm={6} md={2.8} lg={2.8} key={category?.name}>
      <Card
        sx={{
          cursor: "pointer",
          maxWidth: 345,
          borderRadius: "16px",
          boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
          textAlign: "start",
        }}
      >
        <CardMedia sx={{ height: 140 }} image={category?.coverImage} />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            fontWeight={"bold"}
            component="div"
          >
            {category?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {category?.description}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Image
              src={Arrow}
              height={14}
              width={36}
              alt=""
              style={{ marginLeft: "8px" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}