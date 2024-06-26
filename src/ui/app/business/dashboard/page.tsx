"use client";

import BackIcon from "@/public/svg/Back.svg";
import AcceptedOrders from "@/public/svg/acceptedOrders.svg?icon";
import CompletedOrders from "@/public/svg/completedOrders.svg?icon";
import PendingOrders from "@/public/svg/pendingOrders.svg?icon";
import RejectedOrders from "@/public/svg/rejectedOrders.svg?icon";
import TotalOrders from "@/public/svg/totalOrders.svg?icon";
import FilterBar from "@/src/components/dashboardComponents/filtersBar";
import ReviewModal from "@/src/components/dashboardComponents/reviewModal";
import StatusCard from "@/src/components/dashboardComponents/statusCard";
import TransactionIcon from "@/src/components/dashboardComponents/transactionIcon";
import UpdateOrder from "@/src/components/dashboardComponents/updateOrder";
import { ConfirmCancel } from "@/src/components/shared/confirmCancel";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import StatusChip from "@/src/components/shared/statusChip";
import CancelEscrow from "@/src/components/web3Components/cancelEscrow";
import { postService, putService } from "@/src/services/httpServices";
import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_TIME_FORMAT,
  ORDER_ITEM_STATUS,
  ORDER_STATUS,
  SERVICE_MASTER_TWITTER_SERVICE_TYPE,
  TRANSACTION_TYPE,
} from "@/src/utils/consts";
import BarChartIcon from "@mui/icons-material/BarChart";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import {
  Box,
  Button,
  CircularProgress,
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
import { closeSnackbar, enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import { DriveEta } from "@mui/icons-material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import MessageIcon from "@mui/icons-material/Message";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import ManualVerifyModal from "@/src/components/dashboardComponents/manualVerifyModal";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  endCancellation,
  startCancellation,
} from "@/src/reducers/orderCancellationSlice";

const tabs = [
  {
    title: "Orders",
    route: `/business/dashboard/?tab=orders`,
    value: 0,
    key: "orders",
  },
  {
    title: "Order Items",
    route: `/business/dashboard/?tab=order-items`,
    value: 1,
    key: "order-items",
  },
];
export default function BusinessDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cancellationInProgress = useAppSelector(
    (state) => state.orderCancellation.cancellationInProgress
  );
  const [connectWallet, setConnectWallet] = useState(false);
  const searchParams = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string>("");
  const [selectedCard, setSelectedCard] = React.useState<number>(0);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [hasAnOrder, setHasAnOrder] = useState(false);
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
  const [selectedReviewOrder, setSelectedReviewOrder] =
    useState<OrderType | null>(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [orderCount, setOrderCount] = React.useState({
    accepted: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    cancelled: 0,
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
  const [selectedTab, setSelectedTab] = React.useState<number>(0);

  // User Guide only for the order's tab for the very first order. And if there are no orders only show the first step
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
            Manage your orders here!
          </Typography>
          <Typography sx={{ mt: 1 }}>
            This tour will help you manage your order accurately once you've
            placed an order. The options would include editing your orders,
            cancelling your orders, view the transactions, giving ratings and
            many more.
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
            Categorise your orders.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Click on the status you wanna view your orders for.
          </Typography>
        </Box>
      ),
      placement: "top",
      target: ".joyride-tabs",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Customized filters.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Advanced filters for orders based on the services, date, order ID,
            and influencers.
          </Typography>
        </Box>
      ),
      placement: "top",
      target: ".joyride-dashboard-filters",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Take actions.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Hover the actions to see what it does and click to do the action.
            Actions include viewing order details, editing your order,
            cancelling the order and many more.
          </Typography>
        </Box>
      ),
      placement: "top",
      target: ".joyride-actions-column",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Give reviews.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Click here to give reviews to the orders.
          </Typography>
        </Box>
      ),
      placement: "top",
      target: ".joyride-review-column",
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
            You've completed your dashboard tour, you're now good to go to
            manage your orders and analyse them.
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
    try {
      const { isSuccess, data, message } = await postService(
        `orders/order-list/`,
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          status: [
            ORDER_STATUS.ACCEPTED,
            ORDER_STATUS.REJECTED,
            ORDER_STATUS.PENDING,
            ORDER_STATUS.COMPLETED,
            ORDER_STATUS.CANCELLED,
          ],
          order_by: "upcoming",
        }
      );
      if (isSuccess) {
        // If the total number of order is exactly one for a business
        if (data?.pagination?.total_data_count == 1) {
          setStepIndex(0);
          setRun(true);
        }
        if (data?.pagination?.total_data_count > 0) {
          setHasAnOrder(true);
        }
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

  const isOrderCancellationAllowed = (order: OrderType): boolean => {
    const orderStatus = order?.status;
    const orderItems = order?.order_item_order_id;

    const isValidOrderStatus =
      orderStatus === ORDER_STATUS.ACCEPTED ||
      orderStatus === ORDER_STATUS.PENDING;
    const hasValidOrderItems =
      orderItems?.filter(
        (item: OrderItemType) =>
          item?.status === ORDER_ITEM_STATUS.PUBLISHED ||
          item?.status === ORDER_ITEM_STATUS.SCHEDULED
      ).length === 0;

    let isNotWithinAnHourOfSpaces = true;

    orderItems?.forEach((order_item: OrderItemType) => {
      if (
        order_item?.status === ORDER_ITEM_STATUS.ACCEPTED &&
        order_item?.service_master?.twitter_service_type ===
          SERVICE_MASTER_TWITTER_SERVICE_TYPE.SPACES
      ) {
        if (
          dayjs(order_item?.publish_date) > dayjs() &&
          dayjs(order_item?.publish_date).diff(dayjs(), "hour") < 1
        ) {
          isNotWithinAnHourOfSpaces = false;
        }
      }
    });

    return (
      isValidOrderStatus && hasValidOrderItems && isNotWithinAnHourOfSpaces
    );
  };

  const cancelOrder = async (order: OrderType) => {
    try {
      setCancelLoading(true);
      const action = () => (
        <>
          <CircularProgress color="inherit" size={20} />
        </>
      );
      dispatch(startCancellation());
      const cancellationNotification = enqueueSnackbar(
        `Cancelling ${order?.order_code}, please wait for confirmation`,
        {
          variant: "default",
          persist: true,
          action,
        }
      );
      const { isSuccess, message } = await putService(
        `/orders/cancel-order/${order?.id}/`,
        {}
      );
      if (isSuccess) {
        closeSnackbar(cancellationNotification);
        dispatch(endCancellation());
        notification("Order cancelled successfully", "success");
        getOrders();
      } else {
        closeSnackbar(cancellationNotification);
        dispatch(endCancellation());
        notification(
          message ? message : "Something went wrong, couldn't cancel order",
          "error",
          3000
        );
      }
    } finally {
      setCancelLoading(false);
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

  const statusCards = [
    {
      label: "All",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: [
            ORDER_STATUS.ACCEPTED,
            ORDER_STATUS.REJECTED,
            ORDER_STATUS.PENDING,
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
      label: "Pending",
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
            className="joyride-actions-column"
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
                  setOpen(true);
                }}
                disabled={cancellationInProgress}
              >
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            <Link
              href={`/business/messages?order_chat_id=${params?.row?.id}`}
              component={NextLink}
              sx={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <Tooltip title="Go to Order Chat" placement="top" arrow>
                <IconButton>
                  <MessageIcon />
                </IconButton>
              </Tooltip>
            </Link>
            {(params?.row?.status === ORDER_STATUS.REJECTED ||
              params?.row?.status === ORDER_STATUS.CANCELLED) &&
              params?.row?.transactions.filter(
                (transaction: TransactionType) =>
                  transaction.transaction_type ===
                  TRANSACTION_TYPE.CANCEL_ESCROW
              )?.length === 0 && (
                <CancelEscrow
                  order={params?.row}
                  updateStatus={getOrders}
                  setConnectWallet={setConnectWallet}
                  disabled={cancellationInProgress}
                />
              )}
            {isOrderCancellationAllowed(params?.row) && (
              <ConfirmCancel
                onConfirm={() => {
                  cancelOrder(params?.row);
                }}
                deleteElement={
                  <IconButton disabled={cancellationInProgress}>
                    <HighlightOffIcon />
                  </IconButton>
                }
                title={`Order ${params?.row?.order_code}`}
                hide={true}
                disabled={cancellationInProgress}
              />
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
                  className="joyride-review-column"
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
              params?.row?.service_master?.twitter_service_type !==
                SERVICE_MASTER_TWITTER_SERVICE_TYPE.SPACES &&
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
    handleUserInteraction();
  }, []);

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
          ORDER_STATUS.PENDING,
          ORDER_STATUS.CANCELLED,
        ],
        order_by: "upcoming",
      }));
      setSelectedCard(0);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (!open) getOrders();
  }, [open]);

  useEffect(() => {
    if (!openVerifyModal) getOrderItems();
  }, [openVerifyModal]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const _selectedTab = tabs.find((_tab) => _tab.key === tab);
    if (_selectedTab) setSelectedTab(_selectedTab?.value);
    else router.replace(tabs[0]?.route!);
  }, [searchParams]);

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

            <Box sx={{ display: "flex", justifyContent: "center", flex: 2 }}>
              <Tabs
                value={selectedTab}
                onChange={(event, newValue) => {
                  setSelectedTab(newValue);
                  router.push(
                    tabs.find((tab) => tab.value === newValue)?.route!
                  );
                }}
              >
                {tabs.map((tab, index) => {
                  return (
                    <Tab
                      key={index}
                      label={tab.title}
                      value={tab.value}
                      sx={{
                        color:
                          selectedTab === tab.value ? "#0099FF" : "#000000",
                        fontSize: "16px",
                        lineHeight: "19px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    />
                  );
                })}
              </Tabs>
            </Box>

            <Box
              sx={{
                flex: 1,
                mr: 4,
                color: "grey",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                columnGap: "4px",
                visibility:
                  selectedTab == 0 && hasAnOrder ? "visible" : "hidden",
              }}
              onClick={() => {
                setStepIndex(0);
                setRun(true);
              }}
            >
              <DriveEta fontSize="small" />
              <Typography sx={{ color: "#C60C30" }}>Take A Tour!</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2} className="joyride-tabs">
              {selectedTab === 0 ? (
                <>
                  {statusCards.map((card, index) => {
                    return (
                      <Grid item key={index} xs={12} sm={6} md={4} lg={2}>
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
          readonly={false}
          updateState={getOrders}
        />
        <ManualVerifyModal
          open={openVerifyModal}
          setOpen={setOpenVerifyModal}
          orderItemId={selectedOrderItemId}
        />
        {selectedTab == 0 ? (
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
        ) : null}
      </Box>
      <WalletConnectModal
        open={connectWallet}
        setOpen={setConnectWallet}
        connect={true}
      />
    </RouteProtection>
  );
}
