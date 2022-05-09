import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";

// Context
import { GuestProvider } from "context/guest_ctx";
import { BroadcastLayerProvider } from "context/broadcast_layer_ctx";

// component
import SideWrapper from "./side_wrapper";

import { MediaType } from "./constant";

// others
import "./index.scss";
import {broadcastInfoNew} from "../../common/api";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxRoomInfoReset, setBroadcastCtxUserMemNo} from "../../redux/actions/broadcastCtx";

export default function Broadcast() {
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
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
        dispatch(setBroadcastCtxRoomInfoReset(roomInfo));
        sessionStorage.setItem("broadcast_data", JSON.stringify(roomInfo));
      }
    });
  }, [baseData]);
  return (
    <BroadcastLayerProvider>
      <GuestProvider>
        <div id="broadcast-page">
          <div
            className={`broadcastWrap ${roomInfo?.mediaType === MediaType.VIDEO ? "video" : "radio"} ${flipIsLeft === false &&
              "reverse"} ${broadcastState.isWide && "wide"} `}
          >
            <SideWrapper />
          </div>
        </div>
      </GuestProvider>
    </BroadcastLayerProvider>
  );
}
