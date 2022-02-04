// tab navigation
import React, { useContext, useState, useEffect } from "react";
import { ModalContext } from "context/modal_ctx";
import { GlobalContext } from "context";
import { useHistory, useParams } from "react-router-dom";
// api
import { getFanRankList, getGoodRankList, postAddFan, deleteFan } from "common/api";
import "./mypage_modal.scss";
import { DalbitScroll } from "common/ui/dalbit_scroll";
import NoResult from "common/ui/no_result";

import GuidePopup from "./guide_user";

import goldMedal from "./static/medal_gold_m@2x.png";
import silverMedal from "./static/medal_silver_m@2x.png";
import bronzeMedal from "./static/medal_bronze_m@2x.png";
import hintIcon from "./static/hint.svg";

export default (props) => {
  const { globalState, globalAction } = useContext(GlobalContext);
  const { modalState, modalAction } = useContext(ModalContext);
  const history = useHistory();
  const [detailPopup, setDetailPopup] = useState(false);
  const [tabType, setTabType] = useState("recent"); //recent, accrue, good
  const [fanListType, setFanListType] = useState(1); //1: 최근, 2, 누적
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
        if (tabType === "good") {
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
        if (tabType === "good") {
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
      memNo: modalState.mypageYourMem,
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
      memNo: modalState.mypageYourMem,
    });
    if (result === "success") {
      setGoodList(data.list);
    }
  }

  //----------------------------------------------------
  useEffect(() => {
    if (tabType === "good") {
      fetchDataGoodRank();
    } else {
      fetchData();
    }
  }, [tabType]);

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
          <h2 className="title">랭킹</h2>

          <div className="innerTabWrap">
            <button className="innerTabWrap__guide" onClick={() => setDetailPopup(true)}>
              <img src={hintIcon} />
            </button>
            <div
              className={`innerTabWrap__tab ${tabType === "recent" ? "innerTabWrap__tab--active" : ""}`}
              onClick={() => {
                setFanListType(1);
                setTabType("recent");
              }}
            >
              최근 팬
            </div>
            <div
              className={`innerTabWrap__tab ${tabType === "accrue" ? "innerTabWrap__tab--active" : ""}`}
              onClick={() => {
                setFanListType(2);
                setTabType("accrue");
              }}
            >
              누적 팬
            </div>
            <div
              className={`innerTabWrap__tab ${tabType === "good" ? "innerTabWrap__tab--active" : ""}`}
              onClick={() => setTabType("good")}
            >
              좋아요
            </div>
          </div>

          <DalbitScroll width={360} height={470} displayClassName="fanListWrapper">
            {tabType === "recent" || tabType === "accrue" ? (
              <ul className="rankList">
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
                  <NoResult text={fanListType === 1 ? "최근 3개월 간 선물한 팬이 없습니다." : "선물한 팬이 없습니다."} />
                )}
              </ul>
            )}
          </DalbitScroll>
        </div>
      </div>

      {detailPopup && <GuidePopup setDetailPopup={setDetailPopup} />}
    </div>
  );
};
