import React, { Fragment } from "react";
import Banner from "./components/banner";
import AnalyticsContainer from "../components/analyticsContainer";

type Props = {};

export default function Influencer({}: Props) {
  return (
    <Fragment>
      <Banner />
      <AnalyticsContainer />
    </Fragment>
  );
}
