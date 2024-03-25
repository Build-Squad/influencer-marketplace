"use client";

import BackIcon from "@/public/svg/Back.svg";
import AcceptedOrders from "@/public/svg/acceptedOrders.svg?icon";
import CompletedOrders from "@/public/svg/completedOrders.svg?icon";
import RejectedOrders from "@/public/svg/rejectedOrders.svg?icon";
import TotalOrders from "@/public/svg/totalOrders.svg?icon";
import FilterBar from "@/src/components/dashboardComponents/filtersBar";
import ReviewModal from "@/src/components/dashboardComponents/reviewModal";
import StatusCard from "@/src/components/dashboardComponents/statusCard";
import TransactionIcon from "@/src/components/dashboardComponents/transactionIcon";
import UpdateOrder from "@/src/components/dashboardComponents/updateOrder";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import StatusChip from "@/src/components/shared/statusChip";
import ClaimEscrow from "@/src/components/web3Components/claimEscrow";
import { postService } from "@/src/services/httpServices";
import {
  BADGES,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_TIME_FORMAT,
  ORDER_ITEM_STATUS,
  ORDER_STATUS,
  TRANSACTION_TYPE,
} from "@/src/utils/consts";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import EditNoteIcon from "@mui/icons-material/EditNote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import {
  Avatar,
  Badge,
  Box,
  Grid,
  IconButton,
  Link,
  Pagination,
  Rating,
  Tab,
  Tabs,
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
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const tabs = [
  {
    title: "Orders",
    route: `/influencer/dashboard/?tab=orders`,
    value: 0,
    key: "orders",
  },
  {
    title: "Order Items",
    route: `/influencer/dashboard/?tab=order-items`,
    value: 1,
    key: "order-items",
  },
];

const getProfileCompletedStatus: (businessDetails: any) => string = (
  businessDetails
) => {
  if (businessDetails) {
    let count = 0;
    if (businessDetails?.isTwitterAccountConnected) count += 5;
    if (businessDetails?.isWalletConnected) count += 5;
    count +=
      Object.values(businessDetails).filter(
        (value) => value !== "" && value !== null
      ).length - 7;
    return `${count} / ${10 + Object.keys(businessDetails).length - 7}`;
  }
  return "-";
};

