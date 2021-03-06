import React, { useEffect, useCallback, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
//context
import { GuestContext } from "context/guest_ctx";
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// constant
import { MediaType, tabType } from "../constant";

// api
import { guest, guestList, modifyBroadcastState } from "common/api";

//socket
import { UserType, ListenerRtc, HostRtc } from "common/realtime/rtc_socket";

//static
import GuestIcon from "../static/ic_live_guest_g.svg";
import GuestAlarmIcon from "../static/ic_guest_setting_on.svg";
import EqualizerIcon from "../static/ic_equalizer.png";
import HintIcon from "../static/broadcast_guide.svg";
import GiftIcon from "../static/ic_gift_m.svg";
import VideoOnIcon from "../static/ic_video.svg";
import VideoOffIcon from "../static/ic_videooff.svg";
import MicOnIcon from "../static/ic_mic.svg";
import MicOffIcon from "../static/ic_mic_off.svg";
// import GuestOffIcon from "../static/ic_more_out.svg";
import GuestOffIcon from "../static/ico_runout_w_s.svg";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxRightTabType, setBroadcastCtxUserMemNo} from "../../../redux/actions/broadcastCtx";
import {
  setGlobalCtxAlertStatus, setGlobalCtxGuestInfoAdd,
  setGlobalCtxGuestInfoEmpty, setGlobalCtxGuestInfoRemove, setGlobalCtxRtcInfoInit,
  setGlobalCtxSetToastStatus
} from "../../../redux/actions/globalCtx";

const initInterval = (callback) => {
  const intervalTime = 100;
  const id = setInterval(() => {
    const result = callback();
    if (result === true) {
      clearInterval(id);
    }
  }, intervalTime);
};

let timer;
let audioStreamChecker;

function getDecibel(analyser: any) {
  const bufferLength = analyser.frequencyBinCount;
  const frequencyArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(frequencyArray);
  let total = 0;
  frequencyArray.forEach((f) => {
    total += f * f;
  });
  const rms = Math.sqrt(total / bufferLength);
  let db = 25 * (Math.log(rms) / Math.log(10));
  db = Math.max(db, 0);
  db = Math.floor(db);

  return db;
}

