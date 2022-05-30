import React, {useCallback, useContext, useEffect, useState} from "react";

import {useHistory} from "react-router-dom";
import {printNumber} from "lib/common_fn";

import {getRankReward, postRankSetting} from "common/api";
import {convertDateToText} from "lib/rank_fn";

import {DATE_TYPE, RANK_TYPE} from "../constant";

import trophyImg from "../static/rankingtop_back@2x.png";
import likeIcon from "../static/like_g_s.svg";
import likeRedIcon from "../static/like_red_m.svg";

import RewardPop from "./reward";
import ResetPointPop from "./reset_point_pop";
import BadgeList from "../../../common/badge_list";
import {useDispatch, useSelector} from "react-redux";
import {setRankData} from "../../../redux/actions/rank";
import {setGlobalCtxAlertStatus} from "../../../redux/actions/globalCtx";

export default function MyProfile() {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const rankState = useSelector(({rankCtx}) => rankCtx);
  const { formState, myInfo, rankTimeData, rankData } = rankState;
  const [myProfile, setMyProfile] = useState<any>(false);
  const [rewardProfile, setRewardProfile] = useState({
    rank: "DJ",
    date: "일간",
  });
  const [reward, setReward] = useState({});
  const [rewardPop, setRewardPop] = useState(false);
  const [resetPointPop, setResetPointPop] = useState(false);
  const [rankSetting, setRankSetting] = useState(false);

  const rankSettingBtn = (rankSetting) => {
    async function fetchRankSetting() {
      const res = await postRankSetting({
        isRankData: rankSetting,
      });

      if (res.result === "success") {
        setRankSetting(rankSetting);
      } else {
        //실패
      }
    }
    fetchRankSetting();
  };

  const rankingReward = () => {
    async function feachrankingReward() {
      const res = await getRankReward({
        rankSlct: formState[formState.pageType].rankType,
        rankType: formState[formState.pageType].dateType,
      });

      if (res.result === "success") {
        setRewardPop(true);
        setReward(res.data);
        // history.push("/modal/rank_reward", {
        //   reward: res.data,
        //   formState: formState,
        //   myInfo: myInfo,
        // });
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "랭킹 보상을 받을 수 있는\n기간이 지났습니다.",
        }));
      }
    }
    feachrankingReward();
  };

  const createMyProfile = () => {
    const { myUpDown } = myInfo;

    if (
      ((formState[formState.pageType].dateType === DATE_TYPE.DAY || formState[formState.pageType].dateType === DATE_TYPE.WEEK) &&
        myInfo.myRank > 1000) ||
      (formState[formState.pageType].dateType === DATE_TYPE.MONTH && myInfo.myRank > 2000) ||
      (formState[formState.pageType].dateType === DATE_TYPE.YEAR && myInfo.myRank > 3000) ||
      (formState[formState.pageType].rankType === RANK_TYPE.LIKE && myInfo.myRank > 201)
    ) {
      return (
        <>
          <p className="myRanking__rank--text">
            순위
            <br />
            없음
          </p>
          {/* <p className="rankingChange">
            <span></span>
          </p> */}
        </>
      );
    }

    let myUpDownName,
      myUpDownValue = "";

    if (myUpDown && myUpDown[0] === "+") {
      myUpDownName = `rankingChange__up rankingChange__up--profile`;
      myUpDownValue = myUpDown.split("+")[1];
    } else if (myUpDown && myUpDown[0] === "-" && myUpDown.length > 1) {
      myUpDownName = `rankingChange__down rankingChange__down--profile`;
      myUpDownValue = myUpDown.split("-")[1];
    } else if (myUpDown && myUpDown === "new") {
      myUpDownName = `rankingChange__new`;
      myUpDownValue = "new";
    } else {
      myUpDownName = `rankingChange__stop`;
    }
    return (
      <>
        <p className={`${myInfo.myRank === 0 ? "myRanking__rank--text" : "myRanking__rank--now"}`}>
          {myInfo.myRank === 0 ? "순위\n없음" : myInfo.myRank}
        </p>
        {myInfo.myRank !== 0 && (
          <p className="rankingChange">
            <span className={myUpDownName}>{myUpDownValue}</span>
          </p>
        )}
      </>
    );
    // return <span className={myUpDownName}>{myUpDownValue}</span>;
  };

  const rewardProf = () => {
    setRewardProfile({
      date: formState[formState.pageType].dateType === DATE_TYPE.DAY ? "일간" : "주간",
      rank:
        formState[formState.pageType].rankType === RANK_TYPE.DJ
          ? "DJ"
          : formState[formState.pageType].rankType === RANK_TYPE.FAN
          ? "팬"
          : "좋아요",
    });
  };

  const rankPointWrap = useCallback(() => {
    return (
      <div className="resetPointBox">
        <p>
          <img src="https://image.dallalive.com/ranking/ico_timer_wh@2x.png" alt="icon" />
          실시간 팬 랭킹 점수 <span>미 반영 중</span>
        </p>
        <button
          onClick={() => {
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              type: "confirm",
              content: `지금부터 실시간 팬 랭킹 점수를<br /><span style="display: block; padding-top: 12px; font-size: 22px;  color: #FF3C7B;">반영하시겠습니까?</span>`,
              callback: () => {
                dispatch(setGlobalCtxAlertStatus({
                  status: true,
                  content: `지금부터 팬 랭킹 점수가<br />반영됩니다.`,
                  callback: () => {
                    rankSettingBtn(true);
                    setRankSetting(true);
                    dispatch(setRankData({
                      ...rankState.rankData,
                      isRankData: true,
                    }))
                  },
                }));
              },
            }));
          }}
        >
          <img src="https://image.dallalive.com/ranking/ico_circle_x_g@2x.png" alt="icon" /> 반영하기
        </button>
      </div>
    );
  }, []);

  const rankPointWrapActive = useCallback(() => {
    return (
      <div className="resetPointBox apply">
        <p>
          <img src="https://image.dallalive.com/ranking/ico_timer_wh@2x.png" alt="icon" />
          실시간 팬 랭킹 점수 <span>반영 중</span>
        </p>
        <button onClick={() => setResetPointPop(true)}>반영하지 않기</button>
      </div>
    );
  }, []);

  const realTimeNow = useCallback(() => {
    const status = convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0);

    if (globalState.baseData.isLogin) {
      if (formState[formState.pageType].rankType === RANK_TYPE.FAN) {
        if (
          (formState[formState.pageType].dateType === DATE_TYPE.TIME && rankTimeData.nextDate === "") ||
          (formState[formState.pageType].dateType === DATE_TYPE.DAY && status) ||
          (formState[formState.pageType].dateType === DATE_TYPE.WEEK && status) ||
          (formState[formState.pageType].dateType === DATE_TYPE.MONTH && status)
        ) {
          if (rankTimeData.isRankData || rankData.isRankData) {
            return rankPointWrapActive();
          } else {
            return rankPointWrap();
          }
        }
      }
    }
    return <></>;
  }, [formState, rankTimeData, rankData]);

  //------------------------------

  useEffect(() => {
    rewardProf();
  }, [myInfo]);

  useEffect(() => {
    if (globalState.baseData.isLogin) {
      setMyProfile(globalState.userProfile);
    } else {
      setMyProfile(false);
    }
  }, [globalState.userProfile]);

  return (
    <>
      {myInfo.isReward === true ? (
        <div>
          <div className="rewordBox">
            <p className="rewordBox__top">
              {rewardProfile.date} {rewardProfile.rank} 랭킹 {myInfo.rewardRank}위
              {/* {formState.dateType === 1 ? "일간" : "주간"} {formState.rankType === 1 ? "DJ" : "팬"} 랭킹 {myInfo.rewardRank}위{" "} */}
              <span>축하합니다</span>
            </p>

            <div className="rewordBox__character1">
              <img src={trophyImg} width={84} alt="trophy" />
            </div>
            <button onClick={() => rankingReward()} className="rewordBox__btnGet">
              보상
              <br />
              받기
            </button>
          </div>
          {rewardPop && <RewardPop reward={reward} formState={formState} myInfo={myInfo} setRewardPop={setRewardPop} />}
        </div>
      ) : (
        <>
          {myProfile && (
            <div className="myRanking profileBox">
              <div
                className="profileWrap"
                onClick={() => {
                  history.push(`/profile/${globalState.baseData.memNo}`);
                }}
              >
                <div className="myRanking__rank">
                  <p className="myRanking__rank--title">내 랭킹</p>
                  {createMyProfile()}
                </div>

                <div className="thumbBox">
                  <img src={myProfile.profImg.thumb292x292} className="thumbBox__pic" />
                </div>

                <div className="myRanking__content">
                  <div className="infoBox">
                    {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
                      <div className="likeDetailWrap">
                        <div className="likeListDetail">
                          <div className="fanGoodBox">
                            <img src={likeRedIcon} />
                            <span>{myInfo.myGoodPoint && myInfo.myGoodPoint.toLocaleString()}</span>
                          </div>
                          <div className="nickNameBox">{myProfile.nickNm}</div>
                        </div>

                        {/* <div className="countBox">

                    </div> */}
                        <div className="bestFanBox">
                          <span className="bestFanBox__label">심쿵유발자</span>
                          {myInfo.myDjNickNm === "" ? (
                            ""
                          ) : (
                            <>
                              <span
                                className="bestFanBox__nickname"
                                onClick={() => {
                                  if (globalState.baseData.isLogin) {
                                    history.push(`/profile/${myInfo.myDjMemNo}`);
                                  } else {
                                    history.push("/login");
                                  }
                                }}
                              >
                                {myInfo.myDjNickNm}
                              </span>
                              <span className="bestFanBox__icon">
                                <img src={likeIcon} />
                                {myInfo.myDjGoodPoint}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="nickNameBox">
                        {myProfile.nickNm}
                        <div className="nickNameImg">
                          <span className="nickNameImg__level">Lv {myProfile.level}</span>
                          {formState[formState.pageType].dateType === DATE_TYPE.TIME &&
                            myInfo.myLiveBadgeList &&
                            myInfo.myLiveBadgeList.length !== 0 && <BadgeList list={myInfo.myLiveBadgeList} />}
                          {myProfile.badgeSpecial > 0 && myProfile.badgeSpecial === 1 ? (
                            <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                          ) : myProfile.badgeSpecial === 2 ? (
                            <em className="icon_wrap icon_bestdj">베스트DJ</em>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="countBox countBox--profile">
                      {formState[formState.pageType].rankType === RANK_TYPE.DJ && (
                        <>
                          <div className="countBox__block">
                            <span className="countBox__item">
                              <i className="icon icon--point">P 포인트 아이콘</i>
                              {printNumber(myInfo.myPoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--people">사람 아이콘</i>
                              {printNumber(myInfo.myListenerPoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--like">회색 하트 아이콘</i>
                              {printNumber(myInfo.myLikePoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--time">시계 아이콘</i>
                              {printNumber(myInfo.myBroadPoint)}
                            </span>
                          </div>
                        </>
                      )}
                      {formState[formState.pageType].rankType === RANK_TYPE.FAN && (
                        <>
                          <div className="countBox__block">
                            <span className="countBox__item">
                              <i className="icon icon--point">P 포인트 아이콘</i>
                              {printNumber(myInfo.myPoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--time">시계 아이콘</i>
                              {printNumber(myInfo.myListenPoint)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {realTimeNow()}
      {resetPointPop && (
        <ResetPointPop setResetPointPop={setResetPointPop} rankSettingBtn={rankSettingBtn} setRankSetting={setRankSetting} />
      )}
    </>
  );
}