export default function BusinessDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [selectedReviewOrder, setSelectedReviewOrder] =
    useState<OrderType | null>(null);
  const [open, setOpen] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedCard, setSelectedCard] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<OrderFilterType>({
    status: [
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.REJECTED,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED,
    ],
    order_by: "upcoming",
  });
  const [orderCount, setOrderCount] = React.useState({
    accepted: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [orderItemsCount, setOrderItemsCount] = React.useState({
    accepted: 0,
    scheduled: 0,
    published: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 10,
  });
  const [selectedTab, setSelectedTab] = React.useState<number>(0);

  const schedulePost = async (id: string, action: string) => {
    try {
      const { isSuccess, data, message } = await postService(
        action === ORDER_ITEM_STATUS.SCHEDULED
          ? `/orders/send-tweet`
          : `/orders/cancel-tweet`,
        {
          order_item_id: id,
        }
      );
      if (isSuccess) {
        notification(message);
        getOrderItems();
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } finally {
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
          ...filters,
        }
      );
      if (isSuccess) {
        setOrders(data?.data?.orders);
        setOrderCount({
          accepted: data?.data?.status_counts?.accepted,
          completed: data?.data?.status_counts?.completed,
          pending: data?.data?.status_counts?.pending,
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
      label: "All",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [
            ORDER_STATUS.ACCEPTED,
            ORDER_STATUS.REJECTED,
            ORDER_STATUS.COMPLETED,
            ORDER_STATUS.CANCELLED,
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
      label: "Completed",
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
      label: "Rejected",
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
    {
      label: "Cancelled",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [ORDER_STATUS.CANCELLED],
        }));
        setPagination((prev) => ({
          ...prev,
          current_page_number: 1,
        }));
        setSelectedCard(5);
      },
      value: 5,
      icon: (
        <RejectedOrders
          style={{
            fill: selectedCard === 5 ? "#fff" : "#19191929",
          }}
        />
      ),
    },
  ];

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

  const getProgressPercentage = (order: OrderType) => {
    const completionStringArr = getProfileCompletedStatus(
      order?.buyer_meta_data
    )
      .replace(/\s/g, "")
      .split("/");

    return (
      (parseInt(completionStringArr[0]) / parseInt(completionStringArr[1])) *
      100
    );
  };

  const getCurrentBadgeIndex = (order: OrderType) => {
    const per = getProgressPercentage(order);
    return per <= 25 ? 0 : per <= 50 ? 1 : per <= 75 ? 2 : per <= 100 ? 3 : 0;
  };

  const columns = [
    {
      field: "order_code",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "buyer__username",
      headerName: "Business",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        const badge = BADGES[getCurrentBadgeIndex(params?.row)];
        return (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "16px",
              lineHeight: "19px",
              color: "#000",
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
            }}
          >
            <Tooltip
              title={
                <React.Fragment>
                  <Typography variant="body2" fontWeight={"bold"}>
                    {badge?.name}
                  </Typography>
                  <Typography variant="caption">
                    {badge?.description}
                  </Typography>
                </React.Fragment>
              }
              arrow
            >
              <Image
                src={badge?.icon}
                style={{ width: 24, height: 24 }}
                alt="Business Badge"
              />
            </Tooltip>
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
              <Badge
                badgeContent={
                  params?.row?.status === ORDER_STATUS.ACCEPTED
                    ? params?.row?.order_item_order_id?.filter(
                        (orderItem: OrderItemType) =>
                          orderItem?.status === ORDER_ITEM_STATUS.ACCEPTED &&
                          dayjs(orderItem?.publish_date) > dayjs()
                      )?.length
                    : 0
                }
                color="secondary"
                overlap="circular"
                // Dont show badge if the order is completed
                invisible={
                  params?.row?.status === ORDER_STATUS.COMPLETED ||
                  params?.row?.status === ORDER_STATUS.REJECTED
                }
              >
                <IconButton
                  onClick={() => {
                    setSelectedOrder(params?.row);
                    setOpen(true);
                  }}
                >
                  <EditNoteIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            {params?.row?.status === ORDER_STATUS.COMPLETED &&
              params?.row?.transactions.filter(
                (transaction: TransactionType) =>
                  transaction.transaction_type === TRANSACTION_TYPE.CLAIM_ESCROW
              )?.length === 0 && (
                <ClaimEscrow order={params?.row} updateStatus={getOrders} />
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
      field: "review__rating",
      headerName: "Review",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): React.ReactNode => {
        return (
          <>
            {params?.row?.review?.rating ? (
              <Tooltip
                title={
                  params?.row?.review?.note
                    ? params?.row?.review?.note
                    : "No Review Available"
                }
                placement="top"
                arrow
                disableHoverListener={!params?.row?.review?.note}
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
                No Review
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
            {params?.row?.status === ORDER_ITEM_STATUS.ACCEPTED &&
              // Publish date is in the future
              dayjs(params?.row?.publish_date) > dayjs() && (
                <Tooltip title="Schedule Post" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      schedulePost(
                        params?.row?.id,
                        ORDER_ITEM_STATUS.SCHEDULED
                      );
                    }}
                  >
                    <ScheduleSendIcon color="warning" />
                  </IconButton>
                </Tooltip>
              )}
            {params?.row?.status === ORDER_ITEM_STATUS.SCHEDULED &&
              dayjs(params?.row?.publish_date) > dayjs() && (
                <Tooltip title="Cancel Post" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      schedulePost(
                        params?.row?.id,
                        ORDER_ITEM_STATUS.CANCELLED
                      );
                    }}
                  >
                    <CancelScheduleSendIcon color="error" />
                  </IconButton>
                </Tooltip>
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
  ];

  useEffect(() => {
    const tab = searchParams.get("tab");
    const _selectedTab = tabs.find((_tab) => _tab.key === tab);
    if (_selectedTab) setSelectedTab(_selectedTab?.value);
    else router.push(tabs[0]?.route!);
  }, [searchParams]);

  useEffect(() => {
    if (!open) getOrders();
  }, [open]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (selectedTab === 0) {
        getOrders();
      }
      if (selectedTab === 1) {
        getOrderItems();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [pagination.current_page_number, pagination.current_page_size, filters]);

  useEffect(() => {
    if (selectedTab === 1) {
      setFilters((prev) => ({
        ...prev,
        status: [
          ORDER_ITEM_STATUS.ACCEPTED,
          ORDER_ITEM_STATUS.PUBLISHED,
          ORDER_ITEM_STATUS.REJECTED,
          ORDER_ITEM_STATUS.SCHEDULED,
          ORDER_ITEM_STATUS.CANCELLED,
          ORDER_ITEM_STATUS.IN_PROGRESS,
        ],
        order_by: "upcoming",
      }));
      setSelectedCard(0);
    } else {
      setFilters((prev) => ({
        ...prev,
        status: [
          ORDER_STATUS.ACCEPTED,
          ORDER_STATUS.REJECTED,
          ORDER_STATUS.COMPLETED,
          ORDER_STATUS.CANCELLED,
        ],
        order_by: "upcoming",
      }));
      setSelectedCard(0);
    }
  }, [selectedTab]);

  return (
    <RouteProtection logged_in={true} influencer={true}>
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
            <Tabs
              value={selectedTab}
              onChange={(event, newValue) => {
                setSelectedTab(newValue);
                router.push(tabs.find((tab) => tab.value === newValue)?.route!);
              }}
            >
              {tabs.map((tab, index) => {
                return (
                  <Tab
                    key={index}
                    label={tab.title}
                    value={tab.value}
                    sx={{
                      color: selectedTab === tab.value ? "#0099FF" : "#000000",
                      fontSize: "16px",
                      lineHeight: "19px",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  />
                );
              })}
            </Tabs>
            <Box></Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {selectedTab === 0 ? (
                <>
                  {statusCards.map((card, index) => {
                    return (
                      <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
                        <StatusCard
                          card={card}
                          selectedCard={selectedCard}
                          count={
                            card?.value === 0
                              ? orderCount?.accepted +
                                orderCount?.completed +
                                orderCount?.pending +
                                orderCount?.rejected +
                                orderCount?.cancelled
                              : card?.value === 1
                              ? orderCount?.accepted
                              : card?.value === 2
                              ? orderCount?.completed
                              : card?.value === 3
                              ? orderCount?.pending
                              : card?.value === 4
                              ? orderCount?.rejected
                              : card?.value === 5
                              ? orderCount?.cancelled
                              : 0
                          }
                        />
                      </Grid>
                    );
                  })}
                </>
              ) : (
                <>
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
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {/* Filters bar */}
            <FilterBar filters={filters} setFilters={setFilters} />
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              getRowId={(row) => (row?.id ? row?.id : 0)}
              autoHeight
              loading={loading}
              rows={selectedTab === 0 ? orders : orderItems}
              columns={selectedTab === 0 ? columns : orderItemColumns}
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
                noRowsLabel:
                  selectedTab === 0
                    ? "No orders found"
                    : "No order items found",
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
        <ReviewModal
          reviewOrder={selectedReviewOrder}
          open={openReviewModal}
          setOpen={setOpenReviewModal}
          readonly={true}
        />
      </Box>
    </RouteProtection>
  );
}
