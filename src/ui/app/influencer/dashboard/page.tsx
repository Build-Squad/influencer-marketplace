"use client";

import { notification } from "@/src/components/shared/notification";
import { postService } from "@/src/services/httpServices";
import { Box, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import React, { useEffect, useState } from "react";

export default function InfluencerDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await postService(
        `orders/order-list/`,
        {}
      );
      if (isSuccess) {
        setOrders(data?.data);
      } else {
        notification(message ? message : "Something went wrong", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "influencer",
      headerName: "Influencer",
      flex: 1,
    },
    {
      field: "services",
      headerName: "Services",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 1,
    },
  ];

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DataGrid
            getRowId={(row) => row?.id}
            autoHeight
            loading={loading}
            rows={orders}
            columns={columns}
            disableRowSelectionOnClick
            disableColumnFilter
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 15]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
