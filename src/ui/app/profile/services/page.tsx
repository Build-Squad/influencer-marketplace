"use client";

import { getService } from "@/src/services/httpServices";
import {
  Autocomplete,
  Box,
  Card,
  FormLabel,
  Grid,
  Pagination,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateUpdateService from "@/src/components/profileComponents/createUpdateService";
import { notification } from "@/src/components/shared/notification";

const sortOptions = [
  {
    value: "name",
    label: "Name (A-Z)",
  },
  {
    value: "-name",
    label: "Name (Z-A)",
  },
  {
    value: "created_at",
    label: "Date (Oldest)",
  },
  {
    value: "-created_at",
    label: "Date (Newest)",
  },
  {
    value: "price",
    label: "Price (Lowest)",
  },
  {
    value: "-price",
    label: "Price (Highest)",
  },
  {
    value: "quantity",
    label: "Quantity (Lowest)",
  },
  {
    value: "-quantity",
    label: "Quantity (Highest)",
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

const Services = () => {
  const [services, setServices] = React.useState<ServiceType[]>([]);
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 10,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>("");
  const [order_by, setOrder_by] = React.useState<string>("-created_at");
  const [value, setValue] = React.useState<number[]>([10, 30]);
  const [quantityRange, setQuantityRange] = React.useState<number[]>([0, 20]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const getServices = async () => {
    try {
      setLoading(true);
      const { message, data, isSuccess, errors } = await getService(
        "packages/service",
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          search: search,
          order_by: order_by,
          quantity_gt: quantityRange[0],
          quantity_lt: quantityRange[1],
          price_gt: value[0],
          price_lt: value[1],
        }
      );
      if (isSuccess) {
        notification(message);
        setServices(data?.data);
        setPagination({
          ...pagination,
          total_data_count: data?.pagination?.total_data_count,
          total_page_count: data?.pagination?.total_page_count,
        });
      } else {
        notification(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      current_page_number: page,
    }));
  };

  const handleSliderValueChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setValue(newValue as number[]);
  };

  const handleQuantityRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setQuantityRange(newValue as number[]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getServices();
    }, 500);
    return () => clearTimeout(timeout);
  }, [
    quantityRange,
    value,
    search,
    pagination.current_page_number,
    pagination.current_page_size,
    order_by,
  ]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={(event: {
              target: { value: React.SetStateAction<string> };
            }) => setSearch(event.target.value)}
            size="small"
            fullWidth
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Autocomplete
            disableClearable
            disablePortal
            id="sort"
            options={sortOptions}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sort"
                variant="outlined"
                size="small"
              />
            )}
            value={sortOptions.find((option) => option.value === order_by)}
            onChange={(event, value) => {
              setOrder_by(value?.value ? value.value : "-created_at");
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <FormLabel component="legend">Price Range</FormLabel>
          <Slider
            getAriaLabel={() => "Price Range"}
            value={value}
            onChange={handleSliderValueChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            min={0}
            disableSwap
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <FormLabel component="legend">Quantity Range</FormLabel>
          <Slider
            getAriaLabel={() => "Quantity Range"}
            value={quantityRange}
            onChange={handleQuantityRangeChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            min={0}
            disableSwap
          />
        </Grid>
        <Grid container spacing={2}>
          {loading ? null : (
            <>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => setOpenModal(true)}
                >
                  <Tooltip title="Add Package">
                    <Box>
                      <AddCircleOutlineIcon
                        sx={{
                          fontSize: 80,
                          color: "secondary.main",
                        }}
                      />
                      <Typography variant="body2">Add Service</Typography>
                    </Box>
                  </Tooltip>
                </Card>
              </Grid>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      padding: 2,
                    }}
                  >
                    <Typography variant="h6">
                      Service: {service.service_master.name}
                    </Typography>
                    <Typography variant="body1">
                      Description: {service.service_master.description}
                    </Typography>
                    <Typography variant="body1">
                      Limit: {service.service_master.limit}
                    </Typography>
                    <Typography variant="body1">
                      Type: {service.service_master.type}
                    </Typography>
                    <Typography variant="body1">
                      Quantity: {service.quantity}
                    </Typography>
                    <Typography variant="body1">
                      Price: {service.currency.symbol} {service.price}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <Pagination
            count={pagination.total_page_count}
            page={pagination.current_page_number}
            onChange={handlePaginationChange}
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 4,
            }}
            color="primary"
          />
        </Grid>
      </Grid>
      <CreateUpdateService open={openModal} setOpen={setOpenModal} />
    </Box>
  );
};

export default Services;
