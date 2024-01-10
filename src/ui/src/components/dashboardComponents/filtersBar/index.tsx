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
import FilterChip from "../../shared/filterChip";

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
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
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
            getOptionDisabled={(option) => {
              // if the option id is in the filters.buyers then disable it
              if (typeof option === "object" && option) {
                if ("id" in option && filters.buyers) {
                  return filters.buyers?.includes(option.id as string);
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }}
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
                    objects: {
                      ...prev.objects,
                      buyers: [...value, ...(prev?.objects?.buyers || [])],
                    },
                  };
                });
              }
            }}
            onClear={() => {
              setFilters((prev) => {
                return {
                  ...prev,
                  buyers: undefined,
                  objects: {
                    ...prev.objects,
                    buyers: undefined,
                  },
                };
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
            getOptionDisabled={(option) => {
              // if the option id is in the filters.buyers then disable it
              if (typeof option === "object" && option) {
                if ("id" in option && filters.service_masters) {
                  return filters.service_masters?.includes(option.id as string);
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }}
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
                    objects: {
                      ...prev.objects,
                      service_masters: [
                        ...value,
                        ...(prev.objects.service_masters || []),
                      ],
                    },
                  };
                });
              }
            }}
            onClear={() => {
              setFilters((prev) => {
                return {
                  ...prev,
                  service_masters: undefined,
                  objects: {
                    ...prev.objects,
                    service_masters: undefined,
                  },
                };
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
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mt: 2,
          px: 2,
        }}
      >
        {/* For the buyers, influencers selected show chips that can be deleted  */}
        {filters?.objects?.buyers && filters.objects.buyers.length > 0 && (
          <>
            {filters.objects.buyers.map((item, index) => {
              return (
                <FilterChip
                  color="secondary"
                  key={index}
                  label={item.username ? item.username : ""}
                  onDelete={() => {
                    setFilters((prev) => {
                      // If the value post deletion is empty then remove the key from the object
                      // update both the buyers and objects.buyers
                      const new_buyers = prev.buyers?.filter(
                        (buyer) => buyer !== item.id
                      );
                      const new_objects_buyers = prev.objects.buyers?.filter(
                        (buyer) => buyer.id !== item.id
                      );
                      return {
                        ...prev,
                        buyers: new_buyers?.length ? new_buyers : undefined,
                        objects: {
                          ...prev.objects,
                          buyers: new_objects_buyers?.length
                            ? new_objects_buyers
                            : undefined,
                        },
                      };
                    });
                  }}
                />
              );
            })}
          </>
        )}
        {/* For the service masters selected show chips that can be deleted  */}
        {filters?.objects?.service_masters &&
          filters?.objects?.service_masters.length > 0 && (
            <>
              {filters?.objects.service_masters.map((item, index) => {
                return (
                  <FilterChip
                    color="secondary"
                    key={index}
                    label={item?.name ? item?.name : ""}
                    onDelete={() => {
                      setFilters((prev) => {
                        // If the value post deletion is empty then remove the key from the object
                        // update both the buyers and objects.buyers
                        const new_service_masters =
                          prev.service_masters?.filter(
                            (service_master) => service_master !== item.id
                          );
                        const new_objects_service_masters =
                          prev.objects.service_masters?.filter(
                            (service_master) => service_master.id !== item.id
                          );
                        return {
                          ...prev,
                          service_masters: new_service_masters?.length
                            ? new_service_masters
                            : undefined,
                          objects: {
                            ...prev.objects,
                            service_masters: new_objects_service_masters?.length
                              ? new_objects_service_masters
                              : undefined,
                          },
                        };
                      });
                    }}
                  />
                );
              })}
            </>
          )}
      </Grid>
    </LocalizationProvider>
  );
}