function GuestComponent(props) {
  const { roomOwner, roomNo, roomInfo, displayWrapRef } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const { guestInfo, rtcInfo, chatInfo } = globalState;

  const { guestAction, guestState } = useContext(GuestContext);
  const { guestConnectStatus, guestObj } = guestState;

  const setGuestConnectStatus = guestAction.setGuestConnectStatus!;
  const setNewApplyGuest = guestAction.setNewApplyGuest!;
  const dispatchGuestObj = guestAction.dispatchGuestObj!;
  const dispatchStatus = guestAction.dispatchStatus!;

  const { dispatchLayer } = useContext(BroadcastLayerContext);

  // audio stream state
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioGauge, setAudioGauge] = useState<number>(0);

  // mic State
  const [micState, setMicState] = useState<boolean>(false);
  const [micCheck, setMicCheck] = useState<boolean>(false);

  const [controllerToggle, setControllerToggle] = useState<boolean>(false);
  const [controllerActive, setControllerActive] = useState<boolean>(true);

  const applyGuest = async () => {
    if (guestState.newApplyGuest === true) {
      //????????? ?????? ??????
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        title: "????????? ?????? ??????",
        content: "????????? ????????? ?????????????????????????",
        callback: async () => {
          await guest({
            roomNo: roomNo,
            memNo: globalState.baseData.memNo,
            mode: 7,
          });
        },
      }));
    } else {
      //????????? ??????
      const res = await guest({
        roomNo: roomNo,
        memNo: globalState.baseData.memNo,
        mode: 5,
      });

      if (res.result === "success") {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "????????? ????????? ?????????????????????.",
        }));
      } else {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: res.message,
        }));
      }
    }
  };

  const exitGuest = useCallback(
    (item) => {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        content: "????????? ????????? ?????????????????????????",
        callback: async () => {
          const res = await guest({
            roomNo: roomNo,
            memNo: item,
            mode: 6,
          });
          if (res.result === "success") {
            if (guestInfo !== null) {
              if (guestInfo[item]) {
                guestInfo[item].stop();
                dispatch(setGlobalCtxGuestInfoRemove({memNo:item}));
              }
              dispatchGuestObj({
                type: "INIT",
              });
              setNewApplyGuest(false);
            }
          } else {
            if (guestInfo !== null) {
              if (guestInfo[item]) {
                dispatch(setGlobalCtxGuestInfoRemove({memNo:item}));
              }
              dispatchGuestObj({
                type: "INIT",
              });
              setNewApplyGuest(false);
            }
          }
        },
      }));
    },
    [roomNo]
  );

  const detectAudioDevice = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    let micDeivceExist: boolean = false;
    let videoDeviceExist: boolean = false;
    devices.forEach((d) => {
      if (d.kind === "audioinput") {
        micDeivceExist = true;
      }
    });

    if (micDeivceExist === false) {
      if (audioStream !== null) {
        removeStream();
        setMicState(false);
      }
      setAudioStream(null);
    } else if (micDeivceExist === true) {
      const stream = await setStream();
      setAudioStream(stream);
    }
  }, []);

  const setStream = useCallback(async () => {
    navigator.mediaDevices.addEventListener("devicechange", detectAudioDevice);
    const constraint = { video: roomInfo.mediaType === MediaType.VIDEO ? true : false, audio: true };
    const stream = await navigator.mediaDevices
      .getUserMedia(constraint)
      .then((stream) => {
        return stream;
      })
      .catch((e) => {
        return null;
      });

    return stream;
  }, []);

  const removeStream = useCallback(async () => {
    navigator.mediaDevices.removeEventListener("devicechange", detectAudioDevice);
    audioStream?.getTracks().forEach((track) => track.stop());
    setAudioGauge(0);
    // setMicState(false);
  }, [audioStream]);

  const checkStatus = useCallback(() => {
    if (guestState.guestStatus.inviteCancle === true) {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "DJ?????? ????????? ????????? ?????????????????????.",
      }));
    } else if (micState === true && audioStream !== null) {
      HostSocketConnect();
    } else {
      setMicCheck(true);
    }
  }, [guestState.guestStatus, micState, audioStream]);

  const connectListeners = useCallback(
    (item) => {
      dispatchStatus({
        type: "INIT",
      });
      if (guestInfo === null || (guestInfo !== null && !guestInfo[item.memNo])) {
        const newGuestInfo = new ListenerRtc(
          UserType.GUEST_LISTENER,
          item.webRtcUrl,
          item.webRtcAppName,
          item.webRtcStreamName,
          roomNo,
          {
            isVideo: roomInfo.mediaType === MediaType.VIDEO,
          }
        );

        newGuestInfo.setDisplayWrapRef(displayWrapRef);

        initInterval(() => {
          if (newGuestInfo.getPeerConnectionCheck()) {
            newGuestInfo.playMediaTag();
            return true;
          }
          return false;
        });
        newGuestInfo;

        if (chatInfo !== null) {
          chatInfo.setGuestInfo(newGuestInfo);
        }

        dispatch(setGlobalCtxGuestInfoAdd({
          RTC: newGuestInfo,
          memNo: item.memNo,
        }));

      } else if (guestInfo !== null && guestInfo[item.memNo]) {
        guestInfo[item.memNo].initVideoTag();

        initInterval(() => {
          if (guestInfo[item.memNo].getPeerConnectionCheck()) {
            guestInfo[item.memNo].playMediaTag();
            return true;
          }

          return false;
        });
      }
      dispatchGuestObj({
        type: "ADD",
        data: item,
      });
    },
    [guestInfo, rtcInfo]
  );

  const connectHost = async (item) => {
    dispatchStatus({
      type: "INIT",
    });
    await initInterval(() => {
      if (micState === true && audioStream !== null) {
        return true;
      }
      return false;
    });

    if (guestInfo === null || (guestInfo !== null && !guestInfo[globalState.baseData.memNo])) {
      const videoConstraints = {
        isVideo: roomInfo.mediaType === MediaType.VIDEO ? true : false,
        videoFrameRate: roomInfo.videoFrameRate,
        videoResolution: roomInfo.videoResolution,
      };

      const newGuestInfo = new HostRtc(
        UserType.GUEST,
        item.webRtcUrl,
        item.webRtcAppName,
        item.webRtcStreamName,
        roomNo,
        true,
        videoConstraints
      );

      initInterval(() => {
        if (newGuestInfo.getWsConnectionCheck()) {
          newGuestInfo.setDisplayWrapRef(displayWrapRef);
          newGuestInfo.publish();
          return true;
        }
        return false;
      });

      initInterval(() => {
        if (newGuestInfo.getPeerConnectionCheck()) {
          dispatch(setGlobalCtxGuestInfoAdd({
            RTC: newGuestInfo,
            memNo: globalState.baseData.memNo,
          }));

          if (chatInfo !== null) {
            chatInfo.setGuestInfo(newGuestInfo);
          }
          dispatchGuestObj({
            type: "ADD",
            data: item,
          });
          return true;
        }
        return false;
      });
    } else if (guestInfo !== null && guestInfo[globalState.baseData.memNo]) {
      const key = Object.keys(guestInfo)[0];
      if(guestInfo[key] && guestInfo[key] !== "EMPTY" ) {
        guestInfo[key].setDisplayWrapRef(displayWrapRef);

        guestInfo[key].initVideoTag();
      }
    }
  };

  const rtcInit = (mono: boolean) => {
    if (rtcInfo !== null && (rtcInfo.getIsMono() !== true || (rtcInfo.getIsMono() === true && mono === false))) {
      rtcInfo.socketDisconnect();
      rtcInfo.stop();

      if (roomInfo.webRtcUrl && roomInfo.webRtcAppName && roomInfo.webRtcStreamName) {
        const videoConstraints = {
          isVideo: roomInfo.mediaType === MediaType.VIDEO ? true : false,
          videoFrameRate: roomInfo.videoFrameRate,
          videoResolution: roomInfo.videoResolution,
        };

        const newRtcInfo = new HostRtc(
          UserType.HOST,
          roomInfo.webRtcUrl,
          roomInfo.webRtcAppName,
          roomInfo.webRtcStreamName,
          roomNo,
          mono,
          videoConstraints
        );
        newRtcInfo.setRoomInfo(roomInfo);
        newRtcInfo.setDisplayWrapRef(displayWrapRef);
        initInterval(() => {
          if (newRtcInfo.getWsConnectionCheck()) {
            dispatch(setGlobalCtxRtcInfoInit(newRtcInfo));
            return true;
          }
          return false;
        });
      }
    }
  };

  const HostSocketConnect = useCallback(async () => {
    const res = await guest({
      roomNo: roomNo,
      memNo: globalState.baseData.memNo,
      mode: 3,
    });
    if (res.result === "success") {
      connectHost(res.data);
    } else {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: res.message,
      }));
    }
  }, [guestInfo, globalState.baseData.memNo, rtcInfo]);

  const startBroadcast = useCallback(
    async (e, type?: string) => {
      e.stopPropagation();
      const mediaState = type || "audio";

      const res = await modifyBroadcastState({
        roomNo,
        mediaState,
        mediaOn: true,
      });

      setControllerActive(true);

      if (guestInfo !== null) {
        Object.keys(guestInfo).forEach((v) => {
          guestInfo[v].setBroadState(true);
          guestInfo[v].addTrackToPeerStream(type);
        });
      }
    },
    [guestInfo]
  );

  const stopBroadcast = useCallback(
    async (e, type?: string) => {
      e.stopPropagation();
      const mediaState = type || "audio";

      const res = await modifyBroadcastState({
        roomNo,
        mediaState,
        mediaOn: false,
      });

      setControllerActive(false);

      if (guestInfo !== null) {
        Object.keys(guestInfo).forEach((v) => {
          guestInfo[v].setBroadState(false);
          guestInfo[v].removeTrackFromPeerStream(type);
        });
      }
    },
    [guestInfo]
  );

  useEffect(() => {
    async function initDeviceAudioStream() {
      const stream = await setStream();
      setAudioStream(stream);
    }
    let audioCheckerId: number | null = null;

    if (audioStream === null && micCheck === true && micState === false) {
      initDeviceAudioStream();

      audioStreamChecker = setTimeout(() => {
        if (audioStream === null) {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content:
              "????????? ????????? ?????? ????????? ????????? ?????????\n?????????. ????????? ???????????????\n'???????????????'????????? ???????????????.\n5??? ??? ????????? ???????????? ?????? ?????? ????????????\n????????? ????????? ???????????????.)",
          }));
        }
      }, 1000);

      timer = setTimeout(async () => {
        await guest({
          roomNo: roomNo,
          memNo: globalState.baseData.memNo,
          mode: 2,
        });

        setMicCheck(false);
        setMicState(false);

        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "?????? ?????? ????????? ???????????? ???????????? ????????? ????????? ?????????????????????.\n????????? ?????? ??? ?????? ????????? ??????????????????.",
        }));
      }, 300000);
    }

    const audioCtx = (() => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      return audioCtx;
    })();

    if (audioStream !== null && micState === false && micCheck === true) {
      const audioSource = audioCtx.createMediaStreamSource(audioStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      audioSource.connect(analyser);

      if (micState === false) {
        audioCheckerId = setInterval(() => {
          const db = getDecibel(analyser);
          setAudioGauge(db);
          if (db > 3) {
            setMicState(true);
          }
        }, 30);
      }
    }

    return () => {
      if (audioCheckerId !== null) {
        clearInterval(audioCheckerId);
      }

      if (timer !== null && audioStream !== null) {
        clearTimeout(timer);
      }

      if (audioStreamChecker !== null && audioStream !== null) {
        clearTimeout(audioStreamChecker);
      }

      audioCtx.close();
    };
  }, [audioStream, micCheck, micState]);

  // Status ?????? Effect
  useEffect(() => {
    // ????????? ??????
    if (guestState.guestStatus.invite === true && roomOwner === false) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        content: "DJ?????? ???????????? ??????????????????.\n???????????? ????????? ?????????????????????????",
        callback: () => {
          checkStatus();
        },
        cancelCallback: async () => {
          await guest({
            roomNo: roomNo,
            memNo: globalState.baseData.memNo,
            mode: 4,
          });
        },
      }));
    }

    // ????????? ?????? ??????
    if (guestState.guestStatus.accept === true && roomOwner === false) {
      setNewApplyGuest(false);
    }

    // ????????? ?????? ??????
    if (guestState.guestStatus.reject === true && roomOwner === false) {
      setNewApplyGuest(false);
    }

    // ????????? ?????? ??????
    if (guestState.guestStatus.applyCancle === true && roomOwner === false) {
      setNewApplyGuest(false);
    }

    if (guestState.guestStatus.connect === true) {
      const getGuestList = async () => {
        const res = await guestList({
          roomNo: roomNo,
        });
        const { data } = res;
        if (res.result === "success") {
          if (data.list.length > 0) {
            connectListeners(data.list[0]);

            if (roomOwner === true) {
              rtcInit(true);
            }
          }
        }
      };

      getGuestList();
    }

    if (guestState.guestStatus.end === true || guestState.guestStatus.exit === true) {
      if (guestInfo !== null) {
        Object.keys(guestInfo).forEach((v) => {
          guestInfo[v].stop?.();
          if (v === globalState.baseData.memNo) {
            guestInfo[v].socketDisconnect();
          }
          dispatch(setGlobalCtxGuestInfoEmpty());
        });
        dispatchGuestObj({
          type: "INIT",
        });
      }

      dispatchStatus({
        type: "INIT",
      });
      if (roomOwner === true) {
        rtcInit(false);
      }
    }
  }, [guestState.guestStatus, guestInfo]);

  useEffect(() => {
    if (micState === true && audioStream !== null) {
      //????????? ????????????
      HostSocketConnect();
    }
  }, [micState, audioStream]);

  useEffect(() => {
    if (guestInfo && guestInfo !== null && Object.keys(guestInfo).length > 0) {
      if (guestInfo[globalState.baseData.memNo]) {
        initInterval(() => {
          if (guestInfo[globalState.baseData.memNo].getPeerConnectionCheck()) {
            setGuestConnectStatus(true);
            return true;
          }
          return false;
        });
      } else {
        const a = Object.keys(guestInfo)[0];
        if(guestInfo[a] && guestInfo[a] !== "EMPTY" ){
          guestInfo[a].setDisplayWrapRef(displayWrapRef);

          initInterval(() => {
            if (guestInfo[a].getPeerConnectionCheck()) {
              setGuestConnectStatus(true);
              return true;
            }
            return false;
          });
        }
      }
    }
  }, [guestInfo]);

  useEffect(() => {
    async function guestConnect() {
      await guest({
        roomNo: roomNo,
        memNo: globalState.baseData.memNo,
        mode: 8,
      });
    }

    if (guestState.guestConnectStatus === true && guestInfo !== null && guestInfo[globalState.baseData.memNo]) {
      guestConnect();
    }
  }, [guestState.guestConnectStatus, guestInfo, globalState.baseData.memNo]);

  useEffect(() => {
    const getGuestList = async () => {
      const res = await guestList({
        roomNo: roomNo,
      });

      if (res.result === "success" && res.data.hasOwnProperty("list")) {
        if (res.data.list.length > 0) {
          const guest = res.data.list[0];
          if (guest.memNo !== globalState.baseData.memNo) {
            connectListeners(guest);

            setGuestConnectStatus(true);
          } else {
            connectHost(guest);
          }
        }
      }
    };
    getGuestList();

    return () => {};
  }, [globalState.baseData.memNo]);
  return (
    <>
      <>
        {guestConnectStatus === true && guestObj !== null ? (
          <>
            {Object.keys(guestObj).map((v, idx) => {
              const obj = guestObj[v];
              return (
                <GuestWrapStyled key={idx}>
                  <div className="guestIconWrap">
                    {roomOwner === true && (
                      <button
                        className="guestGift"
                        onClick={(e) => {
                          e.stopPropagation();

                          dispatchLayer({
                            type: "GIFT",
                            others: {
                              guestClicked: true,
                            },
                          });
                        }}
                      >
                        <img src={GiftIcon} />
                      </button>
                    )}
                    <span
                      className="guestImageWrap"
                      onClick={() => {
                        if (roomOwner === true) {
                          exitGuest(v);
                        } else if (v === globalState.baseData.memNo) {
                          setControllerToggle(!controllerToggle);
                          dispatch(setBroadcastCtxUserMemNo(v));
                          dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
                        }
                      }}
                    >
                      <img src={EqualizerIcon} className="equalizer" />
                      <img src={guestObj[v].profImg.url} className="guestImg" />
                    </span>
                  </div>
                  {roomInfo.useGuest === true && (
                    <div className="guestBtnWrap">
                      <img
                        src={HintIcon}
                        className="hintIcon"
                        onClick={() => {
                          history.push("/event/guest_guide");
                        }}
                      />
                      {roomOwner === true ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setBroadcastCtxRightTabType(tabType.GUEST));
                          }}
                        >
                          <img src="https://image.dalbitlive.com/broadcast/ico_live_guest_g.png" className="guestIcon" alt="G" />
                          {guestState.newApplyGuest === false ? (
                            "??????"
                          ) : (
                            <>
                              <img src={GuestAlarmIcon} className="guestAlarm" alt="dot" />
                              ??????
                            </>
                          )}
                        </button>
                      ) : v !== globalState.baseData.memNo ? (
                        <button onClick={applyGuest}>
                          <img src="https://image.dalbitlive.com/broadcast/ico_live_guest_g.png" alt="G" />
                          {guestState.newApplyGuest === true ? "??????" : "??????"}
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                  {controllerToggle === true && (
                    <div className="guestBtnToggle">
                      {roomInfo.mediaType === MediaType.AUDIO ? (
                        <>
                          {controllerActive === true ? (
                            <button
                              onClick={(e) => {
                                stopBroadcast(e);
                              }}
                            >
                              <img className="icon" src={MicOffIcon} alt="????????? ??????" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                startBroadcast(e);
                              }}
                            >
                              <img className="icon" src={MicOnIcon} alt="????????? ??????" />
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {controllerActive === true ? (
                            <button
                              onClick={(e) => {
                                stopBroadcast(e, "video");
                              }}
                            >
                              <img className="icon" src={VideoOffIcon} alt="????????? ??????" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                startBroadcast(e, "video");
                              }}
                            >
                              <img className="icon" src={VideoOnIcon} alt="????????? ??????" />
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exitGuest(v);
                        }}
                      >
                        <img src={GuestOffIcon} alt="????????? ?????? ??????" />
                      </button>
                    </div>
                  )}
                </GuestWrapStyled>
              );
            })}
          </>
        ) : (
          <GuestWrapStyled className="guest_wrap">
            {roomInfo.useGuest === true && (
              <div className="guestBtnWrap">
                <img
                  src={HintIcon}
                  className="hintIcon"
                  onClick={() => {
                    history.push("/event/guest_guide");
                  }}
                />
                {roomOwner === true ? (
                  <button
                    onClick={() => {
                      dispatch(setBroadcastCtxRightTabType(tabType.GUEST));
                    }}
                  >
                    <img src="https://image.dalbitlive.com/broadcast/ico_live_guest_g.png" className="guestIcon" alt="G" />
                    {guestState.newApplyGuest === false ? (
                      "??????"
                    ) : (
                      <>
                        <img src={GuestAlarmIcon} className="guestAlarm" alt="dot" />
                        ??????
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      applyGuest();
                    }}
                  >
                    <img src="https://image.dalbitlive.com/broadcast/ico_live_guest_g.png" alt="G" />
                    {guestState.newApplyGuest === false ? "??????" : "??????"}
                  </button>
                )}
              </div>
            )}
          </GuestWrapStyled>
        )}
      </>
    </>
  );
}

