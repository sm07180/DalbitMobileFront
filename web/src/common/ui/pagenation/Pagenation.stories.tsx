import React, { useState } from "react";
import Pagenation from "./Pagenation";
import { action } from "@storybook/addon-actions";
import { addParameters } from "@storybook/react";
import { withKnobs, number, object } from "@storybook/addon-knobs";
import { useEffect } from "@storybook/addons";

addParameters({
  options: {
    selectedPanel: "storybook/docs/panel",
  },
});

export default {
  title: "Pagenation",
  component: Pagenation,
  parameters: {
    componentSubtitle: "버튼으로 Page를 바꾸는 컴포넌트",
  },
  decorators: [withKnobs],
};

export const Default = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [originalList, setOriginalList] = useState(list);
  const [filterList, setFilterList] = useState(list);
  /** 페이지에서 보여줄 갯수 */
  const num = 10;
  const totalPage = number("totalPage", 5);
  const mapList = object("list", filterList);
  return (
    <div>
      <div>
        {mapList.map((v, i) => {
          return <p key={i}>{v.text}</p>;
        })}
      </div>
      <Pagenation
        setPage={(param) => {
          action("setPage")(param);
          setCurrentPage(param);
        }}
        currentPage={currentPage}
        totalPage={totalPage}
        count={5}
      />
    </div>
  );
};

export const total10 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Pagenation
      setPage={(param) => {
        action("setPage")(param);
        setCurrentPage(param);
      }}
      currentPage={currentPage}
      totalPage={10}
      count={5}
    />
  );
};

export const count10 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Pagenation
      setPage={(param) => {
        action("setPage")(param);
        setCurrentPage(param);
      }}
      currentPage={currentPage}
      totalPage={10}
      count={10}
    />
  );
};

const list = [
  { text: "1번쨰" },
  { text: "2번쨰" },
  { text: "3번쨰" },
  { text: "4번쨰" },
  { text: "5번쨰" },
  { text: "6번쨰" },
  { text: "7번쨰" },
  { text: "8번쨰" },
  { text: "9번쨰" },
  { text: "10번쨰" },
  { text: "11번쨰" },
  { text: "12번쨰" },
  { text: "13번쨰" },
  { text: "14번쨰" },
  { text: "15번쨰" },
  { text: "16번쨰" },
  { text: "17번쨰" },
  { text: "18번쨰" },
  { text: "19번쨰" },
  { text: "20번쨰" },
  { text: "21번쨰" },
  { text: "22번쨰" },
  { text: "23번쨰" },
  { text: "24번쨰" },
  { text: "25번쨰" },
  { text: "26번쨰" },
  { text: "27번쨰" },
  { text: "28번쨰" },
  { text: "29번쨰" },
  { text: "30번쨰" },
  { text: "31번쨰" },
  { text: "32번쨰" },
];
