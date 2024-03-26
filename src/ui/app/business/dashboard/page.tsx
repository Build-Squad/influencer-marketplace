"use client";

import BackIcon from "@/public/svg/Back.svg";
import AcceptedOrders from "@/public/svg/acceptedOrders.svg?icon";
import CompletedOrders from "@/public/svg/completedOrders.svg?icon";
import PendingOrders from "@/public/svg/pendingOrders.svg?icon";
import RejectedOrders from "@/public/svg/rejectedOrders.svg?icon";
import TotalOrders from "@/public/svg/totalOrders.svg?icon";
import FilterBar from "@/src/components/dashboardComponents/filtersBar";
import OrderDetails from "@/src/components/dashboardComponents/orderDetails";
import ReviewModal from "@/src/components/dashboardComponents/reviewModal";
import StatusCard from "@/src/components/dashboardComponents/statusCard";
import TransactionIcon from "@/src/components/dashboardComponents/transactionIcon";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import StatusChip from "@/src/components/shared/statusChip";
import CancelEscrow from "@/src/components/web3Components/cancelEscrow";
import { getService, postService } from "@/src/services/httpServices";
import {
  DISPLAY_DATE_FORMAT,
  ORDER_STATUS,
  TRANSACTION_TYPE,
} from "@/src/utils/consts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Box,
  Grid,
  IconButton,
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
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream
=======
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import { DriveEta } from "@mui/icons-material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import MessageIcon from "@mui/icons-material/Message";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
>>>>>>> Stashed changes

export default function BusinessDashboardPage() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [selectedCard, setSelectedCard] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<OrderFilterType>({
    status: [
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.REJECTED,
      ORDER_STATUS.PENDING,
      ORDER_STATUS.COMPLETED,
    ],
    order_by: "-created_at",
  });
  const [selectedReviewOrder, setSelectedReviewOrder] =
    useState<OrderType | null>(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
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
    current_page_size: 10,
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
          status: [
            ORDER_STATUS.ACCEPTED,
            ORDER_STATUS.REJECTED,
            ORDER_STATUS.PENDING,
            ORDER_STATUS.COMPLETED,
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
      label: "Accepted Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_STATUS.ACCEPTED],
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
      label: "Completed Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_STATUS.COMPLETED],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
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
      label: "Pending Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_STATUS.PENDING],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
        }));
        setSelectedCard(3);
      },
      value: 3,
      icon: (
        <PendingOrders
          style={{
            fill: selectedCard === 3 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
    {
      label: "Rejected Orders",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_STATUS.REJECTED],
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
  ];

  const columns = [
    {
      field: "order_code",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "influencer",
      headerName: "Influencer",
      flex: 1,
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        const influencer =
          params?.row?.order_item_order_id[0]?.package?.influencer;
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
              href={`/influencer/profile/${influencer?.id}`}
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
              @{influencer?.twitter_account?.user_name}
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
      flex: 1,
      sortable: false,
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
      field: "action",
      headerName: "Action",
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
                  setSelectedOrder(params?.row);
                }}
              >
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            <>
              {params?.row?.status === ORDER_STATUS.PENDING && (
                <Tooltip
                  title="Go To Order"
                  placement="top"
                  arrow
                  disableInteractive
                >
                  <Link
                    href={`/business/order/${params?.row?.id}`}
                    component={NextLink}
                    sx={{
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <IconButton>
                      <OpenInNewIcon color="secondary" />
                    </IconButton>
                  </Link>
                </Tooltip>
              )}
            </>
            {params?.row?.status === ORDER_STATUS.REJECTED &&
              params?.row?.transactions.filter(
                (transaction: TransactionType) =>
                  transaction.transaction_type ===
                  TRANSACTION_TYPE.CANCEL_ESCROW
              )?.length === 0 && (
                <CancelEscrow order={params?.row} updateStatus={getOrders} />
              )}
          </Box>
        );
      },
    },
    {
      field: "transactions",
      headerName: "Transactions",
      flex: 1,
      sortable: false,
      minWidth: 300,
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
            {params?.row?.transactions?.map((transaction: TransactionType) => {
              return (
                <TransactionIcon
                  key={transaction?.transaction_address}
                  transaction={transaction}
                />
              );
            })}
          </Box>
        );
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
      field: "review.rating",
      headerName: "Review",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <>
            {params?.row?.status === ORDER_STATUS.COMPLETED ? (
              <Tooltip
                title={params?.row?.review?.id ? "Edit review" : "Add review"}
                placement="top"
                arrow
              >
                <Box
                  onClick={() => {
                    setSelectedReviewOrder(params?.row);
                    setOpenReviewModal(true);
                  }}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <Rating
                    name="read-only"
                    value={Number(params?.row?.review?.rating)}
                    readOnly
                  />
                </Box>
              </Tooltip>
            ) : (
              <Typography sx={{ textAlign: "center", fontStyle: "italic" }}>
                Order Not Completed
              </Typography>
            )}
          </>
        );
      },
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
              <CancelIcon color="error" />
            )}
          </Typography>
        );
      },
    },
  ];

  useEffect(() => {
    getOrdersCount();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getOrders();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [pagination.current_page_number, pagination.current_page_size, filters]);

  return (
    <RouteProtection logged_in={true} business_owner={true}>
      <Box
        sx={{
          p: 2,
        }}
      >
        <Image
          src={BackIcon}
          alt={"BackIcon"}
          height={30}
          style={{ marginTop: "8px", marginBottom: "8px", cursor: "pointer" }}
          onClick={() => {
            router.back();
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {statusCards.map((card, index) => {
                return (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
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
            <FilterBar filters={filters} setFilters={setFilters} />
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              getRowId={(row) => (row?.id ? row?.id : 0)}
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
              // Sorting
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
        <OrderDetails
          order={selectedOrder}
          onClose={() => {
            setSelectedOrder(null);
          }}
        />
        <ReviewModal
          reviewOrder={selectedReviewOrder}
          open={openReviewModal}
          setOpen={setOpenReviewModal}
          readonly={false}
          updateState={getOrders}
        />
      </Box>
    </RouteProtection>
  );
}
