// React
import React, {useCallback, useContext, useEffect, useRef, useState,} from "react";
import {useHistory} from "react-router-dom";

// Api
import {
  broadcastExit,
  broadcastLike,
  broadcastShare,
  getBroadcastSetting,
  getBroadcastShortCut,
  modifyBroadcastState,
  postFreezeRoom,
} from "common/api";

// Context
import {GuestContext} from "context/guest_ctx";
import {BroadcastLayerContext} from "context/broadcast_layer_ctx";

import {
  setBroadcastCtxChatFreeze, setBroadcastCtxHeartActive,
  setBroadcastCtxLikeClicked,
  setBroadcastCtxMsgShortCut,
  setBroadcastCtxRightTabType,
  setBroadcastCtxRoomInfoMicState,
  setBroadcastCtxRoomInfoVideoState,
  setBroadcastCtxSettingObject,
  setBroadcastCtxSoundVolume
} from "../../../redux/actions/broadcastCtx";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxGuestInfoEmpty,
  setGlobalCtxRtcInfoEmpty, setGlobalCtxSetToastStatus
} from "../../../redux/actions/globalCtx";

// Module
import _ from "lodash";

// Component
import Volume from "./volume";
import SettingWrap from "./setting_wrap";

// Type
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import {MediaType, tabType} from "pages/broadcast/constant";

// Static
import MsgIcon from "../static/ic_message.svg";
import MsgFillIcon from "../static/ic_message_over.svg";
import MicIcon from "../static/ic_mic.svg";
import MicOffIcon from "../static/ic_mic_off.svg";
import HeartBigIcon from "../static/ic_heart_big.svg";
import HeartBigFillIcon from "../static/ic_heart_big_fill.svg";
import MoreIcon from "../static/ic_more.svg";
import MoreFillIcon from "../static/ic_more_fill.svg";
import BoostIcon from "../static/ic_booster.svg";
import BoostOffIcon from "../static/ic_booster_off.svg";
import SettingIcon from "../static/ic_setting.svg";
import EmoticonIcon from "../static/ic_emoticon.svg";
import EmoticonOnIcon from "../static/ic_emoticon_on.svg";
import VideoOffIcon from "../static/ic_videooff.svg";
import VideoOnIcon from "../static/ic_video.svg";
import VideoSettingIcon from "../static/ic_videosetting_w_m.svg";
import VideoSettingOffIcon from "../static/ic_videosetting_m.svg";
import VideoFlipIcon from "../static/ic_mirrormode_m.svg";
import VideoEffectIcon from "../static/ic_videoeffect_m.svg";
import MiniGameIcon from "../static/ic_roulette_g.svg";
import {moveVoteListStep} from "../../../redux/actions/vote";
import {useDispatch, useSelector} from "react-redux";

