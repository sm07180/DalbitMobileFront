// React
import React, { useContext } from "react";

// Context
import { BroadcastContext } from "context/broadcast_ctx";

import OriginalImg from "../../static/img_originalbox.svg";
import SepiaImg from "../../static/img_filter_sepia.jpg";
import GrayImg from "../../static/img_filter_gray.jpg";
import SaturateImg from "../../static/img_filter_saturate.jpg";
import BrightImg from "../../static/img_filter_bright.jpg";

const videoFilterArray = [
  { img: OriginalImg, title: "Normal" },
  { img: SepiaImg, title: "Sepia" },
  { img: GrayImg, title: "Gray" },
  { img: SaturateImg, title: "Saturate" },
  { img: BrightImg, title: "Bright" },
];

const VideoFilter = () => {
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);

  return (
    <div className="effectList">
      {videoFilterArray.map((v, i) => {
        return (
          <button
            key={i}
            className={`effectItem ${v.title.toLocaleLowerCase() === broadcastState.videoEffect.filter.toLocaleLowerCase() &&
              "active"}`}
            onClick={(e) => {
              const newEffectValue = {
                ...broadcastState.videoEffect,
                filter: v.title,
              };
              broadcastAction.setVideoEffect && broadcastAction.setVideoEffect(newEffectValue);

              sessionStorage.setItem("videoEffect", JSON.stringify(newEffectValue));
            }}
          >
            <div className="imageDim"></div>
            <img src={v.img} alt={`필터_${v.title}`} />
            <p>{v.title}</p>
          </button>
        );
      })}
    </div>
  );
};

export default VideoFilter;
