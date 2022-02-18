import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  useRef,
} from "react";
import { useHistory } from "react-router-dom";

// static
import {
  broadcastCheck,
  broadcastCreate,
  broadcastExit,
  getRoomType,
  postImage,
  getBroadcastSetting, broadcastInfoNew, broadcastAllExit,
} from "common/api";
// others
import {AgoraHostRtc, AgoraListenerRtc, HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";
// context
import { Context } from "context";
import { ModalContext } from "context/modal_ctx";
import "./broadcast_setting.scss";
// lib
import getDecibel from "./lib/getDecibel";
import { BroadcastContext } from "../../context/broadcast_ctx";
import LayerCopyright from "../../common/layerpopup/contents/copyright";
import LayerTitle from "./content/title";
import LayerWelcome from "./content/welcome";
import Layout from "common/layout";
import { MediaType } from "pages/broadcast/constant";
import AgoraRTC from 'agora-rtc-sdk-ng';

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
  const titleInputRef = useRef<any>();
  const context = useContext(Context)
  const { globalState, globalAction } = useContext(Context);
  const { chatInfo, rtcInfo } = globalState;
  const { modalState } = useContext(ModalContext);
  const { broadcastAction } = useContext(BroadcastContext);
  const [state, dispatch] = useReducer(reducer, {
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
    dispatch({ type: "SET_MICSTATE", micState: status });
  const setVideoState = (status: boolean) =>
    dispatch({ type: "SET_VIDEOSTATE", videoState: status });

  const setEntry = useCallback((access_type: ACCESS_TYPE) => {
    dispatch({ type: "SET_ENTRY", entryType: access_type });
  }, []);

  const setMicForm = useCallback((micFormType: string) => {
    dispatch({ type: "SET_MICFORM", micFormType: micFormType });
  }, []);

  const setCamForm = useCallback((camFormType: string) => {
    dispatch({ type: "SET_CAMFORM", camFormType: camFormType });
  }, []);

  const setRoomType = useCallback(
    (value) =>
      dispatch({
        type: "SET_ROOMTYPE",
        roomType: value,
      }),
    []
  );
  const setBgChange = (value) =>
    dispatch({
      type: "SET_BGCHANGE",
      bgChange: value,
    });
  const setTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 20) return;
    dispatch({ type: "SET_TITLECHANGE", titleChange: value });
  };
  const setWelcomeMsg = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 100) return;
    dispatch({ type: "SET_WELCOMEMSG", welcomeMsgChange: value });
  };

  //배경 사진 업로드 관련
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
      return alert("jpg, png, gif 이미지만 사용 가능합니다.");
    }
    if (fileExtension === "gif" && fileSize > 5000000) {
      globalAction.callSetToastStatus!({
        status: true,
        message: "GIF 파일 크기는 최대 5MB를 넘을 수 없습니다.",
      });
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
            globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              content: "이미지 업로드에 실패하였습니다.\n다시 시도해주세요",
            });
            return;
          }
        } else {
          globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            content: message,
          });
        }
      }
    };
  };

  // 방송방 생성
  const onSubmit = () => {
    if (state.titleChange.length < 3) {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }

      if (globalAction.callSetToastStatus)
        return globalAction.callSetToastStatus({
          status: true,
          message: "방송 제목을 3자 이상 입력해주세요",
        });
    }

    if (state.micState === false) {
      return globalAction.setAlertStatus!({
        status: true,
        content: `마이크 연결 상태를 확인해주세요.`,
      });
    }

    if (state.mediaType === MediaType.VIDEO && state.videoState === false) {
      return globalAction.setAlertStatus!({
        status: true,
        content: "캠 연결 상태를 확인해주세요.",
      });
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
          // 방 정보 설정
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
          globalAction.dispatchRtcInfo({ type: "init", data: newRtcInfo });
          sessionStorage.setItem("wowza_rtc", JSON.stringify({roomInfo:newRtcInfo.roomInfo, userType:newRtcInfo.userType}));
          sessionStorage.setItem("room_no", data.roomNo);
          broadcastAction.setExtendTime!(false);
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
            globalAction.dispatchRtcInfo({type: "init", data: dispatchRtcInfo});
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
            globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              content: message,
              callback: () => {
                history.push("/self_auth/self?type=create");
              },
            })
          );
        }
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({ status: true, content: message });
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
            globalAction.dispatchRtcInfo!({ type: "empty" });
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
    cams = await AgoraRTC.getCameras();

    if (videoStream === null) {
      const result = await setStream();
      if(result === null){
        //장치 연결 관련 팝업
        let message = "현재 다른 응용 프로그램에서 해당 장치를 \n사용중입니다." +
          " 다른 캡처 장치를 선택해주세요"

        context.action.alert({
          msg: message
        })
        currentCam = cams[1];
        sessionStorage.setItem("cam", JSON.stringify(currentCam.deviceId));
        localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: {
            width: 1280,
            // Specify a value range and an ideal value
            height: { ideal: 720, min: 720, max: 1280 },
            frameRate: 24,
            bitrateMin: 1130, bitrateMax: 2000,
          },cameraId:currentCam.deviceId})
        localTracks.videoTrack.play("pre-local-player",{mirror:false});
      }else{
        currentCam = cams[0];
        sessionStorage.setItem("cam", JSON.stringify(currentCam.deviceId));
        localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: {
            width: 1280,
            // Specify a value range and an ideal value
            height: { ideal: 720, min: 720, max: 1280 },
            frameRate: 24,
            bitrateMin: 1130, bitrateMax: 2000,
          },cameraId:currentCam.deviceId})
        localTracks.videoTrack.play("pre-local-player",{mirror:false});
      }
      setVideoStream(result);
      setCamForm(currentCam.label)
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
          //장치 연결 관련 팝업
          let message = "현재 다른 응용 프로그램에서 해당 장치를 \n사용중입니다." +
            " 다른 캡처 장치를 선택해주세요"
          context.action.alert({
            msg: message
          })
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
    e.preventDefault();
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
      globalAction.setAlertStatus &&
      globalAction.setAlertStatus({
        status: true,
        type: "confirm",
        title: "알림",
        content: `현재 ${
          rtcInfo.userType === UserType.HOST ? "하고" : "듣고"
        } 있던 방송을 종료하시겠습니까?`,
        callback: () => {
          if (chatInfo !== null && rtcInfo !== null) {
            chatInfo.privateChannelDisconnect();
            rtcInfo.socketDisconnect();
            rtcInfo.stop();
            globalAction.dispatchRtcInfo &&
            globalAction.dispatchRtcInfo({ type: "empty" });
            rtcSessionClear();
            broadcastAllExit();
          }
        },
        cancelCallback: () => {
          history.goBack();
        },
      });
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
      dispatch({
        type: "SET_TITLECHANGE",
        titleChange: modalState.broadcastOption.title,
      });
    }
    if (
      modalState.broadcastOption.welcome !== "" &&
      modalState.broadcastOption.welcome
    ) {
      dispatch({
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
    dispatch({type: "SET_MEDIATYPE", mediaType: mediaType});
    //broadcastAction.dispatchRoomInfo({type:'broadcastSettingUpdate', data:{platform:mediaType === BROAD_TYPE.AUDIO ? 'wowza' : 'agora'}})
  }

  return (
    <>
        <div className="broadcastSetting">
          <div className="headerTitle">방송설정</div>

          {/* 방송 타입 */}
          <div className="title">라이브 타입</div>
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

          <div className="title">마이크 설정</div>
          <div className="access" style={{zIndex:3}}>
            <div
              onClick={() => {
                setMicPop(!micPop);
              }}
              className={"access__list active"}
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
              <div className="title">웹캠/비디오 장치 설정</div>
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
          {/*아고라 와우자 분기값 셋팅 테스트용*/}
          {/*        <div className="title">참여서버</div>
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


          {/* 입장제한 라디오박스영역 */}
          <div className="title">입장제한</div>
          <ul className="access">
            {AccessList.map(
              (item: { name: string; id: number }, idx: number) => {
                return (
                  <li
                    key={idx}
                    onClick={() => {
                      setEntry(item.id);
                      if (item.id === ACCESS_TYPE.ADULT) {
                        if (globalAction.callSetToastStatus) {
                          globalAction.callSetToastStatus({
                            status: true,
                            message: "20세 이상 청취 하실 수 있습니다",
                          });
                        }
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

          {/* 방송주제 라디오박스영역 */}
          {globalState.splashData?.roomType.length > 0 && (
            <>
              <div className="title">방송주제</div>
              <ul className="category">
                {globalState.splashData?.roomType.map(
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
          {/* 백그라운드 사진업로드 영역 */}
          <div className="title">
            사진 등록{" "}
            <span className="title__subText">
              방송 배경 이미지를 등록해주세요.
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
            ></label>
            <input
              type="file"
              id="profileImg"
              accept="image/jpg, image/jpeg, image/png, image/gif"
              onChange={BgImageUpload}
              className="bgUploader"
            />
            {broadBg !== "" && <div className="fakeBox" />}
          </div>

          {/* 스디 실시간 LIVE 사진 노출 영역*/}
          {globalState.userProfile && globalState.userProfile.badgeSpecial > 0 && (
            <>
              <div className="title">실시간 LIVE 사진 노출</div>
              <ul className="access">
                {ImageList.map(
                  (item: { name: string; id: number }, idx: number) => {
                    return (
                      <li
                        key={item.id}
                        onClick={() => {
                          dispatch({
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

          {/* 방송제목 영역 */}
          <div className="title">
            방송 제목
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
              placeholder="제목을 입력해주세요 (3~20자 이내)"
              onChange={(e) => setTitleChange(e)}
              value={state.titleChange}
            />
            <p className="textNumber">{state.titleChange.length}/20</p>
          </div>

          {/* 인사말 영역 */}
          <div className="title">
            인사말
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
              placeholder="청취자가 방송방에 들어올 때 자동 인사말을 입력해보세요.&#13;&#10;(10 ~ 100자 이내)"
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
            저작권 주의사항
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
            방송하기
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
    name: "아고라",
  },
  {
    id: PLATFORM_TYPE.WOWZA,
    name: "와우자",
  },

]

const AccessList = [
  {
    id: ACCESS_TYPE.ALL,
    name: "모두입장",
  },
  {
    id: ACCESS_TYPE.FAN,
    name: "팬 만 입장",
  },
  {
    id: ACCESS_TYPE.ADULT,
    name: "20세 이상",
  },
];

enum IMAGE_TYPE {
  PROFILE = 1,
  BACKGROUND = 2,
}

const ImageList = [
  {
    id: IMAGE_TYPE.PROFILE,
    name: "프로필 사진",
  },
  {
    id: IMAGE_TYPE.BACKGROUND,
    name: "배경 사진",
  },
];

enum BROAD_TYPE {
  AUDIO= "a",
  VIDEO= "v",
};
