import React, {DispatchWithoutAction, useCallback, useContext, useEffect, useReducer, useRef, useState,} from "react";
import {useHistory} from "react-router-dom";

// static
import {
  broadcastAllExit,
  broadcastCheck,
  broadcastCreate,
  broadcastExit,
  getBroadcastSetting,
  postImage,
} from "common/api";
// others
import {AgoraHostRtc, HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import "./broadcast_setting.scss";
// lib
import getDecibel from "./lib/getDecibel";
import LayerCopyright from "../../common/layerpopup/contents/copyright";
import LayerTitle from "./content/title";
import LayerWelcome from "./content/welcome";
import {MediaType} from "pages/broadcast/constant";
import AgoraRTC from 'agora-rtc-sdk-ng';
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxMessage, setGlobalCtxRtcInfoEmpty,
  setGlobalCtxRtcInfoInit,
  setGlobalCtxSetToastStatus
} from "../../redux/actions/globalCtx";
import {setBroadcastCtxExtendTime} from "../../redux/actions/broadcastCtx";

declare global {
  interface Window {
    webkitAudioContext: any;
  }
}

//type
type State = {
  micState: boolean;
  videoState: boolean;
  entryType: number;
  roomType: string;
  bgChange: string;
  titleChange: string;
  welcomeMsgChange: string;
  imageType: number;
  mediaType: string;
  micFormType:string;
  camFormType:string;
};

type localTracksType = {
  videoTrack?: any,
  audioTrack?: any
};
let localTracks: localTracksType = {}
let mics:any = []; // all microphones devices you can use
let cams:any = []; // all cameras devices you can use
let currentMic; // the microphone you are using
let currentCam; // the camera you are using

//action type
type Action =
  | { type: "SET_MICSTATE"; micState: boolean }
  | { type: "SET_ENTRY"; entryType: number }
  | { type: "SET_ROOMTYPE"; roomType: string }
  | { type: "SET_BGCHANGE"; bgChange: string }
  | { type: "SET_TITLECHANGE"; titleChange: string }
  | { type: "SET_WELCOMEMSG"; welcomeMsgChange: string }
  | { type: "SET_IMAGETYPE"; imageType: number }
  | { type: "SET_MEDIATYPE"; mediaType: string }
  | { type: "SET_VIDEOSTATE"; videoState: boolean }
  | { type: "SET_MICFORM"; micFormType: string }
  | { type: "SET_CAMFORM"; camFormType: string };


//broad Reducer
function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_MICSTATE":
      return {
        ...state,
        micState: action.micState,
      };
    case "SET_VIDEOSTATE":
      return {
        ...state,
        videoState: action.videoState,
      };
    case "SET_ENTRY":
      return {
        ...state,
        entryType: action.entryType,
      };
    case "SET_MICFORM":
      return {
        ...state,
        micFormType: action.micFormType,
      };
    case "SET_CAMFORM":
      return {
        ...state,
        camFormType: action.camFormType,
      };
    case "SET_ROOMTYPE":
      return {
        ...state,
        roomType: action.roomType,
      };
    case "SET_BGCHANGE":
      return {
        ...state,
        bgChange: action.bgChange,
      };
    case "SET_TITLECHANGE":
      return {
        ...state,
        titleChange: action.titleChange,
      };
    case "SET_WELCOMEMSG":
      return {
        ...state,
        welcomeMsgChange: action.welcomeMsgChange,
      };
    case "SET_IMAGETYPE":
      return {
        ...state,
        imageType: action.imageType,
      };
    case "SET_MEDIATYPE":
      return {
        ...state,
        mediaType: action.mediaType,
      };
    default:
      throw new Error("error");
  }
}

let streamInterval;

let constraint = {
  video: false,
  audio: true,
};

