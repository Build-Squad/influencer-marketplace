"use client";

import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import React from "react";
import CustomAutoComplete from "../../shared/customAutoComplete";
import FilterChip from "../../shared/filterChip";
import SearchIcon from "@mui/icons-material/Search";
import { ORDER_STATUS } from "@/src/utils/consts";

type OrderChatFilterBarType = {
  filters: OrderFilterType;
  setFilters: React.Dispatch<React.SetStateAction<OrderFilterType>>;
};

const STATUS_OPTIONS = [
  {
    label: "Pending",
    value: ORDER_STATUS.PENDING,
  },
  {
    label: "Completed",
    value: ORDER_STATUS.COMPLETED,
  },
  {
    label: "Accepted",
    value: ORDER_STATUS.ACCEPTED,
  },
  {
    label: "Rejected",
    value: ORDER_STATUS.REJECTED,
  },
];

export default function OrderChatFilterBar({
  filters,
  setFilters,
}: OrderChatFilterBarType) {
  return (
    <Box sx={{ my: 1 }}>
      <TextField
        color="secondary"
        fullWidth
        label="Search Order"
        variant="outlined"
        value={filters.search}
        onChange={(e) =>
          setFilters({
            ...filters,
            search: e.target.value,
          })
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
          my: 1,
        }}
        InputProps={{
          endAdornment: (
            <IconButton
              sx={{
                backgroundColor: "#000",
              }}
            >
              <SearchIcon
                sx={{
                  color: "#fff",
                }}
              />
            </IconButton>
          ),
        }}
      />
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
                    ...(prev?.objects?.service_masters || []),
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
          my: 1,
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
      {/* An Autocomplete for status */}
      <Autocomplete
        color="secondary"
        fullWidth
        multiple={true}
        options={STATUS_OPTIONS}
        getOptionLabel={(option) => {
          if (typeof option === "object" && option) {
            if ("label" in option) {
              return option.label as string;
            } else {
              return "";
            }
          } else {
            return "";
          }
        }}
        getOptionDisabled={(option) => {
          // if the option id is in the filters.buyers then disable it
          if (typeof option === "object" && option) {
            if ("value" in option && filters.status) {
              return filters.status?.includes(option.value as string);
            } else {
              return false;
            }
          } else {
            return false;
          }
        }}
        value={[]}
        onChange={(e, value) => {
          if (Array.isArray(value)) {
            setFilters((prev) => {
              return {
                ...prev,
                status: [
                  ...(prev.status || []),
                  ...value.map((item) => item.value),
                ],
              };
            });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Status"
            placeholder="Status"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
              my: 1,
            }}
            size="small"
            color="secondary"
          />
        )}
      />
      <Box sx={{ my: 1 }} />

      {/* A chip for each status */}
      {filters?.status && filters?.status?.length > 0 && (
        <>
          {filters?.status.map((item, index) => {
            return (
              <FilterChip
                color="secondary"
                key={index}
                label={item?.charAt(0).toUpperCase() + item?.slice(1)}
                onDelete={() => {
                  setFilters((prev) => {
                    // If the value post deletion is empty then remove the key from the object
                    return {
                      ...prev,
                      status: prev.status?.filter((status) => status !== item),
                    };
                  });
                }}
              />
            );
          })}
        </>
      )}
      {/* A chip for each service */}
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
                      const new_service_masters = prev.service_masters?.filter(
                        (service_master) => service_master !== item.id
                      );
                      const new_objects_service_masters =
                        prev?.objects?.service_masters?.filter(
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
    </Box>
  );
}
