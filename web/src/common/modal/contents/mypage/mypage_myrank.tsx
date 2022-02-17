// tab navigation
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// api
import { getFanRankList, getGoodRankList, postAddFan, deleteFan } from "common/api";
import "./mypage_modal.scss";
import { DalbitScroll } from "common/ui/dalbit_scroll";
import NoResult from "common/ui/no_result";

import GuidePopup from "./guide_my";

import goldMedal from "./static/medal_gold_m@2x.png";
import silverMedal from "./static/medal_silver_m@2x.png";
import bronzeMedal from "./static/medal_bronze_m@2x.png";
import dalIcon from "./static/ic_moon_s@2x.png";
import goodIcon from "./static/like_red_m@2x.png";
import hintIcon from "./static/hint.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus} from "../../../../redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const [detailPopup, setDetailPopup] = useState(false);
  const [rankingType, setRankingType] = useState("fan"); // fan, all
  const [allListType, setAllListType] = useState("gift"); //gift, good
  const [fanListType, setFanListType] = useState(1); //1: 최근, 2, 누적
  const [fanRankList, setFanRankList] = useState([
    {
      nickNm: "",
      memNo: "",
      profImg: {
        thumb62x62: "",
      },
      isFan: false,
      giftDal: 0,
    },
  ]);
  const [goodList, setGoodList] = useState([
    {
      nickNm: "",
      memNo: "",
      profImg: {
        thumb62x62: "",
      },
      isFan: false,
      good: 0,
    },
  ]);
  const [fanGiftList, setFanGiftList] = useState([
    {
      nickNm: "",
      memNo: "",
      profImg: {
        thumb62x62: "",
      },
      isFan: false,
      giftDal: 0,
    },
  ]);

  const AddFan = (memNo) => {
    async function AddFanFunc() {
      const { result, data, message } = await postAddFan({
        memNo: memNo,
      });
      if (result === "success") {
        if (rankingType === "fan") {
          fetchFanRank();
        } else {
          if (allListType === "gift") {
            fetchGiftRank();
          } else {
            fetchFanGood();
          }
        }
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
        }));
      }
    }
    AddFanFunc();
  };
  const DeleteFan = (memNo) => {
    async function DeleteFanFunc() {
      const { result, data, message } = await deleteFan({
        memNo: memNo,
      });
      if (result === "success") {
        if (rankingType === "fan") {
          fetchFanRank();
        } else {
          if (allListType === "gift") {
            fetchGiftRank();
          } else {
            fetchFanGood();
          }
        }

        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
        }));
      }
    }
    DeleteFanFunc();
  };

  async function fetchFanRank() {
    const { result, data } = await getFanRankList({
      memNo: globalState.baseData.memNo,
      page: 1,
      records: 100,
      rankType: fanListType,
    });
    if (result === "success") {
      setFanRankList(data.list);
    }
  }

  async function fetchGiftRank() {
    const { result, data } = await getFanRankList({
      memNo: globalState.baseData.memNo,
      page: 1,
      records: 100,
      rankType: 1,
      rankSlct: 2,
    });
    if (result === "success") {
      setFanGiftList(data.list);
    }
  }

  async function fetchFanGood() {
    const { result, data } = await getGoodRankList({
      memNo: globalState.baseData.memNo,
      page: 1,
      records: 100,
      rankType: fanListType,
    });
    if (result === "success") {
      setGoodList(data.list);
    }
  }

  //----------------------------------------------------
  useEffect(() => {
    if (allListType === "good") {
      fetchFanGood();
    } else {
      fetchGiftRank();
    }
  }, [allListType]);

  useEffect(() => {
    fetchFanRank();
  }, [fanListType]);

  useEffect(() => {
    if (rankingType === "fan" && (fanListType === 1 || fanListType === 2)) {
      fetchFanRank();
    } else if (rankingType === "all" && allListType === "gift") {
      fetchGiftRank();
    } else if (rankingType === "all" && allListType === "good") {
      fetchFanGood();
    }
  }, []);

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  //-------------------------------------------------------
  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <button className="closeBtn" onClick={() => history.goBack()}></button>

      <div className="myModalWrap myModalWrap--wihte">
        <div className="myModalWrap__myListWrap">
          <div className="tabWrap">
            <div
              className={`tabWrap__tab ${rankingType === "fan" ? "tabWrap__tab--active" : ""}`}
              onClick={() => setRankingType("fan")}
            >
              팬 랭킹
            </div>
            <div
              className={`tabWrap__tab ${rankingType === "all" ? "tabWrap__tab--active" : ""}`}
              onClick={() => setRankingType("all")}
            >
              전체 랭킹
            </div>
          </div>

          {rankingType === "fan" && (
            <>
              <div className="innerTabWrap">
                <div
                  className={`innerTabWrap__tab ${fanListType === 1 ? "innerTabWrap__tab--active" : ""} `}
                  onClick={() => setFanListType(1)}
                >
                  최근
                </div>
                <div
                  className={`innerTabWrap__tab ${fanListType === 2 ? "innerTabWrap__tab--active" : ""} `}
                  onClick={() => setFanListType(2)}
                >
                  누적
                </div>

                <button className="innerTabWrap__guide" onClick={() => setDetailPopup(true)}>
                  <img src={hintIcon} />
                </button>
              </div>

              <DalbitScroll width={360} height={470} displayClassName="fanListWrapper">
                <ul className="rankList">
                  {fanRankList.length > 0 ? (
                    <>
                      {fanRankList.map((item, idx) => {
                        const { nickNm, profImg, isFan, memNo, giftDal } = item;
                        return (
                          <li className="rankitem" key={idx}>
                            <div className="rankitemWrap">
                              <div className="thumbBox" onClick={() => history.push(`/mypage/${item.memNo}`)}>
                                <img src={profImg.thumb62x62} className="thumbBox__thumb" alt="thumb" />
                                {idx < 5 && (
                                  <>
                                    {idx < 3 ? (
                                      <img
                                        className="thumbBox__medalIcon"
                                        src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                      />
                                    ) : (
                                      <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="textBox">
                                <p className="textBox__nick">{nickNm}</p>
                                <p className="textBox__dal">
                                  <img src={dalIcon} width={20} alt="dal" />
                                  {giftDal.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {isFan ? (
                              <span className="myModalWrap__fanBtn--fan" onClick={() => DeleteFan(memNo)}>
                                팬
                              </span>
                            ) : (
                              <span className="myModalWrap__fanBtn--fan myModalWrap__fanBtn--plus" onClick={() => AddFan(memNo)}>
                                +팬등록
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </>
                  ) : (
                    <NoResult text={fanListType === 1 ? "최근 3개월 간 선물한 팬이 없습니다." : "선물한 팬이 없습니다."} />
                  )}
                </ul>
              </DalbitScroll>
            </>
          )}

          {rankingType === "all" && (
            <>
              <div className="innerTabWrap">
                <div
                  className={`innerTabWrap__tab ${allListType === "gift" ? "innerTabWrap__tab--active" : ""} `}
                  onClick={() => setAllListType("gift")}
                >
                  선물
                </div>
                <div
                  className={`innerTabWrap__tab ${allListType === "good" ? "innerTabWrap__tab--active" : ""} `}
                  onClick={() => setAllListType("good")}
                >
                  좋아요
                </div>
                <button className="innerTabWrap__guide" onClick={() => setDetailPopup(true)}>
                  <img src={hintIcon} />
                </button>
              </div>

              <DalbitScroll width={360} height={470} displayClassName="fanListWrapper">
                {allListType === "gift" ? (
                  <div className="rankList">
                    {fanGiftList.length > 0 ? (
                      <>
                        {fanGiftList.map((item, idx) => {
                          const { nickNm, profImg, isFan, memNo, giftDal } = item;
                          return (
                            <li className="rankitem" key={idx}>
                              <div className="rankitemWrap">
                                <div className="thumbBox" onClick={() => history.push(`/mypage/${item.memNo}`)}>
                                  <img src={profImg.thumb62x62} className="thumbBox__thumb" alt="thumb" />
                                  {idx < 5 && (
                                    <>
                                      {idx < 3 ? (
                                        <img
                                          className="thumbBox__medalIcon"
                                          src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                        />
                                      ) : (
                                        <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="textBox">
                                  <p className="textBox__nick">{nickNm}</p>
                                  <p className="textBox__dal">
                                    <img src={dalIcon} width={20} alt="dal" />
                                    {giftDal.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {isFan ? (
                                <span className="myModalWrap__fanBtn--fan" onClick={() => DeleteFan(memNo)}>
                                  팬
                                </span>
                              ) : (
                                <span
                                  className="myModalWrap__fanBtn--fan myModalWrap__fanBtn--plus"
                                  onClick={() => AddFan(memNo)}
                                >
                                  +팬등록
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </>
                    ) : (
                      <NoResult text="선물한 회원이 없습니다." />
                    )}
                  </div>
                ) : (
                  <ul className="rankList">
                    {goodList.length > 0 ? (
                      <>
                        {goodList.map((item, idx) => {
                          const { nickNm, profImg, isFan, memNo, good } = item;
                          return (
                            <li className="rankitem" key={idx}>
                              <div className="rankitemWrap">
                                <div className="thumbBox" onClick={() => history.push(`/mypage/${item.memNo}`)}>
                                  <img src={profImg.thumb62x62} className="thumbBox__thumb" alt="thumb" />
                                  {idx < 5 && (
                                    <>
                                      {idx < 3 ? (
                                        <img
                                          className="thumbBox__medalIcon"
                                          src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                        />
                                      ) : (
                                        <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="textBox">
                                  <p className="textBox__nick">{nickNm}</p>
                                  <p className="textBox__dal">
                                    <img src={goodIcon} width={20} alt="good" />
                                    {good.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {isFan ? (
                                <>
                                  {memNo !== globalState.baseData.memNo && (
                                    <span className="myModalWrap__fanBtn--fan" onClick={() => DeleteFan(memNo)}>
                                      팬
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  {memNo !== globalState.baseData.memNo && (
                                    <span
                                      className="myModalWrap__fanBtn--fan myModalWrap__fanBtn--plus"
                                      onClick={() => AddFan(memNo)}
                                    >
                                      +팬등록
                                    </span>
                                  )}
                                </>
                              )}
                            </li>
                          );
                        })}
                      </>
                    ) : (
                      <NoResult text="좋아요를 보낸 회원이 없습니다." />
                    )}
                  </ul>
                )}
              </DalbitScroll>
            </>
          )}
        </div>
      </div>

      {detailPopup && <GuidePopup setDetailPopup={setDetailPopup} />}
    </div>
  );
};
