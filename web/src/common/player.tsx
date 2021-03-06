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
import {useDispatch, useSelector} from "react-redux";
import {
  setBroadcastCtxChatFreeze,
  setBroadcastCtxExtendTimeOnce, setBroadcastCtxLikeClicked,
  setBroadcastCtxRoomInfoReset
} from "../redux/actions/broadcastCtx";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxClipInfoAdd,
  setGlobalCtxClipPlayerInit,
  setGlobalCtxExitMarbleInfo,
  setGlobalCtxGuestInfoEmpty,
  setGlobalCtxIsShowPlayer,
  setGlobalCtxRtcInfoEmpty,
  setGlobalCtxRtcInfoInit
} from "../redux/actions/globalCtx";

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
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
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

      dispatch(setGlobalCtxRtcInfoInit(rtcInfo));
      rtcInfo.setRoomInfo(roomInfo);
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
      setPlayBtnStatus(false);
    }
  }, [rtcInfo, roomInfo]);

  async function fetchSelfAuth() {
    const { result } = await selfAuthCheck();
    if (result === "success") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "20??? ????????? ????????? ??? ?????? ???????????????.",
        callback: () => history.push("/"),
        cancelCallback: () => history.push("/"),
      }));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content:
          "20??? ????????? ????????? ??? ?????? ???????????????. ???????????? ??? ??????????????????.",
        callback: () => history.push("/mysetting"),
        cancelCallback: () => history.push("/"),
      }));
    }
  }

  async function broadcastJoinAction() {
    if (roomNo) {
      const { result, data, code, message } = await broadcastJoin({
        roomNo,
        shadow: globalState.shadowAdmin,
      });
      if (result === "success") {
        // ??? ?????? ??????
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
        dispatch(setBroadcastCtxRoomInfoReset(roomInfo));
        dispatch(setBroadcastCtxChatFreeze(isFreeze));
        dispatch(setBroadcastCtxExtendTimeOnce(isExtend));
        dispatch(setBroadcastCtxLikeClicked(isLike));
        chatInfo && chatInfo.setChatFreeze(isFreeze);

        sessionStorage.setItem("room_no", roomNo);
      } else if (result === "fail") {
        dispatch(setGlobalCtxIsShowPlayer(false));
        if (code === "-6") {
          // 20??? ??????
          fetchSelfAuth();
        } else if (code === "-8") {
          // Host Join case
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            title: "??????",
            content:
              "?????? ????????? ?????? ???????????? DJ??? ?????? ???????????? ???????????? ????????? ??? ????????????.",
            callback: () => history.push("/"),
            cancelCallback: () => history.push("/"),
          }));
        } else {
          if (chatInfo && chatInfo !== null) {
            chatInfo.privateChannelDisconnect();
            if (rtcInfo !== null) rtcInfo!.stop();
            disconnectGuest();
            dispatch(setGlobalCtxRtcInfoEmpty());
          }
          rtcSessionClear();
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            title: "??????",
            content: `${message}`,
            callback: () => history.push("/"),
            cancelCallback: () => history.push("/"),
          }));
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
        // ??? ?????? ??????

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

        dispatch(setBroadcastCtxRoomInfoReset(newRoomInfo));
        dispatch(setBroadcastCtxChatFreeze(isFreeze));
        dispatch(setBroadcastCtxExtendTimeOnce(isExtend));
        dispatch(setBroadcastCtxLikeClicked(isLike));
        chatInfo && chatInfo.setChatFreeze(isFreeze);

        dispatch(setGlobalCtxIsShowPlayer(true));
      } else {
        if (code + "" === "-3") {
          //????????? ?????? ?????? ????????? ??????
          broadcastJoinAction();
        } else {
          if (chatInfo && chatInfo !== null) {
            chatInfo.privateChannelDisconnect();
            if (rtcInfo !== null) rtcInfo!.stop();
            disconnectGuest();
            dispatch(setGlobalCtxRtcInfoEmpty());
          }
          rtcSessionClear();
          dispatch(setGlobalCtxIsShowPlayer(false));
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
          dispatch(setGlobalCtxGuestInfoEmpty());
        });
      }
    }
  };

  useEffect(() => {
    if (roomNo && roomInfo !== null && chatInfo !== null) {
      // chat init logic
      chatInfo.setRoomNo(roomNo);
      chatInfo.setMsgListWrapRef(null);
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
              dispatch(setGlobalCtxIsShowPlayer(true));
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
            dispatch(setGlobalCtxIsShowPlayer(false));
            if (rtcInfo !== null) {
              chatInfo.privateChannelDisconnect();
              if (rtcInfo !== null) {
                rtcInfo.socketDisconnect();
                rtcInfo.stop();
              }
              disconnectGuest();
              dispatch(setGlobalCtxRtcInfoEmpty());
            }
          }
        };
        roomExit();
      }
    }
  }, [roomInfo, baseData.isLogin]);

  useEffect(() => {
    if (mode === "broadcast") {
      if (chatInfo !== null && rtcInfo !== undefined && rtcInfo !== null) {
        setBgImage(rtcInfo.roomInfo!.bjProfImg["thumb120x120"]);
        setNickName(rtcInfo.roomInfo!.bjNickNm);
        setTitle(rtcInfo.roomInfo!.title);
        dispatch(setGlobalCtxIsShowPlayer(true));
        setPlayBtnStatus(false);
        setRoomInfo(rtcInfo.roomInfo);
        setRoomOwner(chatInfo.roomOwner);
      } else {
        if (roomNo !== "") {
          broadcastInit();
        } else {
          dispatch(setGlobalCtxIsShowPlayer(false));
        }
      }
    } else if (clipInfo !== undefined && clipInfo !== null) {
      setBgImage(clipInfo.bgImg["thumb120x120"]);
      setNickName(clipInfo.nickName);
      setTitle(clipInfo.title);
      setIsClip(true);
    } else {
      dispatch(setGlobalCtxIsShowPlayer(false));
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
    if (globalState.clipPlayListTab.length > 0) {
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
      newClipPlayer?.findPlayingClip({clipNo:data.clipNo, clipPlayList:globalState.clipPlayList});
      dispatch(setGlobalCtxClipPlayerInit(newClipPlayer));
      dispatch(setGlobalCtxClipInfoAdd({ ...data, ...{ isPaused: true } }));
      newClipPlayer?.start();
      sessionStorage.setItem("clip", JSON.stringify(data));
    } else {
      newClipPlayer?.findPlayingClip({clipNo:setClipNo, clipPlayList:globalState.clipPlayList});
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
      localStorage.removeItem("clipPlayListInfo");
    } else {
      if ((rtcInfo !== null && rtcInfo !== undefined) || roomNo !== null) {
        const roomNo1 = rtcInfo ? rtcInfo.getRoomNo() : roomNo;
        if (roomNo1) {
          const { data, result } = await broadcastExit({ roomNo: roomNo1 });
          if (result === "success") {
            dispatch(setGlobalCtxExitMarbleInfo({
              ...exitMarbleInfo,
              rMarbleCnt: data.getMarbleInfo.rMarbleCnt,
              yMarbleCnt: data.getMarbleInfo.yMarbleCnt,
              bMarbleCnt: data.getMarbleInfo.bMarbleCnt,
              vMarbleCnt: data.getMarbleInfo.vMarbleCnt,
              isBjYn: data.getMarbleInfo.isBjYn,
              marbleCnt: data.getMarbleInfo.marbleCnt,
              pocketCnt: data.getMarbleInfo.pocketCnt,
            }));
            if (
              globalState.exitMarbleInfo.marbleCnt > 0 ||
              globalState.exitMarbleInfo.pocketCnt > 0
            ) {
              dispatch(setGlobalCtxExitMarbleInfo({
                ...exitMarbleInfo,
                showState: true,
              }));
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
                dispatch(setGlobalCtxGuestInfoEmpty());
              }
              dispatch(setGlobalCtxRtcInfoEmpty());

              dispatch(setGlobalCtxIsShowPlayer(false));
            }
          }
        }
      }
    }
  };
  useEffect(() => {
    if (rtcInfo !== null) {
      // for dj host, audio publishing - refresh case
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
        <div id="player" style={{ display: isShowPlayer || isClip ? "" : "none" }}>
          <div className="inner-player" onClick={playerBarClickEvent}>
            <div className="info-wrap">
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
        </div>
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
                  <p>????????? ???????????? ???????????????.</p>
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
