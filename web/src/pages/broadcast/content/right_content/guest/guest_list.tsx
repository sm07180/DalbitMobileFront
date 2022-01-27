import React, { useCallback, useEffect, useState, useContext } from "react";

import { guestManagement, guest, getBroadcastListeners } from "common/api";

import { GuestContext } from "context/guest_ctx";
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";

import { DalbitScroll } from "common/ui/dalbit_scroll";
import NoResult from "common/ui/no_result";
import GuestItem from "./guest_item";

import "./index.scss";

export default function GuestList(props: any) {
  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastState } = useContext(BroadcastContext);
  const { guestState, guestAction } = useContext(GuestContext);

  const { guestInfo } = globalState;

  const [guestList, setGuestList] = useState<Array<any>>([]);
  const [empty, setEmpty] = useState(false);

  async function fetchData() {
    const { data, result } = await guestManagement({
      roomNo: props.roomNo,
      page: 1,
      records: 1000,
    });

    if (result === "success") {
      if (data.list.length > 0) {
        setGuestList(data.list);
        setEmpty(false);
      } else {
        setGuestList([]);
        setEmpty(true);
      }
    }
  }

  const exitGuest = useCallback(async (item: any) => {
    globalAction.setAlertStatus!({
      type: "confirm",
      status: true,
      content: `${item.nickNm}님의 게스트 연결을\n종료하시겠습니까?`,
      callback: async () => {
        await guest({
          roomNo: props.roomNo,
          memNo: item.memNo,
          mode: 6,
        });
      },
    });
  }, []);

  const cancleGuest = useCallback((item: any) => {
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: `${item.nickNm}님의 게스트 초대를\n취소하시겠습니까?`,
      callback: async () => {
        const res = await guest({
          roomNo: props.roomNo,
          memNo: item.memNo,
          mode: 2,
        });
      },
    });
  }, []);

  const inviteGuest = useCallback(
    async (memNo: string) => {
      const { result, data, message } = await getBroadcastListeners({
        roomNo: props.roomNo,
        page: 1,
        records: 10000,
      });

      if (result === "success") {
        if (data.hasOwnProperty("list") && data.list.length > 0) {
          if (
            data.list.findIndex((v) => {
              return v.memNo === memNo;
            }) < 0
          ) {
            globalAction.setAlertStatus!({
              status: true,
              content: "방송방에 존재하지 않는 사용자입니다.",
            });
            return;
          }
        } else {
          globalAction.setAlertStatus!({
            status: true,
            content: "방송방에 존재하지 않는 사용자입니다.",
          });
          return;
        }

        if (guestState.guestConnectStatus === true) {
          globalAction.setAlertStatus!({
            status: true,
            content: "이미 방송 중인 게스트가 있습니다.\br게스트 연결종료 후 게스트를 초대해주세요.",
          });
        } else {
          const res = await guest({
            roomNo: props.roomNo,
            memNo: memNo,
            mode: 1,
          });
          if (res.result === "success") {
            globalAction.callSetToastStatus!({
              status: true,
              message: "게스트 초대 요청을 보냈습니다.",
            });
          } else {
            globalAction.callSetToastStatus!({
              status: true,
              message: res.message,
            });
          }
        }
      } else {
      }
    },
    [guestState.guestStatus, guestState.guestConnectStatus]
  );

  useEffect(() => {
    fetchData();
  }, [guestState.guestStatus, broadcastState.userCount, guestInfo]);

  useEffect(() => {
    guestAction.setNewApplyGuest!(false);
  }, []);

  return (
    <div id="GuestWrap">
      <h3 className="title">게스트 관리</h3>
      <div className="guestListWrap">
        {guestList.length > 0 &&
          guestList.map((v, i) => {
            return (
              <React.Fragment key={i}>
                <GuestItem item={v} exitGuest={exitGuest} inviteGuest={inviteGuest} cancleGuest={cancleGuest} />
              </React.Fragment>
            );
          })}

        {empty && <NoResult text="게스트가 없습니다." />}
      </div>
    </div>
  );
}
