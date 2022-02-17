import React, { useState, useEffect, useContext } from "react";


import { convertMonday, convertMonth, changeDate, convertDateToText, liveBoxchangeDate, dateTimeConvert } from "lib/rank_fn";

import { DATE_TYPE, RANK_TYPE } from "../constant";
import {useDispatch, useSelector} from "react-redux";
import {setRankFormDate, setRankFormPageType} from "../../../redux/actions/rank";

export default function TimeBtnWrap() {
  const rankState = useSelector(({rank}) => rank);

  const { formState, myInfo, rankTimeData } = rankState;

  const dispatch = useDispatch();

  const [dateTitle, setDateTitle] = useState({
    header: "오늘",
    date: "",
  });

  const prevLast = () => {
    let cy = formState[formState.pageType].currentDate.getFullYear();
    let cm = formState[formState.pageType].currentDate.getMonth() + 1;
    let cd = formState[formState.pageType].currentDate.getDate();
    if (formState[formState.pageType].dateType === DATE_TYPE.DAY) {
      const cDt = (() => {
        if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
          return new Date("2020-10-08");
        } else {
          return new Date("2020-07-01");
        }
      })();
      let ye = cDt.getFullYear();
      let yM = cDt.getMonth() + 1;
      let yd = cDt.getDate();

      if (cy === ye && cm === yM && cd === yd) {
        return false;
      } else {
        return true;
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.WEEK) {
      const cDt = (() => {
        if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
          return new Date("2020-10-05");
        } else {
          return new Date("2020-07-06");
        }
      })();

      let ye = cDt.getFullYear();
      let yM = cDt.getMonth() + 1;
      let yd = cDt.getDate();

      if (cy === ye && cm === yM && cd === yd) {
        return false;
      } else {
        return true;
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.MONTH) {
      const cDt = new Date("2020-07-01");
      let ye = cDt.getFullYear();
      let yM = cDt.getMonth() + 1;

      if (cy === ye && cm === yM) {
        return false;
      } else {
        return true;
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.YEAR) {
      const cDt = new Date("2020-07-01");
      let ye = cDt.getFullYear();

      if (cy === ye) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const nextLast = () => {
    let cy = formState[formState.pageType].currentDate.getFullYear();
    let cm = formState[formState.pageType].currentDate.getMonth() + 1;
    let cd = formState[formState.pageType].currentDate.getDate();
    if (formState[formState.pageType].dateType === DATE_TYPE.DAY) {
      const cDt = new Date();

      let ye = cDt.getFullYear();
      let yM = cDt.getMonth() + 1;
      let yd = cDt.getDate();

      if (cy === ye && cm === yM && cd === yd) {
        return false;
      } else {
        return true;
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.WEEK) {
      const cDt = convertMonday();
      let ye = cDt.getFullYear();
      let yM = cDt.getMonth() + 1;
      let yd = cDt.getDate();

      if (cy === ye && cm === yM && cd === yd) {
        return false;
      } else {
        return true;
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.MONTH) {
      const cDt = convertMonth();
      let ye = cDt.getFullYear();
      let yM = cDt.getMonth() + 1;

      if (cy === ye && cm === yM) {
        return false;
      } else {
        return true;
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.YEAR) {
      const cDt = new Date("2020-07-01");
      let ye = cDt.getFullYear();

      if (cy === ye) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const formatDate = () => {
    const textObj = convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 1);

    if (textObj instanceof Object) {
      if (textObj.date === "time") {
        setDateTitle({
          header: textObj.header,
          date: myInfo.time,
        });
      } else {
        setDateTitle({
          header: textObj.header,
          date: textObj.date,
        });
      }
    }
  };

  const handleDate = (some: string) => {
    if (formState[formState.pageType].dateType === DATE_TYPE.TIME) {
      if (some === "back") {
        const dateCode = liveBoxchangeDate(
          some,
          formState[formState.pageType].dateType,
          formState[formState.pageType].currentDate
        );
        dispatch(setRankFormDate(dateCode));
      } else {
        const dateCode = liveBoxchangeDate(
          some,
          formState[formState.pageType].dateType,
          formState[formState.pageType].currentDate
        );
        dispatch(setRankFormDate(dateCode));
      }
    } else {
      const handle = changeDate(some, formState[formState.pageType].dateType, formState[formState.pageType].currentDate);
      dispatch(setRankFormDate(handle));
    }
  };

  const prevLastTime = () => {
    const typeTime = dateTimeConvert(new Date(formState[formState.pageType].currentDate));
    let cy = typeTime.getFullYear();
    let cm = typeTime.getMonth() + 1;
    let cd = typeTime.getDate();
    let ch = typeTime.getHours();

    const cDt = (() => {
      // return new Date('2020-12-22T10:00:00')
      return new Date(2020, 11, 22, 10, 0, 0);
    })();

    let ye = cDt.getFullYear();
    let yM = cDt.getMonth() + 1;
    let yd = cDt.getDate();
    let yh = cDt.getHours();

    if (cy === ye && cm === yM && cd === yd && ch === yh) {
      return false;
    } else {
      return true;
    }
  };

  const nextLastTime = () => {
    const typeTime = rankTimeData.nextDate;

    if (typeTime) {
      return true;
    } else {
      return false;
    }
  };

  const timeRound = () => {
    if (rankTimeData.rankRound === 1) {
      return <>AM 00시 ~ AM 10시</>;
    } else if (rankTimeData.rankRound === 2) {
      return <>AM 10시 ~ PM 19시</>;
    } else {
      return <>PM 19시 ~ AM 00시</>;
    }
  };

  useEffect(() => {
    formatDate();
  }, [myInfo]);

  return (
    <div className="detailView">
      {formState[formState.pageType].dateType === DATE_TYPE.TIME ? (
        <>
          <button
            className={`prevButton ${prevLastTime() && "active"}`}
            onClick={() => {
              if (prevLastTime()) {
                handleDate("back");
              }
            }}
          >
            이전
          </button>

          <div className="title">
            <div className="titleWrap">{rankTimeData.titleText}</div>
            <span>{timeRound()}</span>
          </div>

          <button
            className={`nextButton ${nextLastTime() && "active"}`}
            onClick={() => {
              if (nextLastTime()) {
                handleDate("front");
              }
            }}
          >
            다음
          </button>
        </>
      ) : (
        <>
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
            <div className="titleWrap">
              {dateTitle.header}
              {/* <span>{dateTitle.date}</span> */}
            </div>
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
        </>
      )}
    </div>
  );
}
