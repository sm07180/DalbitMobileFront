// React
import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useHistory } from "react-router-dom";

// Api
import {
  modifyBroadcastState,
  broadcastLike,
  getBroadcastShortCut,
  broadcastExit,
  getBroadcastSetting,
  postFreezeRoom,
  broadcastShare,
} from "common/api";

// Context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
import { GuestContext } from "context/guest_ctx";
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// Module
import _ from "lodash";

// Component
import Volume from "./volume";
import SettingWrap from "./setting_wrap";

// Type
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import { tabType, MediaType } from "pages/broadcast/constant";
import { userBroadcastSettingType } from "common/realtime/chat_socket";

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

export const IconWrap = (props: {
  roomOwner: boolean | null;
  roomNo: string;
  roomInfo: roomInfoType;
  sendMessage: any;
}) => {
  const { roomNo, roomInfo, sendMessage, roomOwner } = props;
  const { useBoost } = roomInfo;

  const history = useHistory();

  const { globalState, globalAction } = useContext(GlobalContext);
  const { rtcInfo, baseData, guestInfo, chatInfo } = globalState;

  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
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

  const [heartActive, setHeartActive] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(roomInfo.isMic);
  const [videoActive, setVideoActive] = useState<boolean>(roomInfo.isVideo);
  const [readyState, setReadyState] = useState<boolean>(false);
  const [savedMicState, setSavedMicState] = useState(roomInfo.isMic);

  const volumeBarRef = useRef<any>(null);

  const heartIconClickHandler = async (e) => {
    if (baseData.isLogin === true) {
      if (heartActive === true) {
        const { result, message } = await broadcastLike({ roomNo, memNo: roomInfo.bjMemNo});
        if (result === "fail") {
          if (globalAction.setAlertStatus) {
            globalAction.setAlertStatus({ status: true, content: message });
          }
        } else if (result === "success") {
          broadcastAction.setLikeClicked!(false);
        }
      } else if (heartActive === false) {
        if (globalAction.setAlertStatus) {
          globalAction.setAlertStatus({
            status: true,
            content: "좋아요는 방송청취 60초 후에 가능합니다.",
          });
        }
      }
    } else if (baseData.isLogin == false) {
      history.push("/login");
    }
  };

  const boostIconClickHandler = useCallback(() => {
    broadcastAction.setRightTabType &&
      broadcastAction.setRightTabType(tabType.BOOST);
  }, []);

  const msgSettingHandler = useCallback(() => {
    broadcastAction.setRightTabType &&
      broadcastAction.setRightTabType(tabType.SHORT);
  }, []);

  const volumeBarOnChange = useCallback(
    (value: number) => {
      if (rtcInfo !== null && rtcInfo.userType === UserType.LISTENER) {
        if (rtcInfo.audioTag) {
          rtcInfo.audioTag.volume = value;
          //tts, sound 아이템에 사운드 볼륨적용하기
          broadcastAction?.setSoundVolume && broadcastAction.setSoundVolume(value);
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
    [rtcInfo, guestInfo, broadcastAction]
  );

  const sendShortCut = (idx: number) => {
    sendMessage(msgShortCut[idx].text);
  };

  const emoticonIconClickHandler = useCallback(() => {
    broadcastAction.setRightTabType &&
      broadcastAction.setRightTabType(tabType.EMOTICON);
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
      broadcastAction.setChatFreeze!(data.isFeeze);
    } else {
      globalAction.callSetToastStatus!({
        status: true,
        message: message,
      });
    }
  }, [chatFreeze]);

  const broadcastEdit = useCallback(() => {
    broadcastAction.setRightTabType &&
      broadcastAction.setRightTabType(tabType.SETTING);
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

      globalAction.callSetToastStatus!({
        status: true,
        message: "링크를 복사하였습니다!",
      });
    } else {
      globalAction.callSetToastStatus!({
        status: true,
        message: message,
      });
    }
  }, []);

  const broadcastOffClick = useCallback(() => {
    // togglController();
    if (globalAction.setAlertStatus) {
      globalAction.setAlertStatus({
        status: true,
        type: "confirm",
        title: "알림",
        content: `방송을 정말 ${
          roomOwner === true ? "종료하" : "나가"
        }시겠습니까?`,
        callback: async () => {
          const { data, result } = await broadcastExit({ roomNo });
          if (result === "success") {
            if (roomNo && chatInfo !== null) {
              chatInfo.privateChannelDisconnect();
            }
            if (rtcInfo !== null) {
              rtcInfo.socketDisconnect();
              rtcInfo.stop();
              globalAction.dispatchRtcInfo({ type: "empty" });
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
      });
    }
  }, [chatInfo, rtcInfo, guestState.guestObj]);

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

  // dj의 마이크가 켜진 상태에서 tts 아이템이 재생되면 마이크를 끈다 (이미 꺼진 상태에서는 변화x)
  const changeTTSMicState = async () => {
    if (rtcInfo?.userType === UserType.HOST && savedMicState && videoActive) {
      if (broadcastState.isTTSPlaying) {
        await stopBroadcastMic();
        globalAction.callSetToastStatus &&
          globalAction.callSetToastStatus({
            status: true,
            message: broadcastState.ttsActionInfo.ttsText
              ? "목소리가 재생되는 동안 마이크가 OFF됩니다."
              : "사운드 아이템이 재생되는 동안 마이크가 OFF됩니다.",
          });
      } else {
        await startBroadcastMic();
      }
    }
  };

  useEffect(() => {
    let timeoutId: number | null = null;
    if (baseData.isLogin === true && likeClicked === true) {
      timeoutId = setTimeout(() => {
        setHeartActive(true);
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
      if (res.result === "success" && broadcastAction.setMsgShortCut) {
        if (res.data instanceof Array) {
          broadcastAction.setMsgShortCut(res.data);
        } else {
          broadcastAction.setMsgShortCut(res.data.list);
        }
      } else {
        globalAction.callSetToastStatus!({
          status: true,
          message: res.message,
        });
      }
    }
    if (msgShortCut.length === 0) {
      getShortcut();
    }
  }, [msgShortCut]);

  useEffect(() => {
    if (rtcInfo !== null) {
      broadcastAction.dispatchRoomInfo &&
        broadcastAction.dispatchRoomInfo({
          type: "videoState",
          data: videoActive,
        });
      if (videoActive === true) {
        rtcInfo.addTrackToPeerStream("video");
      } else {
        rtcInfo.removeTrackFromPeerStream("video");
      }
    }
  }, [videoActive, rtcInfo]);

  useEffect(() => {
    if (rtcInfo !== null) {
      broadcastAction.dispatchRoomInfo &&
        broadcastAction.dispatchRoomInfo({
          type: "micState",
          data: micActive,
        });
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

  /** 설정 팝업을 띄운상태에서 선물팝업 띄운경우 끄기 */
  // TTS, 사운드 아이템 on/off 설정
  useEffect(() => {
    if(layer && layer?.status && layer?.type && layer.status && layer.type === 'GIFT'){
        togglController();
    }
  },[layer]);


  useEffect(() => {
    if(layer && layer?.status && layer?.type && layer.status && layer.type === 'GIFT') { // 선물 팝업이 떴을때
      /** 선물팝업 띄운상태에서 설정 메뉴 띄운경우 끄기 */
      if (toggles && (toggles.more || toggles.msg || toggles.volume || toggles.video)) {
        dispatchLayer({type: "INIT"});
      }
    }
  },[toggles]);

  /** 현재 로그인한 유저의 방송설정 정보를 chatSocket에 set하기 (req
   * chatInfo (chat_socket) 재갱신 시 chatInfo 객체내에 방송 설정 값이 없다면 =>
   * chatInfo객체에 broadcastSettingObj 유저 방송 설정정보 다시 저장*/
  useEffect(() => {
    //chatInfo가 갱신되어 유저의 방송설정값이 없는 경우만!
    if(settingObj && Object.keys(settingObj).length) {
      chatInfo?.setUserSettingObj && chatInfo.setUserSettingObj(settingObj);
    }
  },[chatInfo, settingObj]);

  //설정값이 바뀔 때 broadcastState에 저장하는 함수
  const setSettingObj = (param) => {
    //설정 값 global State에 저장
    if(broadcastAction?.setSettingObj) {
      broadcastAction.setSettingObj(param);
    } else {
      console.error('icon_wrap.tsx => broadcastAction.setSettingObj null')
    }
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
            src={heartActive ? HeartBigFillIcon : HeartBigIcon}
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
                broadcastAction.setRightTabType!(tabType.MAKE_UP);
              }}
              alt="화면 필터"
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
            <img src={VideoFlipIcon} alt="화면 반전" />
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
              alt="메세지설정"
            />

            {settingObj !== null && settingMore && (
              <SettingWrap
                roomOwner={roomOwner}
                settingObj={settingObj}
                setSettingObj={setSettingObj}
              />
            )}
          </button>

          {roomOwner === true && roomInfo.isMinigame && (
            <button
              className="icon"
              onClick={() => {
                if (broadcastState.miniGameInfo.status === true) {
                  globalAction.callSetToastStatus &&
                    globalAction.callSetToastStatus({
                      status: true,
                      message:
                        "이미 진행중인 게임이 있습니다.\n종료 후 다시 시도해주세요.",
                    });
                } else {
                  broadcastAction.setRightTabType &&
                    broadcastAction.setRightTabType(tabType.ROULETTE);
                }
              }}
            >
              <img src={MiniGameIcon} alt="미니게임" />
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
                  alt="얼리기"
                />
              </button>
              <button className="icon" onClick={broadcastEdit}>
                <img
                  src="https://image.dalbitlive.com/broadcast/ico_edit.svg"
                  alt="방송설정"
                />
              </button>
            </>
          )}
          <button className="icon" onClick={broadcastShareClick}>
            <img
              src="https://image.dalbitlive.com/broadcast/ico_share.svg"
              alt="링크공유"
            />
          </button>
          <button className="icon" onClick={broadcastOffClick}>
            <img
              src="https://image.dalbitlive.com/broadcast/ico_out.svg"
              alt="나가기"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default IconWrap;
