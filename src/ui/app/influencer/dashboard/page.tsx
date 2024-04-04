"use client";

import BackIcon from "@/public/svg/Back.svg";
import AcceptedOrders from "@/public/svg/acceptedOrders.svg?icon";
import CompletedOrders from "@/public/svg/completedOrders.svg?icon";
import RejectedOrders from "@/public/svg/rejectedOrders.svg?icon";
import TotalOrders from "@/public/svg/totalOrders.svg?icon";
import FilterBar from "@/src/components/dashboardComponents/filtersBar";
import StatusCard from "@/src/components/dashboardComponents/statusCard";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import { postService } from "@/src/services/httpServices";
import { ORDER_ITEM_STATUS, ORDER_STATUS } from "@/src/utils/consts";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import { Box, Grid, Pagination, Tab, Tabs, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import { DriveEta } from "@mui/icons-material";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import dynamic from "next/dynamic";

const Joyride = dynamic(() => import("react-joyride"));
const TableComponent = dynamic(() => import("./components/tableComponent"));
const UpdateOrder = dynamic(
  () => import("@/src/components/dashboardComponents/updateOrder")
);
const ReviewModal = dynamic(
  () => import("@/src/components/dashboardComponents/reviewModal")
);

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
  const [connectWallet, setConnectWallet] = useState(false);
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
            This tour will help you manage your order accurately once you have
            an order. The options would include editing the orders, claiming the
            payouts, view your ratings, and many more.
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
            and businesses.
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
            Actions include claiming funds, viewing order details and editing
            them.
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
            Review by businesses.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Click the stars (if there's any) to see what the businesses have to
            say about your work.
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
            You've completed your dashboard tour, you're good to go to manage
            your orders and analyse your performance.
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

  const handleUserInteraction = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await postService(
        `orders/order-list/`,
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          order_by: "upcoming",
        }
      );
      if (isSuccess) {
        if (data?.pagination?.total_data_count == 1) {
          setStepIndex(0);
          setRun(true);
        }
      }
    } finally {
      setLoading(false);
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

  useEffect(() => {
    handleUserInteraction();
  }, []);

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
                  selectedTab == 0 && pagination.total_data_count > 0
                    ? "visible"
                    : "hidden",
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
                      <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
                        <StatusCard
                          card={card}
                          selectedCard={selectedCard}
                          count={
                            card?.value === 0
                              ? orderCount?.accepted +
                                orderCount?.completed +
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
            <TableComponent
              setConnectWallet
              loading={loading}
              selectedTab={selectedTab}
              orders={orders}
              orderItems={orderItems}
              setFilters={setFilters}
              schedulePost={schedulePost}
              getCurrentBadgeIndex={getCurrentBadgeIndex}
              setSelectedOrder={setSelectedOrder}
              setOpen={setOpen}
              setSelectedReviewOrder={setSelectedReviewOrder}
              getOrders={getOrders}
              setOpenReviewModal={setOpenReviewModal}
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
