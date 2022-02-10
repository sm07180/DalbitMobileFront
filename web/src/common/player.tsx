// others
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { IMG_SERVER } from "constant/define";

// others
import { ChatSocketHandler } from "common/realtime/chat_socket";
import {
  HostRtc,
  ListenerRtc, rtcSessionClear,
  RtcSocketHandler,
  UserType,
} from "common/realtime/rtc_socket";

// static
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";

import {
  broadcastExit,
  broadcastInfoNew,
  broadcastJoin,
  selfAuthCheck,
  postClipPlay,
  clipPlayConfirm,
} from "common/api";
import { ClipPlayerHandler } from "common/audio/clip_player";
import CloseBtn from "./images/ic_player_close_btn.svg";

import PauseIcon from "./static/ic_pause.svg";
import PlayIcon from "./static/ic_play.svg";
import { MediaType } from "pages/broadcast/constant";

const initInterval = (callback: () => boolean) => {
  const intervalTime = 100;
  const id = setInterval(() => {
    const result = callback();
    if (result === true) {
      clearInterval(id);
    }
  }, intervalTime);
};

// !Deprecated
export default function Player(props: { clipInfo?: any; clipPlayer?: any; mode?: string; }) {
  const history = useHistory();
  const historyState = history.location.state;
  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastAction } = useContext(BroadcastContext);
  const { clipInfo, clipPlayer, mode } = props;

  const {
    baseData,
    chatInfo,
    rtcInfo,
    isShowPlayer,
    guestInfo,
    exitMarbleInfo,
  } = globalState;

  const [bgImage, setBgImage] = useState("");
  const [nickName, setNickName] = useState("");
  const [title, setTitle] = useState("");
  const [isClip, setIsClip] = useState(false);

  const roomNo: string | null =
    sessionStorage.getItem("room_no") === undefined ||
    sessionStorage.getItem("room_no") === null
      ? ""
      : sessionStorage.getItem("room_no");
  const [roomOwner, setRoomOwner] = useState<boolean>(false);
  const [roomInfo, setRoomInfo] = useState<roomInfoType | null>(null);
  const [playBtnStatus, setPlayBtnStatus] = useState<boolean>(false);
  const [connectedStatus, setConnectedStatus] = useState<boolean>(
    (() => {
      if (rtcInfo !== null && rtcInfo.getPeerConnectionCheck()) {
        return false;
      }
      return true;
    })()
  );

  const displayWrapRef = useRef<HTMLDivElement>(null);

  const broadcastPlayAsListener = useCallback(() => {
    if (
      roomNo &&
      roomInfo &&
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
          isVideo: roomInfo.mediaType === MediaType.VIDEO,
        }
      );
      rtcInfo.setRoomInfo(roomInfo);

      rtcInfo.setDisplayWrapRef(displayWrapRef);

      rtcInfo.initVideoTag();

      globalAction.dispatchRtcInfo &&
        globalAction.dispatchRtcInfo({ type: "init", data: rtcInfo });
      setPlayBtnStatus(false);
    }
  }, [rtcInfo, roomInfo]);

  const broadcastPublishAsHost = useCallback(() => {
    if (
      roomNo &&
      roomInfo &&
      roomInfo.webRtcUrl &&
      roomInfo.webRtcAppName &&
      roomInfo.webRtcStreamName
    ) {
      const videoConstraints = {
        isVideo: roomInfo.mediaType === MediaType.VIDEO ? true : false,
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
      globalAction.dispatchRtcInfo &&
        globalAction.dispatchRtcInfo({ type: "init", data: rtcInfo });
      setPlayBtnStatus(false);
    }
  }, [rtcInfo, roomInfo]);

  async function fetchSelfAuth() {
    const { result } = await selfAuthCheck();
    if (result === "success") {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: "20세 이상만 입장할 수 있는 방송입니다.",
          callback: () => history.push("/"),
          cancelCallback: () => history.push("/"),
        });
    } else {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content:
            "20세 이상만 입장할 수 있는 방송입니다. 본인인증 후 이용해주세요.",
          callback: () => history.push("/mysetting"),
          cancelCallback: () => history.push("/"),
        });
    }
  }

  async function broadcastJoinAction() {
    if (roomNo) {
      const { result, data, code, message } = await broadcastJoin({
        roomNo,
        shadow: globalState.shadowAdmin,
      });
      if (result === "success") {
        // 방 정보 설정
        const roomInfo = {
          ...data,
          currentMemNo:
            globalState.baseData.isLogin === true
              ? globalState.baseData.memNo
              : "",
          broadState: data.state === 2 ? false : true,
        };

        const { auth, isFreeze, isExtend, isLike } = roomInfo;
        setRoomOwner(auth === 3 ? true : false);
        setRoomInfo(roomInfo);
        broadcastAction.dispatchRoomInfo &&
          broadcastAction.dispatchRoomInfo({
            type: "reset",
            data: roomInfo,
          });
        broadcastAction.setChatFreeze!(isFreeze);
        chatInfo && chatInfo.setChatFreeze(isFreeze);
        broadcastAction.setExtendTimeOnce!(isExtend);
        broadcastAction.setLikeClicked!(isLike);
        sessionStorage.setItem("room_no", roomNo);
      } else if (result === "fail") {
        globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(false);
        if (code === "-6") {
          // 20세 이상
          fetchSelfAuth();
        } else if (code === "-8") {
          // Host Join case
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              title: "알림",
              content:
                "해당 방송은 다른 기기에서 DJ로 방송 중이므로 청취자로 입장할 수 없습니다.",
              callback: () => history.push("/"),
              cancelCallback: () => history.push("/"),
            });
        } else {
          if (chatInfo && chatInfo !== null) {
            chatInfo.privateChannelDisconnect();
            if (rtcInfo !== null) rtcInfo!.stop();
            disconnectGuest();
            globalAction.dispatchRtcInfo!({ type: "empty" });
          }
          rtcSessionClear();
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              title: "알림",
              content: `${message}`,
              callback: () => history.push("/"),
              cancelCallback: () => history.push("/"),
            });
        }
      }
    }
  }

  async function broadcastInit() {
    if (roomNo !== null && roomNo != "") {
      const { result, data, message, code } = await broadcastInfoNew({
        roomNo,
      });
      if (result === "success") {
        // 방 정보 설정

        const newRoomInfo = {
          ...data,
          currentMemNo:
            globalState.baseData.isLogin === true
              ? globalState.baseData.memNo
              : "",
          broadState: data.state === 2 ? false : true,
        };

        const { auth, isFreeze, isExtend, isLike } = newRoomInfo;

        setRoomOwner(auth === 3 ? true : false);
        setRoomInfo(newRoomInfo);

        setBgImage(newRoomInfo.bjProfImg["thumb120x120"]);
        setNickName(newRoomInfo.bjNickNm);
        setTitle(newRoomInfo.title);

        broadcastAction.dispatchRoomInfo &&
          broadcastAction.dispatchRoomInfo({
            type: "reset",
            data: newRoomInfo,
          });
        broadcastAction.setChatFreeze!(isFreeze);
        chatInfo && chatInfo.setChatFreeze(isFreeze);
        broadcastAction.setExtendTimeOnce!(isExtend);
        broadcastAction.setLikeClicked!(isLike);
        globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(true);
      } else {
        if (code + "" === "-3") {
          //해당방 회원 아님 룸조인 처리
          broadcastJoinAction();
        } else {
          if (chatInfo && chatInfo !== null) {
            chatInfo.privateChannelDisconnect();
            if (rtcInfo !== null) rtcInfo!.stop();
            disconnectGuest();
            globalAction.dispatchRtcInfo!({ type: "empty" });
          }
          rtcSessionClear();
          globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(false);
          // globalAction.setAlertStatus &&
          //   globalAction.setAlertStatus({
          //     status: true,
          //     title: "알림",
          //     content: `${newRoomInfo.message}`,
          //   });
        }
      }
    }
  }

  const disconnectGuest = () => {
    if (guestInfo !== null) {
      const guestInfoKeyArray = Object.keys(guestInfo);

      if (guestInfoKeyArray.length > 0) {
        guestInfoKeyArray.forEach((v) => {
          guestInfo[v].stop?.();
          globalAction.dispatchGuestInfo!({
            type: "EMPTY",
          });
        });
      }
    }
  };

  useEffect(() => {
    if (roomNo && roomInfo !== null && chatInfo !== null) {
      // chat init logic
      chatInfo.setRoomNo(roomNo);
      chatInfo.setMsgListWrapRef(null);
      chatInfo.setGlobalAction(globalAction);
      chatInfo.setBroadcastAction(broadcastAction);
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
              setBgImage(roomInfo!.bjProfImg["thumb120x120"]);
              setNickName(roomInfo!.bjNickNm);
              setTitle(roomInfo!.title);
              globalAction.setIsShowPlayer &&
                globalAction.setIsShowPlayer(true);
              return true;
            }
            return false;
          });
        }
      } else {
        const roomExit = async () => {
          const { result } = await broadcastExit({ roomNo });
          if (result === "success") {
            rtcSessionClear();
            globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(false);
            if (rtcInfo !== null && globalAction.dispatchRtcInfo) {
              chatInfo.privateChannelDisconnect();
              if (rtcInfo !== null) {
                rtcInfo.socketDisconnect();
                rtcInfo.stop();
              }
              disconnectGuest();
              globalAction.dispatchRtcInfo({ type: "empty" });
            }
          }
        };
        roomExit();
      }
    }
  }, [roomInfo, baseData.isLogin]);

  useEffect(() => {
    console.log("broadcast====>",1)
    if (mode === "broadcast") {
      if (chatInfo !== null && rtcInfo !== undefined && rtcInfo !== null) {
        setBgImage(rtcInfo.roomInfo!.bjProfImg["thumb120x120"]);
        setNickName(rtcInfo.roomInfo!.bjNickNm);
        setTitle(rtcInfo.roomInfo!.title);
        globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(true);
        setPlayBtnStatus(false);
        setRoomInfo(rtcInfo.roomInfo);
        setRoomOwner(chatInfo.roomOwner);
      } else {
        if (roomNo !== "") {
          console.log("broadcast====>",3)
          broadcastInit();
        } else {
          globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(false);
        }
      }
    } else if (clipInfo !== undefined && clipInfo !== null) {
      setBgImage(clipInfo.bgImg["thumb120x120"]);
      setNickName(clipInfo.nickName);
      setTitle(clipInfo.title);
      setIsClip(true);
    } else {
      globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(false);
    }
  }, [rtcInfo]);

  useEffect(() => {
    if (
      clipInfo !== null &&
      clipInfo !== undefined &&
      clipInfo.isSaved60seconds === true &&
      clipPlayer?.save60seconds! >= 59
    ) {
      let checked = false;
      const clip60secondsConfirm = async () => {
        const { result, message } = await clipPlayConfirm({
          clipNo: clipInfo.clipNo,
          playIdx: clipInfo.playIdx,
        });
        if (result === "success") {
          clipPlayer?.initSave60seconds();
        } else {
          if (!checked) {
            checked = true;
            const { message } = await clipPlayConfirm({
              clipNo: clipInfo.clipNo,
              playIdx: clipInfo.playIdx,
            });
          }
        }
      };

      clip60secondsConfirm();
    }
  }, [clipInfo]);

  useEffect(() => {
    if (clipInfo !== undefined && clipInfo !== null) {
      setBgImage(clipInfo.bgImg["thumb120x120"]);
      setNickName(clipInfo.nickName);
      setTitle(clipInfo.title);
      setIsClip(true);
    }
  }, [globalState.clipInfo]);

  // useEffect(() => {
  //   if (globalState.clipPlayList!.length > 0) {
  //     clipPlayer?.clipAudioTag?.addEventListener("ended", audioEndHandler);
  //   }

  //   return () => {
  //     clipPlayer?.clipAudioTag?.removeEventListener("ended", audioEndHandler);
  //   };
  // }, []);

  useEffect(() => {
    if (globalState.clipPlayList!.length > 0) {
      clipPlayer?.clipAudioTag?.addEventListener("ended", audioEndHandler);
    }

    return () => {
      clipPlayer?.clipAudioTag?.removeEventListener("ended", audioEndHandler);
    };
  }, [globalState.clipPlayMode]);

  const audioEndHandler = async (clipNo) => {
    let setClipNo = "";
    if (globalState.clipPlayList?.length === 0) return null;
    if (
      globalState.clipPlayList![clipPlayer?.isPlayingIdx! + 1] === undefined
    ) {
      if (globalState.clipPlayMode === "allLoop") {
        setClipNo = globalState.clipPlayList![0].clipNo;
      } else {
        return;
      }
    } else {
      setClipNo = globalState.clipPlayList![clipPlayer?.isPlayingIdx! + 1]
        .clipNo;
    }

    if (clipNo && typeof clipNo === "string") setClipNo = clipNo;

    let newClipPlayer = clipPlayer;
    const { result, data, message } = await postClipPlay({
      clipNo: setClipNo,
    });
    if (result === "success") {
      newClipPlayer!.setGlobalAction(globalAction);

      if (
        data.file.url === newClipPlayer?.clipAudioTag?.src &&
        data.clipNo !== newClipPlayer!.clipNo
      ) {
        newClipPlayer?.init(data.file.url);
        newClipPlayer!.restart();
      } else {
        newClipPlayer?.init(data.file.url);
      }
      newClipPlayer?.clipNoUpdate(data.clipNo);
      newClipPlayer?.findPlayingClip(data.clipNo);

      globalAction.dispatchClipPlayer!({ type: "init", data: newClipPlayer });
      globalAction.dispatchClipInfo!({
        type: "add",
        data: { ...data, ...{ isPaused: true } },
      });
      newClipPlayer?.start();
      sessionStorage.setItem("clip", JSON.stringify(data));
    } else {
      newClipPlayer?.findPlayingClip(setClipNo);
      if (clipPlayer?.isPlayingIdx === globalState.clipPlayList!.length - 1) {
        if (
          globalState.clipPlayMode !== "normal" &&
          globalState.clipPlayMode !== "oneLoop"
        ) {
          audioEndHandler(globalState.clipPlayList![0].clipNo);
        }
      } else {
        audioEndHandler(
          globalState.clipPlayList![clipPlayer?.isPlayingIdx! + 1].clipNo
        );
      }
    }
  };

  const closeClickEvent = async (e: any) => {
    e.stopPropagation();
    if (isClip) {
      clipPlayer.clipExit();
      sessionStorage.removeItem("clip");
      sessionStorage.removeItem("clipPlayListInfo");
    } else {
      if ((rtcInfo !== null && rtcInfo !== undefined) || roomNo !== null) {
        const roomNo1 = rtcInfo ? rtcInfo.getRoomNo() : roomNo;
        if (roomNo1) {
          const { data, result } = await broadcastExit({ roomNo: roomNo1 });
          if (result === "success") {
            {
              globalAction.setExitMarbleInfo &&
                globalAction.setExitMarbleInfo({
                  ...exitMarbleInfo,
                  rMarbleCnt: data.getMarbleInfo.rMarbleCnt,
                  yMarbleCnt: data.getMarbleInfo.yMarbleCnt,
                  bMarbleCnt: data.getMarbleInfo.bMarbleCnt,
                  vMarbleCnt: data.getMarbleInfo.vMarbleCnt,
                  isBjYn: data.getMarbleInfo.isBjYn,
                  marbleCnt: data.getMarbleInfo.marbleCnt,
                  pocketCnt: data.getMarbleInfo.pocketCnt,
                });
            }
            if (
              globalState.exitMarbleInfo.marbleCnt > 0 ||
              globalState.exitMarbleInfo.pocketCnt > 0
            ) {
              globalAction.setExitMarbleInfo &&
                globalAction.setExitMarbleInfo({
                  ...exitMarbleInfo,
                  showState: true,
                });
            }

            rtcSessionClear();
            if (
              chatInfo &&
              chatInfo !== null &&
              chatInfo.privateChannelHandle !== null
            ) {
              chatInfo.privateChannelDisconnect();
              if (rtcInfo !== null) {
                rtcInfo.socketDisconnect();
                rtcInfo.stop();
              }
              disconnectGuest();
              if (globalState.guestInfo !== null) {
                globalState.guestInfo[
                  Object.keys(globalState.guestInfo)[0]
                ].stop?.();
                globalAction.dispatchGuestInfo!({
                  type: "EMPTY",
                });
              }
              globalAction.dispatchRtcInfo &&
                globalAction.dispatchRtcInfo({ type: "empty" });

              globalAction.setIsShowPlayer &&
                globalAction.setIsShowPlayer(false);
            }
          }
        }
      }
    }
  };
  useEffect(() => {
    if (rtcInfo !== null) {
      // for dj host, audio publishing - refresh case
      // globalAction.setIsShowPlayer && globalAction.setIsShowPlayer(false);
      rtcInfo.setDisplayWrapRef(displayWrapRef);
      rtcInfo.initVideoTag();
      if (roomOwner === true) {
        initInterval(() => {
          if (rtcInfo.getWsConnectionCheck()) {
            rtcInfo.publish();
            setPlayBtnStatus(false);
            setConnectedStatus(false);
            return true;
          }
          return false;
        });
      }
      // for listener, audio playing
      else if (roomOwner === false) {
        initInterval(() => {
          if (rtcInfo.getPeerConnectionCheck()) {
            rtcInfo.initVideoTag();

            setConnectedStatus(false);

            rtcInfo.playMediaTag();

            setPlayBtnStatus(false);
            return true;
          }
          return false;
        });
      }

      // Set rtcinfo in chat instance.
      if (chatInfo !== null) {
        rtcInfo.setMsgListWrapRef(null);
        chatInfo.setRtcInfo(rtcInfo);
      }
    } else {
      setPlayBtnStatus(true);
    }
    return () => {};
  }, [rtcInfo]);

  const playerBarClickEvent = () => {
    if (isClip) {
      if (clipInfo !== undefined && clipInfo !== null) {
        const { clipNo } = clipInfo;
        history.push(`/clip/${clipNo}`);
      }
    } else {
      if ((rtcInfo !== undefined && rtcInfo !== null) || roomNo !== null) {
        const roomNo1 = rtcInfo ? rtcInfo.getRoomNo() : roomNo;
        history.push(`/broadcast/${roomNo1}`);
      }
    }
  };

  if (clipInfo === null && (rtcInfo === null || rtcInfo!.roomInfo === null)) {
    return null;
  }

  return (
    <>
      {((mode === "broadcast" &&
        roomInfo !== null &&
        roomInfo.mediaType == MediaType.AUDIO) ||
        isClip) && (
        <PlayerStyled style={{ display: isShowPlayer || isClip ? "" : "none" }}>
          <div className="inner-player" onClick={playerBarClickEvent}>
            <div className="info-wrap">
              <div className="equalizer">
                {isClip && globalState.clipInfo?.isPaused !== false ? (
                  <></>
                ) : (
                  <ul>
                    <li>
                      <span></span>
                    </li>
                    <li>
                      <span></span>
                    </li>
                    <li>
                      <span></span>
                    </li>
                    <li>
                      <span></span>
                    </li>
                    <li>
                      <span></span>
                    </li>
                  </ul>
                )}

                <p>{isClip ? `CLIP` : `LIVE`}</p>
              </div>
              <div
                className="thumb"
                style={{ backgroundImage: `url(${bgImage})` }}
                onClick={(e) => e.stopPropagation()}
              >
                {isClip && globalState.clipInfo?.isPaused === false && (
                  <img
                    onClick={() => clipPlayer.stop()}
                    src={PauseIcon}
                    className="playToggle__stop"
                  />
                )}
                {isClip && globalState.clipInfo?.isPaused !== false && (
                  <img
                    onClick={() => clipPlayer.start()}
                    src={PlayIcon}
                    className="playToggle__play"
                  />
                )}
                {mode === "broadcast" && playBtnStatus == true && (
                  <img
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
                    src={PlayIcon}
                    className="playToggle__play"
                  />
                )}
              </div>
              <div className="room-info">
                <p className="title">{`${nickName}`}</p>
                <p>{title}</p>
              </div>
              <div className="counting">
                {/* <span>
              <img src={iconPeople2} />
              85
            </span>
            <span>
              <img src={iconPeople} />
              85
            </span>
            <span>
              <img src={iconHeart} />
              85
            </span> */}
              </div>
            </div>

            {((mode === "broadcast" && roomOwner === false) || isClip) && (
              <img
                src={CloseBtn}
                className="close-btn"
                onClick={closeClickEvent}
              />
            )}
          </div>
        </PlayerStyled>
      )}
      {mode === "broadcast" &&
        roomInfo !== null &&
        roomInfo.mediaType == MediaType.VIDEO && (
          <PlayerVideoStyled
            style={{ display: isShowPlayer ? "" : "none" }}
            className={`${playBtnStatus === false && "back"} ${roomOwner ===
              true && "unVisible"}`}
            ref={displayWrapRef}
            onClick={playerBarClickEvent}
          >
            {playBtnStatus === true && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (roomOwner) {
                    if (rtcInfo !== null) {
                      if (rtcInfo.getPeerConnectionCheck()) {
                        setPlayBtnStatus(false);
                        setConnectedStatus(false);
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
                className="playToggle__play"
              >
                <div className="playBox">
                  <img
                    src={`${IMG_SERVER}/broadcast/ico_circle_play_l.svg`}
                    alt="play"
                  />
                  <br />
                  <p>방송이 일시정지 되었습니다.</p>
                </div>
              </div>
            )}
            {roomInfo.mediaType === MediaType.VIDEO && roomOwner === true && (
              <canvas
                id="deepar-canvas"
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
              ></canvas>
            )}
            {connectedStatus === true && (
              <div className="playToggle__play auto">
                <div className="playBox">
                  <img
                    src={`${IMG_SERVER}/broadcast/ico_loading_l.svg`}
                    alt="play"
                  />
                </div>
              </div>
            )}

            {((mode === "broadcast" && roomOwner === false) || isClip) && (
              <img
                src={`${IMG_SERVER}/broadcast/ico_close_w_m.svg`}
                className="close-btn"
                onClick={closeClickEvent}
              />
            )}
          </PlayerVideoStyled>
        )}
    </>
  );
}

const PlayerStyled = styled.div`
  position: fixed;
  left: 50%;
  margin-left: -220px;
  bottom: 20px;
  width: 440px;
  height: 64px;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-radius: 44px;
  cursor: pointer;

  /* player에 들어가는 움직이는 equalizer bar */
  @keyframes equalizer-bar {
    0% {
      height: 5px;
    }
    10% {
      height: 7px;
    }
    20% {
      height: 9px;
    }
    30% {
      height: 4px;
    }
    40% {
      height: 11px;
    }
    50% {
      height: 13px;
    }
    60% {
      height: 7px;
    }
    70% {
      height: 12px;
    }
    80% {
      height: 9px;
    }
    90% {
      height: 7px;
    }
    100% {
      height: 4px;
    }
  }

  .inner-player {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0px 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .info-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      .equalizer {
        width: 36px;
        height: 36px;
        margin-right: 8px;
        color: #fdad2b;
        text-align: center;
        display: flex;
        flex-direction: column;

        ul {
          padding-top: 1px;
          height: 14px;
          width: 20px;
          margin: 0 auto;
          padding: 0 0 0 0;
          position: relative;
          li {
            width: 2px;
            float: left;
            margin: 0 2px 0 0;
            padding: 0;
            height: 14px;
            position: relative;
            list-style-type: none;
            span {
              display: block;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 14px;
              background: #fdad2b;
              transform: none;
            }
          }
          li:nth-child(1) span {
            animation: equalizer-bar 2s 1s ease-out alternate infinite;
          }
          li:nth-child(2) span {
            animation: equalizer-bar 2s 0.5s ease-out alternate infinite;
          }
          li:nth-child(3) span {
            animation: equalizer-bar 2s 1.5s ease-out alternate infinite;
          }
          li:nth-child(4) span {
            animation: equalizer-bar 2s 0.25s ease-out alternate infinite;
          }
          li:nth-child(5) span {
            animation: equalizer-bar 2s 2s ease-out alternate infinite;
          }
        }
        p {
          margin-top: auto;
          padding-top: 6px;
          font-size: 11px;
        }
      }

      .thumb {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        margin-right: 16px;
        background: #ccc;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        &::before {
          position: absolute;
          content: "";
          /* background: rgba(0, 0, 0, 0.3); */
          width: 100%;
          height: 100%;
          z-index: 4;
        }
        .playToggle__play,
        .playToggle__stop {
          position: relative;
          padding: 10px;
          z-index: 5;

          &.video {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }

      .room-info {
        width: 256px;
        font-size: 13px;
        letter-spacing: -0.35px;

        .title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 3px;
          font-size: 16px;
          font-weight: 300;
        }
        p {
          font-weight: 300;
        }
      }

      .counting {
        span {
          display: inline-block;
          margin-right: 18px;

          img {
            vertical-align: middle;
            display: inline-block;
            margin-right: 5px;
          }
        }
      }
    }

    .close-btn {
      display: block;
      cursor: pointer;
    }
  }
`;

const PlayerVideoStyled = styled.div`
  overflow: hidden;
  position: fixed;
  left: 50%;
  margin-left: 365px;
  bottom: 20px;
  transform: translate(-50%);
  width: 240px;
  height: 360px;
  border-radius: 10px;
  cursor: pointer;

  &.back {
    background-color: black;
  }

  #videoViewer {
    position: absolute;
    width: 240px !important;
    top: 50%;
    transform: translate(0, -50%);
  }

  #deepar-canvas {
    position: absolute;
    opacity: 0;
  }

  video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.unVisible {
    video {
      opacity: 0;
    }
  }

  .playToggle__play {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    text-align: center;

    .playBox {
      text-align: center;
      top: -50%;
      left: -50%;
      transform: translate(0%, 125%);

      p {
        display: inline-block;
        height: 25px;
        margin-top: 20px;
        padding: 0 6px;
        line-height: 25px;
        border-radius: 18px;
        font-size: 12px;
        color: #fff;
        background: #000;
      }
    }

    &.auto {
      .playBox {
        transform: translate(0%, 312%);
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
`;
