// api
import { getFanRankList, getGoodRankList, postAddFan, deleteFan } from "common/api";
import { useHistory, useParams } from "react-router-dom";
import { GlobalContext } from "context";
import { DalbitScroll } from "common/ui/dalbit_scroll";

// ctx
import { BroadcastContext } from "context/broadcast_ctx";
import React, { useContext, useEffect, useState } from "react";
// constant
import { tabType } from "../../constant";

import NoResult from "common/ui/no_result";
import GuidePopup from "common/modal/contents/mypage/guide_user";

import goldMedal from "../../../../common/modal/contents/mypage/static/medal_gold_m@2x.png";
import silverMedal from "../../../../common/modal/contents/mypage/static/medal_silver_m@2x.png";
import bronzeMedal from "../../../../common/modal/contents/mypage/static/medal_bronze_m@2x.png";
import dalIcon from "../../../../common/modal/contents/mypage/static/ic_moon_s@2x.png";
import goodIcon from "../../../../common/modal/contents/mypage/static/like_red_m@2x.png";
import hintIcon from "../../../../common/modal/contents/mypage/static/hint.svg";

export default function FanList(props: { profile: any }) {
  const { profile } = props;
  // ctx
  const history = useHistory();
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { globalState, globalAction } = useContext(GlobalContext);
  const { setRightTabType, setUserMemNo } = broadcastAction;
  const { userMemNo } = broadcastState;
  const [popupState, setPopupState] = useState(false);
  const [fanTabType, setFanTabType] = useState("recent"); //recent, accrue, good
  const [fanListType, setFanListType] = useState(1); //1: 최근, 2, 누적
  const [fanListSlct, setFanListSlct] = useState(1); //1:  팬 랭킹, 2: 받은선물랭킹
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
        if (fanTabType === "good") {
          fetchDataGoodRank();
        } else {
          fetchData();
        }
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: message,
        });
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
        if (fanTabType === "good") {
          fetchDataGoodRank();
        } else {
          fetchData();
        }
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: message,
        });
      }
    }
    DeleteFanFunc();
  };

  async function fetchData() {
    const { result, data } = await getFanRankList({
      memNo: userMemNo,
      page: 1,
      records: 100,
      rankType: fanListType,
    });
    if (result === "success") {
      setFanGiftList(data.list);
    }
  }

  async function fetchDataGoodRank() {
    const { result, data } = await getGoodRankList({
      memNo: userMemNo,
    });
    if (result === "success") {
      setGoodList(data.list);
    }
  }

  const viewProfile = (memNo?: any) => {
    setRightTabType && setRightTabType(tabType.PROFILE);
    if (memNo) {
      setUserMemNo && setUserMemNo(memNo);
    }
  };
  //----------------------------------------------------
  useEffect(() => {
    if (fanTabType === "good") {
      fetchDataGoodRank();
    } else {
      fetchData();
    }
  }, [fanTabType]);

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div>
        <h3
          className="tabTitle tabTitle__back"
          onClick={() => {
            viewProfile();
          }}
        >
          팬 랭킹
        </h3>

        <div className="innerTabWrap">
          <button className="innerTabWrap__guide" onClick={() => setPopupState(true)}>
            <img src={hintIcon} />
          </button>
          <div
            className={`innerTabWrap__tab ${fanTabType === "recent" ? "innerTabWrap__tab--active" : ""}`}
            onClick={() => {
              setFanListType(1);
              setFanTabType("recent");
            }}
          >
            최근 팬
          </div>
          <div
            className={`innerTabWrap__tab ${fanTabType === "accrue" ? "innerTabWrap__tab--active" : ""}`}
            onClick={() => {
              setFanListType(2);
              setFanTabType("accrue");
            }}
          >
            누적 팬
          </div>
          <div
            className={`innerTabWrap__tab ${fanTabType === "good" ? "innerTabWrap__tab--active" : ""}`}
            onClick={() => setFanTabType("good")}
          >
            좋아요
          </div>
        </div>

        <DalbitScroll width={360} displayClassName="fanListWrapper">
          {fanTabType === "recent" || fanTabType === "accrue" ? (
            <ul className="rankList">
              {fanGiftList.length > 0 ? (
                <>
                  {fanGiftList.map((item, idx) => {
                    const { nickNm, profImg, isFan, memNo, giftDal } = item;
                    return (
                      <li className="rankitem" key={idx}>
                        <div className="rankitemWrap">
                          <div
                            className="thumbBox"
                            onClick={() => {
                              viewProfile(item.memNo);
                            }}
                          >
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
                          </div>
                        </div>

                        {isFan ? (
                          <>
                            {memNo !== globalState.baseData.memNo && (
                              <span className="btn__fan btn__fan--active" onClick={() => DeleteFan(memNo)}>
                                팬
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {memNo !== globalState.baseData.memNo && (
                              <span className="btn__fan" onClick={() => AddFan(memNo)}>
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
                <NoResult text={fanListType === 1 ? "최근 3개월 간 선물한 팬이 없습니다." : "선물한 팬이 없습니다."} />
              )}
            </ul>
          ) : (
            <ul className="rankList">
              {goodList.length > 0 ? (
                <>
                  {goodList.map((item, idx) => {
                    const { nickNm, profImg, isFan, memNo } = item;
                    return (
                      <li className="rankitem" key={idx}>
                        <div className="rankitemWrap">
                          <div
                            className="thumbBox"
                            onClick={() => {
                              viewProfile(item.memNo);
                            }}
                          >
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
                          </div>
                        </div>

                        {isFan ? (
                          <>
                            {memNo !== globalState.baseData.memNo && (
                              <span className="btn__fan btn__fan--active" onClick={() => DeleteFan(memNo)}>
                                팬
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {memNo !== globalState.baseData.memNo && (
                              <span className="btn__fan" onClick={() => AddFan(memNo)}>
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
                <NoResult text={fanListType === 1 ? "최근 3개월 간 선물한 팬이 없습니다." : "선물한 팬이 없습니다."} />
              )}
            </ul>
          )}
        </DalbitScroll>

        {popupState && <GuidePopup setPopupState={setPopupState} />}
      </div>
    </>
  );
}
