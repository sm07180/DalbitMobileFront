import React, { useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";

// import {RoomJoin} from 'context/room'
import { printNumber } from "lib/common_fn";

import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
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
  const rankState = useSelector(({rankCtx}) => rankCtx);

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
                      history.push(`/profile/${memNo}`);
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
                      history.push(`/profile/${memNo}`);
                    } else {
                      history.push("/login");
                    }
                  }}
                >
                  <div className="thumbBox">
                    {formState[formState.pageType].rankType === RANK_TYPE.FAN &&
                    index < 2 && <div className="thumbBox__frame" />}
                    <img src={profImg.thumb292x292} className="thumbBox__pic" />
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
                            <span className="blind">??????</span>
                          </em>
                        )}

                        {formState[formState.pageType].dateType ===
                        DATE_TYPE.DAY &&
                        liveBadgeList &&
                        liveBadgeList.length !== 0 && (
                          <BadgeList list={liveBadgeList} />
                        )}
                        {badgeSpecial > 0 && badgeSpecial === 2 ? (
                          <em className="icon_wrap icon_bestdj">?????????DJ</em>
                        ) : isConDj === true ? (
                          <em className="icon_wrap icon_contentsdj">
                            ?????????DJ
                          </em>
                        ) : badgeSpecial === 1 ? (
                          <em className="icon_wrap icon_specialdj">?????????DJ</em>
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
                            <i className="icon icon--people">?????? ?????????</i>
                            {printNumber(listenerPoint)}
                          </span>

                          <span className="countBox__item">
                            <i className="icon icon--like">????????? ?????????</i>
                            {printNumber(goodPoint)}
                          </span>

                          <span className="countBox__item">
                            <i className="icon icon--time">?????? ?????????</i>
                            {printNumber(broadcastPoint)}
                          </span>
                        </>
                      )}

                      {formState[formState.pageType].rankType ===
                      RANK_TYPE.FAN && (
                        <>
                          <span className="countBox__item">
                            <i className="icon icon--star">S ?????? ?????????</i>
                            {printNumber(starCnt)}
                          </span>
                          <span className="countBox__item">
                            <i className="icon icon--time">?????? ?????????</i>
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
                        RoomValidateFromClipMemNo(listenRoomNo, memNo, dispatch, globalState, history, "", "listener");
                      } else {
                        let alertMsg;
                        if (isNaN(listenRoomNo)) {
                          alertMsg = `${nickNm} ?????? ??????????????? ??????????????????. ?????? ????????? ?????? ?????? ???????????? ????????? ??? ????????????`;
                          dispatch(setGlobalCtxAlertStatus({
                            status: true,
                            type: "alert",
                            content: alertMsg,
                          }));
                        } else {
                          alertMsg = `?????? ???????????? ?????? ???????????? ?????????????????????????`;
                          dispatch(setGlobalCtxAlertStatus({
                            status: true,
                            type: "confirm",
                            content: alertMsg,
                            callback: () => {
                              RoomValidateFromClipMemNo(listenRoomNo, memNo, dispatch, globalState, history, "", "listener");
                            },
                          }));
                        }
                      }
                    }}
                    className="liveBox__img"
                  >
                    {roomNo !== "" && (
                      <em className="icon_wrap icon_live_text_ranking">
                        ????????????
                      </em>
                    )}
                    {roomNo === "" && listenRoomNo !== "" && (
                      <em className="icon_wrap icon_listen_text_ranking">
                        ?????????
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

export default React.memo(RankList)
