import React, { useContext, useEffect, useState, useCallback } from "react";
import {useDispatch, useSelector} from "react-redux";

export default function ClipPlayerBar() {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { clipPlayer } = globalState;
  const { clipAudioTag } = clipPlayer!;

  const [nowTime, setNowTime] = useState<any>(0);
  const [endTime, setEndTime] = useState<any>(Math.floor(clipPlayer!.duration));
  const [offLeft, setOffLeft] = useState(0);
  const [offWidth, setOffWidth] = useState(0);
  const [dragInterval, setDragInterval] = useState(0);
  const [dragTime, setDragTime] = useState(0);
  const [dragState, setDragState] = useState(false);

  const calcTime = useCallback((time: any) => {
    const leadingZeros = (data) => {
      let zero = "";
      data = data.toString();
      if (data.length < 2) {
        for (var i = 0; i < 2 - data.length; i++) {
          zero += "0";
        }
      }
      return zero + data;
    };
    return `${leadingZeros(Math.floor(+time / 60))}:${leadingZeros(Math.floor(+time % 60))}`;
  }, []);

  const settingPlayerTime = (isClicked, clickedTime) => {
    if (isClicked) {
      if (clickedTime <= 0) clickedTime = 0;
      if (clickedTime >= endTime) clickedTime = endTime;
      if (clickedTime !== -1) {
        clipAudioTag!.currentTime = clickedTime;
      }
    } else {
      if (clickedTime !== -1) {
        clipAudioTag!.currentTime = clickedTime;
      }
    }
  };

  const playUpdate = useCallback((e) => {
    const { currentTime } = e.target;
    setNowTime(currentTime);
  }, []);

  const endTimeUpdate = useCallback(() => {
    setEndTime(clipAudioTag?.duration);
  }, []);

  useEffect(() => {
    setEndTime(clipAudioTag?.duration);
    setOffLeft(document.getElementById("playBar")!.offsetLeft);
    setOffWidth(document.getElementById("playBar")!.offsetWidth);

    clipAudioTag?.addEventListener("loadedmetadata", endTimeUpdate);
    clipAudioTag?.addEventListener("timeupdate", playUpdate);

    return () => {
      clipAudioTag?.removeEventListener("loadedmetadata", endTimeUpdate);
      clipAudioTag?.removeEventListener("timeupdate", playUpdate);
    };
  }, []);

  return (
    <div className="playerBarWrap">
      <span className="startTime">{calcTime(nowTime)}</span>

      <div
        className="playerBar"
        id="playBar"
        onMouseDown={(e) => {
          setDragState(true);
          settingPlayerTime(true, ((e.clientX - offLeft) / offWidth) * endTime);
        }}
        onMouseMove={(e) => {
          if (dragState) {
            let captureTime = ((e.clientX - offLeft) / offWidth) * endTime;
            if (captureTime < 0) captureTime = 0;
            if (dragInterval % 2 === 0) setDragTime(endTime < captureTime ? endTime : captureTime);
            if (dragInterval === 0) {
              setDragInterval(5);
              settingPlayerTime(true, captureTime);
            } else {
              setDragInterval(dragInterval - 1);
            }
          }
        }}
        onMouseLeave={() => {
          setDragState(false);
          settingPlayerTime(false, -1);
        }}
        onMouseUp={(e) => {
          let totalTime = ((e.clientX - offLeft) / offWidth) * endTime;
          if (totalTime < 0) totalTime = 0;
          setDragState(false);
          setDragTime(endTime < totalTime ? endTime : totalTime);
          settingPlayerTime(false, endTime < totalTime ? endTime : totalTime);
        }}
        onClick={(e) => {
          let totalTime = ((e.clientX - offLeft) / offWidth) * endTime;
          if (totalTime < 0) totalTime = 0;
          setDragState(false);
          setDragTime(endTime < totalTime ? endTime : totalTime);
          settingPlayerTime(false, endTime < totalTime ? endTime : totalTime);
        }}
      >
        <div className="playerBar__track">
          <div
            className="playerBar__progress"
            style={{ width: `${((dragState ? dragTime : nowTime > endTime ? endTime : nowTime) / endTime) * 100}%` }}
          >
            <button type="button" className="playerBar__btn"></button>
          </div>
        </div>
      </div>

      <span className="endTime">{calcTime(endTime)}</span>
    </div>
  );
}
