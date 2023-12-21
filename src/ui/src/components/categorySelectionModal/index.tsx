"use client";

import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import { getService } from "@/src/services/httpServices";
import {
  Box,
  Button,
  Chip,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import CustomModal from "../shared/customModal";
import { notification } from "../shared/notification";

type CategorySelectionModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const steps = ["Add Categories", "Connect Wallet"];

export default function CategorySelectionModal({
  open,
  setOpen,
}: CategorySelectionModalProps) {
  const [search, setSearch] = React.useState<string>("");
  const [categoryMasters, setCategoryMasters] = React.useState<
    CategoryMasterType[]
  >([]);
  const [selectedCategories, setSelectedCategories] = React.useState<
    CategoryMasterType[]
  >([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const getCategoryMasters = async () => {
    const { isSuccess, data, message } = await getService(
      "/account/category-master/",
      {
        page_size: 100,
        page_number: 1,
      }
    );
    if (isSuccess) {
      setCategoryMasters(data?.data);
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  const onSubmit = () => {
    setOpen(false);
  };

  useEffect(() => {
    getCategoryMasters();
  }, []);

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 2,
        border: "1px solid black",
        minHeight: "40vh",
      }}
    >
      <Grid container sx={{ p: 2 }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Image src={Star_Coloured} alt={"Coloured Start"} height={30} />
            <Typography variant="h5" sx={{ ml: 2, fontWeight: "bold" }}>
              {"Let's set up your Account"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <FormLabel
            sx={{
              fontWeight: "bold",
              my: 2,
            }}
          >
            I create content about...
          </FormLabel>
          <TextField
            fullWidth
            placeholder="Search category"
            variant="outlined"
            size="small"
            sx={{
              my: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {categoryMasters.map((categoryMaster) => {
            return (
              <>
                {categoryMaster?.name?.includes(search) && (
                  <Chip
                    key={categoryMaster.id}
                    label={categoryMaster.name}
                    sx={{ m: 1 }}
                    color="secondary"
                    variant={
                      selectedCategories.includes(categoryMaster)
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() => {
                      if (selectedCategories.includes(categoryMaster)) {
                        setSelectedCategories(
                          selectedCategories.filter(
                            (category) => category.id !== categoryMaster.id
                          )
                        );
                      } else {
                        setSelectedCategories([
                          ...selectedCategories,
                          categoryMaster,
                        ]);
                      }
                    }}
                  />
                )}
              </>
            );
          })}
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ borderRadius: 8 }}
            disabled={selectedCategories.length === 0}
            onClick={onSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </CustomModal>
  );
}
