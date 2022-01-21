// React
import React, { useContext, useCallback } from "react";

// Context
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// Component
import BroadcastEndByDj from "../content/broadcast_end/dj_layer";
import BroadcastEndByListener from "../content/broadcast_end/listener_layer";
import DirectGift from "../content/direct_gift_layer";
import LevelUp from "../content/level_up_layer";
import FullMoon from "../content/broadcast_moon_layer/moon_layer";
import RouletteLayer from "../content/roulette_layer";
import MoonLandPop from "../content/moon_land_pop";

export default () => {
  const { dimLayer, dispatchDimLayer } = useContext(BroadcastLayerContext);

  const SwitchRendered = useCallback(() => {
    switch (dimLayer.type) {
      case "BROAD_END":
        if (dimLayer.others.roomOwner === true) {
          return <BroadcastEndByDj />;
        } else {
          return <BroadcastEndByListener />;
        }
      case "DIRECT_GIFT":
        return <DirectGift />;
      case "LEVEL_UP":
        return <LevelUp />;
      case "FULL_MOON":
        return <FullMoon />;
      case "ROULETTE":
        return <RouletteLayer roomOwner={dimLayer.others.roomOwner} />;
      case "MOON_LAND":
        const {data, roomOwner} = dimLayer.others;
        let validBool = false;
        if(data && Object.keys(data) && data.hasOwnProperty('items') && data.hasOwnProperty('items')) {
          validBool = true;
        }
        return <MoonLandPop roomOwner={roomOwner} data={validBool?data: null}/>;
      default:
        return <> </>;
    }
  }, [dimLayer]);

  return (
    <div
      id="modal"
      onClick={(e) => {
        e.stopPropagation();
        dispatchDimLayer({
          type: "INIT",
        });
      }}
    >
      <SwitchRendered />
    </div>
  );
};
