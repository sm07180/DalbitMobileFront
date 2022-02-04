// others
import { UserType } from "common/realtime/rtc_socket";
// Server Api
import { broadcastExit } from "common/api";

export function ClipPlayerJoin(clipNo: string, gtx, history, clipTable?: boolean) {
  const { globalState, globalAction } = gtx;
  const { rtcInfo, chatInfo } = globalState;
  if (rtcInfo !== null) {
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: `현재 ${rtcInfo.userType === UserType.HOST ? "방송" : "청취"} 중인 방송방이 있습니다. 클립을 재생하시겠습니까?`,
      callback: () => {
        const roomExit = async () => {
          const roomNo = rtcInfo!.getRoomNo();
          const { result } = await broadcastExit({ roomNo });
          if (result === "success") {
            sessionStorage.removeItem("room_no");
            if (chatInfo && chatInfo !== null) {
              chatInfo.privateChannelDisconnect();
              if (rtcInfo !== null) rtcInfo!.stop();
              globalAction.dispatchRtcInfo!({ type: "empty" });
            }
          }
        };
        if (rtcInfo !== null && rtcInfo !== undefined) {
          roomExit();
        }

        // history.push(`/clip/${clipNo }`);
        history.push({
          pathname: `/clip/${clipNo}`,
          state: "firstJoin",
        });
      },
    });
  } else {
    if (!globalState.baseData.isLogin) {
      clipTable
        ? history.push({
            pathname: "/login",
            state: "/clip_recommend",
          })
        : history.push("/login");
    } else {
      // history.push(`/clip/${clipNo}`);
      history.push({
        pathname: `/clip/${clipNo}`,
        state: "firstJoin",
      });
    }
  }
}

export function RoomValidateFromClip(roomNo, gtx, history, nickNm?, listener?) {
  const { globalState, globalAction } = gtx;
  const { clipInfo, clipPlayer } = globalState;
  if (clipInfo !== null) {
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: `현재 재생 중인 클립이 있습니다. \n 방송에 입장하시겠습니까?`,
      callback: () => {
        clipPlayer.clipExit();
        if (globalState.checkAdmin === true && globalState.baseData.isLogin) {
          globalAction.setBroadcastAdminLayer!((prevState) => ({
            ...prevState,
            status: `broadcast`,
            roomNo: roomNo,
            nickNm: nickNm,
          }));
        } else {
          history.push(`/broadcast/${roomNo}`);
        }
      },
    });
  } else {
    if (!globalState.baseData.isLogin) {
      history.push("/login");
      // globalAction.setUrlInfo!((prevState) => ({
      //   ...prevState,
      //   type: `broadcast`,
      //   sub: roomNo,
      // }));
    } else {
      if (globalState.checkAdmin !== true && globalState.baseData.isLogin) {
        if (listener === "listener") {
          history.push(`/broadcast/${roomNo}`);
        } else {
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              type: "confirm",
              content:
                nickNm === "noName" ? `방송방에 입장하시겠습니까?` : `<b>${nickNm}</b> 님의 <br/> 방송방에 입장하시겠습니까?`,
              callback: () => {
                history.push(`/broadcast/${roomNo}`);
              },
            });
        }
      } else {
        if (globalState.checkAdmin === true && globalState.baseData.isLogin) {
          globalAction.setBroadcastAdminLayer!((prevState) => ({
            ...prevState,
            status: `broadcast`,
            roomNo: roomNo,
            nickNm: nickNm === "noName" ? "" : nickNm,
          }));
          //history.push(`/broadcast/${roomNo}`);
        }
      }
    }
  }
}