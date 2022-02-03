import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useLastLocation } from "react-router-last-location";

// context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
import { GuestContext } from "context/guest_ctx";

// constant
import { MediaType } from "pages/broadcast/constant";

// component
import ChatHeaderWrap from "../component/chat_header_wrap";
import ChatInputWrap from "../component/chat_input_wrap";
import ChatListWrap from "../component/chat_list_wrap";
import RandomMsgWrap from "../component/random_msg_wrap";

// others
import LottiePlayer from "lottie-web";
import {
  UserType,
  ListenerRtc,
  HostRtc,
  AgoraHostRtc,
  AgoraListenerRtc,
  getArgoraRtc,
  rtcSessionClear
} from "common/realtime/rtc_socket";
import { createElement } from "lib/create_element";
import Lottie from "react-lottie";

// static
import TooltipUI from "common/tooltip";
import { broadcastExit } from "common/api";

import playBtn from "../static/ic_circle_play.svg";
import StampIcon from "../static/stamp.json";
import LottieFreeze from "../static/lottie_freeze.json";

import {ttsAlarmDuration} from "../../../constant";
import {BroadcastLayerContext} from "../../../context/broadcast_layer_ctx";
import {TransitionPromptHook} from "history";

type ComboType = {
  status: boolean;
  playing: boolean;
  idx: number;
  prevCnt: number;
  repeatCnt: number;
  itemNo: string;
  memNo: string;
  duration: number;
  elem?: any;
  comboCountingText?: any;
  url?: string;
  userImage?: string;
  userNickname?: string;
  callback(): void;
};

const initInterval = (callback: () => boolean) => {
  const intervalTime = 100;
  const id = setInterval(() => {
    const result = callback();
    if (result === true) {
      clearInterval(id);
    }
  }, intervalTime);
};

const comboPositionActive = [false, false, false];

const ANIMATION_MAX_COUNT = 100;
let animationQueue: Array<any> = [];
let animationCount = 0;

let soundAnimationQueue: Array<any> = [];

let audio: any = new Audio();
let ttsAudio: any = new Audio();
let intervalCnt = 0;

let comboActiveQueue: Array<ComboType> = [];

let comboWaitingQueue: Array<ComboType> = [];

let comboTimer;
let lottieAnimation;
let animationWrapElem;

const comboTimerGroup = {
  comboInterval_0: null,
  comboTimer_0: null,
  comboInterval_1: null,
  comboTimer_1: null,
  comboInterval_2: null,
  comboTimer_2: null,
};

function audioTimeout(
    duration,
    lottieAnimation,
    lottieDisplayElem,
    animationWrapElem,
    broadcastAction
) {
  setTimeout(() => {
    const audioInterval = setInterval(() => {
      const roundNumber = Math.round(audio.volume * 10 - 1);
      let volume = roundNumber < 0 ? 0 : roundNumber;
      if (volume === 0) {
        clearInterval(audioInterval);
        audio.pause();
        audio.currentTime = 0;
        soundAnimationQueue.shift();
        intervalCnt = 0;
        broadcastAction.setIsTTSPlaying!(false);

        if (lottieAnimation) {
          lottieAnimation.destroy();
        }

        lottieDisplayElem.removeChild(animationWrapElem);

        if (lottieDisplayElem.children.length === 0) {
          broadcastAction.dispatchChatAnimation &&
          broadcastAction.dispatchChatAnimation({ type: "end" });
        }
      } else {
        audio.volume = volume / 10;
      }
    }, 200);
  }, duration);
}

