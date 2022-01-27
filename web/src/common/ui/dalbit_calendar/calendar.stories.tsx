import React, { useState, useEffect } from "react";
import { addParameters } from "@storybook/react";
import moment from "moment";
// Calendar
import Calendar from "react-calendar";
// css
import "./calendar_reset.scss"; // 기본 npm style
import "./calendar.scss"; // customizing style

addParameters({
  options: {
    selectedPanel: "storybook/docs/panel",
  },
});

export default {
  title: "Dalbit Calendar",
  component: Calendar,
  parameters: {
    componentSubtitle: "React Calendar Component (https://www.npmjs.com/package/react-calendar)",
  },
};

// 날짜 하나 선택
export const noRange = () => {
  const [value, onChange] = useState(new Date());
  useEffect(() => {
    let startDate: string;
    startDate = moment(value).format("YYYY-MM-DD");
    // Calendar.alert(startDate);
    // setState({});
  }, [value]);
  const val = new Date("2020-07-13");
  return <Calendar onChange={onChange} value={value} maxDate={val} />;
};

// 날짜 range 선택
export const Range = () => {
  const [value, onChange] = useState(new Date());
  useEffect(() => {
    let startDate: string, endDate: string;
    startDate = moment(value[0]).format("YYYY-MM-DD");
    endDate = moment(value[1]).format("YYYY-MM-DD");
    // setState({});
  }, [value]);
  return <Calendar onChange={onChange} value={value} selectRange={true} />;
};
