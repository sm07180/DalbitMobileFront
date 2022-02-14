import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useHistory, useLocation } from "react-router-dom";

import { GlobalContext } from "context";
import { RankContext } from "context/rank_ctx";
import {
  getRankList,
  getRankTimeList,
  getSpecialDjHistory,
  getWeeklyList,
  getSecondList,
} from "common/api";
import { convertDateFormat } from "lib/common_fn";
import { convertDateTimeForamt, convertSetSpecialDate } from "lib/rank_fn";
import { RANK_TYPE, DATE_TYPE, PAGE_TYPE } from "./constant";

import RankBtnWrap from "./content/rank_btn_wrap";
import DateBtnWrap from "./content/date_btn_wrap";
import TimeBtnWrap from "./content/time_btn_wrap";
import MyProfile from "./content/myProfile";
import RankListWrap from "./content/rank_list";
import LevelListWrap from "./content/level_list";
import LikeListWrap from "./content/like_list";
import SpecialHistoryHandle from "./content/special_history_handle";
import SpecialListWrap from "./content/special_list";
import WeeklyPickWrap from "./content/weekly_pick";
import SecondWrap from "./content/second";
import MonthlyDJ from "./content/monthlyDJ";

import benefitIcon from "./static/benefit.png";
import hallOfFameIcon from "./static/ic_fame.svg";
import rankingPageIcon from "./static/ic_ranking_page.svg";
import awardIcon from "./static/ic_award.png";
import Layout from "common/layout";

import "./index.scss";

let timer;
const records = 50;

