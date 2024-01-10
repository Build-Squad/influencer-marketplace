"use client";

import AcceptedOrders from "@/public/svg/acceptedOrders.svg?icon";
import CompletedOrders from "@/public/svg/completedOrders.svg?icon";
import RejectedOrders from "@/public/svg/rejectedOrders.svg?icon";
import TotalOrders from "@/public/svg/totalOrders.svg?icon";
import FilterBar from "@/src/components/dashboardComponents/filtersBar";
import StatusCard from "@/src/components/dashboardComponents/statusCard";
import { notification } from "@/src/components/shared/notification";
import StatusChip from "@/src/components/shared/statusChip";
import { getService, postService } from "@/src/services/httpServices";
import { DISPLAY_DATE_FORMAT } from "@/src/utils/consts";
import {
  Box,
  Grid,
  Link,
  Pagination,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";

export default function BusinessDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [selectedCard, setSelectedCard] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<OrderFilterType>({
    status: ["accepted", "rejected", "completed"],
  });
  const [orderCount, setOrderCount] = React.useState({
    accepted: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
  });
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 5,
  });

  const getOrders = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await postService(
        `orders/order-list/`,
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          ...filters,
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

  const getOrdersCount = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await getService(
        `orders/order-list/`
      );
      if (isSuccess) {
        setOrderCount({
          accepted: data?.data?.accepted,
          completed: data?.data?.completed,
          pending: data?.data?.pending,
          rejected: data?.data?.rejected,
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

  const statusCards = [
    {
      label: "Total Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: ["accepted", "rejected", "completed"],
        }));
        setSelectedCard(0);
      },
      value: 0,
      icon: (
        <TotalOrders
          style={{
            fill: selectedCard === 0 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
    {
      label: "Accepted Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: ["accepted"],
        }));
        setSelectedCard(1);
      },
      value: 1,
      icon: (
        <AcceptedOrders
          style={{
            fill: selectedCard === 1 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
    {
      label: "Completed Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: ["completed"],
        }));
        setSelectedCard(2);
      },
      value: 2,
      icon: (
        <CompletedOrders
          style={{
            fill: selectedCard === 2 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
    {
      label: "Rejected Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: ["rejected"],
        }));
        setSelectedCard(3);
      },
      value: 3,
      icon: (
        <RejectedOrders
          style={{
            fill: selectedCard === 3 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
  ];

  const columns = [
    {
      field: "buyer__username",
      headerName: "Business",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "16px",
              lineHeight: "19px",
              color: "#000",
              mt: 1,
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
              {params?.row?.buyer?.username}
            </Link>
          </Typography>
        );
      },
    },
    {
      field: "services",
      headerName: "Services",
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
              sx={{
                // Wrap the text if it is too long
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
    },
    {
      field: "amount",
      headerName: "Total Amount",
      sortable: false,
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Typography>
            {params?.row?.amount} {params?.row?.currency?.symbol}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return <StatusChip status={params?.row?.status} />;
      },
    },
    {
      field: "created_at",
      headerName: "Order Date",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Typography>
            {dayjs(params?.row?.created_at).format(DISPLAY_DATE_FORMAT)}
          </Typography>
        );
      },
    },
    {
      field: "review_order_id__rating",
      headerName: "Rating",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Rating
              name="read-only"
              value={params?.row?.rating}
              size="small"
              disabled={true}
            />
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    getOrdersCount();
  }, []);

  useEffect(() => {
    getOrders();
  }, [pagination.current_page_number, pagination.current_page_size, filters]);

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {statusCards.map((card, index) => {
              return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <StatusCard
                    card={card}
                    selectedCard={selectedCard}
                    orderCount={orderCount}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {/* Filters bar */}
          <FilterBar filters={filters} setFilters={setFilters} />
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            getRowId={(row) => row?.id}
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
            }}
            sortingMode="server"
            onSortModelChange={(model) => {
              setFilters((prev) => ({
                ...prev,
                order_by: model?.[0]?.field
                  ? model?.[0]?.sort === "asc"
                    ? `-${model?.[0]?.field}`
                    : `${model?.[0]?.field}`
                  : undefined,
              }));
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
    </Box>
  );
}
