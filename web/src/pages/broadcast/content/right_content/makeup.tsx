// React
import React, { useContext } from "react";

// Context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";

// static
import OriginalImg from "../../static/img_originalbox.svg";
import DailyImg from "../../static/img_makeup_daily.jpg";
import PinkImg from "../../static/img_makeup_pink.jpg";
import CoralImg from "../../static/img_makeup_coral.jpg";
import OrangeImg from "../../static/img_makeup_orange.jpg";
import WineImg from "../../static/img_makeup_wine.jpg";

const makeUpArray = [
  { img: OriginalImg, title: "Original" },
  { img: DailyImg, title: "Daily" },
  { img: PinkImg, title: "Pink" },
  { img: CoralImg, title: "Coral" },
  { img: OrangeImg, title: "Orange" },
  { img: WineImg, title: "Wine" },
];

const MakeUp = () => {
  const { globalState } = useContext(GlobalContext);

  const { broadcastState, broadcastAction } = useContext(BroadcastContext);

  const changeMakeUp = () => {
    if (globalState.rtcInfo) {
      const videoEffect = sessionStorage.getItem("videoEffect");
      if (videoEffect) {
        globalState.rtcInfo.effectChange(JSON.parse(videoEffect));
      }
    }
  };

  return (
    <div className="effectList">
      {makeUpArray.map((v, i) => {
        return (
          <button
            key={i}
            className={`effectItem
            ${v.title.toLocaleLowerCase() === broadcastState.videoEffect.makeUp.toLocaleLowerCase() && "active"}`}
            onClick={(e) => {
              const newEffectValue = {
                ...broadcastState.videoEffect,
                makeUp: v.title,
              };

              broadcastAction.setVideoEffect && broadcastAction.setVideoEffect(newEffectValue);
              sessionStorage.setItem("videoEffect", JSON.stringify(newEffectValue));

              changeMakeUp();
            }}
          >
            <div className="imageDim"></div>
            <img src={v.img} alt={`메이크업_${v.title}`} />
            <p>{v.title}</p>
          </button>
        );
      })}
    </div>
  );
};

export default MakeUp;
