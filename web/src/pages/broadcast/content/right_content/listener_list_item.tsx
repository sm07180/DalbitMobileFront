import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import LazyLoad from 'react-lazyload';
// ctx
import { BroadcastContext } from "context/broadcast_ctx";
import { GlobalContext } from "context";
import { settingAlarmTime } from "lib/common_fn";
// api
import { broadManagerSet, broadManagerDelete, broadKickOut, MypageBlackListAdd } from "common/api";
// constant
import { tabType } from "pages/broadcast/constant";
import { AuthType } from "constant";
import { MANAGER_TYPE } from "./constant";
import {thumbInlineStyle} from "../../../../common/pip/PlayerStyle";

export default function ListenerListItem(props: {
  roomNo: string;
  roomOwner: boolean;
  profile: any;
  data: any;
  classNm: string;
}) {
  const { roomNo, roomOwner, profile, data, classNm } = props;
  const history = useHistory();

  // ctx
  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);

  const { isLogin } = globalState.baseData;
  const { setRightTabType, setUserMemNo, setUserNickNm } = broadcastAction;

  // state
  const [focusIdx, setFocusIdx] = useState(-1);

  // modal toggle
  const toggleFocus = (idx: any) => {
    if (idx === focusIdx) {
      setFocusIdx(-1);
    } else {
      setFocusIdx(idx);
    }
  };

  // 프로필 보기
  const viewProfile = (memNo: string) => {
    if (isLogin === true) {
      setRightTabType && setRightTabType(tabType.PROFILE);
      setUserMemNo && setUserMemNo(memNo);
    } else {
      return history.push("/login");
    }
  };

  // 신고 하기
  const pushReport = (data: any) => {
    setRightTabType && setRightTabType(tabType.REPORT);
    setUserNickNm && setUserNickNm(data.nickNm);
    setUserMemNo && setUserMemNo(data.memNo);
    setFocusIdx(-1);
  };

  // 매니저 지정, 해제
  const setManager = (data: any, auth: number, managerType: number) => {
    const [msg, managerApi] = ((): Array<any> => {
      if (auth === AuthType.LISTENER) {
        if (managerType === MANAGER_TYPE.TEMPORARY) {
          return [" 님을 매니저로 지정하시겠습니까?", broadManagerSet];
        } else {
          return [" 님을 고정 매니저로 지정하시겠습니까?", broadManagerSet];
        }
      } else {
        if (managerType !== data.managerType) {
          if (managerType === MANAGER_TYPE.TEMPORARY) {
            return [" 님을 매니저로 지정하시겠습니까?", broadManagerSet];
          } else {
            return [" 님을 고정 매니저로 지정하시겠습니까?", broadManagerSet];
          }
        } else {
          if (managerType === MANAGER_TYPE.TEMPORARY) {
            return [" 님을 매니저에서 해제하시겠습니까?", broadManagerDelete];
          } else {
            return [" 님을 고정 매니저에서 해제하시겠습니까?", broadManagerDelete];
          }
        }
      }
    })();

    if (globalAction.setAlertStatus) {
      globalAction.setAlertStatus({
        status: true,
        type: "confirm",
        title: "알림",
        content: data.nickNm + msg,
        callback: async () => {
          const res = await managerApi({ roomNo: roomNo, memNo: data.memNo, managerType: managerType });
          if (res.result === "success") {
            toggleFocus(-1);
            globalAction.callSetToastStatus!({
              status: true,
              message: res.message,
            });
          } else {
            globalAction.setAlertStatus &&
              globalAction.setAlertStatus({
                status: true,
                type: "alert",
                content: res.message,
                callback: () => {
                  return;
                },
              });
          }
        },
      });
    }
  };

  // 강퇴 하기
  const outUser = (data: any) => {
    if (globalAction.setAlertStatus) {
      globalAction.setAlertStatus({
        status: true,
        type: "confirm",
        title: "강제 퇴장",
        content: data.nickNm + " 님을 강제퇴장 하시겠습니까?",
        subcont: `* 강퇴당한 회원은 입장이 불가능하며 다음 방송부터 정상적으로 입장이 가능합니다."`,
        subcontStyle: {
          color: "gray",
          lineHeight: "16px",
          margin: "10px 0 0 0",
        },
        callback: async () => {
          const res = await broadKickOut({ roomNo: roomNo, blockNo: data.memNo });
          if (res.result === "success") {
            KickAfterBan(data);
          } else {
            globalAction.setAlertStatus &&
              globalAction.setAlertStatus({
                status: true,
                type: "alert",
                content: res.message,
              });
          }
        },
      });
    }
  };
  const KickAfterBan = (data) => {
    globalAction.setAlertStatus &&
      globalAction.setAlertStatus({
        status: true,
        type: "confirm",
        content: `강제퇴장이 완료되었습니다. 
         ${data.nickNm}님을 
         차단하시겠습니까?`,
        callback: () => fetchDataBlock(data),
        cancelCallback: () => toggleFocus(-1),
      });
  };
  async function fetchDataBlock(data) {
    const { message, result, code } = await MypageBlackListAdd({
      memNo: data.memNo,
    });
    if (result === "success") {
      globalAction.callSetToastStatus!({
        status: true,
        message: message,
      });
      toggleFocus(-1);
    } else {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "alert",
          content: message,
        });
    }
  }

  // 임시 매니저 등록, 해임, 고정매니저 등록, 해임
  const makeMoreContents = useCallback(
    (item) => {
      const { auth, managerType } = item;
      if (auth === AuthType.LISTENER) {
        return (
          <>
            <button className="modal__item" onClick={() => setManager(item, AuthType.LISTENER, MANAGER_TYPE.TEMPORARY)}>
              임시 매니저 등록
            </button>
            <button className="modal__item" onClick={() => setManager(item, AuthType.LISTENER, MANAGER_TYPE.FIXING)}>
              고정 매니저 등록
            </button>
          </>
        );
      } else if (auth === AuthType.MANAGER) {
        if (managerType === MANAGER_TYPE.TEMPORARY) {
          return (
            <>
              <button className="modal__item" onClick={() => setManager(item, AuthType.MANAGER, MANAGER_TYPE.TEMPORARY)}>
                임시 매니저 해제
              </button>
              <button className="modal__item" onClick={() => setManager(item, AuthType.MANAGER, MANAGER_TYPE.FIXING)}>
                고정 매니저 등록
              </button>
            </>
          );
        } else {
          return (
            <button className="modal__item" onClick={() => setManager(item, AuthType.MANAGER, MANAGER_TYPE.FIXING)}>
              고정 매니저 해제
            </button>
          );
        }
      } else {
        return <></>;
      }
    },
    [data]
  );

  useEffect(() => {
    // modal slide click
    const sideEffect = function() {
      setFocusIdx(-1);
    };
    window.addEventListener("click", sideEffect);
    return () => {
      window.removeEventListener("click", sideEffect);
    };
  }, []);
  return (
    <>
      {data &&
        data.map((v: any, i: number) => {
          const { memNo, isFan, profImg, nickNm, auth, isNewListener, commonBadgeList, goodCnt, joinTs, byeolCnt, isGuest } = v;
          const badgeActive = (() => {
            if (isNewListener === true || auth === AuthType.MANAGER || isGuest === true) {
              return true;
            }
            return false;
          })();

          return (
            <LazyLoad height={46} key={i} once overflow throttle={100} >
              <div className={`user user--${classNm}`} key={`listeners-${i}`}>
                <div
                  className="user__box"
                  onClick={() => {
                    viewProfile(memNo);
                  }}
                >
                  <div className={`user__thumb user__thumb${isFan ? "--fan" : ""}`} style={thumbInlineStyle(profImg)}>
                    <span className="blind">{nickNm}</span>
                  </div>
                  <div className="user__infoBox">
                    <span className="user__infoBox--sub">
                      {auth === 1 && <span className="user__badge manager">매니저</span>}
                      {isNewListener === true && <span className="user__badge new">신입청취자</span>}

                      {/* {badgeActive === true && (
                        <div className={`user__badge ${isGuest === true ? "guest" : isNewListener === true ? "new" : "manager"}`}>
                          {isGuest === true ? "게스트" : isNewListener === true ? "신입청취자" : "매니저"}
                        </div>
                      )} */}
                      {commonBadgeList &&
                      commonBadgeList.map((badge, badgeIdx) => {
                        const {text, icon, startColor, endColor} = badge;
                        if (icon && icon != null && icon != "") {
                          return (
                            <span
                              className="fan-badge"
                              style={{
                                background: `linear-gradient(to right, ${startColor}, ${endColor})`,
                              }}
                              key={badgeIdx}
                            >
                                <img src={icon} alt={text}/>
                                <span>{text}</span>
                              </span>
                          );
                        } else {
                          return (
                            <span
                              className="fan-badge-text"
                              style={{
                                backgroundColor: `${startColor}`,
                                border: `solid 1px ${endColor}`,
                              }}
                              key={badgeIdx}
                            >
                                {text}
                              </span>
                          );
                        }
                      })}

                      <span className="user__nickNm">{nickNm}</span>
                    </span>
                    {roomOwner && (
                      <span className="user__infoBox--cnt">
                        <span className="like">{goodCnt}</span>
                        <span className="times">{settingAlarmTime(joinTs)}</span>
                        <span className="stars">{byeolCnt}</span>
                      </span>
                    )}
                  </div>
                  {profile && profile.memNo !== memNo && (
                    <button
                      className="user__btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFocus(i);
                      }}
                    >
                      <span className="blind">더보기</span>
                    </button>
                  )}
                </div>

                {/* modal */}
                <div className={`modal ${focusIdx === i ? "modal--active" : ""}`}>
                  {((broadcastState.roomInfo!.auth === AuthType.MANAGER && auth === AuthType.LISTENER) || roomOwner) && (
                    <button className="modal__item" onClick={() => outUser(v)}>
                      강제퇴장
                    </button>
                  )}
                  {roomOwner && makeMoreContents(v)}
                  <button className="modal__item" onClick={() => viewProfile(memNo)}>
                    프로필 보기
                  </button>
                  <button className="modal__item" onClick={() => pushReport(v)}>
                    신고하기
                  </button>
                </div>
              </div>
            </LazyLoad>
          );
        })}
    </>
  );
}
