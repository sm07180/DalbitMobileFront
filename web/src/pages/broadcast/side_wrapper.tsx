import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

// static
import { broadcastAllExit, broadcastExit, broadcastJoin, broadcastInfoNew, selfAuthCheck } from "common/api";

// others
import {HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";

// context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// content
import ChatSide from "./content/chat_side";
// import LeftSide from "./content/left_side";
import RightSide from "./content/right_side";
import Agora from "./content/left_side_agora"

import LayerSwitchRendered from "./component/layer_switch_rendered";

import LevelUpLayerComponent from "./content/level_up_layer";
import "./index.scss";
import { MediaType, MiniGameType, tabType } from "./constant";
import {useDispatch} from "react-redux";
import {moveVoteStep, setVoteActive} from "../../redux/actions/vote";

export default function SideWrapper() {
  const [splashData, setSplashData] = useState<any>(null);
  const [roomOwner, setRoomOwner] = useState<boolean | null>(null);
  const [forceChatScrollDown, setForceChatScrollDown] = useState<boolean>(false);
  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { baseData, chatInfo, rtcInfo, guestInfo } = globalState;

  const { dispatchLayer, dispatchDimLayer, dimLayer } = useContext(BroadcastLayerContext);

  const { roomNo } = useParams<{ roomNo: string }>();

  const [fetching, setFetching] = useState<boolean>(false);

  const history = useHistory();
  const dispatch = useDispatch();

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
    const videoEffect = sessionStorage.getItem("videoEffect");
    if (videoEffect) {
      broadcastAction.setVideoEffect!(JSON.parse(videoEffect));
    }

    if (globalState.splashData) {
      setSplashData(globalState.splashData);
    }


    async function broadcastJoinConfirm() {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: `이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?`,
          callback: () => {
            const callResetListen = async () => {
              const { result, message } = await broadcastAllExit();
              if (result === "success") {
                setTimeout(() => {
                  broadcastInit();
                }, 700);
              } else {
                globalAction.setAlertStatus &&
                  globalAction.setAlertStatus({
                    status: true,
                    title: "알림",
                    content: `${message}`,
                    callback: () => history.push("/"),
                    cancelCallback: () => history.push("/"),
                  });
              }
            };
            callResetListen();
          },
          cancelCallback: () => history.push("/"),
        });
    }

    async function broadcastExitAction(exitRoomNo) {
      const { result, message } = await broadcastExit({ roomNo: exitRoomNo });
      if (result === "success") {
        if (chatInfo && chatInfo !== null) {
          chatInfo.privateChannelDisconnect();
          if (rtcInfo !== null) {
            rtcInfo!.stop();
            globalAction.dispatchRtcInfo!({ type: "empty" });
          }
          disconnectGuest();
          rtcSessionClear();
        }
        setTimeout(() => {
          broadcastJoinAction();
        }, 1000);
      } else {
        if (chatInfo && chatInfo !== null) {
          chatInfo.privateChannelDisconnect();
          if (rtcInfo !== null) {
            rtcInfo!.stop();
            globalAction.dispatchRtcInfo!({ type: "empty" });
          }
          disconnectGuest();
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
    //청취자 입장
    async function broadcastJoinAction() {
      const { result, data, code, message } = await broadcastJoin({ roomNo, shadow: globalState.shadowAdmin });
      if (result === "success") {
        // 방 정보 설정
        const roomInfo = {
          ...data,
          currentMemNo: globalState.baseData.isLogin === true ? globalState.baseData.memNo : "",
        };
        const { isFreeze, isExtend, isLike, bjMemNo, fanRank, likes, rank, miniGameList } = roomInfo;

        setRoomOwner(baseData.memNo === bjMemNo ? true : false);
        broadcastAction.dispatchRealTimeValue &&
          broadcastAction.dispatchRealTimeValue({ type: "setLikeFanRank", data: { fanRank, likes, rank } });
        broadcastAction.dispatchRoomInfo &&
        broadcastAction.dispatchRoomInfo({
          type: "reset",
          data: roomInfo,
        });
        sessionStorage.setItem("broadcast_data", JSON.stringify(roomInfo));

        broadcastAction.setChatFreeze!(isFreeze);
        broadcastAction.setExtendTimeOnce!(isExtend);
        broadcastAction.setUserCount &&
          broadcastAction.setUserCount((prev) => {
            return { ...prev, history: roomInfo.entryCnt };
          });

        chatInfo && chatInfo.setChatFreeze(isFreeze);
        chatInfo?.setRoomInfo(roomInfo);
        chatInfo?.setBroadcastLayerAction({ dispatchLayer, dispatchDimLayer });

        broadcastAction.setLikeClicked!(isLike);
        if (roomInfo.useFilter === false) {
          sessionStorage.removeItem("videoEffect");
        }
        if (miniGameList.length > 0) {
          broadcastAction.setMiniGameInfo!({
            status: true,
            miniGameType: MiniGameType.ROLUTTE,
            isFree: miniGameList[0].isFree,
            optCnt: miniGameList[0].optCnt,
            optList: miniGameList[0].optList,
            payAmt: miniGameList[0].payAmt,
            rouletteNo: miniGameList[0].rouletteNo,
            versionIdx: miniGameList[0].versionIdx,
            autoYn: miniGameList[0].autoYn,
          });
        } else if (miniGameList.length === 0) {
          broadcastAction.setMiniGameInfo!({
            status: false,
          });
        }
        dispatch(setVoteActive(data.isVote));

        setFetching(true);
        //Facebook,Firebase 이벤트 호출
        try {
          if (window.fbq) {
            window.fbq("track", "RoomJoin");
          }
          if (window.firebase) {
            window.firebase.analytics().logEvent("RoomJoin");
          }
        } catch (e) {}
        sessionStorage.setItem("room_no", roomNo);
      } else if (result === "fail") {
        if (code === "-10" || code === "-4") {
          //타기기조인
          broadcastJoinConfirm();
        } else if (code === "-6") {
          // 20세 이상
          authCheck();
        } else if (code === "-8") {
          // Host Join case
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              title: "알림",
              content: "해당 방송은 다른 기기에서 DJ로 방송 중이므로 청취자로 입장할 수 없습니다.",
              callback: () => history.push("/"),
              cancelCallback: () => history.push("/"),
            });
        } else if (code === "-14") {
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              title: "알림",
              content: `${message}`,
              callback: () => {
                history.push(`/self_auth/self?type=adultJoin`);
              },
            });
        } else if (code === "-99") {
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              title: "알림",
              content: `${message}`,
              callback: () => {
                history.push({
                  pathname: "/login",
                  state: `/broadcast/${roomNo}`,
                });
              },
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
    //방장 입장.
    async function broadcastInit() {
      /*
       * 기존 룸조인 => 방장일때 정보조회
       * 변경 정보조회 후 방회원이 아닐때만 룸조인
       * 정보의 auth로 처리(chatInfo, rtcInfo 널이나 언디파인드 확인)
       * */
      const newRoomInfo = await broadcastInfoNew({ roomNo });

      if (newRoomInfo.result === "success") {
        // 방 정보 설정
        const roomInfo = {
          ...newRoomInfo.data,
          currentMemNo: globalState.baseData.isLogin === true ? globalState.baseData.memNo : "",
          broadState: newRoomInfo.data.state === 2 ? false : true,
        };
        const { auth, fanRank, likes, rank, isExtend, isFreeze, isLike, miniGameList } = roomInfo;
        setRoomOwner(auth === 3 ? true : false);
        broadcastAction.dispatchRealTimeValue &&
          broadcastAction.dispatchRealTimeValue({ type: "setLikeFanRank", data: { fanRank, likes, rank } });
        // broadcastAction.dispatchRoomInfo &&
        //   broadcastAction.dispatchRoomInfo({
        //     type: "reset",
        //     data: roomInfo,
        //   });
        broadcastAction.setExtendTimeOnce!(isExtend);
        broadcastAction.setChatFreeze!(isFreeze);
        broadcastAction.setUserCount &&
          broadcastAction.setUserCount((prev) => {
            return { ...prev, history: roomInfo.entryCnt };
          });
        chatInfo && chatInfo.setChatFreeze(isFreeze);
        chatInfo?.setRoomInfo(roomInfo);
        chatInfo?.setBroadcastLayerAction({ dispatchLayer, dispatchDimLayer });
        broadcastAction.setLikeClicked!(isLike);
        dispatch(setVoteActive(newRoomInfo.data.isVote));
        sessionStorage.setItem("room_no", roomNo);
        if (roomInfo.useFilter === false) {
          sessionStorage.removeItem("videoEffect");
        }
        if (miniGameList.length > 0) {
          broadcastAction.setMiniGameInfo!({
            status: true,
            miniGameType: MiniGameType.ROLUTTE,
            isFree: miniGameList[0].isFree,
            optCnt: miniGameList[0].optCnt,
            optList: miniGameList[0].optList,
            payAmt: miniGameList[0].payAmt,
            rouletteNo: miniGameList[0].rouletteNo,
            versionIdx: miniGameList[0].versionIdx,
            autoYn: miniGameList[0].autoYn,
          });
        } else if (miniGameList.length === 0) {
          broadcastAction.setMiniGameInfo!({
            status: false,
          });
        }

        setFetching(true);
      } else {
        if (newRoomInfo.code === "-10" || newRoomInfo.code === "-4") {
          //타기기조인
          broadcastJoinConfirm();
        } else if (newRoomInfo.code === "-8") {
          // Host Join case
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              title: "알림",
              content: "해당 방송은 다른 기기에서 DJ로 방송 중이므로 청취자로 입장할 수 없습니다.",
              callback: () => history.push("/"),
              cancelCallback: () => history.push("/"),
            });
        } else if (newRoomInfo.code + "" === "-3") {
          //해당방 회원 아님 룸조인 처리
          const listenRoomNo = sessionStorage.getItem("room_no");

          if (listenRoomNo == undefined || listenRoomNo == null || listenRoomNo == "" || listenRoomNo === roomNo) {
            broadcastJoinAction();
          } else {
            broadcastExitAction(listenRoomNo);
          }
        } else {
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              title: "알림",
              content: `${newRoomInfo.message}`,
              callback: () => history.push("/"),
              cancelCallback: () => history.push("/"),
            });
        }
      }
    }

    (async () => {
      // await getSplashData();
      if (rtcInfo === null || rtcInfo.userType === UserType.LISTENER) {
        if (rtcInfo !== null) {
          rtcInfo.socketDisconnect();
          // rtcInfo.stop();
        }
        broadcastInit();
      } else if (rtcInfo !== null && rtcInfo.userType === UserType.HOST) {
        const { roomInfo } = rtcInfo;

        setFetching(true);
        if (roomInfo !== null) {
          const roomOwner = baseData.memNo === roomInfo.bjMemNo;
          if (rtcInfo?.roomInfo?.roomNo !== roomNo) {
            if (globalAction.setAlertStatus) {
              globalAction.setAlertStatus({
                status: true,
                type: "alert",
                title: "알림",
                content: "해당 방송은 다른 기기에서 DJ로 방송 중이므로 청취자로 입장할 수 없습니다.",
                callback: () => history.goBack(),
                cancelCallback: () => history.goBack(),
              });
            }
          } else if (rtcInfo?.roomInfo?.roomNo === roomNo) {
            broadcastInit();
          }
        }
      }
    })();

    // 방송방입장시 항상 스크롤 최상위로 kjo.
    window.scrollTo(0, 0);

    function LayerInit() {
      dispatchLayer({
        type: "INIT",
      });

      dispatchDimLayer({
        type: "INIT",
      });
    }

    window.addEventListener("click", LayerInit);

    return () => {
      window.removeEventListener("click", LayerInit);

      broadcastAction.setRightTabType!(tabType.PROFILE);

      broadcastAction.setIsWide!(true);
    };
  }, []);
  // if (roomOwner !== null) {
  //   return (
  //     <>
  //       {roomOwner === true ? (
  //         <>
  //           {broadcastState.roomInfo !== null && fetching && (
  //             <TempSide
  //               roomOwner={roomOwner}
  //               roomNo={roomNo}
  //               roomInfo={broadcastState.roomInfo}
  //               forceChatScrollDown={forceChatScrollDown}
  //               setForceChatScrollDown={setForceChatScrollDown}
  //             />
  //           )}
  //         </>
  //       ) : (
  //         <>
  //           {roomOwner !== null && broadcastState.roomInfo !== null && (
  //             <RightSide
  //               splashData={splashData}
  //               roomOwner={roomOwner}
  //               roomNo={roomNo}
  //               roomInfo={broadcastState.roomInfo}
  //               forceChatScrollDown={forceChatScrollDown}
  //               setForceChatScrollDown={setForceChatScrollDown}
  //             />
  //           )}

  //           {roomOwner !== null && broadcastState.roomInfo !== null && fetching ? (
  //             <LeftSide
  //               roomOwner={roomOwner}
  //               roomNo={roomNo}
  //               roomInfo={broadcastState.roomInfo}
  //               forceChatScrollDown={forceChatScrollDown}
  //               setForceChatScrollDown={setForceChatScrollDown}
  //             />
  //           ) : (
  //             <div className="temp-left-side"></div>
  //           )}

  //           {broadcastState.roomInfo?.mediaType === MediaType.VIDEO && (
  //             <ChatSide
  //               forceChatScrollDown={forceChatScrollDown}
  //               setForceChatScrollDown={setForceChatScrollDown}
  //               roomOwner={roomOwner}
  //               roomNo={roomNo}
  //               roomInfo={broadcastState.roomInfo}
  //             />
  //           )}
  //         </>
  //       )}
  //     </>
  //   );
  // } else {
  //   return <></>;
  // }
  // console.log("broadcastState====>",broadcastState.roomInfo)
  return (
    <>
      {roomOwner !== null && broadcastState.roomInfo !== null && (
        <RightSide
          splashData={splashData}
          roomOwner={roomOwner}
          roomNo={roomNo}
          roomInfo={broadcastState.roomInfo}
          forceChatScrollDown={forceChatScrollDown}
          setForceChatScrollDown={setForceChatScrollDown}
        />
      )}

      {(roomOwner !== null && broadcastState.roomInfo !== null && fetching) ? (
        <Agora
        roomOwner={roomOwner}
        roomNo={roomNo}
        roomInfo={broadcastState.roomInfo}
        forceChatScrollDown={forceChatScrollDown}
        setForceChatScrollDown={setForceChatScrollDown}
        />
        // <LeftSide
        //   roomOwner={roomOwner}
        //   roomNo={roomNo}
        //   roomInfo={broadcastState.roomInfo}
        //   forceChatScrollDown={forceChatScrollDown}
        //   setForceChatScrollDown={setForceChatScrollDown}
        // />
      ) : (
        <div className="temp-left-side"/>
      )}

      {broadcastState.roomInfo?.mediaType === MediaType.VIDEO && (
        <ChatSide
          forceChatScrollDown={forceChatScrollDown}
          setForceChatScrollDown={setForceChatScrollDown}
          roomOwner={roomOwner}
          roomNo={roomNo}
          roomInfo={broadcastState.roomInfo}
        />
      )}

      {dimLayer.status === true && <LayerSwitchRendered />}
    </>
  );
}

export const authCheck = async () => {
  const history = useHistory();
  const { globalState, globalAction } = useContext(GlobalContext);

  const { result } = await selfAuthCheck();
  if (result === "success") {
    globalAction.setAlertStatus({
      status: true,
      content: "20세 이상만 입장할 수 있는 방송입니다.",
      callback: () => history.push("/"),
      cancelCallback: () => history.push("/"),
    });
  } else {
    globalAction.setAlertStatus({
      status: true,
      content: "20세 이상만 입장할 수 있는 방송입니다. 본인인증 후 이용해주세요.",
      callback: () => history.push("/mysetting"),
      cancelCallback: () => history.push("/"),
    });
  }
}

