import React, { useContext } from "react";

import { PAGE_TYPE, RANK_TYPE } from "../constant";
import {useDispatch, useSelector} from "react-redux";

import {
  setRankMyInfo,
  setRankList,
  setRankLevelList,
  setRankLikeList,
  setRankFormReset, setRankFormRankType, setRankFormPageType, setRankData, setRankFormDate
} from "redux/actions/rank";

const btnArray = [
  { val: RANK_TYPE.DJ, text: "DJ" },
  { val: RANK_TYPE.FAN, text: "팬" },
  { val: RANK_TYPE.LIKE, text: "좋아요" },
];

const fameArray = [
  { val: RANK_TYPE.SPECIAL, text: "스페셜DJ", isSpecial: true },
  // { val: RANK_TYPE.LEVEL, text: "레벨" },
  { val: RANK_TYPE.WEEKLYPICK, text: "위클리픽" },
  { val: RANK_TYPE.SECOND, text: "15초" },
];

function RankBtnWrap() {
  const dispatch = useDispatch();
  const rankState = useSelector(({rank}) => rank);

  const { formState } = rankState;


  return (
    <div className="rankTab">
      {formState.pageType === PAGE_TYPE.RANKING ? (
        <>
          {btnArray.map((v, idx) => {
            return (
              <button
                key={idx}
                className={
                  formState[formState.pageType].rankType === v.val ? "rankTab__btn rankTab__btn--active" : "rankTab__btn"
                }
                onClick={() => {
                  if (formState[formState.pageType].rankType !== v.val) {
                    scrollTo(0, 0);
                    dispatch(setRankFormRankType(v.val));
                  }
                }}
              >
                {v.text}
              </button>
            );
          })}
        </>
      ) : (
        <>
          {fameArray.map((v, idx) => {
            return (
              <button
                key={idx}
                className={
                  formState[formState.pageType].rankType === v.val ? "rankTab__btn rankTab__btn--active" : "rankTab__btn"
                }
                onClick={() => {
                  if (formState[formState.pageType].rankType !== v.val) {
                    scrollTo(0, 0);
                    dispatch(setRankFormRankType(v.val));
                  }
                }}
              >
                {v.text}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

export default React.memo(RankBtnWrap);
