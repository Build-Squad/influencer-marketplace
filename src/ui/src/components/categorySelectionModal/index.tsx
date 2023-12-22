"use client";

import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import {
  bulkDeleteService,
  getService,
  postService,
} from "@/src/services/httpServices";
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
  addedCategories?: string[];
  addedCategoryObjects?: AccountCategoryType[];
};

type AccountCategoryExtendedType = CategoryMasterType & {
  added_already: boolean;
  selected: boolean;
  account_category_id?: string | null;
  addedCategoryObjects?: AccountCategoryType[];
};

export default function CategorySelectionModal({
  open,
  setOpen,
  addedCategories,
  addedCategoryObjects,
}: CategorySelectionModalProps) {
  const [search, setSearch] = React.useState<string>("");
  const [allCategoryMasters, setAllCategoryMasters] = React.useState<
    AccountCategoryExtendedType[]
  >([]);

  const getCategoryMasters = async () => {
    const { isSuccess, data, message } = await getService(
      "/account/category-master/",
      {
        page_size: 100,
        page_number: 1,
      }
    );
    if (isSuccess) {
      const _allCategoryMasters = data?.data?.map(
        (categoryMaster: CategoryMasterType) => {
          return {
            ...categoryMaster,
            added_already: addedCategories?.includes(categoryMaster.id),
            selected: addedCategories?.includes(categoryMaster.id),
            account_category_id: addedCategories?.includes(categoryMaster.id)
              ? addedCategories?.find(
                  (category_id: string) => category_id === categoryMaster.id
                )
              : null,
          };
        }
      );
      setAllCategoryMasters(_allCategoryMasters);
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  const saveCategories = async () => {
    const requestBody = {
      category_ids: allCategoryMasters
        ?.filter(
          (categoryMaster: AccountCategoryExtendedType) =>
            categoryMaster.selected && !categoryMaster.added_already
        )
        ?.map((categoryMaster: AccountCategoryExtendedType) => {
          return categoryMaster.id;
        }),
    };
    if (requestBody.category_ids.length === 0) {
      return true;
    }
    const { isSuccess, data, message } = await postService(
      "/account/account-category/",
      requestBody
    );
    if (isSuccess) {
      return true;
    } else {
      return false;
    }
  };

  const deleteCategories = async () => {
    const toDeleteCategoryMasterIds = allCategoryMasters
      ?.filter(
        (categoryMaster: AccountCategoryExtendedType) =>
          !categoryMaster.selected && categoryMaster.added_already
      )
      ?.map((categoryMaster: AccountCategoryExtendedType) => {
        return categoryMaster.id;
      });
    const toDeleteAccountCategoryIds = addedCategoryObjects
      ?.filter((category: AccountCategoryType) =>
        toDeleteCategoryMasterIds?.includes(category.category.id)
      )
      ?.map((category: AccountCategoryType) => {
        return category.id;
      });
    const requestBody = {
      account_category_ids: toDeleteAccountCategoryIds
        ? toDeleteAccountCategoryIds
        : [],
    };
    if (requestBody.account_category_ids.length === 0) {
      return true;
    }
    const { isSuccess, data, message } = await bulkDeleteService(
      "/account/account-category/",
      requestBody
    );
    if (isSuccess) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = async () => {
    try {
      const saveCategoriesResponse = await saveCategories();
      const deleteCategoriesResponse = await deleteCategories();
      if (saveCategoriesResponse && deleteCategoriesResponse) {
        notification("Categories saved successfully", "success");
        setOpen(false);
      } else {
        notification("Something went wrong", "error");
      }
    } finally {
    }
  };

  useEffect(() => {
    if (open) {
      getCategoryMasters();
    }
  }, [open, addedCategories]);

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
              {addedCategories && addedCategories?.length > 0
                ? "Update Categories"
                : "Let's set up your Account"}
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
          {allCategoryMasters.map(
            (categoryMaster: AccountCategoryExtendedType) => {
              return (
                <>
                  {categoryMaster?.name?.includes(search) && (
                    <Chip
                      key={categoryMaster.id}
                      label={categoryMaster.name}
                      sx={{ m: 1 }}
                      color="secondary"
                      variant={categoryMaster?.selected ? "filled" : "outlined"}
                      onClick={() => {
                        setAllCategoryMasters(
                          allCategoryMasters.map(
                            (_categoryMaster: AccountCategoryExtendedType) => {
                              if (_categoryMaster.id === categoryMaster.id) {
                                return {
                                  ..._categoryMaster,
                                  selected: !_categoryMaster.selected,
                                };
                              } else {
                                return _categoryMaster;
                              }
                            }
                          )
                        );
                      }}
                    />
                  )}
                </>
              );
            }
          )}
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ borderRadius: 8 }}
            onClick={onSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </CustomModal>
  );
}
