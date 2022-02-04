import React, { useContext, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";

// api
import { getBroadcastListeners } from "common/api";

// component
import { DalbitScroll } from "common/ui/dalbit_scroll";

// ctx
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
import { GuestContext } from "context/guest_ctx";

// constant
import { tabType } from "pages/broadcast/constant";

// component
import ListenerListItem from "./listener_list_item";
import { AuthType } from "constant";

export default function ListenerList(props: { roomInfo: any; roomOwner: boolean; roomNo: string; profile: any }) {
  const { roomInfo, roomOwner, roomNo, profile } = props;
  const history = useHistory();

  // ctx
  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { guestState } = useContext(GuestContext);
  const { isLogin } = globalState.baseData;
  const { userCount } = broadcastState;
  const { setRightTabType, setUserMemNo, setListenerList } = broadcastAction;
  const { guestConnectStatus, guestObj } = guestState;
  // state
  const [listenersList, setListenersList] = useState<Array<any>>([]);
  const [managerList, setManagerList] = useState<Array<any>>([]);
  const [guestList, setGuestList] = useState<Array<any>>([]);
  // 프로필 보기
  const viewProfile = useCallback((memNo: string) => {
    if (isLogin === true) {
      setRightTabType && setRightTabType(tabType.PROFILE);
      setUserMemNo && setUserMemNo(memNo);
    } else {
      return history.push("/login");
    }
  }, []);

  // fetch data
  const page = 1;
  const records = 1000;
  const fetchData = useCallback(async function() {
    const { result, data, message } = await getBroadcastListeners({ roomNo, page, records });

    if (result === "success" && data.hasOwnProperty("list")) {
      setListenerList && setListenerList(data.list);
      const listenersFilter = data.list.filter((user) => user.auth === AuthType.LISTENER && user.isGuest === false);
      const managerFilter = data.list.filter((user) => user.auth === AuthType.MANAGER && user.isGuest === false);
      const guestFilter = data.list.filter((user) => user.isGuest === true);
      setListenersList(listenersFilter);
      setManagerList(managerFilter);
      setGuestList(guestFilter);

      broadcastAction.setUserCount &&
        broadcastAction.setUserCount((prev) => {
          return { ...prev, current: data.list.length };
        });
    } else {
      if (result === "fail") {
        globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            title: "알림",
            content: `${message}`,
            callback: () => history.push("/"),
          });
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [broadcastState.roomInfo]);
  return (
    <>
      <h3 className="blind">청취자 리스트</h3>
      <div className="userListWrap">
        <DalbitScroll width={354} onHoverBarVisible={true}>
          <div className="scroll-box">
            <h4 className="subTitle">방송 DJ</h4>
            <div className="userBox">
              {roomInfo && (
                <div className="user user--dj">
                  <span
                    className="user__box"
                    onClick={() => {
                      viewProfile(roomInfo.bjMemNo);
                    }}
                  >
                    <span className="user__thumb" style={{ backgroundImage: `url(${roomInfo.bjProfImg.url})` }}>
                      <span className="blind">{roomInfo.bjNickNm}</span>
                    </span>
                    <div className={`user__badge dj ${roomInfo.isNew === true ? "new" : ""}`}>
                      {roomInfo.isNew === true ? "신입DJ" : "DJ"}
                    </div>
                    <span className="user__nickNm">{roomInfo.bjNickNm}</span>
                  </span>
                </div>
              )}
            </div>
            {guestConnectStatus === true && (
              <>
                <h4 className="subTitle">게스트</h4>
                <div className="userBox">
                  {isLogin === true && Array.isArray(guestList) && (
                    <ListenerListItem
                      roomOwner={roomOwner}
                      roomNo={roomNo}
                      profile={profile}
                      data={guestList}
                      classNm="listeners"
                    />
                  )}
                </div>
              </>
            )}
            <h4 className="subTitle">방송 매니저</h4>
            <div className="userBox">
              {isLogin === true && Array.isArray(managerList) && (
                <ListenerListItem roomOwner={roomOwner} roomNo={roomNo} profile={profile} data={managerList} classNm="manager" />
              )}
            </div>

            <h4 className="subTitle">청취자</h4>
            <div className="userBox">
              {isLogin === true && Array.isArray(listenersList) && (
                <ListenerListItem
                  roomOwner={roomOwner}
                  roomNo={roomNo}
                  profile={profile}
                  data={listenersList}
                  classNm="listeners"
                />
              )}
            </div>
          </div>
        </DalbitScroll>
      </div>
    </>
  );
}
