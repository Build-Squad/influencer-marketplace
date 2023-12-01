"use client";

import { deleteService, getService } from "@/src/services/httpServices";
import { DISPLAY_DATE_FORMAT } from "@/src/utils/consts";
import {
  Autocomplete,
  Box,
  Card,
  FormLabel,
  Grid,
  IconButton,
  Pagination,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateUpdatePackage from "@/src/components/profileComponents/createUpdatePackage";
import { notification } from "@/src/components/shared/notification";
import { ConfirmDelete } from "@/src/components/shared/confirmDeleteModal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

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
    value: "publish_date",
    label: "Publish Date (Oldest)",
  },
  {
    value: "-publish_date",
    label: "Publish Date (Newest)",
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

const Packages = () => {
  const [packages, setPackages] = React.useState<PackageType[]>([]);
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 11,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>("");
  const [order_by, setOrder_by] = React.useState<string>("-created_at");
  const [value, setValue] = React.useState<number[]>([0, 100]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [refreshPage, setRefreshPage] = React.useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] =
    React.useState<PackageType | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  const getPackages = async () => {
    try {
      setLoading(true);
      const { message, data, isSuccess, errors } = await getService(
        "packages/",
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          search: search,
          order_by: order_by,
          price_gt: value[0],
          price_lt: value[1],
        }
      );
      if (isSuccess) {
        setPackages(data?.data);
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

  const deletePackageItem = async (id: string) => {
    try {
      setDeleteLoading(true);
      const { isSuccess, message } = await deleteService(`/packages/${id}/`);
      if (isSuccess) {
        notification(message, "success");
        setRefreshPage(true);
      } else {
        notification(message, "error");
      }
    } finally {
      setDeleteLoading(false);
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

  useEffect(() => {
    if (refreshPage) {
      getPackages();
      setRefreshPage(false);
    }
  }, [refreshPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getPackages();
    }, 500);
    return () => clearTimeout(timeout);
  }, [
    search,
    pagination.current_page_number,
    pagination.current_page_size,
    order_by,
    value,
  ]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
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
        <Grid container spacing={2}>
          {loading ? null : (
            <>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: "100%",
                    minHeight: 150,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setSelectedPackage(null);
                    setOpenModal(true);
                  }}
                >
                  <Tooltip title="Add Package">
                    <Box>
                      <AddCircleOutlineIcon
                        sx={{
                          fontSize: 80,
                          color: "secondary.main",
                        }}
                      />
                      <Typography variant="body2">Add Package</Typography>
                    </Box>
                  </Tooltip>
                </Card>
              </Grid>
              {packages.map((item: PackageType) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      padding: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">Package: {item.name}</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => {
                              setSelectedPackage(item);
                              setOpenModal(true);
                            }}
                          >
                            <EditIcon
                              sx={{
                                fontSize: 16,
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        <ConfirmDelete
                          deleteElement={
                            <IconButton>
                              <DeleteOutlineIcon
                                sx={{
                                  fontSize: 16,
                                }}
                                color="error"
                              />
                            </IconButton>
                          }
                          title={item.name}
                          onConfirm={() => {
                            deletePackageItem(item.id);
                          }}
                          loading={deleteLoading}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      Description: {item.description}
                    </Typography>
                    <Typography variant="body1">
                      Price: {item.currency.symbol} {item.price}
                    </Typography>
                    <Typography variant="body1">
                      Publish Date:{" "}
                      {dayjs(item.publish_date).format(DISPLAY_DATE_FORMAT)}
                    </Typography>
                    <Typography variant="body1">
                      Status: {item.status}
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
      <CreateUpdatePackage
        open={openModal}
        setOpen={setOpenModal}
        setRefreshPage={setRefreshPage}
        packageItem={selectedPackage}
      />
    </Box>
  );
};

export default Packages;
