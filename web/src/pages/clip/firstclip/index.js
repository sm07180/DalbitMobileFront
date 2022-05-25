import React from 'react';
import {useHistory} from "react-router-dom";

// global components
import Header from 'components/ui/header/Header';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import '../scss/firstClipUpload.scss';

import {IMG_SERVER} from 'context/config'
import {
  broadcastCheck,
  broadcastContinue,
  broadcastExit,
  broadcastNomalize,
  certificationCheck,
  selfAuthCheck
} from "common/api";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxBroadClipDim,
  setGlobalCtxRtcInfoEmpty,
  setGlobalCtxRtcInfoInit,
  setGlobalCtxUpdatePopup
} from "redux/actions/globalCtx";
import {HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import {authReq} from 'pages/self_auth'
import {useDispatch, useSelector} from "react-redux";
import {MediaType} from "pages/broadcast/constant";
import {getDeviceConfig} from "common/DeviceCommon";
import {Hybrid, isHybrid} from "context/hybrid";

const firstClip = () => {
  const history = useHistory();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { baseData, clipPlayer, chatInfo, rtcInfo } = globalState;
  const dispatch = useDispatch();

  const dimLink = async (category) => {
    const doAuthCheck = () => {
      certificationCheck().then(res => {
        if(res.data === 'y') {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            type: "confirm",
            title: "본인인증을 완료해주세요",
            content: `클립 녹음, 클립 업로드를 하기 위해 본인인증을 완료해주세요.`,
            callback: () => {
              authReq({code: '9',formTagRef: globalState.authRef, dispatch});
            },
          }));

        }else {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content: '본인인증을 이미 완료했습니다.<br/>1일 1회만 가능합니다.',
          }));
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
            dispatch(setGlobalCtxAlertStatus({
                status: true,
                type: "confirm",
                content: `현재 ${rtcInfo.userType === UserType.HOST ? "방송" : "청취"} 중인 방송방이 있습니다. ${msgText}`,
                callback: () => {
                  if (chatInfo !== null && rtcInfo !== null) {
                    chatInfo.privateChannelDisconnect();
                    rtcInfo.socketDisconnect();
                    rtcInfo.stop();
                    dispatch(setGlobalCtxRtcInfoEmpty());
                    rtcSessionClear();
                  }

                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    dispatch(setGlobalCtxBroadClipDim(false));
                    clipCallBack(category);
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
                content: `현재 재생 중인 클립이 있습니다. ${msgText}`,
                callback: () => {
                  clipPlayer.clipExit();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    dispatch(setGlobalCtxBroadClipDim(false));
                    clipCallBack(category);
                  }
                },
              })
            ));
        }

        if ("broadcast_setting" === category) {
          checkBroadcast(category);
        } else {
          dispatch(setGlobalCtxBroadClipDim(false));
          clipCallBack(category);
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
          if (rtcInfo !== null) rtcInfo.stop();
          dispatch(setGlobalCtxRtcInfoEmpty())
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
      dispatch(setGlobalCtxRtcInfoInit(newRtcInfo));
      sessionStorage.setItem("room_no", roomNo);

      dispatch(setGlobalCtxBroadClipDim(false));
      history.push(`/broadcast/${roomNo}`);
    };

    const { result, message, code, data } = await broadcastCheck();
    if (result === "success") {
      if (code === "1") {
        // 진행중인 방송 존재
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: message,
          confirmText: "방송종료",
          cancelCallback: () => {
            dispatch(setGlobalCtxBroadClipDim(false));
          },
          callback: () => {
            roomExit(data.roomNo);
          },
        }));
      } else if (code === "2") {
        //비정상된 방이 있음 => 이어하기와 동일하게 수정
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: "2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?",
          subcont: "※ 이어서 하면 모든 방송데이터 (방송시간, 청취자, 좋아요, 부스터, 선물)를 유지한 상태로 만들어집니다.",
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
          // 새로방송하기
          callback: () => {
            roomExit(data.roomNo);
          },
        }));
      } else if (code === "C100") {
        // 이어하기 가능
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: "2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?",
          subcont: "※ 이어서 하면 모든 방송데이터 (방송시간, 청취자, 좋아요, 부스터, 선물)를 유지한 상태로 만들어집니다.",
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
          //새로방송하기
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

  const clipCallBack = (category) => {
    console.log(isHybrid());
    if (getDeviceConfig() == 1 || getDeviceConfig() == 2){
      if (category === "clip_recoding"){
        Hybrid("EnterClipRecord");
      } else {
        Hybrid("ClipUploadJoin");
      }
    } else if (getDeviceConfig() == 3) {
      history.push(`/${category}`);
    } else {
      dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 3]}));
    }
  }

  return (
    <div id="firstClipPage">
      <Header type="back"/>
      <section className='titleWrap'>
        <h1>첫 클립을 올려보세요!</h1>
        <p>청취 10건, 좋아요 5개를 달성하면 5달을 드려요.</p>
      </section>
      <section className='contentWrap'>
        <img src={`${IMG_SERVER}/clip/dalla/firstClipUpload.png`} />
        <p>1분 이상 청취해야 청취로 인정됩니다.</p>
        <p>비공개로 전환되거나 저작권을 침해하는 클립에는 지급되지 않습니다.</p>
      </section>
      <section className='bottomWrap'>
        <div className='recodeBox'>
          <span>준비된 파일이 없나요?</span>
          <button onClick={()=>{dimLink("clip_recoding")}}>녹음해서 올리기</button>
        </div>
        <SubmitBtn text="클립 올리기" onClick={()=>{dimLink("clip_upload")}}/>
      </section>
    </div>
  );
};

export default firstClip;