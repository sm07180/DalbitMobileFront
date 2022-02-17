import React, { useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";

// import {RoomJoin} from 'context/room'
import { printNumber } from "lib/common_fn";

// context
import { RoomValidateFromClip } from "common/audio/clip_func";
import { convertDateToText } from "lib/rank_fn";
import { RANK_TYPE, DATE_TYPE } from "pages/rank/constant";

import BadgeList from "../../../../common/badge_list";
//static
import live from "../../static/live_m.svg";
import goldMedalIcon from "../../static/medal_gold_b.svg";
import silverMedalIcon from "../../static/medal_silver_b.svg";
import bronzeMedalIcon from "../../static/medal_bronze_m.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus} from "../../../../redux/actions/globalCtx";

function RankList() {
  //context
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const rankState = useSelector(({rank}) => rank);

  const { formState, rankList } = rankState;

  const history = useHistory();

  const sliceStart = useMemo(() => {
    if (
      formState[formState.pageType].rankType === RANK_TYPE.DJ ||
      formState[formState.pageType].rankType === RANK_TYPE.FAN
    ) {
      return 3;
    } else {
      return 0;
    }
  }, [formState]);

  const realTimeCheck = useMemo(() => {
    if (
      convertDateToText(
        formState[formState.pageType].dateType,
        formState[formState.pageType].currentDate,
        0
      )
    ) {
      return true;
    } else {
      return false;
    }
  }, [formState]);

  const creatList = () => {
    return (
      <>
        <div className="userRanking bottomList">
          {rankList.slice(sliceStart).map((item, index) => {
            const {
              gender,
              nickNm,
              rank,
              profImg,
              upDown,
              listenPoint,
              listenerPoint,
              goodPoint,
              broadcastPoint,
              roomNo,
              listenRoomNo,
              memNo,
              starCnt,
              liveBadgeList,
              badgeSpecial,
              isConDj,
            } = item;
            let genderName;

            if (gender == "m" || gender == "f") {
              genderName = `genderBox gender-${gender}`;
            } else {
              genderName = `genderBox`;
            }

            return (
              <div className="myRanking rankingList" key={index}>
                {/* {realTimeCheck ? (
                  <div className="myRanking__rank levelListBox__levelBox">
                    {rank === 1 ? (
                      <img src={goldMedalIcon} className="levelListBox__levelBox--top1" />
                    ) : rank === 2 ? (
                      <img src={silverMedalIcon} className="levelListBox__levelBox--top2" />
                    ) : rank === 3 ? (
                      <img src={bronzeMedalIcon} className="levelListBox__levelBox--top3" />
                    ) : (
                      <div className="myRanking__rank--ranking">{rank}</div>
                    )}
                    <div className="levelListBox__levelBox--updown">
                      {upDown === "-" ? (
                        <span className="levelListBox__levelBox--updown__new"></span>
                      ) : upDown === "new" ? (
                        <span className="levelListBox__levelBox--updown__new">NEW</span>
                      ) : upDown[0] === "+" ? (
                        <span className="levelListBox__levelBox--updown__up">{Math.abs(parseInt(upDown))}</span>
                      ) : (
                        <span className="levelListBox__levelBox--updown__down">{Math.abs(parseInt(upDown))}</span>
                      )}
                    </div>
                  </div>
                ) : ( */}
                <div
                  className="myRanking__rank"
                  onClick={() => {
                    if (globalState.baseData.isLogin) {
                      if (globalState.baseData.memNo === memNo) {
                        history.push(`/menu/profile`);
                      } else {
                        history.push(`/mypage/${memNo}`);
                      }
                    } else {
                      history.push(`/login`);
                    }
                  }}
                >
                  <p className="myRanking__rank--ranking">{rank}</p>
                  <p className="rankingChange">
                    {upDown === "new" ? (
                      <span className="rankingChange__new">NEW</span>
                    ) : upDown > 0 ? (
                      <span className="rankingChange__up">
                        {Math.abs(upDown)}
                      </span>
                    ) : upDown < 0 ? (
                      <span className="rankingChange__down">
                        {Math.abs(upDown)}
                      </span>
                    ) : (
                      <></>
                    )}
                  </p>
                </div>

                {/* )} */}

                <div
                  className="myRanking__content"
                  onClick={() => {
                    if (globalState.baseData.isLogin) {
                      history.push(`/mypage/${memNo}`);
                    } else {
                      history.push("/login");
                    }
                  }}
                >
                  <div className="thumbBox">
                    {formState[formState.pageType].rankType === RANK_TYPE.FAN &&
                      index < 2 && <div className="thumbBox__frame" />}
                    <img src={profImg.thumb120x120} className="thumbBox__pic" />
                  </div>

                  <div className="infoBox">
                    <div className="nickNameBox">
                      {nickNm}
                      <div className="nickNameImg">
                        {gender !== "n" && (
                          <em
                            className={`icon_wrap ${
                              gender === "m" ? "icon_male" : "icon_female"
                            }`}
                          >
                            <span className="blind">성별</span>
                          </em>
                        )}

                        {formState[formState.pageType].dateType ===
                          DATE_TYPE.DAY &&
                          liveBadgeList &&
                          liveBadgeList.length !== 0 && (
                            <BadgeList list={liveBadgeList} />
                          )}
                        {badgeSpecial > 0 && badgeSpecial === 2 ? (
                          <em className="icon_wrap icon_bestdj">베스트DJ</em>
                        ) : isConDj === true ? (
                          <em className="icon_wrap icon_contentsdj">
                            콘텐츠DJ
                          </em>
                        ) : badgeSpecial === 1 ? (
                          <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div className="countBox">
                      {formState[formState.pageType].rankType ===
                        RANK_TYPE.DJ && (
                        <>
                          <span className="countBox__item">
                            <i className="icon icon--people">사람 아이콘</i>
                            {printNumber(listenerPoint)}
                          </span>

                          <span className="countBox__item">
                            <i className="icon icon--like">좋아요 아이콘</i>
                            {printNumber(goodPoint)}
                          </span>

                          <span className="countBox__item">
                            <i className="icon icon--time">시계 아이콘</i>
                            {printNumber(broadcastPoint)}
                          </span>
                        </>
                      )}

                      {formState[formState.pageType].rankType ===
                        RANK_TYPE.FAN && (
                        <>
                          <span className="countBox__item">
                            <i className="icon icon--star">S 스타 아이콘</i>
                            {printNumber(starCnt)}
                          </span>
                          <span className="countBox__item">
                            <i className="icon icon--time">시계 아이콘</i>
                            {printNumber(listenPoint)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="liveBox">
                  <button
                    onClick={() => {
                      if (roomNo !== "") {
                        RoomValidateFromClip(roomNo, globalState, dispatch, history, nickNm);
                      } else {
                        let alertMsg;
                        if (isNaN(listenRoomNo)) {
                          alertMsg = `${nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`;
                          dispatch(setGlobalCtxAlertStatus({
                            status: true,
                            type: "alert",
                            content: alertMsg,
                          }));
                        } else {
                          alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`;
                          dispatch(setGlobalCtxAlertStatus({
                            status: true,
                            type: "confirm",
                            content: alertMsg,
                            callback: () => {
                              RoomValidateFromClip(
                                listenRoomNo,
                                globalState,
                                dispatch,
                                history,
                                "",
                                "listener"
                              );
                            },
                          }));
                        }
                      }
                    }}
                    className="liveBox__img"
                  >
                    {roomNo !== "" && (
                      <em className="icon_wrap icon_live_text_ranking">
                        라이브중
                      </em>
                    )}
                    {roomNo === "" && listenRoomNo !== "" && (
                      <em className="icon_wrap icon_listen_text_ranking">
                        청취중
                      </em>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return creatList();
}

export default React.memo(RankList);
