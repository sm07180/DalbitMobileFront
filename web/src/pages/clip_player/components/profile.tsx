import React, { useContext, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { printNumber, addComma } from "lib/common_fn";
import { getProfile, postAddFan, deleteFan, MypageBlackListAdd } from "common/api";
import { tabType } from "../constant";
// lib
import Swiper from "react-id-swiper";
import GiftDalPop from "./gift_dal_pop";
import BadgeList from "../../../common/badge_list";
import LayerPopup from "components/ui/layerPopup/LayerPopup2";
import SpecialHistoryPop from "pages/remypage/components/popup/SpecialHistoryPop";

import "../../../asset/scss/module/mypage/index.scss";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxUserMemNo} from "../../../redux/actions/broadcastCtx";

import {setCommonPopupOpenData} from "redux/actions/common";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxMultiViewer,
  setGlobalCtxSetToastStatus
} from "../../../redux/actions/globalCtx";
import {setClipCtxRightTabType, setClipCtxUserMemNo} from "../../../redux/actions/clipCtx";

let Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const clipState = useSelector(({clipCtx}) => clipCtx);
  const popup = useSelector(state => state.popup);

  const { baseData, clipInfo, clipPlayer } = globalState;
  const { isLogin } = baseData;

  const [layerPopMemNo, setLayerPopMemNo] = useState<string>("");
  const [fanState, setFanState] = useState(0);
  const [badgeList, setBadgeList] = useState<Array<any>>([]);
  const [expData, setExpData] = useState<any>({
    expCalc: 0,
    expPercent: 0,
  });
  const [profileData, setProfileData] = useState<userProfileType | null>(null);

  async function fetchProfileData(memNum?: string) {
    const memNo = (() => {
      // 선택한 member number
      if (memNum) {
        return memNum;
      }
      // 이전 선택한 member number
      else if (clipState.userMemNo) {
        return clipState.userMemNo;
      } else if (globalState.clipInfo?.clipMemNo) {
        return globalState.clipInfo?.clipMemNo;
      }
      // 아무것도 선택되지 않았을때
      return baseData.memNo;
    })();
    // setUserMemNo && setUserMemNo(memNo);

    const { result, data, message } = await getProfile({
      memNo: memNo,
    });
    if (result === "success") {
      setProfileData(data);
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
        callback: () => {
          history.goBack();
          clipPlayer!.clipExit();
        },
      }));
    }
  }

  const viewProfile = useCallback(
      (memNo: string) => {
        if (isLogin === true) {
          dispatch(setClipCtxRightTabType(tabType.PROFILE))
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
          dispatch(setClipCtxUserMemNo(memNo));
          dispatch(setBroadcastCtxUserMemNo(memNo));
          dispatch(setClipCtxRightTabType(tabType.SPECIALDJLIST))
        } else {
          return history.push("/login");
        }
      },
      [isLogin]
  );

  const registerFan = (memNo: string, nickNm: string) => {
    async function AddFanFunc() {
      const { result, data } = await postAddFan({
        memNo: memNo,
      });
      if (result === "success") {
        fetchProfileData(memNo);
        if (fanState === 0) {
          setFanState && setFanState(-1);
          dispatch(setGlobalCtxSetToastStatus({
            status: true,
            message: `${nickNm}님의 팬이 되었습니다`,
          }));
        }
      }
    }
    AddFanFunc();
  };

  const cancelFan = (memNo: string, nickNm: string) => {
    dispatch(setGlobalCtxAlertStatus({
      status: true,
      type: "confirm",
      content: `${nickNm} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        async function DeleteFanFunc() {
          const { result, message } = await deleteFan({ memNo: memNo });
          if (result === "success") {
            fetchProfileData(memNo);
            dispatch(setGlobalCtxSetToastStatus({
              status: true,
              message: message,
            }));

            if (fanState === 0) {
              setFanState && setFanState(-1);
            } else {
              setFanState && setFanState(0);
            }
          }
        }

        DeleteFanFunc();
      },
    }));
  };

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
    if(memNo === globalState.profile.memNo){
      setLayerPopMemNo(memNo);
      dispatch(setCommonPopupOpenData({...popup, layerPopup: true}));
    }   

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
    //       <div
    //           className="checkBadge"
    //           onClick={() => {
    //             viewSpecialList(profileData.memNo);
    //           }}
    //       >
    //         <div className="specialIcon prev" />
    //       </div>
    //   );
    // } else if (profileData.badgeSpecial > 0) {
    //   return (
    //       <div
    //           className="checkBadge"
    //           onClick={() => {
    //             viewSpecialList(profileData.memNo);
    //           }}
    //       >
    //         <div className="specialIcon">
    //           {profileData.specialDjCnt && profileData.specialDjCnt > 0 ? (
    //               <em className="specialIcon__count">{profileData.specialDjCnt}</em>
    //           ) : (
    //               ""
    //           )}
    //         </div>
    //       </div>
    //   );
    } else if (profileData.isNew === true) {
      return <span className="newIcon">신입 DJ</span>;
    } else if (profileData.isNewListener === true) {
      return <span className="newIcon">신입청취자</span>;
    } else {
      return <span className="blind">no badge</span>;
    }
  };
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
      // setRightTabType && setRightTabType(tabType.LISTENER);
    }
  }, [profileData]);

  useEffect(() => {
    fetchProfileData();
  }, [clipState.userMemNo, clipState.clipInfo, fanState]);

  useEffect(() => {
    if (profileData !== null) {
      setBadgeList(profileData.commonBadgeList);
      let expCal = Math.floor(((profileData.exp - profileData.expBegin) / (profileData.expNext - profileData.expBegin)) * 100);
      let expPerc = Math.floor(((profileData.exp - profileData.expBegin) / (profileData.expNext - profileData.expBegin)) * 100);
      setExpData({ expCalc: expCal, expPercent: expPerc });
    }
  }, [profileData]);
  const exBar = profileData && profileData.expRate - 100;

  return (
      <>
        {profileData !== null ? (
            <div className="tabProfile">
              <div id="profile_pc" className="broadcast">
                <h3 className="tabContent__title">프로필</h3>
                <div className="profileTopWrap">
                  <div className="profileBox">
                    <div className="profile__button">
                      {/* <div className="btnSetting">
                    {baseData.memNo !== profileData.memNo && (
                      <button
                        className="btn__report"
                        onClick={() => {
                          clipAction.setRightTabType && clipAction.setRightTabType(tabType.REPORT);
                          // setUserNickNm && setUserNickNm(profileData.nickNm);
                        }}
                      >
                        <span className="blind">신고하기</span>
                      </button>
                    )}
                  </div> */}
                    </div>

                    <div className="profile__imgWrap">
                      {/* 프로필 사진 영역 */}
                      <img src={profileData.profImg.thumb292x292} className="thumb" />
                      {/* 홀더 사진 영역 */}
                      <img
                          src={profileData.holder}
                          className="holder"
                          onClick={() => {
                            dispatch(setGlobalCtxMultiViewer({
                              show: true,
                              list: profileData.profImgList.length ? profileData.profImgList : [{ profImg: profileData.profImg }],
                            }));
                          }}
                      />
                    </div>
                    <div className="profile__levelWrap">
                  <span className="box">
                    {/* 홀더 등급 영역 */}
                    {profileData.grade &&
                        profileData.level !== 0 &&
                        `${profileData.grade}` +
                        (profileData.level > 0 && ` / `) +
                        (profileData.level && `Lv.${profileData.level}`)}
                    {profileData.grade && profileData.level === 0 && `Lv. 0`}
                    {/* 홀더 레벨 영역 */}
                  </span>
                    </div>
                    {checkSpecialDj(profileData)}
                    {baseData.memNo === profileData.memNo && (
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
                                EXP
                                <span className="expTitle">{profileData.exp}</span>
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
                        {profileData.gender !== "" && (
                          <em className={`icon_wrap ${profileData.gender === "n" ? "" : profileData.gender === "m" ? "icon_male" : "icon_female"}`}>
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

                    {profileData.fanRank && profileData.fanRank.length > 0 ? (
                        <div className="profile__rankingList">
                          <button
                              className="rankingList__linkBtn"
                              onClick={() => {
                                dispatch(setClipCtxUserMemNo(profileData.memNo));
                                if (baseData.memNo === profileData.memNo) {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_MY))
                                } else {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_USER))
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
                                dispatch(setClipCtxUserMemNo(profileData.memNo));
                                if (baseData.memNo === profileData.memNo) {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_MY))
                                } else {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_USER))
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
                                    className={`rankingList__item`}
                                >
                                  <img
                                      src="https://image.dalbitlive.com/common/photoNone-bgGray.png"
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
                        <div className="profile__rankingList profileCupid">
                          <button
                              className="rankingList__linkBtn"
                              onClick={() => {
                                dispatch(setClipCtxUserMemNo(profileData.memNo));
                                if (baseData.memNo === profileData.memNo) {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_MY))
                                } else {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_USER))
                                }
                              }}
                          >
                            CUPID
                          </button>
                          <div className={`rankingList__item `}>
                            <img
                                src="https://image.dalbitlive.com/common/photoNone-bgGray.png"
                                className="rankingList__item--img"
                                alt={`defalutrankProfileImg`}
                            />
                          </div>
                          <span className="rankingList__warnTxt">(좋아요 보낸 회원없음)</span>
                        </div>
                    ) : (
                        <div className="profile__rankingList profileCupid">
                          <button
                              className="rankingList__linkBtn"
                              onClick={() => {
                                dispatch(setClipCtxUserMemNo(profileData.memNo));
                                if (baseData.memNo === profileData.memNo) {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_MY))
                                } else {
                                  dispatch(setClipCtxRightTabType(tabType.FAN_RANK_USER))
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
                    <div className="profile__count">
                      {createCountList("fan", profileData.fanCnt)}
                      {createCountList("star", profileData.starCnt)}
                      {createCountList("like", profileData.likeTotCnt)}
                    </div>

                    {baseData.memNo !== profileData.memNo && (
                        <div className="btnWrap">
                          <button
                              className="btn btn_gift"
                              onClick={() => {
                                // giftDal();
                                dispatch(setClipCtxRightTabType(tabType.GIFT_GIVE))
                                // setUserNickNm && setUserNickNm(profileData.nickNm);
                              }}
                          >
                            선물하기
                          </button>
                          {profileData.isFan === true ? (
                              <button className="btn btn_fan" onClick={() => cancelFan(profileData.memNo, profileData.nickNm)}>
                                팬
                              </button>
                          ) : (
                              <button
                                  className="btn btn_fan isDisable"
                                  onClick={() => registerFan(profileData.memNo, profileData.nickNm)}
                              >
                                + 팬등록
                              </button>
                          )}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        ) : (
            <div id="loading">
              <div className="spinner">
                <span></span>
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
};
export default Profile;
