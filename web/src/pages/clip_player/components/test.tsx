import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { duration } from "moment";
import { number } from "@storybook/addon-knobs";

export default function Clip() {
  const tabTypeData: any = [
    { value: "profile", title: "프로필" },
    { value: "gift_give", title: "선물하기" },
    { value: "playlist", title: "재생목록" },
    { value: "reply", title: "댓글" },
  ];

  const clipFiles = [
    { title: "곡1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "곡2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "곡3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [nowTime, setNowTime] = useState<any>(0);
  const [endTime, setEndTime] = useState<any>(0);
  const [offLeft, setOffLeft] = useState(0);
  const [offWidth, setOffWidth] = useState(0);
  const [dragInterval, setDragInterval] = useState(0);
  const [dragTime, setDragTime] = useState(0);
  const [dragState, setDragState] = useState(false);

  const [tabType, setTabType] = useState<any>("reply"); // type: profile, gift_give, playlist, reply

  useEffect(() => {
    if (audioRef) {
      console.log(audioRef);
      const { currentTime, duration } = audioRef.current!;
      console.log("currentTime", currentTime);
      console.log("duration", duration, typeof duration, audioRef.current!.duration);
      // settotalTime(Math.floor(duration));
      console.log(audioRef.current!.onloadedmetadata);
    }
  }, [audioRef]);

  const playUpdate = (e) => {
    console.log(e);
    console.log("ontimeUpdate", e.target.currentTime);
    const { currentTime } = e.target;
    setNowTime(currentTime);
  };

  const playStart = (e) => {
    console.log("onPlay", e);
  };

  const playPause = (e) => {
    console.log("onPause", e);
  };

  const playEnd = (e) => {
    console.log("onEnded", e);
  };

  const playLoad = (e) => {
    const { duration } = e.target;
    setEndTime(duration);
  };

  const settingPlayerTime = (isClicked, clickedTime) => {
    if (isClicked) {
      if (clickedTime <= 0) clickedTime = 0;
      if (clickedTime >= endTime) clickedTime = endTime;
      if (clickedTime !== -1) {
        audioRef.current!.currentTime = clickedTime;
      }
    } else {
      if (clickedTime !== -1) {
        audioRef.current!.currentTime = clickedTime;
      }
    }
  };

  useEffect(() => {
    setOffLeft(document.getElementById("playBar")!.offsetLeft);
    setOffWidth(document.getElementById("playBar")!.offsetWidth);
  }, []);

  return (
    <>
      <div id="clipPlayer">
        <div className="leftSide">
          <ClipPlayer>
            테스트중
            <audio
              controls
              src={clipFiles[1].url}
              autoPlay={true}
              ref={audioRef}
              onTimeUpdate={playUpdate}
              onPlay={playStart}
              onPause={playPause}
              onEnded={playEnd}
              onLoadedMetadata={playLoad}
            ></audio>
            {/* <span>{calcTime(nowTime)}</span>
            <span>{calcTime(endTime)}</span> */}
            <PlayBar
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
              <div className="track">
                <div
                  className="progress"
                  style={{ width: `${((dragState ? dragTime : nowTime > endTime ? endTime : nowTime) / endTime) * 100}%` }}
                >
                  <button></button>
                </div>
              </div>
            </PlayBar>
          </ClipPlayer>
        </div>

        <div className="rightSide">
          <div className="tabBox">
            {tabTypeData.map((tab, idx) => {
              const { value, title } = tab;
              return (
                <div
                  className={`tabBox__btnTab ${tabType === value ? "tabBox__btnTab--active" : ""}`}
                  onClick={() => setTabType && setTabType(value)}
                  key={`tab-${idx}`}
                >
                  {title}
                </div>
              );
            })}
          </div>
          <div className="tabContent"></div>
        </div>
      </div>
    </>
  );
}

const PlayBar = styled.div`
  margin-top: 20px;
  position: relative;
  width: 100%;
  height: 14px;
  cursor: pointer;
  .track {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    transform: translateY(-50%);
  }
  .progress {
    position: absolute;
    height: 6px;
    top: 50%;
    background: #632beb;
    transform: translateY(-50%);
  }
  button {
    position: absolute;
    right: -1px;
    top: -3px;
    width: 12px;
    height: 12px;
    border-radius: 10px;
    background: #632beb;
  }
`;

const ClipPlayer = styled.div`
  & > button {
    display: block;
    width: 100px;
    margin: 10px;
    border: 1px solid #000;
  }
  span + span {
    display: inline-block;
    margin-left: 10px;
    padding-left: 10px;
    border-left: 1px solid #000;
  }
`;
