import React, {useContext, useEffect, useState, useCallback} from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  broadcastCheck,
  broadcastContinue,
  broadcastExit,
  broadcastNomalize, certificationCheck,
  selfAuthCheck
} from "common/api";
import { IMG_SERVER } from "constant/define";
import Lottie from "react-lottie";

// others
import {HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import { checkIsMailboxNew } from "common/api";
import { openMailboxBanAlert } from "common/mailbox/mail_func";
// static
import LayerPopupCommon from "common/layerpopup";
import broadText from "./static/bc_t.png";
import searchIcon from "./static/ico_search_g.svg";
import storeIcon from "./static/ic_store_g.svg";
import alarmIcon from "./static/alarm_g.svg";
import dallaLogo from "./static/dalla_logo.svg";
import { MediaType } from "pages/broadcast/constant";
// import {authReq} from "../pages/self_auth/content/self_auth";
import {authReq} from 'pages/self_auth'
import './navigation.scss'
import styled from "styled-components";
import {isDesktopViewRouter} from "../../lib/agent";
import {useDispatch, useSelector} from "react-redux";
import {setMailBoxIsMailBoxNew} from "../../redux/actions/mailBox";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxBroadClipDim,
  setGlobalCtxRtcInfoEmpty, setGlobalCtxRtcInfoInit
} from "../../redux/actions/globalCtx";

