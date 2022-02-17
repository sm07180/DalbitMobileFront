import React, { useEffect, useState, useRef, useContext } from "react";
// modules
import MicRecorder from "mic-recorder-to-mp3";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { GlobalContext } from "context";
import { selfAuthCheck } from "common/api";
import moment from "moment";
// components
import useCounter from "./counter";
import CircleTimer from "./circle_timer";
//fn
import { secToDateConvertorMinute, dateTimeFormat } from "lib/common_fn";
//scss
import "./record.scss";
//media flag
let mediaRecorder;
let chunks = [];

export default function castRecoding(props: any) {
  //history
  let history = useHistory();
  const lastLocation = useLastLocation();
  const { globalState, globalAction } = useContext(GlobalContext);
  //ref
  const audioRef = useRef<HTMLAudioElement>(null);
  //uesCounter element
  const { count, start, stop, reset } = useCounter(0, 1000);
  //initialState
  const [micState, setMicState] = useState(0);
  const [recordState, setRecordState] = useState(-1);
  // -1 : 녹음시작전 0 : 녹음중 1 : 녹음완료
  const [blobUrl, setBlobUrl] = useState("");
  // blob Url
  const [recordFile, setRecordFile] = useState({});
  // files
  const [playState, setPlayState] = useState(false);

  //playstate

  // record func
  const startRecording = () => {
    mediaRecorder.start().then(() => {
      if (mediaRecorder && mediaRecorder.activeStream.active) {
        setTimeout(() => {
          setRecordState(0);
          start();
        }, 400);
      }
    });
    // console.log(mediaRecorder);
    console.log("녹음시작!!");
  };

  const stopRecording = () => {
    mediaRecorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        const dateToday = moment(new Date()).format("YYYYMMDDHHmm");
        const file = new File(buffer, `${globalState.baseData.memNo}_${dateToday}.mp3`, {
          type: blob.type,
          lastModified: Date.now(),
        });
        setRecordFile(file);
        stop();
        setRecordState(1);
        setBlobUrl(blobURL);
      })
      .catch(() => {
        console.log("에러발생!!");
      });
  };

  // RESET FUNC
  const reRerecording = () => {
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: "다시 녹음하시겠습니까? \n  현재 녹음된 내용은 저장되지 않습니다.",
      callback: () => {
        setRecordState(-1);
        setPlayState(false);
        reset();
      },
    });
    // stopRecording();
    //-- reset record
    // startRecording();
    //-- start record
  };

  // TOGGLE PLAY & RECORD
  const toggleRecord = () => {
    if (recordState === -1) {
      startRecording();
    } else if (recordState === 0) {
      if (count < 30) {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "30초 이상 녹음해주세요.",
          callback: () => {},
        });
      } else if (count > 29) {
        stopRecording();
      }
    }
  };

  const togglePlay = () => {
    if (!playState) {
      playStart();
    } else {
      playPause();
    }
  };
  const playStart = () => {
    audioRef.current?.play();
    setPlayState(true);
  };

  const playPause = () => {
    audioRef.current?.pause();

    setPlayState(false);
  };

  // -----------------
  // mediaRecorder Api ChECK
  useEffect(() => {
    if (navigator.getUserMedia && window.MediaRecorder) {
      chunks = [];
      const onErr = () => {
        setMicState(0);
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "마이크 연결을 확인해주세요!",
          callback: () => {
            if (lastLocation?.pathname.includes("/modal")) {
              history.go(-2);
            } else {
              history.goBack();
            }
          },
        });
      };
      const onSuccess = (stream) => {
        // const MicRecorder = require("mic-recorder-to-mp3");
        mediaRecorder = new MicRecorder({
          bitRate: 128,
        });
        setMicState(1);
      };
      navigator.getUserMedia({ audio: true }, onSuccess, onErr);
    } else {
      console.log("Audio recording APIs not supported by this browser");
    }
  }, []);
  // -----------------
  // 10분제한
  useEffect(() => {
    // console.log(count);
    if (count > 599) stopRecording();
  }, [count]);
  // -----------------
  const validateRecoding = (recordFile) => {
    history.push({
      pathname: "/clip_upload",
      state: recordFile,
    });
  };

  const [authState, setAuthState] = useState(false);

  // useEffect(() => {
  //   //본인인증 체크
  //   const authCheck = async () => {
  //     const { result } = await selfAuthCheck();
  //     if (result === "fail") {
  //       history.push("/self_auth/self?type=create");
  //     } else {
  //       setAuthState(true);
  //     }
  //   };
  //   authCheck();
  // }, []);

  // if (!authState) return null;

  return (
    <React.Fragment>
      {micState === 1 && (
        <div id="recordWrap">
          <div className="headerTitle">클립 녹음</div>
          {(recordState === 0 || playState) && (
            <>
              <div className="volumeAniBox1"></div>
              <div className="volumeAniBox2"></div>
              <div className="volumeAniBox3"></div>
            </>
          )}

          {recordState === 1 ? (
            <button className="streamBtn" />
          ) : (
            <div style={{ zIndex: 5 }}>
              <button
                className={recordState === -1 ? "recordBtn" : recordState === 0 ? "stopBtn" : "recordBtn"}
                onClick={toggleRecord}
              />
            </div>
          )}
          {recordState === 0 && (
            <div style={{ position: `absolute`, top: `196px`, zIndex: 4 }}>
              <CircleTimer
                duration={600}
                loop={true}
                strokeWidth={8}
                size={100}
                toggleAni={false}
                trackColor="transparent"
                fillColor="rgba(255, 60, 123, 0.8)"
              />
            </div>
          )}
          {recordState === 1 && audioRef.current?.ended === false && count > 0 && (
            <div style={{ position: `absolute`, top: `196px`, zIndex: 4 }}>
              <CircleTimer
                duration={count}
                loop={true}
                strokeWidth={8}
                toggleAni={audioRef.current?.paused}
                size={100}
                //trackColor="#FF3C7B"
                trackColor="transparent"
                fillColor="rgba(255, 60, 123, 0.8)"
              />
            </div>
          )}

          {/* 10분게이지 */}
          {/* <div
            style={{ width: `${0.8 * count}px`, backgroundColor: "#FF3C7B", height: "10px", maxWidth: "240px", margin: "10px 0" }}
          ></div> */}
          {recordState !== -1 ? (
            <span className="recordCount recordCount--active">
              {recordState !== 1 && <em className="recordCount__recording" />}
              {secToDateConvertorMinute(count)}
            </span>
          ) : (
            <span className="recordCount">00:00</span>
          )}
          <p className="timeAlert">10분 동안 녹음이 진행됩니다.</p>

          <div className="recordControls">
            {recordState === 1 && (
              <>
                <div onClick={() => reRerecording()} className="reRecordWrap">
                  <button className="reRecordWrap__reRecordBtn" />
                  <span className="reRecordWrap__reRecordTitle">다시녹음</span>
                </div>
                <button onClick={togglePlay} className={playState ? "playBtn playBtn--stop" : "playBtn"} />
                <div onClick={() => validateRecoding(recordFile)} className="reRecordWrap">
                  <button className="reRecordWrap__submitBtn" />
                  <span className="reRecordWrap__reRecordTitle">완료</span>
                </div>
              </>
            )}
            {recordState === 1 && (
              <audio src={blobUrl} ref={audioRef} onPlay={playStart} onPause={playPause} controls style={{ display: "none" }} />
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
