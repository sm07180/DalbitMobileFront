import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

// Api
import {
  broadKickOut,
  broadManagerDelete,
  broadManagerSet,
  getBroadcastMemberInfo,
  MypageBlackListAdd,
  postBroadFanAdd,
  postBroadFanRemove,
} from "common/api";

// lib
import Swiper from "react-id-swiper";
import {CHAT_CONFIG} from "constant/define";
// ctx
import {addComma, printNumber} from "lib/common_fn";
import {mailBoxJoin} from "common/mailbox/mail_func";
// constant
import {tabType} from "pages/broadcast/constant";
import {AuthType} from "constant";
import {MANAGER_TYPE} from "./constant";
import BadgeList from "../../../../common/badge_list";
import LayerPopup from "../../../../components/ui/layerPopup/LayerPopup2";
// import LayerPopup from "../../../../components/ui/layerPopup/LayerPopup2";
import SpecialHistoryPop from "pages/remypage/components/popup/SpecialHistoryPop";
import 'asset/scss/module/mypage/index.scss'

import {
  setBroadcastCtxIsFan,
  setBroadcastCtxRightTabType,
  setBroadcastCtxUserMemNo,
  setBroadcastCtxUserNickName
} from "../../../../redux/actions/broadcastCtx";
import {setCommonPopupOpenData} from "redux/actions/common";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxMultiViewer,
  setGlobalCtxSetToastStatus
} from "../../../../redux/actions/globalCtx";
import {useDispatch, useSelector} from "react-redux";

