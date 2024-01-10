"use client";

import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import CustomAutoComplete from "../../shared/customAutoComplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FORM_DATE_FORMAT } from "@/src/utils/consts";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type FilterBarProps = {
  filters: OrderFilterType;
  setFilters: React.Dispatch<React.SetStateAction<OrderFilterType>>;
};

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={6}
          md={1}
          lg={1}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FilterListIcon />
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Filters
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <CustomAutoComplete
            label="Search Business"
            apiEndpoint="/account/user"
            placeholder="Search Business"
            value={[]}
            onChange={(value) => {
              // Ensure value is an array and then extract the id from the object
              if (Array.isArray(value)) {
                setFilters((prev) => {
                  return {
                    ...prev,
                    buyers: [
                      ...(prev.buyers || []),
                      ...value.map((item) => item.id),
                    ],
                  };
                });
              }
            }}
            onClear={() => {
              setFilters((prev) => {
                return { ...prev, buyers: undefined };
              });
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            }}
            isMulti={true}
            getOptionLabel={(option) => {
              if (typeof option === "object" && option) {
                if ("username" in option) {
                  return option.username as string;
                } else {
                  return "";
                }
              } else {
                return "";
              }
            }}
            isOptionEqualToValue={(option, value) => {
              if (typeof option === "object" && option) {
                if ("id" in option) {
                  return option.id === value;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <CustomAutoComplete
            label="Search Service"
            apiEndpoint="/packages/servicemaster/"
            placeholder="Search Service"
            value={[]}
            onChange={(value) => {
              // Ensure value is an array and then extract the id from the object
              if (Array.isArray(value)) {
                setFilters((prev) => {
                  return {
                    ...prev,
                    service_masters: [
                      ...(prev.service_masters || []),
                      ...value.map((item) => item.id),
                    ],
                  };
                });
              }
            }}
            onClear={() => {
              setFilters((prev) => {
                return { ...prev, service_masters: undefined };
              });
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            }}
            isMulti={true}
            getOptionLabel={(option) => {
              if (typeof option === "object" && option) {
                if ("name" in option) {
                  return option.name as string;
                } else {
                  return "";
                }
              } else {
                return "";
              }
            }}
            isOptionEqualToValue={(option, value) => {
              if (typeof option === "object" && option) {
                if ("id" in option) {
                  return option.id === value;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1.5} lg={1.5}>
          {/* Rating more than and rating less than */}
          <TextField
            label="Rating more than"
            type="number"
            value={filters.gt_rating}
            onChange={(event) => {
              if (event.target.value === "") {
                setFilters((prev) => {
                  return {
                    ...prev,
                    gt_rating: undefined,
                  };
                });
                return;
              }
              setFilters((prev) => {
                return {
                  ...prev,
                  gt_rating: event.target.value,
                };
              });
            }}
            fullWidth
            color="secondary"
            size="small"
            inputProps={{
              min: 0,
              max: 5,
              step: 1,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1.5} lg={1.5}>
          {/* Rating more than and rating less than */}
          <TextField
            label="Rating less than"
            type="number"
            value={filters.lt_rating}
            onChange={(event) => {
              if (event.target.value === "") {
                setFilters((prev) => {
                  return {
                    ...prev,
                    lt_rating: undefined,
                  };
                });
                return;
              }
              setFilters((prev) => {
                return {
                  ...prev,
                  lt_rating: event.target.value,
                };
              });
            }}
            fullWidth
            color="secondary"
            size="small"
            inputProps={{
              min: 0,
              max: 5,
              step: 1,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <DatePicker
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                variant: "outlined",
                color: "secondary",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 8,
                  },
                },
              },
            }}
            label="Order Date From"
            value={
              filters.gt_created_at
                ? dayjs(filters.gt_created_at, FORM_DATE_FORMAT)
                : null
            }
            onChange={(newValue) => {
              if (!newValue) {
                setFilters((prev) => {
                  return {
                    ...prev,
                    gt_created_at: undefined,
                  };
                });
                return;
              } else {
                setFilters((prev) => {
                  return {
                    ...prev,
                    gt_created_at: dayjs(newValue).format(FORM_DATE_FORMAT),
                  };
                });
              }
            }}
            format={FORM_DATE_FORMAT}
            maxDate={
              filters.lt_created_at
                ? dayjs(filters.lt_created_at, FORM_DATE_FORMAT)
                : dayjs()
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <DatePicker
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                variant: "outlined",
                color: "secondary",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 8,
                  },
                },
              },
            }}
            label="Order Date To"
            value={
              filters.lt_created_at
                ? dayjs(filters.lt_created_at, FORM_DATE_FORMAT)
                : null
            }
            onChange={(newValue) => {
              if (!newValue) {
                setFilters((prev) => {
                  return {
                    ...prev,
                    lt_created_at: undefined,
                  };
                });
                return;
              } else {
                setFilters((prev) => {
                  return {
                    ...prev,
                    lt_created_at: dayjs(newValue).format(FORM_DATE_FORMAT),
                  };
                });
              }
            }}
            format={FORM_DATE_FORMAT}
            maxDate={dayjs()}
            minDate={
              filters.gt_created_at
                ? dayjs(filters.gt_created_at, FORM_DATE_FORMAT)
                : null
            }
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