const Navigation = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const { baseData, userProfile, clipPlayer, chatInfo, rtcInfo, alarmStatus, alarmMoveUrl, isMailboxOn } = globalState;
  const { isMailboxNew } = mailboxState;

  const rankState = useSelector(({rankCtx}) => rankCtx);
  const { formState } = rankState;
  const history = useHistory();

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
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            type: "confirm",
            title: "??????????????? ??????????????????",
            content: `????????????, ?????? ??????, ?????? ???????????? ?????? ?????? ??????????????? ??????????????????.`,
            callback: () => {
              // TODO : ???????????? ????????????
              authReq({code: '9', formTagRef: globalState.authRef, dispatch});
            },
          }));

        }else {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content: '??????????????? ?????? ??????????????????.<br/>1??? 1?????? ???????????????.',
          }));
        }
      });
    }

    /* ???????????? ?????? */
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
            msgText = "????????? ?????????????????????????";
            break;
          case "clip_recoding":
            msgText = "????????? ?????????????????????????";
            break;
          case "clip_upload":
            msgText = "????????? ????????????????????????????";
            break;

          default:
            break;
        }
        if (rtcInfo !== null && rtcInfo.getPeerConnectionCheck()) {
          return (
              dispatch(setGlobalCtxAlertStatus({
                status: true,
                type: "confirm",
                content: `?????? ${rtcInfo.userType === UserType.HOST ? "??????" : "??????"} ?????? ???????????? ????????????. ${msgText}`,
                callback: () => {
                  if (chatInfo !== null && rtcInfo !== null) {
                    chatInfo.privateChannelDisconnect();
                    rtcInfo.socketDisconnect();
                    rtcInfo.stop();
                    dispatch(setGlobalCtxRtcInfoEmpty());
                    rtcSessionClear();
                  }

                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    dispatch(setGlobalCtxBroadClipDim(false));
                    history.push(`/${category}`);
                  }
                },
              })
          ));
        }
        if (clipPlayer !== null) {
          return (
              dispatch(setGlobalCtxAlertStatus({
                status: true,
                type: "confirm",
                content: `?????? ?????? ?????? ????????? ????????????. ${msgText}`,
                callback: () => {
                  clipPlayer.clipExit();
                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    dispatch(setGlobalCtxBroadClipDim(false));
                    history.push(`/${category}`);
                  }
                },
              })
          ));
        }

        scrollToTop();
        if ("broadcast_setting" === category) {
          checkBroadcast(category);
        } else {
          dispatch(setGlobalCtxBroadClipDim(false));
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
          dispatch(setGlobalCtxRtcInfoEmpty());
          rtcSessionClear();
        }
        dispatch(setGlobalCtxBroadClipDim(false));
        history.push(`/${category}`);
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: exitRes.message,
          callback: () => {
            dispatch(setGlobalCtxBroadClipDim(false));
          },
        }));
      }
    };

    // ??? ?????? ??????
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
      dispatch(setGlobalCtxRtcInfoInit(newRtcInfo));
      sessionStorage.setItem("room_no", roomNo);

      dispatch(setGlobalCtxBroadClipDim(false));
      history.push(`/broadcast/${roomNo}`);
    };

    const { result, message, code, data } = await broadcastCheck();
    if (result === "success") {
      if (code === "1") {
        // ???????????? ?????? ??????
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: message,
          confirmText: "????????????",
          cancelCallback: () => {
            dispatch(setGlobalCtxBroadClipDim(false));
          },
          callback: () => {
            roomExit(data.roomNo);
          },
        }));
      } else if (code === "2") {
        //???????????? ?????? ?????? => ??????????????? ???????????? ??????
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: "2?????? ????????? ???????????? ????????? ????????????. \n????????? ????????? ???????????????????",
          subcont: "??? ????????? ?????? ?????? ??????????????? (????????????, ?????????, ?????????, ?????????, ??????)??? ????????? ????????? ??????????????????.",
          subcontStyle: { color: `#e84d70` },
          confirmCancelText: "????????? ????????????",
          confirmText: "?????? ????????????",
          // ?????????????????????
          cancelCallback: () => {
            (async function() {
              const infoRes = await broadcastNomalize({ roomNo: data.roomNo });
              if (infoRes.result === "success") {
                broadcastMove(infoRes.data);
              } else {
                dispatch(setGlobalCtxAlertStatus({
                  status: true,
                  type: "alert",
                  content: infoRes.message,
                  callback: () => {
                    dispatch(setGlobalCtxBroadClipDim(false));
                  },
                }));
              }
            })();
          },
          // ??????????????????
          callback: () => {
            roomExit(data.roomNo);
          },
        }));
      } else if (code === "C100") {
        // ???????????? ??????
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: "2?????? ????????? ???????????? ????????? ????????????. \n????????? ????????? ???????????????????",
          subcont: "??? ????????? ?????? ?????? ??????????????? (????????????, ?????????, ?????????, ?????????, ??????)??? ????????? ????????? ??????????????????.",
          subcontStyle: { color: `#e84d70` },
          confirmCancelText: "????????? ????????????",
          confirmText: "?????? ????????????",
          //?????????????????????
          cancelCallback: () => {
            (async function() {
              const continueRes = await broadcastContinue();
              if (continueRes.result === "success") {
                broadcastMove(continueRes.data);
              } else {
                dispatch(setGlobalCtxAlertStatus({
                  status: true,
                  type: "alert",
                  content: continueRes.message,
                  callback: () => {
                    dispatch(setGlobalCtxBroadClipDim(false));
                  },
                }));
              }
            })();
          },
          //??????????????????
          callback: () => {
            dispatch(setGlobalCtxBroadClipDim(false));
            history.push(`/${category}`);
          },
        }));
      } else {
        dispatch(setGlobalCtxBroadClipDim(false));
        history.push(`/${category}`);
      }
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          dispatch(setGlobalCtxBroadClipDim(false));
        },
      }));
    }
  };

  const updateDispatch = (event) => {
    if(location.pathname.includes('customer_clear')) {
      history.push('/login');
    }else if(location.pathname.includes('customer')) {
      if (event.detail.result == "success" && event.detail.code == "0") {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "???????????? ?????????????????????.",
          callback: () => location.replace("/"),
          cancelCallback: () => location.reload(),
        }));
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: event.detail.message,
        }));
      }
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setGlobalCtxBroadClipDim(false))
    }
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
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
        }));
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

  const [ pcMenuState , setPcMenuState ] = useState(false);
  useEffect(()=>{
    setPcMenuState(isDesktopViewRouter());
  },[])
  return (
      <>
        {pcMenuState &&

        <div className={"navigation"}>
          <div className={"dalla"}>
            <div className={"logo"}/>
            <div className={"broadcast"}>
              <div className={"icon"}>
                <div className={"icon_plus"}/>
              </div>
              <div className={"text"}>????????????</div>
            </div>
            <div className={"buttonWarp"}>
              <button className={"button"} onClick={
                ()=>history.push(`/`)
              }>???</button>
              <button className={"button"}>??????</button>
              <button className={"button"}>??????</button>
              <button className={"button"}>??????</button>
              <button className={"button"}>??????</button>
              <button className={"button"}>??????</button>
            </div>
          </div>
        </div>
        }
        {globalState.broadClipDim && (
            <div id="dim-layer" onClick={() => dispatch(setGlobalCtxBroadClipDim(false))}>
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
};
export default Navigation
