import React, { useContext, useEffect, useState, useCallback } from "react";

import { RankContext } from "context/rank_ctx";

import { changeDate } from "lib/rank_fn";

export default function SpecialHistoryHandle() {
  const { rankState, rankAction } = useContext(RankContext);

  const { formState } = rankState;

  const formDispatch = rankAction.formDispatch!;

  const [dateTitle, setDateTitle] = useState("이번달");

  const handleDate = (type) => {
    const handle = changeDate(type, 3, formState[formState.pageType].currentDate);

    formDispatch({
      type: "DATE",
      val: handle,
    });
  };

  const formatDate = useCallback(() => {
    const yy = formState[formState.pageType].currentDate.getFullYear();
    const mm = formState[formState.pageType].currentDate.getMonth() + 1;
    const dd = formState[formState.pageType].currentDate.getDate();

    const cdt = new Date();
    const cyy = cdt.getFullYear();
    const cmm = cdt.getMonth() + 1;

    if (yy === cyy && mm === cmm) {
      setDateTitle("이번달");
    } else {
      setDateTitle(`${yy}년 ${mm}월`);
    }
  }, [formState]);

  const prevLast = () => {
    const yy = formState[formState.pageType].currentDate.getFullYear();
    const mm = formState[formState.pageType].currentDate.getMonth() + 1;
    const dd = formState[formState.pageType].currentDate.getDate();

    const cdt = new Date("2020-06-01");
    const cyy = cdt.getFullYear();
    const cmm = cdt.getMonth() + 1;

    if (yy === cyy && cmm === mm) {
      return false;
    } else {
      return true;
    }
  };

  const nextLast = () => {
    const yy = formState[formState.pageType].currentDate.getFullYear();
    const mm = formState[formState.pageType].currentDate.getMonth() + 1;
    const dd = formState[formState.pageType].currentDate.getDate();

    const cdt = new Date();
    const cyy = cdt.getFullYear();
    const cmm = cdt.getMonth() + 1;

    if (yy === cyy && cmm === mm) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    formatDate();
  }, [formState]);
  return (
    <div className="detailView isSpecial">
      <button
        className={`prevButton ${prevLast() && "active"}`}
        onClick={() => {
          if (prevLast()) {
            handleDate("back");
          }
        }}
      >
        이전
      </button>

      <div className="title">
        <div className="titleWrap">{dateTitle}</div>
      </div>

      <button
        className={`nextButton ${nextLast() && "active"}`}
        onClick={() => {
          if (nextLast()) {
            handleDate("front");
          }
        }}
      >
        다음
      </button>
    </div>
  );
}