export default GuestComponent;

const GuestWrapStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  z-index: 1;

  .guestIconWrap {
    display: flex;
    margin-bottom: 5px;
    background-color: #000;
    border-radius: 30px;
    .guestGift {
      display: inline-block;
      margin: 0 12px;
      img {
        width: 32px;
        height: 32px;
      }
    }
    .guestImageWrap {
      display: block;
      text-align: right;
      cursor: pointer;
    }
    .guestImg {
      display: inline-block;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      cursor: pointer;
    }

    .equalizer {
      position: absolute;
      animation: roll linear 2s infinite;
      @keyframes roll {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(359deg);
        }
      }
    }
  }
  .guestBtnWrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .hintIcon {
      width: 28px;
      height: 28px;
      margin-right: 6px;
      cursor: pointer;
    }
    & > button {
      position: relative;
      width: 62px;
      height: 28px;
      background-color: rgb(0, 0, 0, 0.2);
      border-radius: 24px;
      color: #fff;
      font-size: 13px;
      line-height: 26px;
      text-align: center;
      .guestAlarm {
        position: absolute;
        left: 0;
      }

      & > img[alt="G"] {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-top: -2px;
        vertical-align: middle;
      }
    }
  }

  .guestBtnToggle {
    position: absolute;
    top: 66px;
    right: 0;
    padding: 4px 6px;
    background: #000;
    border-radius: 40px;

    button + button {
      margin-left: 4px;
    }

    img {
      vertical-align: middle;
    }
  }
`;