export const IconWrap = (props: {
  roomOwner: boolean | null;
  roomNo: string;
  roomInfo: roomInfoType;
  sendMessage: any;
}) => {
  const { roomNo, roomInfo, sendMessage, roomOwner } = props;
  const { useBoost } = roomInfo;

  const history = useHistory();
  const dispatch = useDispatch();

  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { rtcInfo, baseData, guestInfo, chatInfo } = globalState;

  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const { rightTabType, likeClicked, msgShortCut, chatFreeze, settingObj } = broadcastState;

  const { guestState } = useContext(GuestContext);

  const { layer, dispatchLayer, dispatchDimLayer } = useContext(BroadcastLayerContext);

  const [toggles, setToggles] = useState<{
    more: boolean;
    msg: boolean;
    volume: boolean;
    video: boolean;
  }>({
    more: false,
    msg: false,
    volume: false,
    video: false,
  });
  const [settingMore, setSettingMore] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(roomInfo.isMic);
  const [videoActive, setVideoActive] = useState<boolean>(roomInfo.isVideo);
  const [readyState, setReadyState] = useState<boolean>(false);
  const [savedMicState, setSavedMicState] = useState(roomInfo.isMic);

  const volumeBarRef = useRef<any>(null);

  const heartIconClickHandler = async (e) => {
    if (baseData.isLogin === true) {
      if (broadcastState.heartActive) {
        const { result, message } = await broadcastLike({ roomNo, memNo: roomInfo.bjMemNo});
        if (result === "fail") {
          dispatch(setGlobalCtxAlertStatus({ status: true, content: message }));
        } else if (result === "success") {
          dispatch(setBroadcastCtxLikeClicked(false));
        }
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "???????????? ???????????? 60??? ?????? ???????????????.",
        }));
      }
    } else if (baseData.isLogin == false) {
      history.push("/login");
    }
  };

  const boostIconClickHandler = useCallback(() => {
    dispatch(setBroadcastCtxRightTabType(tabType.BOOST));
  }, []);

  const msgSettingHandler = useCallback(() => {
    dispatch(setBroadcastCtxRightTabType(tabType.SHORT));
  }, []);

  const volumeBarOnChange = useCallback(
    (value: number) => {
      if (rtcInfo !== null && rtcInfo.userType === UserType.LISTENER) {
        if (rtcInfo.audioTag) {
          rtcInfo.audioTag.volume = value;
          //tts, sound ???????????? ????????? ??????????????????
          dispatch(setBroadcastCtxSoundVolume(value));
        }
      }

      if (guestInfo !== null) {
        Object.keys(guestInfo).forEach((v) => {
          if (
            guestInfo[v].audioTag &&
            guestInfo[v].userType === UserType.GUEST_LISTENER
          ) {
            guestInfo[v].audioTag.volume = value;
          }
        });
      }
    },
    [rtcInfo, guestInfo]
  );

  const sendShortCut = (idx: number) => {
    sendMessage(msgShortCut[idx].text);
  };

  const emoticonIconClickHandler = useCallback(() => {
    dispatch(setBroadcastCtxRightTabType(tabType.EMOTICON));
  }, []);

  const togglController = useCallback(
    (key?: string) => {
      if (key) {
        Object.keys(toggles).forEach((v) => {
          toggles[v] = v === key ? !toggles[v] : false;
        });
        setToggles({ ...toggles });
      } else {
        setToggles({ ..._.mapValues(toggles, () => false) });
      }

      setSettingMore(false);
    },
    [toggles]
  );

  const broadcastSettingMore = useCallback(
    (e) => {
      e.stopPropagation();
      setSettingMore(!settingMore);
    },
    [settingMore]
  );

  const broadcastFreeze = useCallback(async () => {
    const { result, data, message } = await postFreezeRoom({
      roomNo,
      isFreeze: !chatFreeze,
    });
    if (result === "success") {
      dispatch(setBroadcastCtxChatFreeze(data.isFeeze));
    } else {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: message,
      }));
    }
  }, [chatFreeze]);

  const broadcastEdit = useCallback(() => {
    dispatch(setBroadcastCtxRightTabType(tabType.SETTING));
  }, []);

  const broadcastShareClick = useCallback(async () => {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    const { result, data, message } = await broadcastShare({
      roomNo: roomNo,
    });

    if (result === "success") {
      textarea.value = data.shareLink;
      textarea.select();
      textarea.setSelectionRange(0, 9999);
      document.execCommand("copy");
      document.body.removeChild(textarea);

      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "????????? ?????????????????????!",
      }));
    } else {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: message,
      }));
    }
  }, []);

  const broadcastOffClick = useCallback(() => {
    // togglController();
    dispatch(setGlobalCtxAlertStatus({
      status: true,
      type: "confirm",
      title: "??????",
      content: `????????? ?????? ${
        roomOwner === true ? "?????????" : "??????"
      }????????????????`,
      callback: async () => {
        const { data, result } = await broadcastExit({ roomNo });
        if (result === "success") {
          if (roomNo && chatInfo !== null) {
            chatInfo.privateChannelDisconnect();
          }
          if (rtcInfo !== null) {
            rtcInfo.socketDisconnect();
            rtcInfo.stop();
            dispatch(setGlobalCtxRtcInfoEmpty());
            disconnectGuest();
            await rtcInfo.stop();
            rtcSessionClear();
            if (roomOwner === true) {
              dispatchDimLayer({
                type: "BROAD_END",
                others: {
                  roomOwner: true,
                  roomNo: roomNo,
                },
              });
            } else {
              setTimeout(() => {
                history.push("/");
              });
            }
          }
        }
      },
    }));
  }, [chatInfo, rtcInfo, guestState.guestObj]);

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

  const callModifyBroadcastState = async ({ mediaState, mediaOn }) => {
    const res = await modifyBroadcastState({
      roomNo,
      mediaState,
      mediaOn,
    });

    if (res.result === "success") {
      return true;
    } else {
      return false;
    }
  };

  /*  const broadcastVideoController = async () => {
      if (!broadcastState.isTTSPlaying) {
        if (!videoActive) {
          await startBroadcastVideo();
        } else {
          await stopBroadcastVideo();
        }
      }
    };*/

  const stopBroadcastVideo = useCallback(async () => {
    const result = await callModifyBroadcastState({
      mediaState: "video",
      mediaOn: false,
    });
    if (result === true) {
      setVideoActive(false);

      if (rtcInfo !== null) {
        rtcInfo.videoMute(true);
        rtcInfo.audioMute(true);
        rtcInfo.setBroadState(false);
      }
    }
  }, [rtcInfo]);

  const startBroadcastVideo = useCallback(async () => {
    const result = await callModifyBroadcastState({
      mediaState: "video",
      mediaOn: true,
    });

    if (result) {
      setVideoActive(true);
      if (rtcInfo !== null) {
        rtcInfo.videoMute(false);
        rtcInfo.audioMute(false);
        rtcInfo.setBroadState(true);
      }
      const noticeDisplay = document.getElementById("broadcast-notice-display");

      const mediaAlarm = document.getElementById("isMediaNotice");


      if (noticeDisplay && mediaAlarm) {
        noticeDisplay.removeChild(mediaAlarm);
      }
    }

    // if (rtcInfo !== null) {
    //   rtcInfo.addTrackToPeerStream("video");
    //
    // }
  }, [rtcInfo]);

  const broadcastMicController = async () => {
    if (!broadcastState.isTTSPlaying) {
      if (!micActive) {
        await startBroadcastMic();
        setSavedMicState(true);
      } else {
        await stopBroadcastMic();
        setSavedMicState(false);
      }
    }
  };

  const startBroadcastMic = useCallback(async () => {
    const result = await callModifyBroadcastState({
      mediaState: "mic",
      mediaOn: true,
    });

    if (result) {
      setMicActive(true);

      if (rtcInfo !== null) {
        rtcInfo.setBroadState(true);
      }

      const noticeDisplay = document.getElementById("broadcast-notice-display");

      const mediaAlarm = document.getElementById("isMediaNotice");

      if (noticeDisplay && mediaAlarm) {
        noticeDisplay.removeChild(mediaAlarm);
      }
    }
  }, [rtcInfo]);

  const stopBroadcastMic = useCallback(async () => {
    const result = await callModifyBroadcastState({
      mediaState: "mic",
      mediaOn: false,
    });

    if (result) {
      setMicActive(false);

      if (rtcInfo !== null) {
        rtcInfo.setBroadState(false);
      }
    }
  }, [rtcInfo]);

  // dj??? ???????????? ?????? ???????????? tts ???????????? ???????????? ???????????? ?????? (?????? ?????? ??????????????? ??????x)
  const changeTTSMicState = async () => {
    if (rtcInfo?.userType === UserType.HOST && savedMicState && videoActive) {
      if (broadcastState.isTTSPlaying) {
        await stopBroadcastMic();

        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: broadcastState.ttsActionInfo.ttsText
            ? "???????????? ???????????? ?????? ???????????? OFF?????????."
            : "????????? ???????????? ???????????? ?????? ???????????? OFF?????????.",
        }));
      } else {
        await startBroadcastMic();
      }
    }
  };

  useEffect(() => {
    let timeoutId: number | null = null;
    if (baseData.isLogin === true && likeClicked === true) {
      timeoutId = setTimeout(() => {
        dispatch(setBroadcastCtxHeartActive(true));
      }, 1000 * 60);
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [likeClicked]);

  useEffect(() => {
    async function getShortcut() {
      const res = await getBroadcastShortCut();
      if (res.result === "success") {
        if (res.data instanceof Array) {
          dispatch(setBroadcastCtxMsgShortCut(res.data));
        } else {
          dispatch(setBroadcastCtxMsgShortCut(res.data.list));
        }
      } else {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: res.message,
        }));
      }
    }
    if (msgShortCut.length === 0) {
      getShortcut();
    }
  }, [msgShortCut]);

  useEffect(() => {
    if (rtcInfo !== null) {
      dispatch(setBroadcastCtxRoomInfoVideoState(videoActive));
      if (videoActive === true) {
        rtcInfo.addTrackToPeerStream("video");
      } else {
        rtcInfo.removeTrackFromPeerStream("video");
      }
    }
  }, [videoActive, rtcInfo]);

  useEffect(() => {
    if (rtcInfo !== null) {
      dispatch(setBroadcastCtxRoomInfoMicState(micActive));
      if (micActive === true) {
        rtcInfo.addTrackToPeerStream();
      } else {
        rtcInfo.removeTrackFromPeerStream();
      }
    }
  }, [micActive, rtcInfo]);

  useEffect(() => {
    if (readyState) {
      changeTTSMicState();
    }
  }, [broadcastState.isTTSPlaying]);

  /** ?????? ????????? ?????????????????? ???????????? ???????????? ?????? */
  // TTS, ????????? ????????? on/off ??????
  useEffect(() => {
    if(layer && layer?.status && layer?.type && layer.status && layer.type === 'GIFT'){
      togglController();
    }
  },[layer]);


  useEffect(() => {
    if(layer && layer?.status && layer?.type && layer.status && layer.type === 'GIFT') { // ?????? ????????? ?????????
      /** ???????????? ?????????????????? ?????? ?????? ???????????? ?????? */
      if (toggles && (toggles.more || toggles.msg || toggles.volume || toggles.video)) {
        dispatchLayer({type: "INIT"});
      }
    }
  },[toggles]);

  /** ?????? ???????????? ????????? ???????????? ????????? chatSocket??? set?????? (req
   * chatInfo (chat_socket) ????????? ??? chatInfo ???????????? ?????? ?????? ?????? ????????? =>
   * chatInfo????????? broadcastSettingObj ?????? ?????? ???????????? ?????? ??????*/
  useEffect(() => {
    //chatInfo??? ???????????? ????????? ?????????????????? ?????? ?????????!
    if(settingObj && Object.keys(settingObj).length) {
      chatInfo?.setUserSettingObj && chatInfo.setUserSettingObj(settingObj);
    }
  },[chatInfo, settingObj]);

  //???????????? ?????? ??? broadcastState??? ???????????? ??????
  const setSettingObj = (param) => {
    //?????? ??? global State??? ??????
    dispatch(setBroadcastCtxSettingObject(param));
  };

  useEffect(() => {
    const clickEv = (e) => {
      togglController();
    };

    const fetchBroadcastSetting = async () => {
      const { result, data } = await getBroadcastSetting();
      if (result === "success") {
        const {djListenerIn, djListenerOut, listenerIn, listenerOut, liveBadgeView, ttsSound, normalSound,
          djTtsSound, djNormalSound} = data;

        const settingObj = {
          djListenerIn: data?.djListenerIn ?? true,
          djListenerOut: data?.djListenerOut ?? true,
          listenerIn: data?.listenerIn ?? true,
          listenerOut: data?.listenerOut ?? true,
          liveBadgeView: data?.liveBadgeView ?? true,
          djTtsSound: data?.djTtsSound ?? true,
          djNormalSound: data?.djNormalSound ?? true,
          ttsSound: data?.ttsSound ?? true,
          normalSound: data?.normalSound ?? true
        };
        setSettingObj(settingObj);
      }
    };

    fetchBroadcastSetting();
    setReadyState(true);

    window.addEventListener("click", clickEv);
    return () => {
      window.removeEventListener("click", clickEv);
    };
  }, []);

  return (
    <>
      <div className="icon-wrap">
        {rtcInfo?.userType === UserType.HOST ? (
          <>
            {roomInfo.mediaType === MediaType.VIDEO ? (
              // (
              //   <>
              //     {videoActive === true && <img className="icon" src={VideoOnIcon} onClick={broadcastVideoController} />}
              //     {videoActive === false && <img className="icon" src={VideoOffIcon} onClick={broadcastVideoController} />}
              //   </>
              // ) : (
              //   <>
              //     {micActive === true && <img className="icon" src={MicIcon} onClick={broadcastMicController} />}
              //     {micActive === false && <img className="icon" src={MicOffIcon} onClick={broadcastMicController} />}
              // )
              <>
                {videoActive === true && (
                  <img
                    className="icon"
                    src={VideoOnIcon}
                    onClick={stopBroadcastVideo}
                  />
                )}
                {videoActive === false && (
                  <img
                    className="icon"
                    src={VideoOffIcon}
                    onClick={startBroadcastVideo}
                  />
                )}
              </>
            ) : (
              <>
                {micActive === true && (
                  <img
                    className="icon"
                    src={MicIcon}
                    onClick={stopBroadcastMic}
                  />
                )}
                {micActive === false && (
                  <img
                    className="icon"
                    src={MicOffIcon}
                    onClick={startBroadcastMic}
                  />
                )}
              </>
              // <img className="icon" src={micOffActive === true ? MicOffIcon : MicIcon} onClick={micOffIconClickHandler} />
            )}
          </>
        ) : likeClicked === true ? (
          <img
            className="icon"
            src={broadcastState.heartActive ? HeartBigFillIcon : HeartBigIcon}
            onClick={heartIconClickHandler}
          />
        ) : (
          <img
            className="icon"
            src={useBoost ? BoostIcon : BoostOffIcon}
            onClick={boostIconClickHandler}
          />
        )}

        {rtcInfo?.userType === UserType.LISTENER && (
          <Volume
            ref={volumeBarRef}
            visible={toggles.volume}
            currentVolume={rtcInfo.audioTag.volume}
            iconClick={(e) => {
              e.stopPropagation();
              togglController("volume");
            }}
            onChange={(value) => {
              volumeBarOnChange(value);
            }}
            setVolumeBarDown={(value) => {}}
          />
        )}
        {rtcInfo?.userType === UserType.HOST &&
          roomInfo.mediaType === MediaType.VIDEO &&
          roomInfo.useFilter && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglController("video");
              }}
            >
              <img
                className="icon"
                src={
                  toggles.video === true
                    ? VideoSettingIcon
                    : VideoSettingOffIcon
                }
              />
            </button>
          )}

        <div
          className={`icon-wrap__msgContainer ${toggles.msg &&
            "on"} ${roomInfo?.mediaType === MediaType.VIDEO && "video"}`}
        >
          {msgShortCut.map((v, idx) => {
            return (
              <div
                key={idx}
                className="icon-wrap__msgContainer--text"
                onClick={() => sendShortCut(idx)}
              >
                {v.order}
              </div>
            );
          })}

          <div
            className="icon-wrap__msgContainer--setting"
            onClick={msgSettingHandler}
          >
            <img src={SettingIcon} />
          </div>
        </div>

        {globalState.baseData.isLogin === true && (
          <img
            className="icon"
            src={`${
              rightTabType === tabType.EMOTICON ? EmoticonOnIcon : EmoticonIcon
            }`}
            onClick={emoticonIconClickHandler}
          />
        )}
        {globalState.baseData.isLogin === true && (
          <img
            className="icon"
            src={toggles.msg === true ? MsgFillIcon : MsgIcon}
            onClick={(e) => {
              e.stopPropagation();
              togglController("msg");
            }}
          />
        )}

        <img
          className="icon more"
          src={toggles.more === true ? MoreFillIcon : MoreIcon}
          onClick={(e) => {
            e.stopPropagation();
            togglController("more");
          }}
        />
      </div>
      {toggles.video && (
        <div className="moreVideo">
          <button className="icon">
            <img
              src={VideoEffectIcon}
              onClick={(e) => {
                dispatch(setBroadcastCtxRightTabType(tabType.MAKE_UP));
              }}
              alt="?????? ??????"
            />
          </button>
          <button
            className="icon"
            onClick={() => {
              if (rtcInfo) {
                rtcInfo.flip();
              }
            }}
          >
            <img src={VideoFlipIcon} alt="?????? ??????" />
          </button>
        </div>
      )}
      {toggles.more && (
        <div
          className={`more-display ${roomInfo?.mediaType === MediaType.VIDEO &&
            "video"}`}
          onClick={(e) => {
            e.stopPropagation();

            togglController();
          }}
        >
          <button
            className={`icon ${settingMore && "active"} `}
            onClick={broadcastSettingMore}
          >
            <img
              src={
                settingMore
                  ? "https://image.dalbitlive.com/broadcast/ico_setting_circle_p.svg"
                  : "https://image.dalbitlive.com/broadcast/ico_setting_circle.svg"
              }
              alt="???????????????"
            />

            {settingObj !== null && settingMore && (
              <SettingWrap
                roomOwner={roomOwner}
                settingObj={settingObj}
                setSettingObj={setSettingObj}
              />
            )}
          </button>

          {roomOwner === true && (
            <button
              className="icon"
              onClick={() => {
                dispatch(moveVoteListStep({
                  roomNo: roomNo
                  , memNo: roomInfo.bjMemNo
                  , voteSlct: 's'
                }))
                dispatch(setBroadcastCtxRightTabType(tabType.VOTE));
              }}
            >
              <img src='https://image.dalbitlive.com/broadcast/dalla/vote/voteIcon-fix.png' alt="??????" />
            </button>
          )}

          {roomOwner === true && roomInfo.isMinigame && (
            <button
              className="icon"
              onClick={() => {
                if (broadcastState.miniGameInfo.status === true) {
                  dispatch(setGlobalCtxSetToastStatus({
                    status: true,
                    message:
                      "?????? ???????????? ????????? ????????????.\n?????? ??? ?????? ??????????????????.",
                  }));
                } else {
                  dispatch(setBroadcastCtxRightTabType(tabType.ROULETTE));
                }
              }}
            >
              <img src={MiniGameIcon} alt="????????????" />
            </button>
          )}

          {roomOwner === true && (
            <>
              <button
                className={`icon ${chatFreeze && "snow"}`}
                onClick={broadcastFreeze}
              >
                <img
                  src={
                    chatFreeze
                      ? "https://image.dalbitlive.com/broadcast/ico_snowman_b.svg"
                      : "https://image.dalbitlive.com/broadcast/ico_snowman.svg"
                  }
                  alt="?????????"
                />
              </button>
              <button className="icon" onClick={broadcastEdit}>
                <img
                  src="https://image.dalbitlive.com/broadcast/ico_edit.svg"
                  alt="????????????"
                />
              </button>
            </>
          )}
          <button className="icon" onClick={broadcastShareClick}>
            <img
              src="https://image.dalbitlive.com/broadcast/ico_share.svg"
              alt="????????????"
            />
          </button>
          <button className="icon" onClick={broadcastOffClick}>
            <img
              src="https://image.dalbitlive.com/broadcast/ico_out.svg"
              alt="?????????"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default IconWrap;
