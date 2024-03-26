"use client";
import Star from "@/public/svg/Star.svg";
import { notification } from "@/src/components/shared/notification";
import { postService, putService } from "@/src/services/httpServices";
import { KeyboardBackspace, OpenInFull } from "@mui/icons-material";
import BackIcon from "@/public/svg/Back.svg";
import Image from "next/image";

import OrderSummaryDetails from "@/src/components/dashboardComponents/orderSummaryDetails";
import OrderSummaryTable from "@/src/components/dashboardComponents/orderSummaryTable";
import {
  Box,
  Button,
  CircularProgress,
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
import RouteProtection from "@/src/components/shared/routeProtection";
import { useRouter } from "next/navigation";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import { DriveEta } from "@mui/icons-material";
import { closeSnackbar, enqueueSnackbar } from "notistack";

export default function Orders() {
  const router = useRouter();
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

  // User Guide for the vwey first order
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<any>([
    {
      content: (
        <Box>
          <Image
            src={XfluencerLogo}
            width={175}
            height={30}
            alt="bgimg"
            priority
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            Order's request dashboard.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            This tour will guide you through the order requests where you can
            view the orders and accept/decline based on your preference.
          </Typography>
        </Box>
      ),
      placement: "center",
      target: "body",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Select orders.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Click on the order row to view details about it on the right hand
            drawer.
          </Typography>
        </Box>
      ),
      placement: "right",
      target: ".joyride-order-column",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            View the order.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Please have a close look at the details of each order item including
            the content, publish time and the amount it's offering. You can also
            visit the business profile by clicking on the hyperlink.
          </Typography>
        </Box>
      ),
      placement: "left",
      target: ".joyride-order-details-drawer",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Accept/Decline Orders.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Accept or decline the order based on your pereference.
          </Typography>
        </Box>
      ),
      placement: "left",
      target: ".joyride-action-column",
    },
    {
      content: (
        <Box>
          <Image
            src={XfluencerLogo}
            width={175}
            height={30}
            alt="bgimg"
            priority
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            Congratulations!!!
          </Typography>
          <Typography sx={{ mt: 1 }}>
            You've completed your order requests tour, you're good to go and
            accept or decline the order request.
          </Typography>
        </Box>
      ),
      placement: "center",
      target: "body",
    },
  ]);

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);
    }
  };

  const handleUserInteraction = async () => {
    const { isSuccess, data, message } = await postService(
      `orders/order-list/`,
      {
        page_number: pagination.current_page_number,
        page_size: pagination.current_page_size,
      }
    );

    if (isSuccess && data?.data?.status_counts) {
      const { status_counts: orders } = data.data;
      const totalOrders = Object.values(orders).reduce(
        (acc: number, curr: any) => acc + curr,
        0
      );

      if (totalOrders === 1 && orders.pending === 1) {
        setStepIndex(0);
        setRun(true);
      }
    }
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await postService(
        `orders/order-list/`,
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          status: ["pending"],
          order_by: "-created_at",
        }
      );
      if (isSuccess) {
        setOrders(data?.data?.orders);
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
      renderHeader: () => (
        <Typography className="joyride-order-column" variant="h6">
          Order ID
        </Typography>
      ),
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
              href={`/business/profile-preview/${params?.row?.buyer?.id}`}
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
        return (
          <Typography variant="subtitle1">
            {params?.row?.amount} {params?.row?.currency?.symbol}
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
          <Box
            sx={{ display: "flex", columnGap: "4px" }}
            className="joyride-action-column"
          >
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
    handleUserInteraction();
  }, []);

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
      if (status === "rejected") {
        handleClose();
        const action = () => (
          <>
            <CircularProgress color="inherit" size={20} />
          </>
        );
        const cancellationNotification = enqueueSnackbar(
          `Declining order request, please wait for confirmation`,
          {
            variant: "default",
            persist: true,
            action,
          }
        );
        const { isSuccess, data, message } = await putService(
          `/orders/cancel-order/${selectedAction.orderId}/`,
          {}
        );
        if (isSuccess) {
          closeSnackbar(cancellationNotification);
          getOrders();
          notification(
            "Order request was declined successfully",
            "success",
            3000
          );
        } else {
          closeSnackbar(cancellationNotification);
          notification(
            message ? message : "Something went wrong, couldn't cancel order",
            "error"
          );
        }
      } else {
        const { isSuccess, data, message } = await putService(
          `orders/update-status/${selectedAction.orderId}/`,
          {
            status: status,
          }
        );
        if (isSuccess) {
          notification(
            `Order request was ${
              selectedAction.status == "Accept" ? "accepted" : "rejected"
            }`
          );
        } else {
          notification(
            message
              ? message
              : "Something went wrong, couldn't update order status",
            "error"
          );
        }
        handleClose();
      }
      setActionLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RouteProtection logged_in={true} influencer={true}>
      <Grid container sx={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        <Grid
          item
          xs={selectedOrder ? 9 : 12}
          sx={{ padding: "16px 20px 0 40px" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image
              src={BackIcon}
              alt={"BackIcon"}
              height={30}
              style={{
                marginTop: "8px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => {
                router.back();
              }}
            />
            {pagination.total_data_count > 0 ? (
              <Box
                sx={{
                  color: "grey",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  columnGap: "4px",
                }}
                onClick={() => {
                  setStepIndex(0);
                  setRun(true);
                }}
              >
                <DriveEta fontSize="small" />
                <Typography sx={{ color: "#C60C30" }}>Take A Tour!</Typography>
              </Box>
            ) : null}
          </Box>

          <Box
            sx={{
              display: "flex",
              columnGap: "8px",
              alignItems: "flex-start",
              mt: 1,
            }}
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
            display: selectedOrder ? "block" : "none",
          }}
          className="joyride-order-details-drawer"
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
                  href={`/business/profile-preview/${selectedOrder?.buyer?.id}`}
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
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={"bold"}>
              Order Summary
            </Typography>
            <OrderSummaryTable
              order={selectedOrder}
              totalOrders={selectedOrder?.order_item_order_id?.length ?? 0}
            />
            <OrderSummaryDetails
              orderItem={selectedOrder?.order_item_order_id}
            />
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
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        stepIndex={stepIndex}
        run={run}
        scrollToFirstStep
        showSkipButton
        steps={steps}
        spotlightClicks
        styles={{
          options: {
            zIndex: 2,
          },
        }}
        locale={{ last: "Finish" }}
      />
    </RouteProtection>
  );
}