export default function Profile(props: { roomInfo: roomInfoType; profile: any; roomNo: string; roomOwner: boolean }) {
  const { roomInfo, profile, roomNo, roomOwner } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const popup = useSelector(state => state.popup);

  const { baseData } = globalState;
  const { isLogin } = baseData;

  // state
  const [profileData, setProfileData] = useState<userProfileType | null>(null);
  const [badgeList, setBadgeList] = useState<Array<any>>([]);
  const [layerPopMemNo, setLayerPopMemNo] = useState<string>(""); // 슬라이드 팝업 정보
  const [expData, setExpData] = useState<any>({
    expCalc: 0,
    expPercent: 0,
  });
  // func
  async function fetchProfileData(memNum?: string) {
    const memNo = (() => {
      // 선택한 member number
      if (memNum) {
        return memNum;
      }
      // 이전 선택한 member number
      else if (broadcastState.userMemNo) {
        return broadcastState.userMemNo;
      }
      // 아무것도 선택되지 않았을때
      return broadcastState.roomInfo.bjMemNo;
    })();
    // const memNo = memNum ? memNum : broadcastState.userMemNo ? broadcastState.userMemNo : broadcastState.roomInfo.bjMemNo;
    dispatch(setBroadcastCtxUserMemNo(memNo));
    const { result, data, message } = await getBroadcastMemberInfo({ memNo, roomNo });
    if (result === "success") {
      setProfileData({
        auth: data.auth,
        managerType: data.managerType,
        profImg: data.profImg,
        holder: data.holder,
        holderBg: data.holderBg,
        isFan: data.isFan,
        grade: data.grade,
        level: data.level,
        nickNm: data.nickNm,
        gender: data.gender,
        profMsg: data.profMsg,
        memId: data.memId,
        memNo: data.memNo,
        fanCnt: data.fanCnt,
        starCnt: data.starCnt,
        cupidNickNm: data.cupidNickNm,
        cupidMemNo: data.cupidMemNo,
        cupidProfImg: data.cupidProfImg,
        likeTotCnt: data.likeTotCnt,
        fanRank: data.fanRank,
        expRate: data.expRate,
        exp: data.exp,
        expNext: data.expNext,
        expBegin: data.expBegin,
        isNew: data.isNew,
        isNewListener: data.isNewListener,
        isSpecial: data.isSpecial,
        wasSpecial: data.wasSpecial,
        badgeSpecial: data.badgeSpecial,
        specialDjCnt: data.specialDjCnt,
        liveBadgeList: data.liveBadgeList,
        fanBadgeList: data.fanBadgeList,
        commonBadgeList: data.commonBadgeList,
        profImgList: data.profImgList,
        isMailboxOn: data.isMailboxOn,
        teamInfo: data.teamInfo,
      });
      dispatch(setBroadcastCtxIsFan(data.isFan));
    } else {

      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
      dispatch(setBroadcastCtxRightTabType(tabType.LISTENER));
    }
  }

  const viewProfile = useCallback(
    (memNo: string) => {
      if (isLogin === true) {
        dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
        fetchProfileData(memNo);
      } else {
        return history.push("/login");
      }
    },
    [isLogin]
  );

  const viewSpecialList = useCallback(
    (memNo: string) => {
      if (isLogin === true) {
        dispatch(setBroadcastCtxUserMemNo(memNo));
        dispatch(setBroadcastCtxRightTabType(tabType.SPECIALDJLIST));
      } else {
        return history.push("/login");
      }
    },
    [isLogin]
  );

  // fan 등록/제거
  const registerFan = useCallback((memNo: string, nickNm: string) => {
    async function AddFanFunc() {
      const { result } = await postBroadFanAdd({ memNo, roomNo });

      if (result === "success") {
        fetchProfileData(memNo);
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: `${nickNm}님의 팬이 되었습니다`,
        }));
      }
    }

    AddFanFunc();
  }, []);

  const cancelFan = useCallback((memNo: string, nickNm: string) => {
    dispatch(setGlobalCtxAlertStatus({
      status: true,
      type: "confirm",
      content: `${nickNm} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        async function DeleteFanFunc() {
          const { result, message } = await postBroadFanRemove({ memNo, roomNo });
          if (result === "success") {
            fetchProfileData(memNo);
            dispatch(setGlobalCtxSetToastStatus({
              status: true,
              message: message,
            }));
          }
        }

        DeleteFanFunc();
      },
    }));
  }, []);

  const defalutRank = [
    {
      id: 1,
      name: "defaultGold",
    },
    {
      id: 2,
      name: "defaultSilver",
    },
    {
      id: 3,
      name: "defaultBronze",
    },
  ];

  const swiperParams: any = {
    slidesPerView: "auto",
  };
  const createCountList = (type, count) => {
    let text, ico;
    if (type === "fan") {
      text = "팬";
      ico = "ico-fan";
    } else if (type === "star") {
      text = "스타";
      ico = "ico-star";
    } else if (type === "like") {
      text = "좋아요";
      ico = "ico-like";
    }
    return (
      <>
        {type !== "like" && count > 0 ? (
          <div className="count-box">
            <span className="icoWrap">
              <span className={`icoImg ${ico}`}></span>
              <em className={`icotitle`}>{text}</em>
            </span>
            <em className="cntTitle">{count > 9999 ? printNumber(count) : addComma(count)}</em>
          </div>
        ) : (
          <div className="count-box">
            <span className="icoWrap">
              <span className={`icoImg ${ico}`}></span>
              <em className="icotitle">{text}</em>
            </span>
            <em className="cntTitle">{count > 9999 ? printNumber(count) : addComma(count)}</em>
          </div>
        )}
      </>
    );
  };

  const historyPopupOpen = (e) => {
    const memNo = e.currentTarget.id;
    e.preventDefault();
    e.stopPropagation();
    setLayerPopMemNo(memNo);
    dispatch(setCommonPopupOpenData({...popup, layerPopup: true}));
  }

  const checkSpecialDj = (profileData) => {
    if(profileData.specialDjCnt > 0){
      return (
        <div className="badgeGroup">
          <span
            id={profileData.memNo}
            className={`starBdg ${profileData.badgeSpecial === 1 ? "active" : ""}`}
            onClick={historyPopupOpen}
          >
            {profileData.specialDjCnt}
          </span>
        </div>
        );
    // if (profileData.wasSpecial && profileData.badgeSpecial === 0) {
    //   return (     
    //     <div
    //       className="checkBadge"
    //       onClick={() => {
    //         viewSpecialList(profileData.memNo);
    //       }}
    //     >
    //       <div className="specialIcon prev" />
    //     </div>
    //   );
    // } else if (profileData.badgeSpecial > 0) {
    //   return (
    //     <div
    //       className="checkBadge"
    //       onClick={() => {
    //         viewSpecialList(profileData.memNo);
    //       }}
    //     >
    //     </div>
    //   );
    } else if (profileData.isNew === true) {
      return <span className="newIcon">신입 DJ</span>;
    } else if (profileData.isNewListener === true) {
      return <span className="newIcon">신입청취자</span>;
    } else {
      return <span className="blind">no badge</span>;
    }
  };
  const setManager = useCallback(
    (type: number) => {
      const { managerType, auth, nickNm, memNo } = profileData!;

      const [msg, managerApi] = ((): Array<any> => {
        if (auth === AuthType.LISTENER) {
          if (type === MANAGER_TYPE.TEMPORARY) {
            return [" 님을 매니저로 지정하시겠습니까?", broadManagerSet];
          } else {
            return [" 님을 고정 매니저로 지정하시겠습니까?", broadManagerSet];
          }
        } else {
          if (type !== managerType) {
            if (type === MANAGER_TYPE.TEMPORARY) {
              return [" 님을 매니저로 지정하시겠습니까?", broadManagerSet];
            } else {
              return [" 님을 고정 매니저로 지정하시겠습니까?", broadManagerSet];
            }
          } else {
            if (type === MANAGER_TYPE.TEMPORARY) {
              return [" 님을 매니저에서 해제하시겠습니까?", broadManagerDelete];
            } else {
              return [" 님을 고정 매니저에서 해제하시겠습니까?", broadManagerDelete];
            }
          }
        }
      })();

      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        title: "알림",
        content: nickNm + msg,
        callback: async () => {
          if (type === MANAGER_TYPE.TEMPORARY && managerType === MANAGER_TYPE.FIXING) {
            dispatch(setGlobalCtxSetToastStatus({
              status: true,
              message: "이미 고정 매니저로 지정되어 있습니다.",
            }));

            return;
          } else {
            const res = await managerApi({ roomNo: roomNo, memNo: memNo, managerType: type });
            if (res.result === "success") {
              dispatch(setGlobalCtxSetToastStatus({
                status: true,
                message: res.message,
              }));
            } else {
              dispatch(setGlobalCtxAlertStatus({
                status: true,
                type: "alert",
                content: res.message,
                callback: () => {
                  return;
                },
              }));
            }
          }
        },
      }));
    },
    [profileData]
  );

  const outUser = useCallback(() => {
    if (profileData) {
      const { nickNm, memNo } = profileData;
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        title: "강제 퇴장",
        content: nickNm + " 님을 강제퇴장 하시겠습니까?",
        subcont: `* 강퇴당한 회원은 입장이 불가능하며 다음 방송부터 정상적으로 입장이 가능합니다."`,
        subcontStyle: {
          color: "gray",
          lineHeight: "16px",
          margin: "10px 0 0 0",
        },
        callback: async () => {
          const res = await broadKickOut({ roomNo: roomNo, blockNo: memNo });
          if (res.result === "success") {
            KickAfterBan();
          } else {
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              type: "alert",
              content: res.message,
            }));
          }
        },
      }));
    }
  }, [profileData]);

  const KickAfterBan = useCallback(() => {
    if (profileData) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        content: `강제퇴장이 완료되었습니다. 
         ${profileData.nickNm}님을 
         차단하시겠습니까?`,
        callback: () => fetchDataBlock(),
        cancelCallback: () => {
          dispatch(setBroadcastCtxRightTabType(tabType.LISTENER));
        },
      }));
    }
  }, [profileData]);
  const fetchDataBlock = useCallback(async () => {
    if (profileData) {
      const { message, result, code } = await MypageBlackListAdd({
        memNo: profileData.memNo,
      });
      if (result === "success") {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: message,
        }));
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
        }));
      }
      dispatch(setBroadcastCtxRightTabType(tabType.LISTENER));
    }
  }, [profileData]);

  // 팀 상세페이지 이동
  const reqTeamJoin = (e) => {
    const { pageLink } = e.currentTarget.dataset;

    if (pageLink !== undefined) {
      history.push(pageLink);
    }
  };

  useEffect(() => {
    //console.log(broadcastState.userMemNo, broadcastState.roomInfo)
    fetchProfileData();
  }, [broadcastState.userMemNo, broadcastState.roomInfo]);

  useEffect(() => {
    if (profileData !== null) {
      /* 좌측 프로필 탭 - 스와이퍼 배지 리스트의 text값이 ''이면 제외 */
      setBadgeList(profileData.commonBadgeList.concat([]).filter((v) => v?.text !== ''));
      let expCal = Math.floor(((profileData.exp - profileData.expBegin) / (profileData.expNext - profileData.expBegin)) * 100);
      let expPerc = Math.floor(((profileData.exp - profileData.expBegin) / (profileData.expNext - profileData.expBegin)) * 100);
      setExpData({ expCalc: expCal, expPercent: expPerc });
    }
  }, [profileData]);

  // useEffect(() => {
  //   return () => {
  //     setUserMemNo && setUserMemNo(baseData.memNo);
  //   };
  // }, []);

  //경험치바 퍼센트 정리
  const exBar = profileData && profileData.expRate - 100;
  const join = (memNo) => {
    const socketUser: any = {
      authToken: baseData.authToken,
      memNo: baseData.memNo,
      locale: CHAT_CONFIG.locale.ko_KR,
      roomNo: null,
    };

    globalState.mailChatInfo?.setUserInfo(socketUser);
    globalState.mailChatInfo?.privateChannelDisconnect();
    mailBoxJoin(memNo, dispatch, history, history);
  };
  return (
    <>
      {profileData !== null && (
        <div id="profile_pc" className="broadcast">
          <h3 className="tabTitle">프로필</h3>
          <div className="profileTopWrap">
            <div className="profileBox">
              <div className="profile__button">
                <div className="btnSetting">
                  {profile.memNo !== profileData.memNo && (
                    <button
                      className="btn__report"
                      onClick={() => {
                        dispatch(setBroadcastCtxRightTabType(tabType.REPORT));
                        dispatch(setBroadcastCtxUserNickName(profileData.nickNm));
                      }}
                    >
                      <span className="blind">신고하기</span>
                    </button>
                  )}
                </div>
              </div>
              {profileData.memNo !== baseData.memNo && mailboxState.useMailbox && (
                <div className="rightButton">
                  <button onClick={() => join(profileData.memNo)} className="mailIcon">
                    <em className={`icon_wrap  ${profileData.isMailboxOn ? "icon_mail" : "icon_mail_off"}`}>
                      <span className="blind">메시지</span>
                    </em>
                  </button>
                </div>
              )}

              <div className="profile__imgWrap">
                {/* 프로필 사진 영역 */}
                <img src={profileData.profImg.thumb292x292} className="thumb" />
                {profileData.level > 50 && (
                  <div className="holderBg" style={{ backgroundImage: `url(${profileData.holderBg})` }}></div>
                )}
                {/* 홀더 사진 영역 */}
                <img
                  src={profileData.holder}
                  className="holder"
                  onClick={() => {
                    dispatch(setGlobalCtxMultiViewer({
                      show: true,
                      list: profileData.profImgList.length ? profileData.profImgList : [{ profImg: profileData.profImg }],
                    }))
                  }}
                />
              </div>
              <div className="profile__levelWrap">
                <span className="box">
                  {/* 홀더 등급 영역 */}
                  {profileData.grade &&
                    profileData.level !== 0 &&
                    `${profileData.grade}` + (profileData.level > 0 && ` / `) + (profileData.level && `Lv.${profileData.level}`)}
                  {profileData.grade && profileData.level === 0 && `Lv. 0`}
                  {/* 홀더 레벨 영역 */}
                </span>
              </div>
              {checkSpecialDj(profileData)}
              {profile.memNo === profileData.memNo && (
                <div className="profile__levelInfoWrap">
                  <>
                    <div className="levelBox">
                      <div className="levelBar">
                        <span
                          className="expBarStatus"
                          style={{
                            right: `${profileData && profileData.expRate >= 101 ? 0 : Math.abs(Number(exBar))}%`,
                          }}
                        ></span>
                        <span className="expTitle expTitle--start">{profileData.expBegin}</span>
                        <span className="expTitle expTitle--end">{profileData.expNext}</span>
                      </div>

                      <div className="levelInfo">
                        {/* <button className="btn-info">
                          <span className="blind">경험치</span>
                        </button> */}
                        EXP
                        <span className="expTitle">
                          {profileData.exp}
                          {/* {Math.floor(((profileData.expNext - profileData.expBegin) * expData.expPercent) / 100)} */}
                        </span>
                        <span className="expTitle expTitle--rate">{profileData.expRate}%</span>
                      </div>
                    </div>
                  </>
                </div>
              )}
              <div className="profile__nameWrap">
                <strong>
                  <span style={{cursor:"pointer"}} onClick={()=>{
                    history.push(`/profile/${profileData.memNo}`)
                  }}>
                    {profileData.nickNm}
                  </span>

                  <span className="subIconWrap">
                    {/* {<span className="nationIcon"></span>} */}
                    {profileData.gender !== "" && (
                      <em className={`icon_wrap ${profileData.gender === "m" ? "icon_male" : "icon_female"}`}>
                        <span className="blind">성별</span>
                      </em>
                    )}
                  </span>
                </strong>
              </div>
              {profileData.profMsg && <p className="profile__msgWrap">{profileData.profMsg}</p>}
              <div className="badgeWrap">
                {badgeList && badgeList.length !== 0 && badgeList.length > 1 ? (
                  <Swiper {...swiperParams}>
                    <BadgeList list={badgeList} />
                  </Swiper>
                ) : (
                  <BadgeList list={badgeList} />
                )}
              </div>

              <div className="profile__wrapper">
                {/* 팀명칭 리스트 */}
                {profileData.teamInfo !== undefined &&
                  <div className="profile__rankingList" data-page-link={profileData.teamInfo.pageLink} onClick={reqTeamJoin}>
                    <div className="teamSymbol">
                      <img src={`${profileData.teamInfo.backgroundUrl}`} alt="배경" />
                      <img src={`${profileData.teamInfo.borderUrl}`} alt="테두리" />
                      <img src={`${profileData.teamInfo.medalUrl}`} alt="메달" />
                    </div>
                    <div className="teamName">{profileData.teamInfo.teamName}</div>
                  </div>
                }

                {/* 팬랭킹 리스트 */}
                {profileData.fanRank && profileData.fanRank.length > 0 ? (
                  <div className="profile__rankingList">
                    <button
                      className="rankingList__linkBtn"
                      onClick={() => {
                        if (profile.memNo === profileData.memNo) {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_MY));
                        } else {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_USER));
                        }
                      }}
                    >
                      팬랭킹
                    </button>
                    {/* Ranking Maps */}
                    {profileData.fanRank.map((rankItem, idx) => {
                      const { memNo, profImg } = rankItem;
                      return (
                        <div
                          key={idx + "rankList"}
                          className={`rankingList__item ${idx === 1 ? "silver" : idx === 2 ? "bronze" : "gold"}`}
                          onClick={() => {
                            viewProfile(memNo);
                          }}
                        >
                          <img src={profImg.thumb62x62} className="rankingList__item--img" alt={`rankProfileImg` + idx} />
                        </div>
                      );
                    })}
                    {globalState.baseData.memNo !== profileData.memNo && (
                      <button
                        className="rankingList__goFanboardBtn"
                        onClick={() => history.push(`/profile/${profileData.memNo}?tab=1`)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="profile__rankingList">
                    <button
                      className="rankingList__linkBtn"
                      onClick={() => {
                        if (profile.memNo === profileData.memNo) {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_MY));
                        } else {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_USER));
                        }
                      }}
                    >
                      팬랭킹
                    </button>
                    {/*Default Ranking Maps */}
                    {defalutRank.map((defalutRankItem, idx) => {
                      return (
                        <div
                          key={idx + "defalutRankList"}
                          className={`rankingList__item ${idx === 1 ? "silver" : idx === 2 ? "bronze" : "gold"}`}
                        >
                          <img
                            src="https://image.dalbitlive.com/svg/ico_defalitprofile.svg"
                            className="rankingList__item--img"
                            alt={`defalutrankProfileImg` + idx}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 큐피트 영역 */}
                {profileData.cupidNickNm === "" ? (
                  <div className="profile__rankingList">
                    <button
                      className="rankingList__linkBtn"
                      onClick={() => {
                        if (profile.memNo === profileData.memNo) {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_MY));
                        } else {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_USER));
                        }
                      }}
                    >
                      CUPID
                    </button>
                    <div className={`rankingList__item `}>
                      <img
                        src="https://image.dalbitlive.com/svg/ico_defalitprofile.svg"
                        className="rankingList__item--img"
                        alt={`defalutrankProfileImg`}
                      />
                    </div>
                    <span className="rankingList__warnTxt">(좋아요 보낸 회원없음)</span>
                  </div>
                ) : (
                  <div className="profile__rankingList">
                    <button
                      className="rankingList__linkBtn"
                      onClick={() => {
                        if (profile.memNo === profileData.memNo) {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_MY));
                        } else {
                          dispatch(setBroadcastCtxRightTabType(tabType.FAN_RANK_USER));
                        }
                      }}
                    >
                      CUPID
                    </button>
                    <div
                      className={`rankingList__item`}
                      onClick={() => {
                        viewProfile(profileData.cupidMemNo);
                      }}
                    >
                      <img src={profileData.cupidProfImg.thumb62x62} className="rankingList__item--img" alt={`cupidDefaultImg`} />
                    </div>
                    <span className="rankingList__warnTxt">{profileData.cupidNickNm}</span>
                  </div>
                )}
              </div>

              <div className="profile__count">
                {createCountList("fan", profileData.fanCnt)}
                {createCountList("star", profileData.starCnt)}
                {createCountList("like", profileData.likeTotCnt)}
              </div>
              {(roomOwner === true || broadcastState.roomInfo!.auth === AuthType.MANAGER) &&
                profile.memNo !== profileData.memNo &&
                broadcastState.roomInfo!.bjMemNo !== broadcastState.userMemNo && (
                  <div className="profile__managerBox">
                    {roomOwner === true && (
                      <>
                        <button
                          className={`manager temporary ${profileData.auth === 1 &&
                            profileData.managerType === MANAGER_TYPE.TEMPORARY &&
                            "on"}`}
                          onClick={() => {
                            setManager(MANAGER_TYPE.TEMPORARY);
                          }}
                        >
                          방송매니저
                        </button>
                        <button
                          className={`manager fixing ${profileData.auth === 1 &&
                            profileData.managerType === MANAGER_TYPE.FIXING &&
                            "on"}`}
                          onClick={() => {
                            setManager(MANAGER_TYPE.FIXING);
                          }}
                        >
                          고정매니저
                        </button>
                      </>
                    )}

                    {(profileData.auth === AuthType.LISTENER || roomOwner === true) && (
                      <button className="manager out" onClick={outUser}>
                        강퇴하기
                      </button>
                    )}
                  </div>
                )}
              {profile.memNo !== profileData.memNo && (
                <div className="btnWrap">
                  <button
                    className="btn btn_gift"
                    onClick={() => {
                      dispatch(setBroadcastCtxRightTabType(tabType.GIFT_DAL));
                      dispatch(setBroadcastCtxUserNickName(profileData.nickNm));
                    }}
                  >
                    선물하기
                  </button>
                  {profileData.isFan === true ? (
                    <button className="btn btn_fan" onClick={() => cancelFan(profileData.memNo, profileData.nickNm)}>
                      팬
                    </button>
                  ) : (
                    <button className="btn btn_fan isDisable" onClick={() => registerFan(profileData.memNo, profileData.nickNm)}>
                      + 팬등록
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {popup.layerPopup &&
        <LayerPopup>
          <SpecialHistoryPop
            memNo={layerPopMemNo}/>
        </LayerPopup>
      }
    </>
  );
}