export default function LeftSideAgora(props: {
  roomOwner: boolean;
  roomNo: string;
  roomInfo: roomInfoType;
  forceChatScrollDown: boolean;
  setForceChatScrollDown: any;
}) {
  const {
    roomOwner,
    roomNo,
    roomInfo,
    forceChatScrollDown,
    setForceChatScrollDown,
  } = props;

  const lastLocation = useLastLocation();

  const { globalState, globalAction } = useContext(GlobalContext);
  const { baseData, chatInfo, rtcInfo, tooltipStatus, guestInfo } = globalState;
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { chatAnimation, comboAnimation, chatFreeze } = broadcastState;
  const { guestState, guestAction } = useContext(GuestContext);
  const { dispatchDimLayer } = useContext(BroadcastLayerContext);

  const { guestConnectStatus } = guestState;

  const history = useHistory();

  const [playBtnStatus, setPlayBtnStatus] = useState<boolean>(false);
  const [connectedStatus, setConnectedStatus] = useState<boolean>(
      (() => {
        if (rtcInfo !== null && rtcInfo.getPeerConnectionCheck()) {
          return false;
        }
        return true;
      })()
  );

  const [animPlayState, setAnimPlayState] = useState(false);
  const [audioPlayState, setAudioPlayState] = useState(false);
  const [ttsAnimationQueue, setTTSAnimationQueue] = useState<Array<any>>([]);
  type AType = {host: AgoraHostRtc | null, listener: AgoraListenerRtc | null};
  const [agoraRtc, setAgoraRtc] = useState<AType>({host: null, listener: null})
  type WType = {host: HostRtc | null, listener: ListenerRtc | null};
  const [wowzaRtc, setWowzaRtc] = useState<WType>({host: null, listener: null})
  // temp variable

  const displayWrapRef = useRef<HTMLDivElement>(null);

  const lottieDisplayRef = useRef<any>(null);

  let roomChanged = false;

  const broadcastPlayAsListener = useCallback(() => {
    if (
        roomInfo.webRtcUrl &&
        roomInfo.webRtcAppName &&
        roomInfo.webRtcStreamName
    ) {
      const rtcInfo = new ListenerRtc(
          UserType.LISTENER,
          roomInfo.webRtcUrl,
          roomInfo.webRtcAppName,
          roomInfo.webRtcStreamName,
          roomNo,
          {
            isVideo: false,
          }
      );
      rtcInfo.setRoomInfo(roomInfo);
      rtcInfo.setDisplayWrapRef(displayWrapRef);
      globalAction.dispatchRtcInfo({ type: "init", data: rtcInfo });
      sessionStorage.setItem("wowza_rtc", JSON.stringify({roomInfo:rtcInfo.roomInfo, userType:rtcInfo.userType}));
    }
  }, [roomInfo]);



  const broadcastPublishAsHost = useCallback(() => {
    if (
        roomInfo.webRtcUrl &&
        roomInfo.webRtcAppName &&
        roomInfo.webRtcStreamName
    ) {
      const videoConstraints = {
        isVideo: false,
        videoFrameRate: roomInfo.videoFrameRate,
        videoResolution: roomInfo.videoResolution,
      };

      const rtcInfo = new HostRtc(
          UserType.HOST,
          roomInfo.webRtcUrl,
          roomInfo.webRtcAppName,
          roomInfo.webRtcStreamName,
          roomNo,
          false,
          videoConstraints
      );
      rtcInfo.setRoomInfo(roomInfo);
      globalAction.dispatchRtcInfo({ type: "init", data: rtcInfo });
      sessionStorage.setItem("wowza_rtc", JSON.stringify({roomInfo:rtcInfo.roomInfo, userType:rtcInfo.userType}));
      setPlayBtnStatus(false);
    }
  }, [rtcInfo, roomInfo]);

  const disconnectGuest = () => {
    if (guestInfo !== null) {
      const guestInfoKeyArray = Object.keys(guestInfo);

      if (guestInfoKeyArray.length > 0) {
        guestInfoKeyArray.forEach((v) => {
          guestInfo[v].stop();
          globalAction.dispatchGuestInfo!({
            type: "EMPTY",
          });
        });
      }
    }
  };

  const audioEndEvent = () => {
    if (ttsAudio) {
      ttsAudio.pause();
      ttsAudio.currentTime = 0;
      ttsAudio = null;
    }

    broadcastAction.setIsTTSPlaying!(false);
    setAudioPlayState(false);
  };

  const playAnimation = (playData) => {
    const {
      ttsItemInfo,
      webpUrl,
      isCombo,
      url,
      isTTSItem,
      soundFileUrl,
    } = playData;
    ttsAudio = new Audio();
    ttsAudio.volume = 1;
    ttsAudio.src = isTTSItem ? ttsItemInfo.fileUrl : soundFileUrl;
    ttsAudio.play();
    ttsAudio.loop = false;

    if (webpUrl) {
      const webpImg = document.createElement("img");
      webpImg.setAttribute("src", webpUrl);
      webpImg.setAttribute(
          "style",
          "position: absolute; object-fit: contain; width: inherit; height: inherit; z"
      );
      animationWrapElem.appendChild(webpImg);
    } else {
      lottieAnimation = LottiePlayer.loadAnimation({
        container: animationWrapElem,
        renderer: "svg",
        loop: isCombo,
        autoplay: true,
        path: url,
      });
    }
  };

  const endAnimation = (duration) => {
    setTimeout(() => {
      const lottieDisplayElem = lottieDisplayRef.current;

      if (lottieAnimation) {
        lottieAnimation.destroy();
      }

      if (lottieDisplayElem && animationWrapElem) {
        lottieDisplayElem.removeChild(animationWrapElem);
      }

      if (lottieDisplayElem && lottieDisplayElem.children.length === 0) {
        broadcastAction.dispatchChatAnimation &&
        broadcastAction.dispatchChatAnimation({ type: "end" });
      }

      setAnimPlayState(false);
    }, duration);
  };

  const resetAnimation = () => {
    soundAnimationQueue = [];
    setTTSAnimationQueue([]);
    broadcastAction.dispatchChatAnimation!({ type: "end" });
    ttsAudio = null;
  };

  // 방장 + 방송중 + url 이동 시 팝업
  // 지우지 마세유
  useEffect(()=>{
    // const transitionPromptHook:TransitionPromptHook = (location, action)=>{
    //   globalAction.setAlertStatus({
    //     status: true,
    //     type: "confirm",
    //     title: "알림",
    //     content: `방송을 정말 종료하시겠습니까?`,
    //     callback: async () => {
    //       const { data, result } = await broadcastExit({ roomNo });
    //       if (result === "success") {
    //         if (roomNo && chatInfo !== null) {
    //           chatInfo.privateChannelDisconnect();
    //         }
    //         if (rtcInfo !== null) {
    //           rtcInfo.socketDisconnect();
    //           rtcInfo.stop();
    //           globalAction.dispatchRtcInfo({ type: "empty" });
    //           disconnectGuest();
    //           await rtcInfo.stop();
    //           rtcSessionClear();
    //           if (roomOwner) {
    //             dispatchDimLayer({
    //               type: "BROAD_END",
    //               others: {
    //                 roomOwner: true,
    //                 roomNo: roomNo,
    //               },
    //             });
    //           } else {
    //             setTimeout(() => {
    //               history.push("/");
    //             });
    //           }
    //         }
    //       }
    //     },
    //   });
    //   return false;
    // }

    //history.block(roomOwner && rtcInfo ? transitionPromptHook : true);
  },[history, rtcInfo])

  useEffect(() => {
    if (!animPlayState && !audioPlayState) {
      shiftAnimation();
    }
  }, [animPlayState, audioPlayState]);

  const shiftAnimation = () => {
    if (ttsAnimationQueue.length > 0) {
      const animQueue = Object.assign([], ttsAnimationQueue);
      animQueue.shift();
      setTTSAnimationQueue(animQueue);
      broadcastAction.dispatchChatAnimation!({ type: "end" });
    }
  };

  useEffect(() => {
    if (roomNo && roomInfo !== null && chatInfo !== null) {
      // chat init logic
      chatInfo.setRoomNo(roomNo);

      chatInfo.setGlobalAction(globalAction);
      chatInfo.setBroadcastAction(broadcastAction);
      chatInfo.setGuestAction(guestAction);

      chatInfo.setRoomOwner(roomOwner);
      chatInfo.setDefaultData({ history });

      chatInfo.setRoomInfo(roomInfo);

      if (baseData.isLogin === true) {
        if (chatInfo.privateChannelHandle === null) {
          initInterval(() => {
            if (
                chatInfo.socket != null &&
                chatInfo.socket.getState() === "open" &&
                chatInfo.chatUserInfo.roomNo !== null
            ) {
              chatInfo.binding(
                  chatInfo.chatUserInfo.roomNo,
                  (roomNo: string) => {}
              );
              return true;
            }
            return false;
          });
        }
      } else {
        const roomExit = async () => {
          const { result } = await broadcastExit({ roomNo });
          if (result === "success") {
            if (rtcInfo !== null && globalAction.dispatchRtcInfo) {
              chatInfo.privateChannelDisconnect();
              rtcInfo.stop();
              disconnectGuest();
              globalAction.dispatchRtcInfo({ type: "empty" });
              rtcSessionClear();
            }
          }
        };
        roomExit();
      }
    }
  }, [baseData.isLogin]);

  useEffect(() => {
    animationCount = 0;
    animationQueue = [];
    if (roomNo && roomInfo !== null && chatInfo !== null) {
      // rtc listener init logic
      if (rtcInfo === null && roomOwner === false) {
        broadcastPlayAsListener();
      } else if (
          chatInfo !== null &&
          rtcInfo !== null &&
          rtcInfo.userType === UserType.LISTENER
      ) {
        // rtc listener new room logic
        if (roomNo !== rtcInfo.getRoomNo()) {
          roomChanged = true;
          chatInfo.privateChannelDisconnect();
          initInterval(() => {
            if (
                chatInfo.socket.getState() === "open" &&
                chatInfo.chatUserInfo.roomNo !== null
            ) {
              chatInfo.binding(
                  chatInfo.chatUserInfo.roomNo,
                  (roomNo: string) => {}
              );
              return true;
            }
            return false;
          });

          rtcInfo.stop();
          disconnectGuest();
          setConnectedStatus(true);
          broadcastPlayAsListener();
        }
      } else if (rtcInfo !== null && rtcInfo.userType === UserType.HOST) {
        // rtc host init logic
        if (rtcInfo.getPeerConnectionCheck()) {
          setConnectedStatus(false);
        } else {
          initInterval(() => {
            if (rtcInfo.getWsConnectionCheck()) {
              setConnectedStatus(false);
              rtcInfo.publish();
              return true;
            }
            return false;
          });
        }
      }
    }

    resetAnimation();

    return () => {
      comboWaitingQueue = [];
      for (var i = 0; i < 3; i++) {
        comboActiveQueue[i] = {
          ...comboActiveQueue[i],
          status: false,
        };
        if (comboTimerGroup[`comboTimer_${i}`])
          clearTimeout(comboTimerGroup[`comboTimer_${i}`]);
        if (comboTimerGroup[`comboInterval_${i}`])
          clearInterval(comboTimerGroup[`comboTimer_${i}`]);
      }

      broadcastAction.dispatchComboAnimation!({
        type: "end",
      });

      resetAnimation();
    };
  }, []);

  useEffect(() => {
    ttsAudio && ttsAudio.addEventListener("ended", audioEndEvent);
    return () =>
        ttsAudio && ttsAudio.removeEventListener("ended", audioEndEvent);
  }, [ttsAudio]);
  //방장 비디오 셋팅
  useEffect(()=>{
    if(roomInfo.platform === "wowza"){
      return;
    }

    if(agoraRtc.host || agoraRtc.listener){// rtc 1번만 생성하기
      return;
    }
    if(!roomInfo.agoraToken){
      console.log(`left_side_agora not found agoraToken`)
      return;
    }
    const videoConstraints = { isVideo: roomInfo.mediaType === MediaType.VIDEO };
    const host = new AgoraHostRtc(UserType.HOST, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomNo, false, videoConstraints);
    const listener = new AgoraListenerRtc(UserType.LISTENER, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomNo, videoConstraints);
    const dispatchRtcInfo:AgoraHostRtc|AgoraListenerRtc = roomOwner ? host : listener;
    dispatchRtcInfo.setRoomInfo(roomInfo);
    dispatchRtcInfo.join(roomInfo).then(()=>{
      globalAction.dispatchRtcInfo({type: "init", data: dispatchRtcInfo});
      sessionStorage.setItem("agora_rtc", JSON.stringify({roomInfo:dispatchRtcInfo.roomInfo, userType:dispatchRtcInfo.userType}));
    });
    setAgoraRtc({...agoraRtc, ...dispatchRtcInfo});
  },[]);

  useEffect(()=>{
    if(roomInfo.platform === "agora"){
      return;
    }

    if(wowzaRtc.host || wowzaRtc.listener){// rtc 1번만 생성하기
      return;
    }

    const hostVideoConstraints = {
      isVideo: roomInfo.mediaType === MediaType.VIDEO,
      videoFrameRate: roomInfo.videoFrameRate,
      videoResolution: roomInfo.videoResolution,
    };
    const listenerVideoConstraints = {
      isVideo: roomInfo.mediaType === MediaType.VIDEO,
    }
    const host = new HostRtc(UserType.HOST, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomNo, false, hostVideoConstraints);
    const listener = new ListenerRtc(UserType.LISTENER, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomNo, listenerVideoConstraints);
    const dispatchRtcInfo:HostRtc|ListenerRtc = roomOwner ? host : listener;
    dispatchRtcInfo.setRoomInfo(roomInfo);
    sessionStorage.setItem("wowza_rtc", JSON.stringify({roomInfo:dispatchRtcInfo.roomInfo, userType:dispatchRtcInfo.userType}));
    setWowzaRtc({...wowzaRtc, ...dispatchRtcInfo});
  },[])

  useEffect(() => {
    if (typeof broadcastState.soundVolume === 'number') {
      if(audio && typeof audio?.volume === 'number') {
        audio.volume = broadcastState.soundVolume;

        if(rtcInfo !==null){
          rtcInfo.audioVolume(broadcastState.soundVolume)
        }
      }
      if(ttsAudio && typeof ttsAudio?.volume === 'number') {
        ttsAudio.volume = broadcastState.soundVolume;
      }
    }
  },[broadcastState.soundVolume]);

  useEffect(()=>{
    // Set rtcinfo in chat instance.
    if (chatInfo !== null) {
      chatInfo.setRtcInfo(rtcInfo);
    }
  },[rtcInfo])



  useEffect(() => {
    if(roomInfo.platform === "wowza"){
      if (rtcInfo !== null) {
        // for dj host, audio publishing - refresh case
        rtcInfo.setDisplayWrapRef(displayWrapRef);

        rtcInfo.initVideoTag();

        if (roomOwner === true) {
          if (lastLocation === null) {
            initInterval(() => {
              if (rtcInfo.getWsConnectionCheck()) {
                setConnectedStatus(false);
                rtcInfo.publish();
                setPlayBtnStatus(false);
                return true;
              }
              return false;
            });
          } else {
            initInterval(() => {
              if (rtcInfo.getWsConnectionCheck()) {
                setConnectedStatus(false);
                rtcInfo.publish();
                setPlayBtnStatus(false);
                return true;
              }
              return false;
            });
          }
        } else if (roomOwner === false) {
          // for listener, audio playing
          if (lastLocation !== null) {
            if (rtcInfo.userType === UserType.LISTENER) {
              rtcInfo.setDisplayWrapRef(displayWrapRef);
              rtcInfo.initVideoTag();
              initInterval(() => {
                if (rtcInfo.getPeerConnectionCheck()) {
                  rtcInfo.playMediaTag();
                  setConnectedStatus(false);
                  return true;
                }
                return false;
              });
            }
          } else {
            initInterval(() => {
              if (rtcInfo.getPeerConnectionCheck()) {
                rtcInfo.setDisplayWrapRef(displayWrapRef);
                setConnectedStatus(false);
                setPlayBtnStatus(true);
                return true;
              }
              return false;
            });
          }
        }

      } else {
        if (roomOwner) {
          setPlayBtnStatus(true);
          setConnectedStatus(false);
        }
      }

    }
    return () => {
      // During signaling, leave the room.
      if (
          rtcInfo !== null &&
          rtcInfo.getPeerConnectionCheck() === false &&
          roomChanged === true
      ) {
        rtcInfo.socketDisconnect();
        globalAction.dispatchRtcInfo &&
        globalAction.dispatchRtcInfo({ type: "empty" });
      }
    };
  }, [rtcInfo]);

  useEffect(() => {
    if (rtcInfo !== null && roomOwner === true) {
      rtcInfo.effectChange(broadcastState.videoEffect);
    }
  }, [rtcInfo, roomOwner, broadcastState.videoEffect]);

  // About scroll

  // Chat animation Logic

  useEffect(() => {
    if (ttsAnimationQueue.length > 0 && !audioPlayState && !animPlayState) {
      const lottieDisplayElem = lottieDisplayRef.current;
      let {
        url,
        width,
        height,
        duration,
        location,
        isCombo,
        count,
        userNickname,
        userImage,
        webpUrl,
        soundFileUrl,
        itemNo,
        memNo,
        ttsItemInfo,
        isTTSItem,
      } = ttsAnimationQueue[0];

      animationWrapElem = document.createElement("div");
      animationWrapElem.className = "animation-wrapper";
      lottieDisplayElem.appendChild(animationWrapElem);

      animationWrapElem.style.width = `${width}px`;
      animationWrapElem.style.height = `${height}px`;

      if (location === "bottomRight") {
        animationWrapElem.classList.add("bottomRight");
        animationWrapElem.style.width = "40%";
        animationWrapElem.style.height = "100%";
      } else if (location === "topLeft") {
        animationWrapElem.classList.add("topLeft");
        animationWrapElem.style.width = "100%";
        animationWrapElem.style.height = "100%";
      } else if (location === "topRight") {
        animationWrapElem.classList.add("topRight");

        animationWrapElem.innerHTML = `
              <div class="enter">
                <img src="${ttsAnimationQueue[0].backgroundImg}" class="background-img" />
                <div class="enter_box">
                  <img src=${userImage} />
                  <div>
                    <p>${userNickname}</p>
                    <p>입장하셨습니다.</p>
                  </div>
                </div>
              </div>
            `;
      }

      if (duration < ttsItemInfo.duration) {
        duration = ttsItemInfo.duration;
      }

      const getTTSActionController = () => {
        broadcastAction.setTtsActionInfo!(ttsItemInfo);
        broadcastAction.setIsTTSPlaying!(true);
        setAnimPlayState(true);
        setAudioPlayState(true);
      };

      const playSoundItem = () => {
        getTTSActionController();
        playAnimation(ttsAnimationQueue[0]);
        endAnimation(duration);
      };

      playSoundItem();
    }
  }, [ttsAnimationQueue]);

  useEffect(() => {
    let comboIdx = 0;

    if (chatAnimation !== null && chatAnimation.status === true) {
      if (lottieDisplayRef !== null) {
        if (animationCount === ANIMATION_MAX_COUNT) {
          animationQueue.push({
            ...chatAnimation,
          });
        } else {
          animationCount += 1;
          const lottieDisplayElem = lottieDisplayRef.current;
          let {
            url,
            width,
            height,
            duration,
            location,
            isCombo,
            count,
            userNickname,
            userImage,
            webpUrl,
            soundFileUrl,
            itemNo,
            memNo,
            ttsItemInfo,
            isTTSItem,
          } = chatAnimation;

          const animationWrapElem = document.createElement("div");
          animationWrapElem.className = "animation-wrapper";
          lottieDisplayElem.appendChild(animationWrapElem);

          animationWrapElem.style.width = `${width}px`;
          animationWrapElem.style.height = `${height}px`;

          if (location === "bottomRight") {
            animationWrapElem.classList.add("bottomRight");
            animationWrapElem.style.width = "40%";
            animationWrapElem.style.height = "100%";
            isCombo = count ? count > 1 : false;
          } else if (location === "topLeft") {
            animationWrapElem.classList.add("topLeft");
            animationWrapElem.style.width = "100%";
            animationWrapElem.style.height = "100%";
            isCombo = count ? count > 1 : false;
          } else if (location === "topRight") {
            animationWrapElem.classList.add("topRight");

            animationWrapElem.innerHTML = `
              <div class="enter">
                <img src="${chatAnimation.backgroundImg}" class="background-img" />
                <div class="enter_box">
                  <img src=${userImage} />
                  <div>
                    <p>${userNickname}</p>
                    <p>입장하셨습니다.</p>
                  </div>
                </div>
              </div>
            `;
          }
          let lottieAnimation;

          if (isTTSItem && ttsItemInfo.fileUrl) {
            const animQueue = Object.assign([], ttsAnimationQueue);
            animQueue.push(chatAnimation);
            setTTSAnimationQueue(animQueue);
          } else if (soundFileUrl && soundFileUrl !== "") {
            soundAnimationQueue.push(chatAnimation);
            if (soundAnimationQueue.length === 1) {
              audio.volume = 1;
              audio.src = soundFileUrl;
              audio.play();
              audio.loop = true;
              broadcastAction.setIsTTSPlaying!(true);

              if (webpUrl) {
                const webpImg = document.createElement("img");
                webpImg.setAttribute("src", webpUrl);
                webpImg.setAttribute(
                    "style",
                    "position: absolute; object-fit: contain; width: inherit; height: inherit; z"
                );

                animationWrapElem.appendChild(webpImg);
              } else {
                lottieAnimation = LottiePlayer.loadAnimation({
                  container: animationWrapElem,
                  renderer: "svg",
                  loop: isCombo ? true : false,
                  autoplay: true,
                  path: url,
                });
              }

              audioTimeout(
                  soundAnimationQueue[0].duration,
                  lottieAnimation,
                  lottieDisplayElem,
                  animationWrapElem,
                  broadcastAction
              );
            } else {
              const AudioInterval = setInterval(() => {
                if (audio.paused) {
                  clearInterval(AudioInterval);
                  audio.volume = 1;
                  audio.src = soundFileUrl;
                  audio.play();
                  audio.loop = true;

                  if (webpUrl) {
                    const webpImg = document.createElement("img");
                    webpImg.setAttribute("src", webpUrl);
                    webpImg.setAttribute(
                        "style",
                        "position: absolute; object-fit: contain; width: inherit; height: inherit;"
                    );

                    animationWrapElem.appendChild(webpImg);
                  } else {
                    lottieAnimation = LottiePlayer.loadAnimation({
                      container: animationWrapElem,
                      renderer: "svg",
                      loop: isCombo ? true : false,
                      autoplay: true,
                      path: url,
                    });
                  }

                  audioTimeout(
                      soundAnimationQueue[0].duration,
                      lottieAnimation,
                      lottieDisplayElem,
                      animationWrapElem,
                      broadcastAction
                  );
                }
              }, 100);
            }
          } else {
            if (webpUrl) {
              const webpImg = document.createElement("img");
              webpImg.setAttribute("src", webpUrl);
              // webpImg.setAttribute("style", "position: absolute; object-fit: contain; width: inherit; height: inherit;");
              if (
                  location === "midLeft" &&
                  isCombo === true &&
                  duration &&
                  count
              ) {
                webpImg.setAttribute(
                    "style",
                    "position: absolute; left: 35%; object-fit: contain; height: inherit; width: 50px;"
                );
              } else {
                webpImg.setAttribute(
                    "style",
                    "position: absolute; object-fit: contain; width: 100%; height: inherit;"
                );
              }

              animationWrapElem.appendChild(webpImg);
            } else {
              lottieAnimation = LottiePlayer.loadAnimation({
                container: animationWrapElem,
                renderer: "svg",
                loop: isCombo ? true : false,
                autoplay: true,
                path: url,
              });
            }
            setTimeout(() => {
              if (isCombo && comboPositionActive[comboIdx] === true) {
                comboPositionActive[comboIdx] = false;
              }
              if (lottieAnimation) {
                lottieAnimation.destroy();
              }
              lottieDisplayElem.removeChild(animationWrapElem);

              if (lottieDisplayElem.children.length === 0) {
                broadcastAction.dispatchChatAnimation &&
                broadcastAction.dispatchChatAnimation({ type: "end" });
              }

              animationCount -= 1;
              if (animationQueue.length > 0) {
                const targetData = animationQueue.shift();
                if (broadcastAction.dispatchChatAnimation) {
                  broadcastAction.dispatchChatAnimation({
                    type: "start",
                    data: targetData,
                  });
                }
              }
            }, duration);
          }
        }
      }
    }
  }, [chatAnimation]);

  const createComboElem = ({ url, userImage, userNickname, _idx }) => {
    const animationWrapElem = document.createElement("div");
    animationWrapElem.className = "animation-wrapper";

    animationWrapElem.classList.add("midLeft");
    animationWrapElem.style.width = "100%";
    animationWrapElem.style.height = "44px";

    animationWrapElem.innerHTML = `
      <div class="combo_box combo_box__${_idx}">
        <div class="user_info">
          <div class="thumb" style="background-image: url(${userImage})"></div>
          <div class="nick">${userNickname}</div>
        </div>
      </div>
    `;
    const comboTextWrap = createElement({
      type: "div",
      className: "text-wrap",
      children: [{ type: "div", className: "x-mark" }],
    });
    const comboCountingText = createElement({
      type: "div",
      className: "combo_counting text-animation",
      text: "1",
    });
    comboTextWrap.appendChild(comboCountingText);
    animationWrapElem.children[0].appendChild(comboTextWrap);
    const webpImg = document.createElement("img");
    webpImg.setAttribute("src", url);
    webpImg.setAttribute(
        "style",
        "position: absolute; left: 163px; object-fit: contain; height: inherit; width: 50px;"
    );

    animationWrapElem.appendChild(webpImg);

    return {
      animationWrapElem,
      comboCountingText,
    };
  };

  const findFalsyComboxIdx = () => {
    if (
        !comboActiveQueue[0] ||
        (comboActiveQueue[0] instanceof Object &&
            comboActiveQueue[0].status === false)
    ) {
      return 0;
    } else if (
        !comboActiveQueue[1] ||
        (comboActiveQueue[1] instanceof Object &&
            comboActiveQueue[1].status === false)
    ) {
      return 1;
    } else if (
        !comboActiveQueue[2] ||
        (comboActiveQueue[2] instanceof Object &&
            comboActiveQueue[2].status === false)
    ) {
      return 2;
    } else {
      return -1;
    }
  };

  useEffect(() => {
    if (animPlayState) {
    }
  }, [animPlayState]);

  useEffect(() => {
    if (broadcastState.ttsActionInfo.showAlarm) {
      const closeTTSMsg = setTimeout(() => {
        broadcastAction.setTtsActionInfo!({
          ...broadcastState.ttsActionInfo,
          showAlarm: false,
        });
      }, ttsAlarmDuration);

      return () => {
        clearTimeout(closeTTSMsg);
      };
    }
  }, [broadcastState.ttsActionInfo.showAlarm]);

  useEffect(() => {
    if (comboAnimation !== null && comboAnimation.status === true) {
      const itemNo = comboAnimation.itemNo!,
          memNo = comboAnimation.memNo!,
          repeatCnt = comboAnimation.repeatCnt!,
          duration = comboAnimation.duration!,
          userImage = comboAnimation.userImage!,
          userNickname = comboAnimation.userNickname!,
          url = comboAnimation.url!;
      if (lottieDisplayRef !== null) {
        const lottieDisplayElem = lottieDisplayRef.current;

        const _idx = comboActiveQueue.findIndex((v) => {
          return v.itemNo === itemNo && v.memNo === memNo;
        });

        if (
            comboActiveQueue[_idx] instanceof Object &&
            comboActiveQueue[_idx].status === true
        ) {
          comboActiveQueue[_idx] = {
            ...comboActiveQueue[_idx],
            repeatCnt: comboActiveQueue[_idx].repeatCnt + repeatCnt,
            callback: function() {
              this.playing = true;
              this.comboCountingText.textContent = String(this.prevCnt);
              if (comboTimerGroup[`comboTimer_${_idx}`])
                clearTimeout(comboTimerGroup[`comboTimer_${_idx}`]);
              if (comboTimerGroup[`comboInterval_${_idx}`])
                clearInterval(comboTimerGroup[`comboInterval_${_idx}`]);

              comboTimerGroup[`comboInterval_${_idx}`] = setInterval(() => {
                if (this.prevCnt < this.repeatCnt) {
                  this.comboCountingText.textContent = String(this.prevCnt + 1);
                }

                if (this.prevCnt === this.repeatCnt) {
                  if (comboTimerGroup[`comboInterval_${this.idx}`])
                    clearInterval(comboTimerGroup[`comboInterval_${this.idx}`]);
                  this.comboCountingText.textContent = String(this.prevCnt);
                  this.playing = false;
                  comboTimerGroup[`comboTimer_${this.idx}`] = setTimeout(() => {
                    if (this.elem && lottieDisplayElem) {
                      lottieDisplayElem.removeChild(this.elem);
                      this.elem = null;
                    }
                    this.status = false;
                    if (comboWaitingQueue.length > 0) {
                      const {
                        animationWrapElem: cloneAni,
                        comboCountingText: cloneText,
                      } = createComboElem({
                        url: comboWaitingQueue[0].url,
                        userImage: comboWaitingQueue[0].userImage,
                        userNickname: comboWaitingQueue[0].userNickname,
                        _idx: this.idx,
                      });

                      lottieDisplayElem.appendChild(cloneAni);

                      comboActiveQueue[this.idx] = {
                        ...comboWaitingQueue[0],
                        idx: this.idx,
                        comboCountingText: cloneText,
                        elem: cloneAni,
                        status: true,
                        callback: this.callback,
                      };

                      comboWaitingQueue.shift();

                      comboActiveQueue[this.idx].callback();
                    } else {
                      if (
                          comboActiveQueue.every((v) => {
                            return !v.status;
                          })
                      ) {
                        broadcastAction.dispatchComboAnimation!({
                          type: "end",
                        });
                      }
                    }
                  }, this.duration);
                }
                this.prevCnt++;
              }, 400);
            },
          };
          if (comboTimerGroup[`comboTimer_${_idx}`])
            clearTimeout(comboTimerGroup[`comboTimer_${_idx}`]);
          comboActiveQueue[_idx].callback();
        } else {
          const __idx = findFalsyComboxIdx();
          if (__idx >= 0) {
            const { animationWrapElem, comboCountingText } = createComboElem({
              url,
              userImage,
              userNickname,
              _idx: __idx,
            });

            lottieDisplayElem.appendChild(animationWrapElem);

            comboActiveQueue[__idx] = {
              status: true,
              playing: false,
              idx: __idx,
              itemNo,
              memNo,
              prevCnt: 1,
              repeatCnt,
              duration,
              comboCountingText,
              elem: animationWrapElem,
              callback: function() {
                this.playing = true;
                this.comboCountingText.textContent = String(this.prevCnt);
                if (comboTimerGroup[`comboTimer_${__idx}`])
                  clearTimeout(comboTimerGroup[`comboTimer_${__idx}`]);
                if (comboTimerGroup[`comboInterval_${__idx}`])
                  clearInterval(comboTimerGroup[`comboInterval_${__idx}`]);

                comboTimerGroup[`comboInterval_${__idx}`] = setInterval(() => {
                  if (this.prevCnt < this.repeatCnt) {
                    this.comboCountingText.textContent = String(
                        this.prevCnt + 1
                    );
                  }
                  if (this.prevCnt === this.repeatCnt) {
                    if (comboTimerGroup[`comboInterval_${this.idx}`])
                      clearInterval(
                          comboTimerGroup[`comboInterval_${this.idx}`]
                      );
                    this.comboCountingText.textContent = String(this.prevCnt);
                    this.playing = false;
                    comboTimerGroup[`comboTimer_${this.idx}`] = setTimeout(
                        () => {
                          if (this.elem && lottieDisplayElem) {
                            lottieDisplayElem.removeChild(this.elem);
                            this.elem = null;
                          }
                          this.status = false;
                          if (comboWaitingQueue.length > 0) {
                            const {
                              animationWrapElem: cloneAni,
                              comboCountingText: cloneText,
                            } = createComboElem({
                              url: comboWaitingQueue[0].url,
                              userImage: comboWaitingQueue[0].userImage,
                              userNickname: comboWaitingQueue[0].userNickname,
                              _idx: this.idx,
                            });

                            lottieDisplayElem.appendChild(cloneAni);

                            comboActiveQueue[this.idx] = {
                              ...comboWaitingQueue[0],
                              idx: this.idx,
                              comboCountingText: cloneText,
                              elem: cloneAni,
                              status: true,
                              callback: this.callback,
                            };

                            comboWaitingQueue.shift();

                            comboActiveQueue[this.idx].callback();
                          } else {
                            if (
                                comboActiveQueue.every((v) => {
                                  return !v.status;
                                })
                            ) {
                              broadcastAction.dispatchComboAnimation!({
                                type: "end",
                              });
                            }
                          }
                        },
                        this.duration
                    );
                  }
                  this.prevCnt++;
                }, 400);
              },
            };

            comboActiveQueue[__idx].callback();
          } else {
            const lating_idx = comboWaitingQueue.findIndex((v) => {
              return v.itemNo === itemNo && v.memNo === memNo;
            });

            if (comboWaitingQueue[lating_idx]) {
              comboWaitingQueue[lating_idx] = {
                ...comboWaitingQueue[lating_idx],
                repeatCnt: comboWaitingQueue[lating_idx].repeatCnt + repeatCnt,
              };
            } else {
              comboWaitingQueue.push({
                status: false,
                playing: false,
                idx: 0,
                itemNo,
                memNo,
                prevCnt: 1,
                repeatCnt,
                duration,
                url,
                userImage,
                userNickname,
                callback: () => {},
              });
            }
          }
        }
      }
    }
  }, [comboAnimation]);

  useLayoutEffect(() => {
    const leftSide = document.getElementById("display");
    if (roomInfo.mediaType === MediaType.VIDEO && leftSide) {
      if (displayWrapRef.current !== null) {
        leftSide.style.maxWidth = displayWrapRef.current.style.maxWidth =
            displayWrapRef.current.offsetHeight * 0.75 + "px";
      }
    }
  }, [displayWrapRef.current?.offsetHeight]);

  useLayoutEffect(() => {
    const canvasTag = document.getElementById("videoViewer");

    if (canvasTag && displayWrapRef.current !== null) {
      canvasTag.style.width = displayWrapRef.current.offsetWidth + "px";
    }
  }, [displayWrapRef.current?.offsetWidth]);

  return (
      <div
          className={`left-side ${roomInfo.mediaType === MediaType.VIDEO &&
          "video"} ${broadcastState.isWide && "wide"}`}
          id="display"
      >
        <div id="local-player" className="player"/>
        <div
            className="chat-display"
            ref={displayWrapRef}
            style={
              roomInfo !== null
                  ? { backgroundImage: `url(${roomInfo.bgImg.url})` }
                  : {}
            }
        >

          {broadcastState.ttsActionInfo.showAlarm &&
              <div className="ttsLayer">
                <div className="user">
                  <img src="https://image.dalbitlive.com/broadcast/ico_speaker-layer.png" />
                  {broadcastState.ttsActionInfo.nickNm}
                </div>
                <span>{broadcastState.ttsActionInfo.ttsText}</span>
              </div>
          }

          {/*        {roomInfo !== null &&
        roomInfo.mediaType === MediaType.VIDEO &&
        roomOwner === true && (
          <canvas
            id="deepar-canvas"
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          ></canvas>
        )}*/}

          {chatFreeze === true && (
              <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: LottieFreeze,
                  }}
                  style={{
                    position: "absolute",
                    zIndex: 2,
                  }}
                  // isClickToPauseDisabled={true}
                  width={"100%"}
                  height={"100%"}
              />
          )}

          <ChatHeaderWrap
              roomOwner={roomOwner}
              roomNo={roomNo}
              roomInfo={roomInfo}
              guestConnectStatus={guestConnectStatus}
              displayWrapRef={displayWrapRef}
          />
          {broadcastState.roomInfo?.mediaType === MediaType.AUDIO && (
              <ChatListWrap
                  roomInfo={roomInfo}
                  forceChatScrollDown={forceChatScrollDown}
                  setForceChatScrollDown={setForceChatScrollDown}
              />
          )}

          {/* {((chatAnimation !== null && chatAnimation.status === true) ||
          (comboAnimation !== null && comboAnimation.status === true)) && ( */}
          <LottieDisplayStyled ref={lottieDisplayRef} id="chat-animation" />
          {/* )} */}

          <NoticeDisplayStyled id="broadcast-notice-display"></NoticeDisplayStyled>

          {/* 방송 툴팁 Component */}
          {tooltipStatus.status === true && <TooltipUI />}

          {rtcInfo !== null &&
              rtcInfo.attendClicked === false &&
              !roomOwner &&
              rtcInfo.roomInfo?.isAttendCheck === false && (
                  <StampIconWrapStyled
                      className="stamp_icon_wrap"
                      onClick={() => {
                        rtcInfo.attendClicked = true;
                        history.push("/event/attend_event");
                      }}
                  >
                    {/* <img src="https://image.dalbitlive.com/main/stamp.webp" width={42} height={42} alt="출석도장" /> */}
                    <Lottie
                        options={{
                          loop: true,
                          autoplay: true,
                          animationData: StampIcon,
                        }}
                        isClickToPauseDisabled={true}
                        width={42}
                        height={42}
                    />
                  </StampIconWrapStyled>
              )}
          <RandomMsgWrap
              roomInfo={roomInfo}
              roomOwner={roomOwner}
              roomNo={roomNo}
          />
        </div>

        {roomInfo.mediaType === MediaType.AUDIO && (
            <ChatInputWrap
                roomNo={roomNo}
                roomInfo={roomInfo}
                roomOwner={roomOwner}
                setForceChatScrollDown={setForceChatScrollDown}
            />
        )}

        {playBtnStatus === true && (
            <PlayBtnDisplayStyled
                onClick={() => {
                  if (roomOwner) {
                    if (rtcInfo !== null) {
                      if (rtcInfo.getPeerConnectionCheck()) {
                        setPlayBtnStatus(false);
                        rtcInfo.publish();
                      }
                    } else {
                      broadcastPublishAsHost();
                    }
                  } else {
                    if (rtcInfo !== null && rtcInfo.audioTag) {
                      if (rtcInfo.getPeerConnectionCheck()) {
                        setPlayBtnStatus(false);
                        rtcInfo.playMediaTag();
                      }
                    } else {
                      broadcastPlayAsListener();
                    }
                  }
                }}
            >
              <img src={playBtn} />
            </PlayBtnDisplayStyled>
        )}

        {/*      {roomInfo.mediaType === MediaType.VIDEO && (
        <ConnectedStatusStyled>
          <div className="title">잠시만 기다려주세요.</div>
        </ConnectedStatusStyled>
      )}*/}
      </div>
  );
}

