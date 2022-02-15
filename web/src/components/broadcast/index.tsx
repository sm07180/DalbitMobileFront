import React, {useContext, useEffect} from "react";
import {BroadcastContext} from "../../context/broadcast_ctx";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {broadcastInfoNew} from "../../common/api";
import {BroadcastLayerProvider} from "../../context/broadcast_layer_ctx";
import {GuestProvider} from "../../context/guest_ctx";
import {MediaType} from "../../pages/broadcast/constant";
import SideWrapper from "../../pages/broadcast/side_wrapper";
import { GlobalContext } from "context";

const BroadcastIndex = ()=>{
  const { globalState } = useContext(GlobalContext);
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { roomInfo, flipIsLeft } = broadcastState;
  const { roomNo } = useParams<{ roomNo: string }>();
  const dispatch = useDispatch();
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


  return (
    <BroadcastLayerProvider>
      <GuestProvider>
        <div id="broadcast-page">
          <div className={`broadcastWrap ${roomInfo?.mediaType === MediaType.VIDEO && "video"} ${!flipIsLeft && "reverse"} ${broadcastState.isWide && "wide"} `}>
            <SideWrapper />
          </div>
        </div>
      </GuestProvider>
    </BroadcastLayerProvider>
  );
}

export default BroadcastIndex
