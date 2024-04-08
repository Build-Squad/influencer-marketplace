"use client";

import BackIcon from "@/public/svg/Back.svg";
import AcceptedOrders from "@/public/svg/acceptedOrders.svg?icon";
import RejectedOrders from "@/public/svg/rejectedOrders.svg?icon";
import TotalOrders from "@/public/svg/totalOrders.svg?icon";
import FilterBar from "@/src/components/dashboardComponents/filtersBar";
import ManualVerifyModal from "@/src/components/dashboardComponents/manualVerifyModal";
import StatusCard from "@/src/components/dashboardComponents/statusCard";
import UpdateOrder from "@/src/components/dashboardComponents/updateOrder";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import StatusChip from "@/src/components/shared/statusChip";
import { postService, putService } from "@/src/services/httpServices";
import {
  DISPLAY_DATE_TIME_FORMAT,
  ORDER_ITEM_STATUS,
  ORDER_STATUS,
  SERVICE_MASTER_TWITTER_SERVICE_TYPE,
} from "@/src/utils/consts";
import BarChartIcon from "@mui/icons-material/BarChart";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function BusinessDashboardPage() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string>("");
  const [selectedCard, setSelectedCard] = React.useState<number>(0);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = React.useState<OrderFilterType>({
    status: [
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.REJECTED,
      ORDER_STATUS.PENDING,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED,
    ],
    order_by: "upcoming",
  });

  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 10,
  });
  const [orderItemsCount, setOrderItemsCount] = React.useState({
    accepted: 0,
    scheduled: 0,
    published: 0,
    rejected: 0,
    cancelled: 0,
  });

  const getOrderItems = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await postService(
        `/orders/order-item/`,
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          ...filters,
        }
      );
      if (isSuccess) {
        setOrderItems(data?.data?.order_items);
        setOrderItemsCount({
          accepted: data?.data?.status_counts?.accepted,
          scheduled: data?.data?.status_counts?.scheduled,
          published: data?.data?.status_counts?.published,
          rejected: data?.data?.status_counts?.rejected,
          cancelled: data?.data?.status_counts?.cancelled,
        });
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

  const approveOrderItem = async (id: string) => {
    const { isSuccess, message } = await putService(
      `/orders/approve-ordder-item/${id}/`,
      {
        approved: true,
      }
    );
    if (isSuccess) {
      notification("Order Item approved successfully!", "success");
      getOrderItems();
    } else {
      notification(message, "error", 3000);
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

  const orderItemStatusCards = [
    {
      label: "All",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [
            ORDER_ITEM_STATUS.IN_PROGRESS,
            ORDER_ITEM_STATUS.CANCELLED,
            ORDER_ITEM_STATUS.REJECTED,
            ORDER_ITEM_STATUS.ACCEPTED,
            ORDER_ITEM_STATUS.SCHEDULED,
            ORDER_ITEM_STATUS.PUBLISHED,
          ],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
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
      label: "Accepted",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_ITEM_STATUS.ACCEPTED],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
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
      label: "Scheduled",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_ITEM_STATUS.SCHEDULED],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
        }));
        setSelectedCard(2);
      },
      value: 2,
      icon: (
        <ScheduleSendIcon
          style={{
            fill: selectedCard === 2 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
    {
      label: "Published",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_ITEM_STATUS.PUBLISHED],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
        }));
        setSelectedCard(3);
      },
      value: 3,
      icon: (
        <OpenInNewIcon
          style={{
            fill: selectedCard === 3 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
    {
      label: "Rejected",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_ITEM_STATUS.REJECTED],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
        }));
        setSelectedCard(4);
      },
      value: 4,
      icon: (
        <RejectedOrders
          style={{
            fill: selectedCard === 4 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
    {
      label: "Cancelled",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_ITEM_STATUS.CANCELLED],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
        }));
        setSelectedCard(5);
      },
      value: 5,
      icon: (
        <CancelScheduleSendIcon
          style={{
            fill: selectedCard === 5 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
  ];

  const orderItemColumns = [
    // Columns for Package name, Price, Order Item Creation Date, Publish Date, Order Code, Published Tweet Link, Status
    {
      field: "package__name",
      headerName: "Service",
      flex: 1,
      minWidth: 200,
      sortable: false,
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
            {params?.row?.package?.name}
          </Typography>
        );
      },
    },
    {
      field: "order_id__order_code",
      headerName: "Order",
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
            {params?.row?.order_id?.order_code}
          </Typography>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Typography>
            {params?.row?.price} {params?.row?.currency?.symbol}
          </Typography>
        );
      },
    },
    {
      field: "publish_date",
      headerName: "Publish Date & Time",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Typography>
            {params?.row?.publish_date
              ? dayjs(params?.row?.publish_date).format(
                  DISPLAY_DATE_TIME_FORMAT
                )
              : "Not Published"}
          </Typography>
        );
      },
    },
    {
      field: "published_tweet_id",
      headerName: "Published Post Link",
      flex: 1,
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Link
            href={`https://x.com/${params?.row?.package?.influencer?.twitter_account?.user_name}/status/${params?.row?.published_tweet_id}`}
            target="_blank"
            sx={{
              textDecoration: "none",
            }}
          >
            {params?.row?.published_tweet_id ? (
              <Tooltip title="Go To Post" placement="top" arrow>
                <IconButton>
                  <OpenInNewIcon color="success" />
                </IconButton>
              </Tooltip>
            ) : (
              <Typography
                sx={{
                  fontStyle: "italic",
                }}
              >
                Not Published
              </Typography>
            )}
          </Link>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
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
            <Tooltip
              title="View Order Details"
              placement="top"
              arrow
              disableInteractive
            >
              <IconButton
                onClick={() => {
                  setSelectedOrder(params?.row?.order_id);
                  setOpen(true);
                }}
              >
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            {params?.row?.status === ORDER_ITEM_STATUS.PUBLISHED &&
              params?.row?.service_master?.twitter_service_type !==
                SERVICE_MASTER_TWITTER_SERVICE_TYPE.LIKE_TWEET &&
              params?.row?.service_master?.twitter_service_type !==
                SERVICE_MASTER_TWITTER_SERVICE_TYPE?.RETWEET &&
              params?.row?.is_verified && (
                <Link
                  href={`/business/dashboard/analytics/order-item/${params?.row?.id}`}
                  component={NextLink}
                  sx={{
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  <Tooltip title="Order Item Analytics" placement="top" arrow>
                    <IconButton>
                      <BarChartIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </Link>
              )}
            {(params?.row?.status === ORDER_ITEM_STATUS.ACCEPTED ||
              params?.row?.status === ORDER_ITEM_STATUS.CANCELLED) && (
              // Action to approve the post
              <>
                {!params?.row?.approved && (
                  <Tooltip title="Approve Order Item" placement="top" arrow>
                    <IconButton
                      onClick={() => {
                        approveOrderItem(params?.row?.id);
                      }}
                    >
                      <CheckCircleOutlineOutlinedIcon color="success" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
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
      field: "is_verified",
      headerName: "Verification Status",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <Typography>
            {params?.row?.is_verified ? (
              <CheckCircleIcon color="success" />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "4px",
                }}
              >
                {params?.row?.allow_manual_approval ? (
                  <Tooltip title="Manually Verify">
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      endIcon={<RuleOutlinedIcon />}
                      onClick={() => {
                        setSelectedOrderItemId(params?.row?.id);
                        setOpenVerifyModal(true);
                      }}
                    >
                      Verify
                    </Button>
                  </Tooltip>
                ) : (
                  <CancelIcon color="error" />
                )}
              </Box>
            )}
          </Typography>
        );
      },
    },
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getOrderItems();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [pagination.current_page_number, pagination.current_page_size, filters]);

  useEffect(() => {
    if (!openVerifyModal) getOrderItems();
  }, [openVerifyModal]);

  return (
    <RouteProtection logged_in={true} business_owner={true}>
      <Box
        sx={{
          p: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
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
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2} className="joyride-tabs">
              {orderItemStatusCards.map((card, index) => {
                return (
                  <Grid item key={index} xs={12} sm={6} md={2} lg={2}>
                    <StatusCard
                      card={card}
                      selectedCard={selectedCard}
                      count={
                        card?.value === 0
                          ? orderItemsCount?.accepted +
                            orderItemsCount?.scheduled +
                            orderItemsCount?.published +
                            orderItemsCount?.rejected +
                            orderItemsCount?.cancelled
                          : card?.value === 1
                          ? orderItemsCount?.accepted
                          : card?.value === 2
                          ? orderItemsCount?.scheduled
                          : card?.value === 3
                          ? orderItemsCount?.published
                          : card?.value === 4
                          ? orderItemsCount?.rejected
                          : card?.value === 5
                          ? orderItemsCount?.cancelled
                          : 0
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FilterBar filters={filters} setFilters={setFilters} />
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              getRowId={(row) => (row?.id ? row?.id : 0)}
              autoHeight
              loading={loading}
              rows={orderItems}
              columns={orderItemColumns}
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
                    : "upcoming",
                }));
              }}
              localeText={{
                noRowsLabel: "No order items found",
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
        <UpdateOrder
          order_id={selectedOrder?.id!}
          open={open}
          setOpen={setOpen}
        />

        <ManualVerifyModal
          open={openVerifyModal}
          setOpen={setOpenVerifyModal}
          orderItemId={selectedOrderItemId}
        />
      </Box>
    </RouteProtection>
  );
}
