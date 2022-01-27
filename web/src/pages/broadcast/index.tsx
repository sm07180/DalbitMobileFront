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
import Layout from "../../common/layout";

export default function Broadcast() {
  const { broadcastState } = useContext(BroadcastContext);

  const { roomInfo, flipIsLeft } = broadcastState;
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
