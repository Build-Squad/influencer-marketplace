import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_TIME_FORMAT,
  ORDER_ITEM_STATUS,
  ORDER_STATUS,
  SERVICE_MASTER_TWITTER_SERVICE_TYPE,
  TRANSACTION_TYPE,
} from "@/src/utils/consts";
import {
  Box,
  Button,
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
import NextLink from "next/link";
import dayjs from "dayjs";
import EditNoteIcon from "@mui/icons-material/EditNote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MessageIcon from "@mui/icons-material/Message";
import StatusChip from "@/src/components/shared/statusChip";
import TransactionIcon from "@/src/components/dashboardComponents/transactionIcon";
import CancelEscrow from "@/src/components/web3Components/cancelEscrow";
import { ConfirmCancel } from "@/src/components/shared/confirmCancel";
import CancelIcon from "@mui/icons-material/Cancel";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

type Props = any;

export default function TableComponent({
  setOpen,
  setSelectedOrder,
  getOrders,
  setConnectWallet,
  setSelectedReviewOrder,
  setOpenReviewModal,
  approveOrderItem,
  cancelOrder,
  setSelectedOrderItemId,
  setOpenVerifyModal,
  selectedTab,
  loading,
  setFilters,
  orders,
  orderItems,
}: Props) {
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
                />
              )}
            {(params?.row?.status === ORDER_STATUS.ACCEPTED ||
              params?.row?.status === ORDER_STATUS.PENDING) &&
              params?.row?.order_item_order_id?.filter(
                (item: OrderItemType) =>
                  item?.status === ORDER_ITEM_STATUS.PUBLISHED ||
                  item?.status === ORDER_ITEM_STATUS.SCHEDULED
              ).length === 0 && (
                <ConfirmCancel
                  onConfirm={() => {
                    cancelOrder(params?.row);
                  }}
                  deleteElement={
                    <HighlightOffIcon color="secondary" sx={{ mt: 1 }} />
                  }
                  title={`Order ${params?.row?.order_code}`}
                  hide={true}
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
