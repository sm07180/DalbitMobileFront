// React
import React, { useContext } from "react";

// static
import OriginalImg from "../../static/img_originalbox.svg";
import DailyImg from "../../static/img_makeup_daily.jpg";
import PinkImg from "../../static/img_makeup_pink.jpg";
import CoralImg from "../../static/img_makeup_coral.jpg";
import OrangeImg from "../../static/img_makeup_orange.jpg";
import WineImg from "../../static/img_makeup_wine.jpg";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxVideoEffect} from "../../../../redux/actions/broadcastCtx";

const makeUpArray = [
  { img: OriginalImg, title: "Original" },
  { img: DailyImg, title: "Daily" },
  { img: PinkImg, title: "Pink" },
  { img: CoralImg, title: "Coral" },
  { img: OrangeImg, title: "Orange" },
  { img: WineImg, title: "Wine" },
];

const MakeUp = () => {
  const globalState = useSelector(({globalCtx})=> globalCtx);

  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);

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

              dispatch(setBroadcastCtxVideoEffect(newEffectValue));
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
