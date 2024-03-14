"use client";

import FilterChip from "@/src/components/shared/filterChip";
import filterCount from "@/src/services/filterCount";
import { FORM_DATE_TIME_TZ_FORMAT } from "@/src/utils/consts";
import BarChartIcon from "@mui/icons-material/BarChart";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {
  Autocomplete,
  Badge,
  Box,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect } from "react";

type FilterBarProps = {
  filters: OrderItemMetricFilterType;
  setFilters: React.Dispatch<React.SetStateAction<OrderItemMetricFilterType>>;
  selectedView: string;
  setSelectedView: React.Dispatch<React.SetStateAction<string>>;
  metricValues: {
    label: string;
    value: string;
  }[];
};

export default function FilterBar({
  filters,
  setFilters,
  selectedView,
  setSelectedView,
  metricValues,
}: FilterBarProps) {
  const [count, setCount] = React.useState<number>(0);

  useEffect(() => {
    const count = filterCount(filters, ["order_item_id", "type"]);
    setCount(count);
  }, [filters]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
        }}
      >
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
            <Badge badgeContent={count} color="secondary">
              <FilterListIcon />
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                Filters
              </Typography>
            </Badge>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={2}>
          <Autocomplete
            multiple
            options={metricValues}
            getOptionLabel={(option) => option.label}
            value={[]}
            getOptionDisabled={(option) => {
              if (
                filters?.metric &&
                filters?.metric?.length > 0 &&
                filters?.metric?.includes(option.value)
              ) {
                return true;
              } else {
                return false;
              }
            }}
            onChange={(event, newValue) => {
              if (Array.isArray(newValue)) {
                setFilters((prev) => {
                  return {
                    ...prev,
                    metric: [
                      ...(prev.metric || []),
                      ...newValue.map((item) => item.value),
                    ],
                  };
                });
              }
            }}
            renderInput={(params) => {
              return (
                <TextField
                  color="secondary"
                  {...params}
                  size={"small"}
                  sx={{
                    height: "100%",
                    borderRadius: 8,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 8,
                    },
                  }}
                  placeholder="Metric"
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <DateTimePicker
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
              actionBar: {
                actions: ["clear"],
              },
            }}
            label="Date Time From"
            value={filters.gt_created_at ? dayjs(filters.gt_created_at) : null}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            formatDensity="spacious"
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
                    gt_created_at: dayjs(newValue).format(
                      FORM_DATE_TIME_TZ_FORMAT
                    ),
                  };
                });
              }
            }}
            maxDateTime={
              filters.lt_created_at ? dayjs(filters.lt_created_at) : dayjs()
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <DateTimePicker
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
              actionBar: {
                actions: ["clear"],
              },
            }}
            label="Date Time To"
            value={filters.lt_created_at ? dayjs(filters.lt_created_at) : null}
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
                    lt_created_at: dayjs(newValue).format(
                      FORM_DATE_TIME_TZ_FORMAT
                    ),
                  };
                });
              }
            }}
            maxDateTime={dayjs()}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            formatDensity="spacious"
            minDateTime={
              filters.gt_created_at ? dayjs(filters.gt_created_at) : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={5}>
          <ToggleButtonGroup
            value={selectedView}
            exclusive
            onChange={(event, newAlignment) => {
              if (newAlignment) {
                setSelectedView(newAlignment);
              }
            }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "row",
            }}
            size="small"
            color="secondary"
          >
            <Tooltip title="Line Chart">
              <ToggleButton value="line" aria-label="centered">
                <ShowChartIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Bar Chart">
              <ToggleButton value="bar" aria-label="left aligned">
                <BarChartIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {filters?.metric && filters?.metric?.length > 0 && (
            <>
              {filters?.metric?.map((m) => (
                <FilterChip
                  key={m}
                  label={metricValues.find((mv) => mv.value === m)?.label || m}
                  onDelete={() => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        metric: prev.metric?.filter((metric) => metric !== m),
                      };
                    });
                  }}
                />
              ))}
            </>
          )}
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
