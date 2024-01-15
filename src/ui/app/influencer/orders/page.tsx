"use client";
import { notification } from "@/src/components/shared/notification";
import { postService, putService } from "@/src/services/httpServices";
import Star from "@/public/svg/Star.svg";
import Image from "next/image";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

const styles = {
  headerCellStyle: {
    fontSize: "20px",
    paddingX: 0,
    paddingY: "10px",
  },
  bodyCellStyle: {
    fontSize: "16px",
    paddingX: "0",
    paddingY: "4px",
  },
  tableRowStyles: {
    "& td, & th": { border: 0 },
  },
};

const OrderSummaryTable = ({
  order,
  totalOrders,
}: {
  order: OrderType;
  totalOrders: number;
}) => {
  const totalAmount = order?.order_item_order_id?.reduce(
    (acc: number, item: any) => {
      return acc + parseFloat(item.price);
    },
    0
  );
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={styles.tableRowStyles}>
            <TableCell align="left" sx={{ ...styles.headerCellStyle }}>
              Services
            </TableCell>
            <TableCell align="center" sx={{ ...styles.headerCellStyle }}>
              Quantity
            </TableCell>
            <TableCell align="right" sx={{ ...styles.headerCellStyle }}>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order?.order_item_order_id.map((item: any) => {
            return (
              <TableRow sx={styles.tableRowStyles}>
                <TableCell align="left" sx={{ ...styles.bodyCellStyle }}>
                  {item?.service_master?.name}
                </TableCell>
                <TableCell align="center" sx={{ ...styles.bodyCellStyle }}>
                  2
                </TableCell>
                <TableCell align="right" sx={{ ...styles.bodyCellStyle }}>
                  {item?.price} {order?.currency?.symbol}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableBody>
          <TableRow sx={styles.tableRowStyles}>
            <TableCell align="left" sx={{ ...styles.bodyCellStyle }}>
              <Typography variant="h6" fontWeight={"bold"}>
                Total
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ ...styles.bodyCellStyle }}>
              <Typography variant="h6" fontWeight={"bold"}>
                {totalOrders}
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ ...styles.bodyCellStyle }}>
              <Typography variant="h6" fontWeight={"bold"}>
                {totalAmount}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

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
              href={`/business/profile/${params?.row?.buyer?.id}`}
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
          <Box sx={{ display: "flex", columnGap: "4px" }}>
            <Button
              variant={"contained"}
              color="secondary"
              sx={{
                borderRadius: "20px",
              }}
              onClick={() => {
                handleAction({ status: "accepted", orderId });
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
                handleAction({ status: "rejected", orderId });
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

  const handleAction = async ({
    status = "",
    orderId,
  }: {
    status: string;
    orderId: string;
  }) => {
    if (status) {
      setActionLoading(true);
      const { isSuccess, data, message } = await putService(
        `orders/order/${orderId}/`,
        {
          status,
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
  };

  return (
    <Grid container sx={{ backgroundColor: "#FAFAFA" }}>
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
              getRowId={(row) => row?.id}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                console.log(newRowSelectionModel);
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              autoHeight
              loading={loading}
              rows={orders}
              columns={columns}
              disableRowSelectionOnClick
              disableColumnFilter
              hideFooter
              getRowHeight={(params) => 100}
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
        <Box sx={{ padding: "20px 40px" }}>
          <Typography variant="h5" fontWeight={"bold"}>
            Order Details
          </Typography>
          <Typography variant="h6">Business: Name of Business</Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "20px 40px" }}>
          <Typography variant="h6" fontWeight={"bold"}>
            Order Summary
          </Typography>
          <OrderSummaryTable
            order={orders?.[0]}
            totalOrders={orders?.[0]?.order_item_order_id?.length ?? 0}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