const Ranking = function() {
  const { globalState } = useContext(GlobalContext);
  const { rankState, rankAction } = useContext(RankContext);

  let location = useLocation();
  const initialRank = location.state;

  const {
    formState,
    myInfo,
    rankList,
    levelList,
    likeList,
    totalPage,
    rankTimeData,
    rankData,
    weeklyList,
    secondList,
  } = rankState;

  const formDispatch = rankAction.formDispatch!;
  const setMyInfo = rankAction.setMyInfo!;
  const setRankList = rankAction.setRankList!;
  const setRankData = rankAction.setRankData!;
  const setLevelList = rankAction.setLevelList!;
  const setLikeList = rankAction.setLikeList!;
  const setTotalPage = rankAction.setTotalPage!;
  const setSpecialList = rankAction.setSpecialList!;
  const setWeeklyList = rankAction.setWeeklyList!;
  const setSecondList = rankAction.setSecondList!;
  const setRankTimeData = rankAction.setRankTimeData!;

  const history = useHistory();
  const [empty, setEmpty] = useState(false);

  const fetchData = async () => {
    if (formState[formState.pageType].rankType === RANK_TYPE.LEVEL) {
      if (levelList.length > 0) {
        if (formState.page > 1) {
          const length = (formState.page - 1) * records;
          if (levelList.length > length) {
            return;
          }
        }
      }
    } else if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
      if (likeList.length > 0) {
        if (formState.page > 1) {
          const length = (formState.page - 1) * records;
          if (likeList.length > length) {
            return;
          }
        }
      }
    } else {
      if (rankList.length > 0) {
        if (formState.page > 1) {
          const length = (formState.page - 1) * records;
          if (rankList.length > length) {
            return;
          }
        }
      }
    }

    const formatDate = convertDateFormat(
      formState[formState.pageType].currentDate,
      "-"
    );

    const res = await getRankList({
      rankSlct: formState[formState.pageType].rankType,
      rankType: formState[formState.pageType].dateType,
      page: formState.page,
      records: records,
      rankingDate: formatDate,
      type:
        formState[formState.pageType].rankType === RANK_TYPE.LEVEL
          ? "level"
          : "page",
    });
    if (res.result === "success" && res.data.list instanceof Array) {
      if (res.data.list.length > 0) {
        if (formState[formState.pageType].rankType === RANK_TYPE.LEVEL) {
          // level
          if (formState.page > 1) {
            setLevelList(levelList.concat(res.data.list));
          } else {
            setLevelList(res.data.list);
          }
          setRankList([]);
          setLikeList([]);
          setTotalPage(res.data.paging.totalPage);
          setEmpty(false);
        } else {
          // dj, fan, good
          const { data } = res;
          const { isRankData } = data;
          if (formState.page > 1) {
            setRankList(rankList.concat(res.data.list));
            setRankData({
              isRankData,
            });
            setEmpty(false);
          } else {
            if (res.data.list.length < 4) {
              setEmpty(true);
            } else {
              setRankList(res.data.list);
              setEmpty(false);
            }
            setRankData({
              isRankData,
            });
          }
          setLevelList([]);
          setLikeList([]);
          setTotalPage(res.data.paging.totalPage);

          setMyInfo({
            ...res.data,
          });
        }
      } else {
        setEmpty(true);
        setRankList([]);
        setLevelList([]);
        setMyInfo({ ...myInfo });
      }
    } else {
      setEmpty(true);
      setRankList([]);
      setLevelList([]);
      setMyInfo({ ...myInfo });
    }
  };

  const fetchSpecial = useCallback(async () => {
    const dateObj = convertSetSpecialDate(
      formState[formState.pageType].currentDate
    );
    const res = await getSpecialDjHistory({
      yy: dateObj.year,
      mm: dateObj.month,
    });
    if (res.result === "success") {
      if (res.data.list.length > 0) {
        setSpecialList(res.data.list);
        setEmpty(false);
      } else {
        setEmpty(true);
        setSpecialList([]);
      }
    }
  }, [formState]);

  const fetchWeekly = useCallback(async () => {
    const res = await getWeeklyList({
      pageNo: formState.page,
      pageCnt: records,
    });
    if (res.result === "success") {
      if (formState.page > 1) {
        setWeeklyList(weeklyList.concat(res.data.list));
      } else {
        setWeeklyList(res.data.list);
      }
      setTotalPage(res.data.paging.totalPage);
      setEmpty(false);
    } else {
      setWeeklyList([]);
      setEmpty(true);
    }
  }, [formState]);

  const fetchSecond = useCallback(async () => {
    const res = await getSecondList({
      pageNo: formState.page,
      pageCnt: records,
    });
    if (res.result === "success") {
      if (formState.page > 1) {
        setSecondList(secondList.concat(res.data.list));
      } else {
        setSecondList(res.data.list);
      }
      setTotalPage(res.data.paging.totalPage);
      setEmpty(false);
    } else {
      setSecondList([]);
      setEmpty(true);
    }
  }, [formState]);

  //////타임랭킹
  const fetchRankTime = useCallback(async () => {
    const res = await getRankTimeList({
      rankSlct: formState[formState.pageType].rankType,
      page: formState.page,
      records: records,
      rankingDate: convertDateTimeForamt(
        formState[formState.pageType].currentDate,
        "-"
      ),
    });

    const { data } = res;
    const { isRankData } = data;
    if (res.result === "success") {
      setRankTimeData({
        ...rankTimeData,
        ...res.data,
      });

      if (formState.page > 1) {
        setRankList(rankList.concat(res.data.list));
      } else {
        // dj, fan, like
        if (formState.page > 1) {
          setRankList(rankList.concat(res.data.list));
          setRankTimeData({
            ...rankTimeData,
            ...res.data,
          });

          setEmpty(false);
        } else {
          if (res.data.list.length < 6) {
            setEmpty(true);
          } else {
            setEmpty(false);
            setRankList(res.data.list);

            setRankData({
              isRankData,
            });
          }
        }
        setLevelList([]);
        setLikeList([]);
        setTotalPage(res.data.paging.totalPage);
        setMyInfo({
          myInfo,
          ...res.data,
        });
      }
    } else {
      setRankList([]);
      setEmpty(true);
    }
  }, [formState]);

  useEffect(() => {
    if (formState[formState.pageType].rankType === RANK_TYPE.SPECIAL) {
      fetchSpecial();
    } else if (
      formState[formState.pageType].rankType === RANK_TYPE.WEEKLYPICK
    ) {
      fetchWeekly();
    } else if (formState[formState.pageType].rankType === RANK_TYPE.SECOND) {
      fetchSecond();
    } else if (formState[formState.pageType].dateType === DATE_TYPE.TIME) {
      fetchRankTime();
    } else {
      //formState[formState.pageType].rankType !== RANK_TYPE.SPECIAL
      fetchData();
    }

    if (formState[formState.pageType].dateType !== DATE_TYPE.TIME) {
      setRankTimeData({
        prevDate: "",
        nextDate: "",
        rankRound: 0,
        titleText: "",
        isRankData: false,
      });
    }
  }, [formState, globalState.baseData.isLogin]);

  useEffect(() => {
    const scrollEvtHdr = (event) => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function() {
        //스크롤
        rankAction.setScrollY!(window.scrollY);
        const windowHeight =
          "innerHeight" in window
            ? window.innerHeight
            : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        const windowBottom = windowHeight + window.pageYOffset;
        const diff = 466;
        if (docHeight - diff < windowBottom) {
          if (totalPage > formState.page) {
            if (
              formState[formState.pageType].rankType === RANK_TYPE.DJ ||
              formState[formState.pageType].rankType === RANK_TYPE.FAN
            ) {
              if (
                (formState.page < 20 &&
                  (formState[formState.pageType].dateType === DATE_TYPE.DAY ||
                    formState[formState.pageType].dateType === DATE_TYPE.WEEK ||
                    formState[formState.pageType].dateType ===
                      DATE_TYPE.TIME)) ||
                (formState.page < 40 &&
                  formState[formState.pageType].dateType === DATE_TYPE.MONTH) ||
                (formState.page < 60 &&
                  formState[formState.pageType].dateType === DATE_TYPE.YEAR)
              ) {
                formDispatch({
                  type: "PAGE",
                });
              }
            } else if (
              formState[formState.pageType].rankType === RANK_TYPE.LEVEL ||
              formState[formState.pageType].rankType === RANK_TYPE.LIKE
            ) {
              if (formState.page < 4) {
                formDispatch({
                  type: "PAGE",
                });
              }
            } else {
              formDispatch({
                type: "PAGE",
              });
            }
          }
        }
      }, 100);
    };

    window.addEventListener("scroll", scrollEvtHdr);

    return () => {
      window.removeEventListener("scroll", scrollEvtHdr);
    };
  }, [formState, totalPage]);

  useEffect(() => {
    if (rankState.scrollY) {
      if (
        formState[formState.pageType].rankType === RANK_TYPE.DJ ||
        formState[formState.pageType].rankType === RANK_TYPE.FAN
      ) {
        window.scrollTo(0, rankState.scrollY - 114);
      } else {
        window.scrollTo(0, rankState.scrollY);
      }
    }
  }, []);
  return (
    <>
      <div id="ranking-page">
        <div className="header">
          <h2 className="header__title">
            {formState.pageType === PAGE_TYPE.RANKING ? "랭킹" : "명예의 전당"}
          </h2>
          {formState.pageType === PAGE_TYPE.RANKING ? (
            <button
              className="benefitSize"
              onClick={() => {
                history.push("/rank/benefit");
              }}
            >
              <img src={benefitIcon} width={60} alt="혜택" />
            </button>
          ) : (
            <button
              className="benefitSize"
              onClick={() => {
                formDispatch({
                  type: "PAGE_TYPE",
                  val: PAGE_TYPE.RANKING,
                });
              }}
            >
              <img src={rankingPageIcon} width={60} alt="랭킹" />
            </button>
          )}

          {formState.pageType === PAGE_TYPE.RANKING ? (
            <button
              className="hallOfFame"
              onClick={() => {
                formDispatch({
                  type: "PAGE_TYPE",
                  val: PAGE_TYPE.FAME,
                });
              }}
            >
              <img src={hallOfFameIcon} alt="명예의 전당" />
            </button>
          ) : (
            // <button
            //   className="hallOfFame"
            //   onClick={() => {
            //     history.push("/event/award/2020");
            //   }}
            // >
            //   <img src={awardIcon} width={78} alt="어워즈" />
            // </button>
            <></>
          )}
        </div>
        <div className="ranking-pageWarp subContent">
          <div className="rankTopBox">
            <RankBtnWrap />
            {/* <div className="rankTopBox__update">{formState[formState.pageType].rankType !== 3 && formState[formState.pageType].rankType !== 4 && `${realTime()}`}</div> */}
          </div>
          {(formState[formState.pageType].rankType === RANK_TYPE.DJ ||
            formState[formState.pageType].rankType === RANK_TYPE.FAN ||
            formState[formState.pageType].rankType === RANK_TYPE.LIKE) && (
            <>
              <DateBtnWrap formState={formState} formDispatch={formDispatch} />
              {formState[formState.pageType].rankType === RANK_TYPE.DJ &&
                formState.page < 40 &&
                formState[formState.pageType].dateType === DATE_TYPE.MONTH && (
                  <MonthlyDJ />
                )}
              <TimeBtnWrap />
              {/* {empty === false && <MyProfile />} */}
            </>
          )}
          {formState[formState.pageType].rankType === RANK_TYPE.LEVEL && (
            <LevelListWrap empty={empty} />
          )}
          {formState[formState.pageType].rankType === RANK_TYPE.LIKE && (
            <LikeListWrap empty={empty} />
          )}

          {formState[formState.pageType].rankType === RANK_TYPE.WEEKLYPICK && (
            <WeeklyPickWrap empty={empty} />
          )}

          {formState[formState.pageType].rankType === RANK_TYPE.SECOND && (
            <SecondWrap empty={empty} />
          )}

          {(formState[formState.pageType].rankType === RANK_TYPE.DJ ||
            formState[formState.pageType].rankType === RANK_TYPE.FAN) && (
            <RankListWrap empty={empty} />
          )}

          {formState[formState.pageType].rankType === RANK_TYPE.SPECIAL && (
            <SpecialListWrap empty={empty} />
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Ranking);
