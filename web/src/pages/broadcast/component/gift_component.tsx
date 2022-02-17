// React
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Lottie from "react-lottie";

import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// Component
import GiftList from "../content/right_content/gift_list";
import GiftLayer from "../content/right_content/send_gift";

// static
import presentAnimation from "../static/chat-present.json";
import {useDispatch, useSelector} from "react-redux";

const GiftComponent = (props: { roomNo: string; roomInfo: roomInfoType; roomOwner: boolean | null }) => {
  const { roomInfo, roomNo, roomOwner } = props;

  const history = useHistory();
  const globalState = useSelector(({globalCtx})=> globalCtx);

  const { layer, dispatchLayer } = useContext(BroadcastLayerContext);

  const [animationStop, setAnimationStop] = useState<boolean>(false);

  const lottieIconClick = useCallback(
    (e) => {
      if (globalState.baseData.isLogin === false) {
        return history.push("/login");
      }
      if (layer.status) {
        dispatchLayer({
          type: "INIT",
        });
      } else {
        dispatchLayer({
          type: "GIFT",
          others: {
            guestClicked: false,
            itemNo: "",
            cnt: 0,
          },
        });
      }
    },
    [globalState.baseData.isLogin, layer]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationStop(!animationStop);
    }, 4500);

    return () => {
      clearInterval(intervalId);
    };
  }, [animationStop]);

  return (
    <div
      className="giftWrap"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="lottie-wrap" onClick={lottieIconClick}>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: presentAnimation,
          }}
          isClickToPauseDisabled={true}
          width={54}
          height={54}
          isStopped={animationStop}
        />
      </div>
      {layer.status === true && layer.type === "GIFT" && (
        <>
          {roomOwner === true && (
            <>{layer.others.guestClicked === true ? <GiftLayer {...props} /> : <GiftList roomNo={roomNo} />}</>
          )}

          {roomOwner === false && <GiftLayer {...props} />}
        </>
      )}
    </div>
  );
};

export default GiftComponent;
