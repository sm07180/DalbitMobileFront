import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";

// Context
import { BroadcastContext } from "context/broadcast_ctx";
import { GuestProvider } from "context/guest_ctx";
import { BroadcastLayerProvider } from "context/broadcast_layer_ctx";

//Test 용코드
import { GlobalContext } from "context";

// component
import SideWrapper from "./side_wrapper";

import { MediaType } from "./constant";

// others
import "./index.scss";
import {broadcastInfoNew} from "../../common/api";
import {useParams} from "react-router-dom";

export default function Broadcast() {
  const { globalState } = useContext(GlobalContext);
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { roomInfo, flipIsLeft } = broadcastState;
  const { roomNo } = useParams<{ roomNo: string }>();
  const { baseData } = globalState;

  useEffect(()=>{
    broadcastInfoNew({ roomNo }).then(res=>{
      if (res.result === "success") {
        const roomInfo = {
          ...res.data,
          currentMemNo: baseData.isLogin ? baseData.memNo : "",
          broadState: res.data.state !== 2,
        };
        broadcastAction.dispatchRoomInfo({
          type: "reset",
          data: roomInfo,
        });
        sessionStorage.setItem("broadcast_data", JSON.stringify(roomInfo));
      }
    });
  }, [baseData]);
  useEffect(()=>{
    if(!roomInfo){
      return
    }
    broadcastAction.setUserMemNo(roomInfo.bjMemNo);
  },[roomInfo]);
  return (
    <BroadcastLayerProvider>
      <GuestProvider>
        <div id="broadcast-page">
          <div
            className={`broadcastWrap ${roomInfo?.mediaType === MediaType.VIDEO && "video"} ${flipIsLeft === false &&
              "reverse"} ${broadcastState.isWide && "wide"} `}
          >
            <SideWrapper />
          </div>
        </div>
      </GuestProvider>
    </BroadcastLayerProvider>
  );
}
