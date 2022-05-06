import React, { useState } from "react";

import { convertMonday, convertMonth } from "lib/rank_fn";

// constant
import {DATE_TYPE, PAGE_TYPE, RANK_TYPE} from "../constant";

import guideIcon from "../static/guide_s.svg";
import GuidePop from "./rank_guide_pop";
import {setRankFormDateType} from "../../../redux/actions/rank";
import {useDispatch} from "react-redux";


const btnArray = [
  { val: DATE_TYPE.TIME, text: "타임" },
  { val: DATE_TYPE.DAY, text: "일간" },
  { val: DATE_TYPE.WEEK, text: "주간" },
  { val: DATE_TYPE.MONTH, text: "월간" },
  { val: DATE_TYPE.YEAR, text: "연간" },
];

const DateBtnWrap = function({ formState }) {
  const dispatch = useDispatch();
  const [guidePop, setGuidePop] = useState(false);
  const [guideState, setGuideState] = useState("like");

  const guidePopup = () => {
    setGuidePop(true);
    setGuideState("like");
  };
  const createBtnArray = () => {
    let type;
    if (formState[formState.pageType].rankType === RANK_TYPE.FAN) {
      type = btnArray.slice(1, 4);
    } else if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
      type = btnArray.slice(1, 3);
    } else {
      type = btnArray;
    }
    return type;
  };

  return (
    <div className="todayList">
      {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
        <div className="guideIconBox">
          <img
            src={guideIcon}
            onClick={() => {
              guidePopup();
            }}
          />
        </div>
      ) : (
        ""
      )}

      {createBtnArray().map((v, idx) => {
        return (
          <button
            key={idx}
            className={
              formState[formState.pageType].dateType === v.val ? "todayList__btn todayList__btn--active" : "todayList__btn"
            }
            onClick={() => {
              if (formState[formState.pageType].dateType !== v.val) {
                const someDate = v.val === 2 ? convertMonday() : v.val === 3 ? convertMonth() : new Date();
                dispatch(setRankFormDateType({
                  dateType: v.val,
                  date: someDate,
                }));
              }
            }}
          >
            {v.text}
          </button>
        );
      })}
      {guidePop && <GuidePop guideState={guideState} setGuidePop={setGuidePop} />}
    </div>
  );
};

export default React.memo(DateBtnWrap);
