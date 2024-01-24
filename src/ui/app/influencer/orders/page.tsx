"use client";
import Star from "@/public/svg/Star.svg";
import { notification } from "@/src/components/shared/notification";
import { postService, putService } from "@/src/services/httpServices";
import { OpenInFull } from "@mui/icons-material";
import Image from "next/image";

import OrderSummaryDetails from "@/src/components/dashboardComponents/orderSummaryDetails";
import OrderSummaryTable from "@/src/components/dashboardComponents/orderSummaryTable";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";

export default function Orders() {
  const [open, setOpen] = React.useState(false);
  const [selectedAction, setSelectedAction] = useState({
    status: "",
    orderId: "",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  const selectedOrder =
    orders.find((item) => item.id == rowSelectionModel[0]) ?? orders[0];

  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 6,
  });

  const getOrders = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await postService(
        `orders/order-list/`,
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          status: ["pending"],
        }
      );
      if (isSuccess) {
        setOrders(data?.data);
        setPagination({
          ...pagination,
          total_data_count: data?.pagination?.total_data_count,
          total_page_count: data?.pagination?.total_page_count,
        });
      } else {
        notification(message ? message : "Something went wrong", "error");
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

  const columns = [
    {
      field: "order_code",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "buyer__username",
      flex: 1,
      minWidth: 200,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "20px",
              lineHeight: "19px",
              color: "#000",
              mt: 1,
              paddingLeft: "20px",
            }}
          >
            <Link
              href={`/business/profile/profile-preview/${params?.row?.buyer?.id}`}
              target="_blank"
              component={NextLink}
              sx={{
                color: "#0099FF",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              @{params?.row?.buyer?.username}
            </Link>
          </Typography>
        );
      },
      renderHeader: () => (
        <Typography variant="h6" sx={{ paddingLeft: "20px" }}>
          Business
        </Typography>
      ),
    },
    {
      field: "services",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        const services = params?.row?.order_item_order_id;
        // create a string of services
        let servicesString = "";
        services?.map((service: ServiceType, index: number) => {
          servicesString += service?.service_master?.name;
          if (index + 1 !== services?.length) {
            servicesString += ", ";
          }
        });
        return (
          <Tooltip
            title={servicesString}
            placement="top"
            arrow
            disableHoverListener={servicesString?.length < 50}
          >
            <Typography
              variant="subtitle1"
              sx={{
                whiteSpace: "normal",
              }}
            >
              {servicesString?.length > 50
                ? `${servicesString?.substring(0, 50)}...`
                : servicesString}
            </Typography>
          </Tooltip>
        );
      },
      renderHeader: () => <Typography variant="h6">Services</Typography>,
    },
    {
      field: "amount",
      sortable: false,
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        const totalAmount = params?.row?.order_item_order_id?.reduce(
          (acc: number, item: any) => {
            return acc + parseFloat(item.price);
          },
          0
        );
        return (
          <Typography variant="subtitle1">
            {totalAmount} {params?.row?.currency?.symbol}
          </Typography>
        );
      },
      renderHeader: () => <Typography variant="h6">Total Amount</Typography>,
    },
    {
      field: "status",
      flex: 1,
      minWidth: 200,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        const orderId = params?.row?.id;
        return (
          <Box sx={{ display: "flex", columnGap: "4px" }}>
            <Button
              variant={"contained"}
              color="secondary"
              sx={{
                borderRadius: "20px",
              }}
              onClick={() => {
                setSelectedAction({ status: "Accept", orderId });
                handleClickOpen();
              }}
            >
              Accept
            </Button>
            <Button
              variant={"outlined"}
              color="secondary"
              sx={{
                borderRadius: "20px",
              }}
              onClick={() => {
                setSelectedAction({ status: "Decline", orderId });
                handleClickOpen();
              }}
            >
              Decline
            </Button>
          </Box>
        );
      },
      renderHeader: () => (
        <Typography variant="h6" sx={{ paddingLeft: "20px" }}>
          Action
        </Typography>
      ),
    },
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getOrders();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    pagination.current_page_number,
    pagination.current_page_size,
    actionLoading,
  ]);

  const handleAction = async () => {
    if (selectedAction.status) {
      const status =
        selectedAction.status == "Accept" ? "accepted" : "rejected";
      setActionLoading(true);
      const { isSuccess, data, message } = await putService(
        `orders/update-status/${selectedAction.orderId}/`,
        {
          status: status,
        }
      );
      if (!isSuccess) {
        notification(
          message
            ? message
            : "Something went wrong, couldn't update order status",
          "error"
        );
      }
      setActionLoading(false);
    }
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container sx={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      <Grid
        item
        xs={9}
        md={9}
        sm={9}
        lg={9}
        sx={{ padding: "16px 20px 0 40px" }}
      >
        <Box
          sx={{ display: "flex", columnGap: "8px", alignItems: "flex-start" }}
        >
          <Image src={Star} height={20} alt="Star" />
          <Typography variant="h4" fontWeight={"bold"}>
            Order Requests
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          See all your order request and click on accept/decline button to do
          the action. Your declined order requests will be deleted on spot and
          all other accepted requests will be seen in dashboard page.
        </Typography>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <DataGrid
              getRowId={(row) => (row.id ? row.id : 0)}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              autoHeight
              loading={loading}
              rows={orders}
              columns={columns}
              disableColumnFilter
              hideFooter
              getRowHeight={(params) => 80}
              sx={{
                backgroundColor: "#fff",
                boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
                border: "none",
                borderRadius: "16px",
              }}
              sortingMode="server"
              localeText={{
                noRowsLabel: "No Orders found",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Pagination
                count={pagination.total_page_count}
                page={pagination.current_page_number}
                onChange={handlePaginationChange}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
                color="secondary"
                shape="rounded"
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={3}
        md={3}
        sm={3}
        lg={3}
        sx={{
          border: "1px solid #D3D3D3",
          backgroundColor: "white",
          borderTop: "none",
        }}
      >
        <Box
          sx={{
            padding: "20px 40px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={"bold"}>
              Order Details
            </Typography>
            <Typography variant="h6">
              Business:{" "}
              <Link
                href={`/business/profile/${selectedOrder?.buyer?.id}`}
                target="_blank"
                component={NextLink}
                sx={{
                  color: "#0099FF",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {selectedOrder?.buyer?.username}
              </Link>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
              <Typography variant="h6">Order ID: </Typography>
              <Typography variant="subtitle1">
                {selectedOrder?.order_code}
              </Typography>
            </Box>
          </Box>

          <OpenInFull fontSize="medium" sx={{ cursor: "pointer" }} />
        </Box>
        <Divider />
        <Box sx={{ padding: "20px 40px" }}>
          <Typography variant="h6" fontWeight={"bold"}>
            Order Summary
          </Typography>
          <OrderSummaryTable
            order={selectedOrder}
            totalOrders={selectedOrder?.order_item_order_id?.length ?? 0}
          />
          <OrderSummaryDetails orderItem={selectedOrder?.order_item_order_id} />
        </Box>
      </Grid>

      {/* Model */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: "#fff !important",
            color: "#000 !important",
          }}
        >
          Are you sure you want to {selectedAction.status} this order?
        </DialogTitle>
        <DialogActions>
          <Button color="secondary" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleAction}
            autoFocus
          >
            {selectedAction.status}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
