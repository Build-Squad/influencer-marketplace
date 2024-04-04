import {
  BADGES,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_TIME_FORMAT,
  ORDER_ITEM_STATUS,
  ORDER_STATUS,
  TRANSACTION_TYPE,
} from "@/src/utils/consts";
import {
  Badge,
  Box,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import dayjs from "dayjs";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import EditNoteIcon from "@mui/icons-material/EditNote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import MessageIcon from "@mui/icons-material/Message";
import StatusChip from "@/src/components/shared/statusChip";
import ClaimEscrow from "@/src/components/web3Components/claimEscrow";
import TransactionIcon from "@/src/components/dashboardComponents/transactionIcon";

type Props = any;

export default function TableComponent({
  loading,
  selectedTab,
  orders,
  orderItems,
  setFilters,
  getCurrentBadgeIndex,
  setSelectedOrder,
  setOpen,
  setSelectedReviewOrder,
  getOrders,
  setOpenReviewModal,
  schedulePost,
  setConnectWallet
}: Props) {
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
            className="joyride-actions-column"
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
                          (orderItem?.status === ORDER_ITEM_STATUS.ACCEPTED ||
                            orderItem?.status ===
                              ORDER_ITEM_STATUS.CANCELLED) &&
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
            <Link
              href={`/influencer/messages?order_chat_id=${params?.row?.id}`}
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
            {params?.row?.status === ORDER_STATUS.COMPLETED &&
              params?.row?.transactions.filter(
                (transaction: TransactionType) =>
                  transaction.transaction_type === TRANSACTION_TYPE.CLAIM_ESCROW
              )?.length === 0 && (
                <ClaimEscrow
                  order={params?.row}
                  updateStatus={getOrders}
                  setConnectWallet={setConnectWallet}
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
            {params?.row?.approved &&
              (params?.row?.status === ORDER_ITEM_STATUS.ACCEPTED ||
                params?.row?.status === ORDER_ITEM_STATUS.CANCELLED) &&
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
  return (
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
        setFilters((prev: any) => ({
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
          selectedTab === 0 ? "No orders found" : "No order items found",
      }}
    />
  );
}
