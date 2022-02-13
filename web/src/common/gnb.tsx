import React, {useCallback, useContext, useEffect, useState} from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  broadcastCheck,
  broadcastContinue,
  broadcastExit,
  broadcastNomalize,
  certificationCheck,
  checkIsMailboxNew,
  selfAuthCheck
} from "common/api";

// context
import {GlobalContext} from "context";
// others
import {HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";
// static
import broadText from "./static/bc_t.png";
import searchIcon from "./static/ico_search_g.svg";
import storeIcon from "./static/ic_store_g.svg";
import alarmIcon from "./static/alarm_g.svg";
import LayerPopupCommon from "../common/layerpopup/index";
import {MediaType} from "pages/broadcast/constant";
// import {authReq} from "../pages/self_auth/content/self_auth";
import {authReq} from 'pages/self_auth'
import {IMG_SERVER} from "../constant/define";
import {openMailboxBanAlert} from "./mailbox/mail_func";
import {useDispatch, useSelector} from "react-redux";

import {
  setRankMyInfo,
  setRankList,
  setRankData,
  setRankLevelList,
  setRankLikeList,
  setRankTotalPage,
  setRankSpecialList,
  setRankWeeklyList,
  setRankSecondList,
  setRankTimeData,
  setRankFormPage,
  setRankFormPageType, setRankScrollY
} from "redux/actions/rank";
import {setMailBoxIsMailBoxNew} from "../redux/actions/mailBox";


export default function GNB() {
  const context = useContext(GlobalContext);
  const dispatch = useDispatch();
  const rankState = useSelector(({rank}) => rank);
  const { globalState, globalAction } = context;
  const { baseData, userProfile, clipPlayer, chatInfo, rtcInfo, alarmStatus, alarmMoveUrl, isMailboxOn } = globalState;
  const mailboxState = useSelector(({mailBox}) => mailBox);
  const { isMailboxNew } = mailboxState;

  const { formState } = rankState;
  const history = useHistory();
  const isDesktop = useSelector((state)=> state.common.isDesktop)

  const [showLayer, setShowLayer] = useState(false);
  const [popupState, setPopupState] = useState<boolean>(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);
  const showLayerPopup = () => {
    setShowLayer(true);
    setPopupState(true);
  };
  //dimMenuLink
  const dimLink = async (category: string) => {
    const doAuthCheck = () => {
      certificationCheck().then(res => {
        if(res.data === 'y') {
          globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            type: "confirm",
            title: "본인인증을 완료해주세요",
            content: `방송하기, 클립 녹음, 클립 업로드를 하기 위해 본인인증을 완료해주세요.`,
            callback: () => {
              // TODO : 본인인증 연결필요
              authReq('9', context.authRef, context);
            },
          });

        }else {
          globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            content: '본인인증을 이미 완료했습니다.<br/>1일 1회만 가능합니다.',
          });
        }
      });
    }

    /* 본인인증 여부 */
    const authCheck = await selfAuthCheck();
    if(authCheck.result === 'fail') {
      doAuthCheck();
    }else {
      if(globalState.noServiceInfo.americanAge < globalState.noServiceInfo.limitAge) {
        doAuthCheck();
      }else {
        sessionStorage.setItem("isBeforeMailbox", "N");
        let msgText;
        switch (category) {
          case "broadcast_setting":
            msgText = "방송을 생성하시겠습니까?";
            break;
          case "clip_recoding":
            msgText = "클립을 녹음하시겠습니까?";
            break;
          case "clip_upload":
            msgText = "클립을 업로드하시겠습니까?";
            break;

          default:
            break;
        }
        if (rtcInfo !== null && rtcInfo.getPeerConnectionCheck()) {
          return (
              globalAction.setAlertStatus &&
              globalAction.setAlertStatus({
                status: true,
                type: "confirm",
                content: `현재 ${rtcInfo.userType === UserType.HOST ? "방송" : "청취"} 중인 방송방이 있습니다. ${msgText}`,
                callback: () => {
                  if (chatInfo !== null && rtcInfo !== null) {
                    chatInfo.privateChannelDisconnect();
                    rtcInfo.socketDisconnect();
                    rtcInfo.stop();
                    globalAction.dispatchRtcInfo && globalAction.dispatchRtcInfo({ type: "empty" });
                    rtcSessionClear();
                  }

                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    globalAction.setBroadClipDim!(false);
                    history.push(`/${category}`);
                  }
                },
              })
          );
        }
        if (clipPlayer !== null) {
          return (
              globalAction.setAlertStatus &&
              globalAction.setAlertStatus({
                status: true,
                type: "confirm",
                content: `현재 재생 중인 클립이 있습니다. ${msgText}`,
                callback: () => {
                  clipPlayer.clipExit();
                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    globalAction.setBroadClipDim!(false);
                    history.push(`/${category}`);
                  }
                },
              })
          );
        }

        scrollToTop();
        if ("broadcast_setting" === category) {
          checkBroadcast(category);
        } else {
          globalAction.setBroadClipDim!(false);
          history.push(`/${category}`);
        }
      }
    }
  };

  const checkBroadcast = async (category) => {
    const roomExit = async (roomNo) => {
      const exitRes = await broadcastExit({ roomNo });
      if (exitRes.result === "success") {
        if (chatInfo && chatInfo !== null) {
          chatInfo.privateChannelDisconnect();
          if (rtcInfo !== null) rtcInfo!.stop();
          globalAction.dispatchRtcInfo!({ type: "empty" });
          rtcSessionClear();
        }
        globalAction.setBroadClipDim!(false);
        history.push(`/${category}`);
      } else {
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: exitRes.message,
          callback: () => {
            globalAction.setBroadClipDim!(false);
          },
        });
      }
    };

    // 방 정보 설정
    const broadcastMove = (data) => {
      const roomInfo = { ...data, micState: true };

      const { webRtcUrl, webRtcAppName, webRtcStreamName, roomNo, mediaType } = roomInfo;

      const videoConstraints = {
        isVideo: roomInfo.mediaType === MediaType.VIDEO ? true : false,
        videoFrameRate: roomInfo.videoFrameRate,
        videoResolution: roomInfo.videoResolution,
      };

      const newRtcInfo = new HostRtc(UserType.HOST, webRtcUrl, webRtcAppName, webRtcStreamName, roomNo, false, videoConstraints);
      newRtcInfo.setRoomInfo(roomInfo);
      globalAction.dispatchRtcInfo && globalAction.dispatchRtcInfo({ type: "init", data: newRtcInfo });
      sessionStorage.setItem("room_no", roomNo);

      globalAction.setBroadClipDim!(false);
      history.push(`/broadcast/${roomNo}`);
    };

    const { result, message, code, data } = await broadcastCheck();
    if (result === "success") {
      if (code === "1") {
        // 진행중인 방송 존재
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: message,
          confirmText: "방송종료",
          cancelCallback: () => {
            globalAction.setBroadClipDim!(false);
          },
          callback: () => {
            roomExit(data.roomNo);
          },
        });
      } else if (code === "2") {
        //비정상된 방이 있음 => 이어하기와 동일하게 수정
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: "2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?",
          subcont: "※ 이어서 하면 모든 방송데이터(방송시간,청취자,좋아요,부스터,선물)를 유지한 상태로 만들어집니다.",
          subcontStyle: { color: `#e84d70` },
          confirmCancelText: "이어서 방송하기",
          confirmText: "새로 방송하기",
          // 이어서방송하기
          cancelCallback: () => {
            (async function() {
              const infoRes = await broadcastNomalize({ roomNo: data.roomNo });
              if (infoRes.result === "success") {
                broadcastMove(infoRes.data);
              } else {
                globalAction.setAlertStatus &&
                globalAction.setAlertStatus({
                  status: true,
                  type: "alert",
                  content: infoRes.message,
                  callback: () => {
                    globalAction.setBroadClipDim!(false);
                  },
                });
              }
            })();
          },
          // 새로방송하기
          callback: () => {
            roomExit(data.roomNo);
          },
        });
      } else if (code === "C100") {
        // 이어하기 가능
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: "2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?",
          subcont: "※ 이어서 하면 모든 방송데이터(방송시간,청취자,좋아요,부스터,선물)를 유지한 상태로 만들어집니다.",
          subcontStyle: { color: `#e84d70` },
          confirmCancelText: "이어서 방송하기",
          confirmText: "새로 방송하기",
          //이어서방송하기
          cancelCallback: () => {
            (async function() {
              const continueRes = await broadcastContinue();
              if (continueRes.result === "success") {
                broadcastMove(continueRes.data);
              } else {
                globalAction.setAlertStatus &&
                globalAction.setAlertStatus({
                  status: true,
                  type: "alert",
                  content: continueRes.message,
                  callback: () => {
                    globalAction.setBroadClipDim!(false);
                  },
                });
              }
            })();
          },
          //새로방송하기
          callback: () => {
            globalAction.setBroadClipDim!(false);
            history.push(`/${category}`);
          },
        });
      } else {
        globalAction.setBroadClipDim!(false);
        history.push(`/${category}`);
      }
    } else {
      globalAction.setAlertStatus &&
      globalAction.setAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          globalAction.setBroadClipDim!(false);
        },
      });
    }
  };

  const updateDispatch = (event) => {
    if(location.pathname.includes('customer')) {
      if (event.detail.result == "success" && event.detail.code == "0") {
        globalAction.setAlertStatus!({
          status: true,
          content: "본인인증 완료되었습니다.",
          callback: () => location.replace("/"),
          cancelCallback: () => location.reload(),
        });
      } else {
        globalAction.setAlertStatus!({
          status: true,
          content: event.detail.message,
        });
      }
    }
  };

  useEffect(() => {
    return () => globalAction.setBroadClipDim!(false);
  }, []);
  useEffect(() => {
    if (globalState.broadClipDim) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [globalState.broadClipDim]);
  useEffect(() => {
    if (popupState === false) {
      if (showLayer) {
        setShowLayer(false);
      }
    }
  }, [popupState]);
  useEffect(() => {
    const mailboxNewCheck = async () => {
      const { result, data, message } = await checkIsMailboxNew({});
      if (result === "success") {
        dispatch(setMailBoxIsMailBoxNew(data.isNew));
      } else {
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "alert",
          content: message,
        });
      }
    };
    if (globalState.baseData.isLogin) {
      mailboxNewCheck();
    } else {
      dispatch(setMailBoxIsMailBoxNew(false));
    }
  }, [globalState.baseData.isLogin]);

  useEffect(() => {
    document.addEventListener("self-auth", updateDispatch);
    return () => {
      document.removeEventListener("self-auth", updateDispatch);
    };
  }, []);

  return (
    <>
      { isDesktop &&
      <header id="gnb">
        <div className="gnbBox">
          <h1>
            <NavLink
                to={`/`}
                onClick={() => {
                  scrollToTop();
                  sessionStorage.setItem("isBeforeMailbox", "N");
                }}
                title="달빛라이브"
            >
              <img src={`${IMG_SERVER}/ani/webp/main/gnb_logo.gif`} alt="logo" width={80} height={80} />
              {/* <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: gnbLogo,
                }}
                width={80}
                height={80}
              />*/}
            </NavLink>
          </h1>

          <button
              className="gnbBox__liveBtn"
              onClick={() => {
                if (baseData.isLogin === true) {
                  scrollToTop();
                  return globalAction.setBroadClipDim!(true);
                } else {
                  return history.push("/login");
                }
              }}
          >
            {/* <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: broadBtn,
              }}
              width={48}
              height={48}
            /> */}

            <img src={`${IMG_SERVER}/ani/webp/main/gnb_broadcast.gif`} alt="방송하기" width={48} height={48} />
            <span>
              <img src={broadText} alt="방송하기" />
            </span>
          </button>

          <div className="navWrap">
            <NavLink
                to={`/`}
                className="navItem"
                activeClassName={"navItem__active"}
                onClick={() => {
                  scrollToTop();
                  sessionStorage.setItem("isBeforeMailbox", "N");
                }}
                exact
                title="메인 이동"
            ></NavLink>
            <NavLink to={`/clip`} className="navItem" activeClassName={"navItem__active"} title="클립페이지 이동"></NavLink>
            {/* <NavLink to={`/rank`} className="navItem" activeClassName={"navItem__active"} title="랭킹페이지 이동"></NavLink> */}
            <NavLink
                to={"/rank"}
                className="navItem"
                activeClassName={"navItem__active"}
                title="랭킹페이지 이동"
                onClick={() => {
                  dispatch(setRankFormPageType("ranking"));
                  sessionStorage.setItem("isBeforeMailbox", "N");
                }}
            ></NavLink>
            <NavLink
                to={`${baseData.isLogin === true ? `/mypage/${globalState.baseData.memNo}` : "/mypage"}`}
                className="navItem"
                activeClassName={"navItem__active"}
                onClick={() => {
                  sessionStorage.setItem("isBeforeMailbox", "N");
                }}
                title="마이페이지 이동"
            ></NavLink>
          </div>

          <div className="etcWrap">
            <button
                type="button"
                className="etcWrap__icon"
                onClick={() => {
                  sessionStorage.setItem("isBeforeMailbox", "N");
                  if (baseData.isLogin === true) {
                    if (alarmMoveUrl === "") {
                      history.push('/menu/alarm');
                    } else {
                      history.push(`${alarmMoveUrl}`);
                    }
                  } else {
                    history.push("/login");
                  }
                }}
            >
              {alarmStatus === true ? (
                  // <Lottie
                  //   options={{
                  //     loop: true,
                  //     autoplay: true,
                  //     animationData: alarmIconDot,
                  //   }}
                  //   width={40}
                  //   height={40}
                  //   />
                  <img src={`${IMG_SERVER}/ani/webp/main/gnb_alarm_g.webp`} alt="alarm active" width={40} height={40} />
              ) : (
                  <img src={alarmIcon} width={40} height={40} alt="alarm" />
              )}
            </button>

            <button
                type="button"
                onClick={() => {
                  history.push("/search");
                  sessionStorage.setItem("isBeforeMailbox", "N");
                }}
                className="etcWrap__icon"
            >
              <img src={searchIcon} width={40} height={40} alt="search" />
            </button>
            <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem("isBeforeMailbox", "N");
                  if (baseData.isLogin === true) {
                    return history.push("/store");
                  } else {
                    return history.push("/login");
                  }
                }}
                className="etcWrap__icon"
            >
              <img src={storeIcon} width={36} height={36} alt="store" />
            </button>
            {/* <button type="button" onClick={() => showLayerPopup()} className="etcWrap__icon">
              Layer
            </button> */}

            {/* 우체통 아이콘 추가 */}
            {mailboxState.useMailbox &&
                (isMailboxNew ? (
                    <button
                        onClick={() => {
                          sessionStorage.setItem("isBeforeMailbox", "N");
                          history.push("/mailbox");
                        }}
                        className="etcWrap__icon"
                    >
                      <img src={`${IMG_SERVER}/svg/ico_postbox_g_on.svg`} alt="mail box" />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                          openMailboxBanAlert({ userProfile, globalAction, history });
                        }}
                        className="etcWrap__icon"
                    >
                      {!isMailboxOn && baseData.isLogin ? (
                          <img src={`${IMG_SERVER}/svg/postbox_w_off.svg`} alt="mail box" />
                      ) : (
                          <img src={`${IMG_SERVER}/svg/ico_postbox_g.svg`} alt="mail box" />
                      )}
                    </button>
                ))}
          </div>
        </div>
      </header>}
      {globalState.broadClipDim && (
        <div id="dim-layer" onClick={() => globalAction.setBroadClipDim!(false)}>
          <div className="broadcast-menu">
            <div className="broadcast-menu__links">
              <button className="broad" onClick={() => dimLink("broadcast_setting")} />
              <button className="recoding" onClick={() => dimLink("clip_recoding")} />
              <button className="upload" onClick={() => dimLink("clip_upload")} />
            </div>
          </div>
        </div>
      )}
      {showLayer && <LayerPopupCommon setPopupState={setPopupState} />}
    </>
  );
}
