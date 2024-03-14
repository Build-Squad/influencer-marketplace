"use client";

import BackIcon from "@/public/svg/Back.svg";
import FilterBar from "@/src/components/dashboardComponents/orderItemAnalytics/filterBar";
import StatusCard from "@/src/components/dashboardComponents/statusCard";
import { notification } from "@/src/components/shared/notification";
import { postService } from "@/src/services/httpServices";
import {
  DISPLAY_DATE_TIME_FORMAT,
  ORDER_ITEM_METRIC_TYPE,
  ORDER_ITEM_METRIC_TYPE_LABEL,
} from "@/src/utils/consts";
import { OpenInNew } from "@mui/icons-material";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import FaceIcon from "@mui/icons-material/Face";
import PeopleIcon from "@mui/icons-material/People";
import PublicOff from "@mui/icons-material/PublicOff";
import {
  Box,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import { BarDatum } from "@nivo/bar";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DynamicResponsiveBarChart = dynamic(
  () =>
    import(
      "../../../../../../src/components/dashboardComponents/orderItemAnalytics/barChart"
    ),
  {
    ssr: false,
  }
);

const DynamicLineChart = dynamic(
  () =>
    import(
      "../../../../../../src/components/dashboardComponents/orderItemAnalytics/lineChart"
    ),
  {
    ssr: false,
  }
);

export default function OrderItemAnalyticsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const router = useRouter();
  const [selectedView, setSelectedView] = React.useState<string>("line");
  const [selectedMetricType, setSelectedMetricType] = React.useState(0);
  const [orderItem, setOrderItem] = React.useState<OrderItemType | null>(null);
  const [keys, setKeys] = React.useState<string[]>([]);
  const [data, setData] = React.useState<BarDatum[]>([]);
  const [lineData, setLineData] = React.useState<any[]>([]);
  const [indexBy, setIndexBy] = React.useState<string>("");
  const [filters, setFilters] = React.useState<OrderItemMetricFilterType>({
    type: [
      ORDER_ITEM_METRIC_TYPE.NON_PUBLIC_METRICS,
      ORDER_ITEM_METRIC_TYPE.PUBLIC_METRICS,
      ORDER_ITEM_METRIC_TYPE.ORGANIC_METRICS,
    ],
    gt_created_at: null,
    lt_created_at: null,
    metric: [],
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [metricValues, setMetricValues] = React.useState<
    { label: string; value: string }[]
  >([]);

  const formatData = (orderItemMetrics: OrderItemMetricType[]) => {
    let keys: string[] = [];
    let data: BarDatum[] = [];
    let indexBy = "";
    orderItemMetrics.forEach((metric) => {
      if (indexBy === "") {
        indexBy = "created_at";
      }
      const formattedKey =
        ORDER_ITEM_METRIC_TYPE_LABEL[
          metric.metric as keyof typeof ORDER_ITEM_METRIC_TYPE_LABEL
        ];
      if (!keys.includes(formattedKey)) {
        keys.push(formattedKey);
      }
      const dataItem = data.find(
        (item) =>
          item.created_at ===
          dayjs(metric.created_at).format(DISPLAY_DATE_TIME_FORMAT)
      );
      if (dataItem) {
        dataItem[formattedKey] = metric.value;
      } else {
        const newItem = {
          created_at: dayjs(metric.created_at).format(DISPLAY_DATE_TIME_FORMAT),
          formattedKey: metric.value,
        };
        data.push(newItem);
      }
    });

    // Sort data by created_at
    data.sort((a, b) => {
      return dayjs(a.created_at).unix() - dayjs(b.created_at).unix();
    });

    setKeys(keys);
    setData(data);
    setIndexBy(indexBy);
  };

  const formatLineData = (orderItemMetrics: OrderItemMetricType[]) => {
    const lineData: any[] = [];
    const sortedOrderItemMetrics = orderItemMetrics.sort(
      (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix()
    );
    sortedOrderItemMetrics.forEach((metric) => {
      const formattedKey =
        ORDER_ITEM_METRIC_TYPE_LABEL[
          metric.metric as keyof typeof ORDER_ITEM_METRIC_TYPE_LABEL
        ];
      const dataItem = lineData.find((item) => item.id === formattedKey);
      if (dataItem) {
        dataItem.data.push({
          x: dayjs(metric.created_at).format(DISPLAY_DATE_TIME_FORMAT),
          y: metric.value,
        });
      } else {
        const newItem = {
          id: formattedKey,
          data: [
            {
              x: dayjs(metric.created_at).format(DISPLAY_DATE_TIME_FORMAT),
              y: metric.value,
            },
          ],
        };
        lineData.push(newItem);
      }
    });
    setLineData(lineData);
  };

  const getOrderItemMetrics = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await postService(
        `/orders/order-item-metrics/`,
        {
          order_item_id: params.id,
          ...filters,
        }
      );
      if (isSuccess) {
        formatData(data?.data?.order_item_metrics);
        formatLineData(data?.data?.order_item_metrics);
        setOrderItem(data?.data?.order_item);

        let _metricValues: { label: string; value: string }[] = [];

        data?.data?.all_metrics.forEach((metric: string) => {
          const formattedKey =
            ORDER_ITEM_METRIC_TYPE_LABEL[
              metric as keyof typeof ORDER_ITEM_METRIC_TYPE_LABEL
            ];
          _metricValues.push({ label: formattedKey, value: metric });
        });

        setMetricValues(_metricValues);
      } else {
        notification(
          message ? message : "Failed to fetch order item analytics",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const metricTypeCards = [
    {
      label: "All Metrics",
      value: 0,
      icon: (
        <AlignHorizontalLeftIcon
          style={{
            fill: selectedMetricType === 0 ? "#fff" : "#19191929",
          }}
        />
      ),
      onClick: () => {
        setSelectedMetricType(0);
        setFilters({
          ...filters,
          type: [
            ORDER_ITEM_METRIC_TYPE.NON_PUBLIC_METRICS,
            ORDER_ITEM_METRIC_TYPE.PUBLIC_METRICS,
            ORDER_ITEM_METRIC_TYPE.ORGANIC_METRICS,
          ],
          metric: [],
        });
      },
    },
    {
      label: "Organic Metrics",
      value: 1,
      icon: (
        <FaceIcon
          style={{
            fill: selectedMetricType === 1 ? "#fff" : "#19191929",
          }}
        />
      ),
      onClick: () => {
        setSelectedMetricType(1);
        setFilters({
          ...filters,
          type: [ORDER_ITEM_METRIC_TYPE.ORGANIC_METRICS],
          metric: [],
        });
      },
    },
    {
      label: "Public Metrics",
      value: 2,
      icon: (
        <PeopleIcon
          style={{
            fill: selectedMetricType === 2 ? "#fff" : "#19191929",
          }}
        />
      ),
      onClick: () => {
        setSelectedMetricType(2);
        setFilters({
          ...filters,
          type: [ORDER_ITEM_METRIC_TYPE.PUBLIC_METRICS],
          metric: [],
        });
      },
    },
    {
      label: "Non Public Metrics",
      value: 3,
      icon: (
        <PublicOff
          style={{
            fill: selectedMetricType === 3 ? "#fff" : "#19191929",
          }}
        />
      ),
      onClick: () => {
        setSelectedMetricType(3);
        setFilters({
          ...filters,
          type: [ORDER_ITEM_METRIC_TYPE.NON_PUBLIC_METRICS],
          metric: [],
        });
      },
    },
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getOrderItemMetrics();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
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
          <Typography variant="h6">Analytics</Typography>
          <Tooltip title="View Post On X">
            <IconButton>
              <Link
                href={`https://x.com/${orderItem?.package?.influencer?.twitter_account?.user_name}/status/${orderItem?.published_tweet_id}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  color: "#676767",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                component={NextLink}
              >
                <OpenInNew />
              </Link>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {metricTypeCards.map((card, index) => (
              <Grid
                item
                xs={12}
                md={3}
                lg={12 / metricTypeCards.length}
                key={index}
              >
                <StatusCard
                  card={card}
                  selectedCard={selectedMetricType}
                  count={0}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            metricValues={metricValues}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            height: "600px",
            m: 2,
          }}
        >
          {selectedView === "bar" ? (
            <DynamicResponsiveBarChart
              keys={keys}
              data={data}
              indexBy={indexBy}
            />
          ) : (
            <DynamicLineChart data={lineData} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
