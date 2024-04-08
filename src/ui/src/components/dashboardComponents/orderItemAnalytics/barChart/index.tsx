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

const getTspanGroups = (
  value: string,
  maxLineLength: number,
  maxLines: number = 2
) => {
  const words = value.split(" ");

  type linesAcc = {
    lines: string[];
    currLine: string;
  };

  //reduces the words into lines of maxLineLength
  const assembleLines: linesAcc = words.reduce(
    (acc: linesAcc, word: string) => {
      //if the current line isn't empty and the word + current line is larger than the allowed line size, create a new line and update current line
      if ((word + acc.currLine).length > maxLineLength && acc.currLine !== "") {
        return {
          lines: acc.lines.concat([acc.currLine]),
          currLine: word,
        };
      }
      //otherwise add the word to the current line
      return {
        ...acc,
        currLine: acc.currLine + " " + word,
      };
    },
    { lines: [], currLine: "" }
  );

  //add the ending state of current line (the last line) to lines
  const allLines = assembleLines.lines.concat([assembleLines.currLine]);

  //for now, only take first 2 lines due to tick spacing and possible overflow
  const lines = allLines.slice(0, maxLines);
  let children: JSX.Element[] = [];
  let dy = 0;

  lines.forEach((lineText, i) => {
    children.push(
      <tspan x={0} dy={dy} key={i}>
        {
          // if on the second line, and that line's length is within 3 of the max length, add ellipsis
          1 === i && allLines.length > 2
            ? lineText.slice(0, maxLineLength - 3) + "..."
            : lineText
        }
      </tspan>
    );
    //increment dy to render next line text below
    dy += 15;
  });

  return children;
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