const StampIconWrapStyled = styled.div`
  position: absolute;
  right: 13px;
  bottom: 16px;
  cursor: pointer;
  z-index: 3;
`;

const ConnectedStatusStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;

  .title {
    margin-top: 30px;
    color: #fff;
    font-size: 22px;
    border-radius: 23px;
    background-color: #000;
    width: 340px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 46px;
  }

  .sub-title {
    margin-top: 16px;
    color: #fff;
    white-space: pre;
    text-align: center;
    line-height: 1.5;
  }
`;

const PlayBtnDisplayStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  z-index: 3;

  :hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  img {
    display: block;
  }
`;

const NoticeDisplayStyled = styled.div`
  position: absolute;
  width: calc(100% - 26px);
  top: 100px;
  left: 13px;
  & > div {
    display: block;
    position: absolute;
    width: 100%;
    height: 36px;
    padding: 6px 12px;
    align-items: center;
    background-color: rgb(236, 69, 95);
    border-radius: 10px;
    box-sizing: border-box;
    color: #fff;
    text-align: center;
    font-size: 14px;
    line-height: 24px;

    .close-img {
      position: absolute;
      top: 9px;
      right: 18px;
      cursor: pointer;
    }
  }
  z-index: 3;
`;

const LottieDisplayStyled = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 185px);
  left: 0;
  bottom: 0;
  z-index: 3;
  pointer-events: none;

  .animation-wrapper {
    position: absolute;

    .combo_box {
      display: none;
    }

    &.bottomRight {
      right: 0;
      bottom: 0;

      img {
        width: 100%;
      }
    }

    &.topLeft {
      top: 0;
      left: 0;
    }

    &.topRight {
      top: 0;
      right: 0;
      .enter {
        opacity: 0;
        animation: ENTER_ANI 6s;
        .background-img {
          position: absolute;
          top: 78px;
          right: 0px;
          width: 146px;
          height: 46px;
        }
        .enter_box {
          display: flex;
          position: absolute;
          align-items: center;
          top: 78px;
          right: 0px;
          width: 144px;
          height: 44px;
          /* border-radius:  */
          border-radius: 24px 0 0 24px;
          img {
            width: 40px;
            height: 40px;
            margin-right: 6px;
            border-radius: 50%;
          }
          & > div {
            width: calc(144px - 46px);
            p {
              font-size: 14px;
              font-weight: 500;
              color: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              word-wrap: normal;
            }

            p:last-child {
              font-size: 12px;
              color: #febd56;
              font-weight: 300;
            }
          }
        }
      }

      @keyframes ENTER_ANI {
        0% {
          opacity: 0;
        }

        66% {
          opacity: 1;
        }

        100% {
          opacity: 1;
        }
      }
    }

    &.midLeft {
      left: 0;

      .combo_box__0 {
        background-image: url("https://image.dalbitlive.com/broadcast/itembar_red.webp");
      }

      .combo_box__1 {
        background-image: url("https://image.dalbitlive.com/broadcast/itembar_purple.webp");
        top: 56px;

        & + img {
          top: 56px;
        }
      }

      .combo_box__2 {
        background-image: url("https://image.dalbitlive.com/broadcast/itembar_green.webp");
        top: 112px;

        & + img {
          top: 112px;
        }
      }

      .combo_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        left: 12px;
        width: 310px;
        height: 44px;
        padding: 3px;
        border-radius: 50px;
        background-size: cover;
        color: #fff;
        box-sizing: border-box;

        .user_info {
          display: flex;
          align-items: center;

          .thumb {
            width: 38px;
            height: 38px;
            margin-right: 9px;
            background-size: cover;
            border-radius: 50%;
          }

          .nick {
            flex: 1;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            word-wrap: normal;
            font-size: 12px;
            max-width: 100px;
          }
        }

        .text-wrap {
          display: flex;
          flex-direction: row;
          align-items: center;

          .x-mark {
            content: "";
            display: block;
            left: -50px;
            width: 7px;
            height: 7px;
            background: url("https://image.dalbitlive.com/svg/itemmulitiply.svg")
              no-repeat;
            background-size: cover;
          }

          .combo_counting {
            position: relative;
            width: 80px;
            text-align: center;
            font-weight: 500;
            font-size: 44px;
            letter-spacing: -1px;

            &.text-animation {
              animation-name: comboCount;
              animation-duration: 0.4s;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }
          }
        }
      }
    }

    .content-wrap {
      margin: 0 auto;
    }
  }
`;
