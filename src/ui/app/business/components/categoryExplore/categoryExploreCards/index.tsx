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
import { useRouter } from "next/navigation";
import { ExploreFilterInitialValues } from "@/app/business/explore/validation";

type Props = {
  category: CategoriesType;
};

export default function CategoryExploreCards({ category }: Props) {
  const router = useRouter();
  const handleClick = (category: CategoriesType) => {
    localStorage.setItem(
      "filterData",
      JSON.stringify({ ...ExploreFilterInitialValues, categories: [category] })
    );
    router.push("business/explore");
  };

  return (
    <Grid item xs={12} sm={6} md={2.8} lg={2.8} key={category?.name}>
      <Card
        sx={{
          cursor: "pointer",
          borderRadius: "16px",
          boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
          textAlign: "start",
        }}
      >
        <CardMedia sx={{ height: 140 }} image={category?.coverImage} />
        <CardContent
          onClick={() => {
            handleClick(category);
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            fontWeight={"bold"}
            component="div"
          >
            {category?.name}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxHeight: "70px",
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
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
