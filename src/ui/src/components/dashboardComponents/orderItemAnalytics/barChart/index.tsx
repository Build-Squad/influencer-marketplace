import React from "react";
import { ResponsiveBar, BarDatum } from "@nivo/bar";

type BarChartProps = {
  keys: string[];
  data: BarDatum[];
  indexBy: string;
};

const customTheme = {
  background: "#ffffff",
  text: {
    fontSize: 11,
    fill: "#333333",
    outlineWidth: 0,
    outlineColor: "transparent",
  },

  // Add a fontSize for funnel label
  labels: {
    text: {
      fontSize: 18,
      fontWeight: 600,
      color: "#000",
    },
  },
};

export default function BarChart({ keys, data, indexBy }: BarChartProps) {
  return (
    <ResponsiveBar
      keys={keys}
      data={data}
      groupMode="grouped"
      padding={0.3}
      colors={{ scheme: "pastel1" }}
      indexBy={indexBy}
      theme={customTheme}
      margin={{ top: 50, right: 150, bottom: 80, left: 60 }}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      enableGridX={false}
      enableGridY={false}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Date",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Count",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 300]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}