export default function BroadcastSetting() {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const modalState = useSelector(({modalCtx}) => modalCtx);

  const titleInputRef = useRef<any>();
  const { chatInfo, rtcInfo } = globalState;

  const [state, dispatchWithoutAction] = useReducer(reducer, {
    micState: false,
    videoState: false,
    entryType: 0,
    roomType: "03",
    bgChange: "",
    titleChange: "",
    welcomeMsgChange: "",
    imageType: IMAGE_TYPE.PROFILE,
    mediaType: BROAD_TYPE.AUDIO,
    micFormType:"",
    camFormType:""
  });

  // audio stream state
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioGauge, setAudioGauge] = useState<number>(0);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  //img state
  const [broadBg, setBroadBg] = useState<string | ArrayBuffer>("");

  // broadcastSetting
  const [broadcastOptionMsg, setBroadcastOptionMsg] = useState<any>({});
  const [popupState, setPopupState] = useState<boolean>(false);
  const [popupCopyright, setPopupCopyright] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<boolean>(false);
  const [popupWelcome, setPopupWelcome] = useState<boolean>(false);

  //mic cam List Pop
  const [camPop, setCamPop] = useState<boolean>(false);
  const [micPop, setMicPop] = useState<boolean>(false);

  // dispatch function
  const setMicState = (status: boolean) =>
    dispatchWithoutAction({ type: "SET_MICSTATE", micState: status });
  const setVideoState = (status: boolean) =>
    dispatchWithoutAction({ type: "SET_VIDEOSTATE", videoState: status });

  const setEntry = useCallback((access_type: ACCESS_TYPE) => {
    dispatchWithoutAction({ type: "SET_ENTRY", entryType: access_type });
  }, []);

  const setMicForm = useCallback((micFormType: string) => {
    dispatchWithoutAction({ type: "SET_MICFORM", micFormType: micFormType });
  }, []);

  const setCamForm = useCallback((camFormType: string) => {
    dispatchWithoutAction({ type: "SET_CAMFORM", camFormType: camFormType });
  }, []);

  const setRoomType = useCallback(
    (value) =>
      dispatchWithoutAction({
        type: "SET_ROOMTYPE",
        roomType: value,
      }),
    []
  );
  const setBgChange = (value) =>
    dispatchWithoutAction({
      type: "SET_BGCHANGE",
      bgChange: value,
    });
  const setTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 20) return;
    dispatchWithoutAction({ type: "SET_TITLECHANGE", titleChange: value });
  };
  const setWelcomeMsg = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 100) return;
    dispatchWithoutAction({ type: "SET_WELCOMEMSG", welcomeMsgChange: value });
  };

  //?????? ?????? ????????? ??????
  const BgImageUpload = (e: any) => {
    if (e.currentTarget.files.length === 0) return;
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    const file = e.target.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileSplited = fileName.split(".");
    const fileExtension = fileSplited.pop().toLowerCase();
    const extValidator = (ext: string) => {
      const list = ["jpg", "jpeg", "png", "gif"];
      return list.includes(ext);
    };

    if (fileExtension !== undefined && !extValidator(fileExtension)) {
      return alert("jpg, png, gif ???????????? ?????? ???????????????.");
    }
    if (fileExtension === "gif" && fileSize > 5000000) {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "GIF ?????? ????????? ?????? 5MB??? ?????? ??? ????????????.",
      }));
      return;
    }
    reader.onload = async () => {
      if (reader.result) {
        const { result, data, message } = await postImage({
          dataURL: reader.result,
          uploadType: "bg",
        });

        if (result === "success") {
          if (data instanceof Object) {
            setBroadBg(reader.result);
            setBgChange(data.path);
          } else {
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              content: "????????? ???????????? ?????????????????????.\n?????? ??????????????????",
            }));
            return;
          }
        } else {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content: message,
          }));
        }
      }
    };
  };

  // ????????? ??????
  const onSubmit = () => {
    if (state.titleChange.length < 3) {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }

      return dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "?????? ????????? 3??? ?????? ??????????????????",
      }));
    }

    if (state.micState === false) {
      return dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: `????????? ?????? ????????? ??????????????????.`,
      }));
    }

    if (state.mediaType === MediaType.VIDEO && state.videoState === false) {

      return dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "??? ?????? ????????? ??????????????????.",
      }));
    }

    if (state.micState === true && state.titleChange.length > 2) {
      createBroadcastRoom();
    }
  };

  async function createBroadcastRoom() {
    if (audioStream !== null) {
      removeStream();
    }
    if (videoStream !== null) {
      removeVideoStream();
    }
    Object.keys(localTracks).forEach(trackName => {
      let track = localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        localTracks[trackName] = undefined;
      }
    })
    const makeRoom = async () => {
      const createInfo = {
        roomType: state.roomType,
        title: state.titleChange,
        bgImg: state.bgChange,
        welcomMsg: state.welcomeMsgChange,
        entryType: state.entryType,
        notice: "",
        imageType: state.imageType,
        djListenerIn: broadcastOptionMsg.djListenerIn ? true : false,
        djListenerOut: broadcastOptionMsg.djListenerOut ? true : false,
        mediaType: state.mediaType
      };

      const { result, data, message, code } = await broadcastCreate(createInfo);
      if (result === "success") {
        if(data.platform === "wowza"){
          // ??? ?????? ??????
          const videoConstraints = {
            isVideo: data.mediaType === MediaType.VIDEO,
            videoFrameRate: data.videoFrameRate,
            videoResolution: data.videoResolution,
          };
          const newRtcInfo = new HostRtc(
              UserType.HOST,
              data.webRtcUrl,
              data.webRtcAppName,
              data.webRtcStreamName,
              data.roomNo,
              false,
              videoConstraints
          );
          newRtcInfo.setRoomInfo({...data, micState: true,});
          newRtcInfo.publish();
          dispatch(setGlobalCtxRtcInfoInit(newRtcInfo));
          sessionStorage.setItem("wowza_rtc", JSON.stringify({roomInfo:newRtcInfo.roomInfo, userType:newRtcInfo.userType}));
          sessionStorage.setItem("room_no", data.roomNo);
          dispatch(setBroadcastCtxExtendTime(false))
          try {
            if (window.fbq) window.fbq("track", "RoomMake");
            if (window.firebase) window.firebase.analytics().logEvent("RoomMake");
          } catch (e) {}

          history.replace(`/broadcast/${data.roomNo}`);
        }else if (data.platform === "agora"){
          if(!data.agoraToken){
            console.log(`broadcast_setting not found agoraToken`)
            return;
          }
          const videoConstraints = { isVideo: data.mediaType === MediaType.VIDEO };
          const dispatchRtcInfo = new AgoraHostRtc(UserType.HOST, data.webRtcUrl, data.webRtcAppName, data.webRtcStreamName, data.roomNo, false, videoConstraints);
          dispatchRtcInfo.setRoomInfo(data);
          dispatchRtcInfo.join(data).then(()=>{
            dispatch(setGlobalCtxRtcInfoInit(dispatchRtcInfo));
            sessionStorage.setItem("agora_rtc", JSON.stringify({roomInfo:dispatchRtcInfo.roomInfo, userType:dispatchRtcInfo.userType}));
          });
          try {
            if (window.fbq) window.fbq("track", "RoomMake");
            if (window.firebase) window.firebase.analytics().logEvent("RoomMake");
          } catch (e) {}

          history.replace(`/broadcast/${data.roomNo}`);
        }else{
          console.log(`broadcast_setting platform error ...`, data.platform)
        }
      } else if (result === "fail") {
        if (code === "-6") {
          return (
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              content: message,
              callback: () => {
                history.push("/self_auth/self?type=create");
              },
            })
          ));
        }
        dispatch(setGlobalCtxAlertStatus({ status: true, content: message }));
      }
    };

    const { result, data } = await broadcastCheck();
    if (result === "success") {
      if (data) {
        const { roomNo } = data;
        const exit = await broadcastExit({ roomNo });

        if (exit.result === "success") {
          rtcSessionClear();
          if (chatInfo && chatInfo !== null) {
            chatInfo.privateChannelDisconnect();
          }
          if (rtcInfo && rtcInfo !== null) {
            rtcInfo!.stop();
            dispatch(setGlobalCtxRtcInfoEmpty());
          }
          return makeRoom();
        }
      }
    }

    return makeRoom();
  }

  const detectStreamDevice = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    let micDeivceExist: boolean = false;
    let videoDeviceExist: boolean = false;
    devices.forEach((d) => {
      if (d.kind === "audioinput") {
        micDeivceExist = true;
      }

      if (d.kind === "videoinput") {
        videoDeviceExist = true;
      }
    });

    if (micDeivceExist === false) {
      if (audioStream !== null) {
        removeStream();
      }
      setAudioStream(null);
    } else if (micDeivceExist === true) {
      const stream = await setStream();
      setAudioStream(stream);
    }

    if (videoDeviceExist === false) {
      if (videoStream !== null) {
        removeVideoStream();
      }
    } else if (videoDeviceExist === true) {
      if (videoStream === null) {
        const stream = await setStream();
        setVideoStream(stream);
      }
    }
  }, [videoStream, audioStream]);

  const setStream = useCallback(async () => {
    navigator.mediaDevices.removeEventListener(
      "devicechange",
      detectStreamDevice
    );
    navigator.mediaDevices.addEventListener("devicechange", detectStreamDevice);

    const stream = await navigator.mediaDevices
      .getUserMedia(constraint)
      .then((stream) => {
        return stream;
      })
      .catch((e) => {
        return null;
      });

    return stream;
  }, [videoStream, audioStream]);

  const removeStream = useCallback(async () => {
    navigator.mediaDevices.removeEventListener(
      "devicechange",
      detectStreamDevice
    );
    audioStream?.getTracks().forEach((track) => track.stop());
    setAudioGauge(0);
    setMicState(false);
  }, [audioStream]);

  const removeVideoStream = useCallback(async () => {
    navigator.mediaDevices.removeEventListener(
      "devicechange",
      detectStreamDevice
    );
    videoStream?.getTracks().forEach((track) => track.stop());
    //setVideoState(false);
  }, [videoStream]);

  const videoDevice = async () =>{
    //setVideoStream(null);
    cams = await AgoraRTC.getCameras();

    if (videoStream === null) {
      const result = await setStream();
      if(result === null){
        let message
        //?????? ?????? ?????? ??????
        currentCam = cams[1];
        if(currentCam === undefined){
          message = "?????? ?????? ????????? ????????? ????????? ????????????.\n??????????????? ??????????????????."
        }else{
          message = "?????? ?????? ?????? ?????????????????? ?????? ????????? \n??????????????????." +
            " ?????? ?????? ????????? ??????????????????"
        }
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: message
        }))
        if(currentCam !== undefined){
          sessionStorage.setItem("cam", JSON.stringify(currentCam.deviceId));
          localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: {
              width: 1280,
              // Specify a value range and an ideal value
              height: { ideal: 720, min: 720, max: 1280 },
              frameRate: 24,
              bitrateMin: 500, bitrateMax: 1700,
            },cameraId:currentCam.deviceId})
          localTracks.videoTrack.play("pre-local-player",{mirror:false});
        }
        setVideoStream(result);
        setCamForm("????????? ?????? ????????????.")
      }else{
        currentCam = cams[0];
        sessionStorage.setItem("cam", JSON.stringify(currentCam.deviceId));
        localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: {
            width: 1280,
            // Specify a value range and an ideal value
            height: { ideal: 720, min: 720, max: 1280 },
            frameRate: 24,
            bitrateMin: 500, bitrateMax: 1700,
          },cameraId:currentCam.deviceId})
        localTracks.videoTrack.play("pre-local-player",{mirror:false});
        setVideoStream(result);
        setCamForm(currentCam.label)
      }

      if(currentCam !==null){
        setVideoState(true)
      }
    }
  }

  const audioDevice = async () => {
    mics = await AgoraRTC.getMicrophones();
    currentMic = mics[0];
    setMicForm(currentMic.label)
    if(currentMic !== null){
      setMicState(true)
    }
    sessionStorage.setItem("mic", JSON.stringify(currentMic.deviceId));
    localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: {
        sampleRate: 48000,
        stereo: true,
        bitrate: 192,
      },microphoneId:currentMic.deviceId})
    // get mics

    //$(".mic-input").val(currentMic.label);
    //$(".cam-input").val(currentCam.label);

  }

  async function switchCamera(label) {
    let constraints = {video: true, audio: true};
    currentCam = cams.find(cam => cam.label === label);
    if(videoStream !== null){
      let camInfo = currentCam.camId;
      // @ts-ignore
      constraints = {video: {deviceId: {exact: camInfo}}, audio: true};
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }).catch((error) => {
        if (error.name === 'NotReadableError' || error.name === 'AbortError') {
          //?????? ?????? ?????? ??????
          let message = "?????? ?????? ?????? ?????????????????? ?????? ????????? \n??????????????????." +
            " ?????? ?????? ????????? ??????????????????"
          dispatch(setGlobalCtxMessage({type:'alert',
            msg: message
          }))
        }
      });
    }

    // switch device of local video track.
    let optionalParams = currentCam.deviceId;
    await localTracks.videoTrack.setDevice(optionalParams);
    sessionStorage.setItem("cam", JSON.stringify(optionalParams));
  }

  async function switchMicrophone(label) {
    currentMic = mics.find(mic => mic.label === label);
    // switch device of local audio track.
    let optionalParams = currentMic.deviceId;
    await localTracks.audioTrack.setDevice(optionalParams);
    sessionStorage.setItem("mic", JSON.stringify(optionalParams));
  }
  const clickEvent = (e) => {
    //e.preventDefault();
    if(camPop) setCamPop(false);
    if(micPop) setMicPop(false);
  }
  useEffect(() => {
    if (typeof document !== 'undefined') {
      window.addEventListener('click', clickEvent);
      return () => {
        window.removeEventListener('click', clickEvent);
      }
    }
  });
  useEffect(() => {
    async function initDeviceAudioStream() {
      const stream = await setStream();
      setAudioStream(stream);
    }

    if (audioStream === null) {
      initDeviceAudioStream();
    }

    let audioCheckerId: number | null = null;

    const audioCtx = (() => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      return audioCtx;
    })();

    if (audioStream !== null) {
      const audioSource = audioCtx.createMediaStreamSource(audioStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      audioSource.connect(analyser);

      audioCheckerId = setInterval(() => {
        const db = getDecibel(analyser);
        setAudioGauge(db);
        if (db > 3) {
          setMicState(true);
        }
      }, 30);
    }

    return () => {
      if (audioStream !== null) {
        removeStream();
      }

      if (audioCheckerId !== null) {
        clearInterval(audioCheckerId);
      }
      Object.keys(localTracks).forEach(trackName => {
        let track = localTracks[trackName];
        if (track) {
          track.stop();
          track.close();
          localTracks[trackName] = undefined;
        }
      })
      audioCtx.close();
    };
  }, [audioStream]);

  useEffect(() => {
    if (state.mediaType === BROAD_TYPE.AUDIO) {
      audioDevice();
      constraint = {
        ...constraint,
        video: false,
      };
    } else {
      constraint = {
        ...constraint,
        video: true,
      };
        videoDevice();

    }
    return ()=>{
      if(videoStream !== null){
        removeVideoStream()
      }
    }
  }, [state.mediaType,videoStream]);

  useEffect(() => {
    if (rtcInfo !== null) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        title: "??????",
        content: `?????? ${
          rtcInfo.userType === UserType.HOST ? "??????" : "??????"
        } ?????? ????????? ?????????????????????????`,
        callback: () => {
          if (chatInfo !== null && rtcInfo !== null) {
            chatInfo.privateChannelDisconnect();
            rtcInfo.socketDisconnect();
            rtcInfo.stop();
            dispatch(setGlobalCtxRtcInfoEmpty());
            rtcSessionClear();
            broadcastAllExit();
          }
        },
        cancelCallback: () => {
          history.goBack();
        },
      }));
    }
  }, []);

  const fetchBroadcastSetting = useCallback(async () => {
    const { result, data } = await getBroadcastSetting();

    if (result === "success") {
      setBroadcastOptionMsg(data);
    }
  }, []);

  useEffect(() => {
    if (
      modalState.broadcastOption.title !== "" &&
      modalState.broadcastOption.title
    ) {
      dispatchWithoutAction({
        type: "SET_TITLECHANGE",
        titleChange: modalState.broadcastOption.title,
      });
    }
    if (
      modalState.broadcastOption.welcome !== "" &&
      modalState.broadcastOption.welcome
    ) {
      dispatchWithoutAction({
        type: "SET_WELCOMEMSG",
        welcomeMsgChange: modalState.broadcastOption.welcome,
      });
    }
  }, [modalState.broadcastOption.title, modalState.broadcastOption.welcome]);

  useEffect(() => {
    fetchBroadcastSetting();
  }, []);

  useEffect(() => {
    if (popupState === false) {
      if (popupCopyright) {
        setPopupCopyright(false);
      } else if (popupTitle) {
        setPopupTitle(false);
      } else if (popupWelcome) {
        setPopupWelcome(false);
      }
    }
  }, [popupState]);

  const setMediaType = (mediaType:BROAD_TYPE)=>{
    dispatchWithoutAction({type: "SET_MEDIATYPE", mediaType: mediaType});
    //broadcastAction.dispatchRoomInfo({type:'broadcastSettingUpdate', data:{platform:mediaType === BROAD_TYPE.AUDIO ? 'wowza' : 'agora'}})
  }

  return (
    <>
        <div className="broadcastSetting">
          <div className="headerTitle">????????????</div>

          {/* ?????? ?????? */}
          <div className="title">????????? ??????</div>
          <ul className="access">
            <li
              onClick={() => {
                setMediaType(BROAD_TYPE.VIDEO);
              }}
              className={
                state.mediaType == BROAD_TYPE.VIDEO
                  ? "access__list active"
                  : "access__list"
              }
            >
              VIDEO
            </li>
            <li
              onClick={() => {
                setMediaType(BROAD_TYPE.AUDIO);
              }}
              className={
                state.mediaType == BROAD_TYPE.AUDIO
                  ? "access__list active"
                  : "access__list"
              }
            >
              RADIO
            </li>
          </ul>

          <div className="title">????????? ??????</div>
          <div className="access" style={{zIndex:3}}>
            <div
              onClick={() => {
                  setMicPop(!micPop);
              }}
              className={`access__list ${state.micState && "active"}`}
            >
              {state.micFormType}
            </div>
            <div className={`access__select ${!micPop &&'hidden'}`}>
              {mics.map((item, index) => {
                return(
                  <div className="access__option"
                    key={index}
                    onClick={() => {
                      if(state.micFormType !== item.label){
                        setMicForm(item.label);
                        switchMicrophone(item.label)
                        setMicPop(false);
                      }
                    }}
                  >{item.label}</div>
                )
              })}
            </div>
          </div>
          {state.mediaType === BROAD_TYPE.VIDEO && (
            <>
              <div className="title">??????/????????? ?????? ??????</div>
              {/*<div id="localVideoSection"/>*/}
              <div className="access" style={{zIndex:2}}>
                <div
                  onClick={() => {
                    setCamPop(!camPop);
                  }}
                  className={"access__list active"}
                >
                  {state.camFormType}
                </div>
                <div className={`access__select ${!camPop &&'hidden'}`}>
                  {cams.map((item, index) => {
                    return(
                      <div className="access__option"
                           key={index}
                           onClick={() => {
                             if(state.camFormType !== item.label){
                               setCamForm(item.label);
                               switchCamera(item.label)
                               setCamPop(false);
                             }
                           }}
                      >{item.label}</div>
                    )
                  })}
                </div>
              </div>

              <div id="pre-local-player" style={{marginTop:20}}/>
            </>
          )}
          {/*????????? ????????? ????????? ?????? ????????????*/}
          {/*        <div className="title">????????????</div>
          <ul className="access">
            {PlatForm.map(
              (item: { name: string; id: string }, idx: number) => {
                return (
                  <li
                    key={idx}
                    onClick={() => {
                      setPlatForm(item.id);
                    }}
                    className={
                      state.platFormType == item.id
                        ? "access__list active"
                        : "access__list"
                    }
                  >
                    {item.name}
                  </li>
                );
              }
            )}
          </ul>*/}


          {/* ???????????? ????????????????????? */}
          <div className="title">????????????</div>
          <ul className="access">
            {AccessList.map(
              (item: { name: string; id: number }, idx: number) => {
                return (
                  <li
                    key={idx}
                    onClick={() => {
                      setEntry(item.id);
                      if (item.id === ACCESS_TYPE.ADULT) {
                        dispatch(setGlobalCtxSetToastStatus({
                          status: true,
                          message: "20??? ?????? ?????? ?????? ??? ????????????",
                        }));
                      }
                    }}
                    className={
                      state.entryType == item.id
                        ? "access__list active"
                        : "access__list"
                    }
                  >
                    {item.name}
                  </li>
                );
              }
            )}
          </ul>

          {/* ???????????? ????????????????????? */}
          {globalState.splash?.roomType.length > 0 && (
            <>
              <div className="title">????????????</div>
              <ul className="category">
                {globalState.splash?.roomType.map(
                  (item: { cdNm: string; value: string }, idx: number) => {
                    return (
                      <li
                        key={idx}
                        onClick={() => {
                          setRoomType(item.value);
                        }}
                        className={
                          state.roomType == item.value
                            ? "category__list category__list--active"
                            : "category__list"
                        }
                      >
                        {item.cdNm}
                      </li>
                    );
                  }
                )}
              </ul>
            </>
          )}
          {/* ??????????????? ??????????????? ?????? */}
          <div className="title">
            ?????? ??????{" "}
            <span className="title__subText">
              ?????? ?????? ???????????? ??????????????????.
            </span>
          </div>
          <div
            className="photo"
            style={{
              backgroundImage: `url(${broadBg})`,
              backgroundSize: "cover",
            }}
          >
            <label
              htmlFor="profileImg"
              className={broadBg !== "" ? "bgLabel bgLabel--active" : "bgLabel"}
            />
            <input
              type="file"
              id="profileImg"
              accept="image/jpg, image/jpeg, image/png, image/gif"
              onChange={BgImageUpload}
              className="bgUploader"
            />
            {broadBg !== "" && <div className="fakeBox" />}
          </div>

          {/* ?????? ????????? LIVE ?????? ?????? ??????*/}
          {globalState.userProfile && (globalState.userProfile.badgeSpecial > 0 || globalState.userProfile.badgePartner > 0) && (
            <>
              <div className="title">????????? LIVE ?????? ??????</div>
              <ul className="access">
                {ImageList.map(
                  (item: { name: string; id: number }, idx: number) => {
                    return (
                      <li
                        key={item.id}
                        onClick={() => {
                          dispatchWithoutAction({
                            type: "SET_IMAGETYPE",
                            imageType: item.id,
                          });
                        }}
                        className={`access__list ${state.imageType ===
                        item.id && "active"}`}
                      >
                        {item.name}
                      </li>
                    );
                  }
                )}
              </ul>
            </>
          )}

          {/* ???????????? ?????? */}
          <div className="title">
            ?????? ??????
            <button
              onClick={() => {
                setPopupState(true);
                setPopupTitle(true);
              }}
            />
          </div>
          <div className="inputBox">
            <input
              ref={titleInputRef}
              className="input"
              placeholder="????????? ?????????????????? (3~20??? ??????)"
              onChange={(e) => setTitleChange(e)}
              value={state.titleChange}
            />
            <p className="textNumber">{state.titleChange.length}/20</p>
          </div>

          {/* ????????? ?????? */}
          <div className="title">
            ?????????
            <button
              onClick={() => {
                setPopupState(true);
                setPopupWelcome(true);
              }}
            />
          </div>
          <div className="inputBox">
            <textarea
              className="textarea"
              placeholder="???????????? ???????????? ????????? ??? ?????? ???????????? ??????????????????.&#13;&#10;(10 ~ 100??? ??????)"
              value={state.welcomeMsgChange}
              onChange={(e) => setWelcomeMsg(e)}
            />
            <p className="textNumber textNumber__padding">
              {state.welcomeMsgChange.length}/100
            </p>
          </div>
          <div
            className="notice"
            onClick={() => {
              setPopupState(true);
              setPopupCopyright(true);
            }}
          >
            ????????? ????????????
          </div>
          <button
            onClick={onSubmit}
            className={
              state.titleChange.length > 2 &&
              state.micState === true &&
              (state.mediaType === MediaType.AUDIO ||
                (state.mediaType === MediaType.VIDEO &&
                  state.videoState === true))
                ? "button button--active"
                : "button"
            }
          >
            ????????????
          </button>
          {popupCopyright && <LayerCopyright setPopupState={setPopupState} />}
          {popupTitle && <LayerTitle setPopupState={setPopupState} />}
          {popupWelcome && <LayerWelcome setPopupState={setPopupState} />}
        </div>
    </>
  );
}

enum ACCESS_TYPE {
  ALL = 0,
  FAN = 1,
  ADULT = 2,
}
enum PLATFORM_TYPE {
  AGORA = "agora",
  WOWZA = "wowza",
}
const PlatForm=[
  {
    id: PLATFORM_TYPE.AGORA,
    name: "?????????",
  },
  {
    id: PLATFORM_TYPE.WOWZA,
    name: "?????????",
  },

]

const AccessList = [
  {
    id: ACCESS_TYPE.ALL,
    name: "????????????",
  },
  {
    id: ACCESS_TYPE.FAN,
    name: "??? ??? ??????",
  },
  {
    id: ACCESS_TYPE.ADULT,
    name: "20??? ??????",
  },
];

enum IMAGE_TYPE {
  PROFILE = 1,
  BACKGROUND = 2,
}

const ImageList = [
  {
    id: IMAGE_TYPE.PROFILE,
    name: "????????? ??????",
  },
  {
    id: IMAGE_TYPE.BACKGROUND,
    name: "?????? ??????",
  },
];

enum BROAD_TYPE {
  AUDIO= "a",
  VIDEO= "v",
};
