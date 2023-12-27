"use client";

import CreateUpdatePackage from "@/src/components/profileComponents/createUpdatePackage";
import { ConfirmDelete } from "@/src/components/shared/confirmDeleteModal";
import { notification } from "@/src/components/shared/notification";
import { deleteService, getService } from "@/src/services/httpServices";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Card,
  Grid,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

const Packages = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  const [packages, setPackages] = React.useState<PackageType[]>([]);
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 5,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
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
          influencer: params.id,
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
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
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
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
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

  useEffect(() => {
    if (refreshPage) {
      getPackages();
      setRefreshPage(false);
    }
  }, [refreshPage]);

  useEffect(() => {
    getPackages();
  }, [pagination.current_page_number, pagination.current_page_size]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setCurrentUser(JSON.parse(localStorage.getItem("user") || "{}"));
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid container spacing={2}>
          {loading ? null : (
            <>
              {params?.id === currentUser?.id && (
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Card
                    sx={{
                      height: "100%",
                      minHeight: 150,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "16px",
                      boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
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
              )}
              {packages?.map((item: PackageType) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 150,
                      padding: 2,
                      borderRadius: "16px",
                      boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedPackage(item);
                      setOpenModal(true);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">{item.name}</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">
                          {item.currency.symbol} {item.price}
                        </Typography>
                        {item.influencer === currentUser?.id && (
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <ConfirmDelete
                              sx={{
                                ml: 1,
                              }}
                              onConfirm={() => deletePackageItem(item.id)}
                              title="Package"
                              loading={deleteLoading}
                              deleteElement={
                                <DeleteOutlineIcon color="error" />
                              }
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2">{item.description}</Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{
                          borderRadius: "20px",
                          mx: 2,
                        }}
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        disabled={item.influencer === currentUser?.id}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          borderRadius: "20px",
                          mx: 2,
                        }}
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        disabled={item.influencer === currentUser?.id}
                      >
                        Buy Now
                      </Button>
                    </Box>
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
            color="secondary"
            shape="rounded"
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
