import {NODE_ENV} from "../../constant/define";
//agora
import AgoraRTC from 'agora-rtc-sdk-ng';
import {modifyBroadcastState, postErrorSave} from "common/api";
import {SystemStartMsg} from "pages/broadcast/lib/chat_msg_format";
import {MediaType} from "../../pages/broadcast/constant";

export enum UserType {
  HOST,
  GUEST,
  LISTENER,
  GUEST_LISTENER,
}

enum StatusType {
  OK = 200,
  READY = 504,
  NO_STREAM = 514,
  DENIED_STREAM = 519,
}

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

const MEDIA_TYPE = {
  AUDIO: "a",
  VIDEO: "v",
};
// const sdpConstraints = {
//   offerToReceiveAudio: false,
//   offerToReceiveVideo: false,
// };

//agora 셋팅

const client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
type localTracksType = {
  videoTrack?: any,
  audioTrack?: any
};
let localTracks: localTracksType = {}
let remoteUsers = {};
let agoraAudio;

let retryCnt = 0;
let reTryTimer;
const intervalTime = 3000;

let constraints: {
  video: any;
  audio: any;
} = {
  video: {
    width: 480,
    height: 640,
    advanced: [{aspectRatio: 0.75}],
  },
  audio: {
    channelCount: 2,
    echoCancellation: false,
  },
};

const Resolusion = {
  144: {width: 192, height: 144},
  288: {width: 352, height: 288},
  360: {width: 480, height: 360},
  480: {width: 640, height: 480},
  540: {width: 960, height: 540},
  720: {width: 1280, height: 720},
  1080: {width: 1920, height: 1080},
  2160: {width: 3840, height: 2160},
};

const videoFilter = {
  Normal: "none",
  Sepia: "sepia(100%)",
  Gray: "grayscale(100%)",
  Saturate: "saturate(200%)",
  Bright: "brightness(200%)",
};

const initInterval = (callback: () => boolean) => {
  const id = setInterval(() => {
    const result = callback();
    if (result === true) {
      clearInterval(id);
      retryCnt = 0;
    }
  }, intervalTime);
};

export class RtcSocketHandler {
  public userType: UserType;
  public roomInfo: roomInfoType | null;
  public audioTag: HTMLAudioElement = document.createElement("audio");
  public videoTag: HTMLVideoElement | null = null;
  public canvasTag: CanvasElement | null = null;
  public attendClicked: boolean = false;

  protected socketUrl: string;
  protected appName: string;
  protected streamName: string;
  protected sessionId: string = "";
  protected roomNo: string;
  protected isMono: boolean;
  protected videoConstraints: any;

  protected wsConnection: WebSocket | null;
  protected peerConnection: RTCPeerConnection | undefined;

  private msgListWrapRef: any;
  private displayWrapRef: any;

  constructor(
    type: UserType,
    socketUrl: string,
    appName: string,
    streamName: string,
    roomNo: string,
    isMono: boolean = false,
    videoConstraints: any = null
  ) {
    this.userType = type;
    this.roomInfo = null;

    this.socketUrl = socketUrl;
    this.appName = appName;
    this.streamName = streamName;
    this.roomNo = roomNo;

    this.wsConnection = null;

    this.isMono = isMono;

    this.videoConstraints = videoConstraints;
  }

  protected connectionStateChange = (event: any) => {
    if (event.type == "connectionstatechange") {
      if (this.peerConnection && this.peerConnection.connectionState === "connected") {
        setTimeout(() => {
          if (this.wsConnection) {
            this.socketDisconnect();
          }
        }, 5000);
      } else if (
        this.peerConnection &&
        (this.peerConnection.connectionState === "disconnected" ||
          this.peerConnection.connectionState === "closed" ||
          this.peerConnection.connectionState === "failed")
      ) {
        postErrorSave({
          os: "pc",
          appVer: "pc",
          dataType: NODE_ENV,
          commandType: window.location.pathname,
          desc:
            "WOWZA CONNECTION ERROR " +
            this.peerConnection.connectionState +
            " | " +
            this.appName +
            " |" +
            this.streamName +
            " |" +
            this.roomNo,
        });

        if (this.userType === UserType.HOST) {
          modifyBroadcastState({
            roomNo: this.roomNo,
            mediaState: this.videoConstraints !== null && this.videoConstraints.isVideo ? "video" : "mic",
            mediaOn: true,
          });
        }
        this.stop();
        this.socketDisconnect();

        initInterval(() => {
          if (retryCnt == 0 && this.msgListWrapRef) {
            const msgData = SystemStartMsg({
              type: "div",
              text: "미디어 서버 접속 중입니다.\n소리가 들리지 않아도 잠시만 기다려 주세요.",
              className: "system-start-msg",
            });
            const msgListWrapElem = this.msgListWrapRef.current;
            if (msgListWrapElem && msgData !== null) {
              msgListWrapElem.appendChild(msgData);
            }
            this.socketConnect();
          }

          if (this.getWsConnectionCheck()) {
            if (this.userType === UserType.HOST) {
              modifyBroadcastState({
                roomNo: this.roomNo,
                mediaState: this.videoConstraints !== null && this.videoConstraints.isVideo ? "video" : "mic",
                mediaOn: true,
              });
              this.publish();
              return true;
            }
          }

          if (this.getPeerConnectionCheck()) {
            if (this.userType === UserType.LISTENER) {
              this.playMediaTag();
              return true;
            }
          }

          retryCnt++;
          if (this.msgListWrapRef && (retryCnt * intervalTime) / 30000 > 0 && (retryCnt * intervalTime) % 30000 == 0) {
            //30초마다 채팅 메세지 추가
            const msgData = SystemStartMsg({
              type: "div",
              text: "미디어 서버 접속 중입니다.\n소리가 들리지 않아도 잠시만 기다려 주세요.",
              className: "system-start-msg",
            });
            const msgListWrapElem = this.msgListWrapRef.current;
            if (msgListWrapElem && msgData !== null) {
              msgListWrapElem.appendChild(msgData);
            }
          }
          return false;
        });
      }
    }
  };

  setMsgListWrapRef(ref: any) {
    this.msgListWrapRef = ref;
  }

  setDisplayWrapRef(ref: any) {
    this.displayWrapRef = ref;
  }

  setBroadState(state: boolean) {
    if (this.roomInfo) {
      if (this.videoConstraints !== null && this.videoConstraints.isVideo) {
        this.roomInfo["isVideo"] = state;
      } else {
        this.roomInfo["isMic"] = state;
      }
    }
  }

  protected getStreamInfo = () => {
    return {
      applicationName: this.appName,
      streamName: this.streamName,
      sessionId: this.sessionId,
    };
  };

  protected socketSendMsg(msg: object) {
    if (this.wsConnection !== null) {
      this.wsConnection.send(JSON.stringify(msg));
    }
  }

  protected setVideoConstraints() {
    if (this.videoConstraints.isVideo === false) {
      constraints.video = false;
    } else {
      constraints.video = {
        ...Resolusion[this.videoConstraints.videoResolution],
        advanced: [{aspectRatio: 0.75}],
      };
    }
  }

  public getWsConnectionCheck() {
    enum WS_READY_STATE {
      CONNECTING = 0,
      OPEN = 1,
      CLOSING = 2,
      CLOSED = 3,
    }

    if (this.wsConnection !== null) {
      return this.wsConnection.readyState === WS_READY_STATE.OPEN;
    }
    return false;
  }

  public getPeerConnectionCheck() {
    if (this.peerConnection) {
      return this.peerConnection.connectionState === "connected";
    }
    return false;
  }

  public getRoomNo() {
    return this.roomNo;
  }

  public setRoomNo(roomNo: string) {
    this.roomNo = roomNo;
  }

  public setRoomInfo(roomInfo: roomInfoType) {
    this.roomInfo = roomInfo;
  }

  public socketDisconnect() {
    if (this.wsConnection !== null) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  public getMsgListWrapRef() {
    return this.msgListWrapRef;
  }

  public getDisplayListWrapRef() {
    return this.displayWrapRef;
  }

  public getVideoIsEnabled() {
    return false;
  }

  public getMediaType() {
    return this.videoConstraints !== null && this.videoConstraints.isVideo;
  }

  public getIsMono() {
    return this.isMono;
  }

  /** interface */
  public socketConnect() {
  }

  public stop() {
  }

  // host
  public publish() {
  }

  public addTrackToPeerStream(type?: string) {
  }

  public removeTrackFromPeerStream(type?: string) {
  }

  // listener
  public play() {
  }

  public playMediaTag() {
  }

  public mutedMediaTag() {
  }

  /** interface */
  public initVideoTag() {
  }

  public flip() {
  }

  public getVideoTag(): any {
  }

  public effectChange(label: any): any {
  }
  public join(roomInfo:any){

  }
  public leave(){
  }
  public videoMute(value:boolean) { }
  public audioMute(value:boolean) { }
  public audioVolume(value:number) { }
}

const audioBitrate = 128; // KBps
const videoBitrate = 1500;

export const rtcSessionClear = ()=>{
  sessionStorage.removeItem("room_no");
  sessionStorage.removeItem("wowza_rtc");
  sessionStorage.removeItem("agora_rtc");
  sessionStorage.removeItem("broadcast_data");
}
export const getArgoraRtc = (rtcInfo:AgoraHostRtc|AgoraListenerRtc)=>{
  const roomInfo = rtcInfo.roomInfo as roomInfoType;
  const videoConstraints = { isVideo: roomInfo.mediaType === MediaType.VIDEO };
  const returnRTC = rtcInfo.userType === UserType.HOST ?
      new AgoraHostRtc(UserType.HOST, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomInfo.roomNo, false, videoConstraints)
      : new AgoraListenerRtc(UserType.LISTENER, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomInfo.roomNo, videoConstraints);
  returnRTC.setRoomInfo(roomInfo);
  return returnRTC;
}
export const getWowzaRtc = (rtcInfo:HostRtc|ListenerRtc)=>{
  const roomInfo = rtcInfo.roomInfo as roomInfoType;
  const hostVideoConstraints = {
    isVideo: roomInfo.mediaType === MediaType.VIDEO,
    videoFrameRate: roomInfo.videoFrameRate,
    videoResolution: roomInfo.videoResolution,
  };
  const listenerVideoConstraints = {
    isVideo: roomInfo.mediaType === MediaType.VIDEO,
  }
  const returnRTC = rtcInfo.userType === UserType.HOST ?
      new HostRtc(UserType.HOST, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomInfo.roomNo, false, hostVideoConstraints)
      : new ListenerRtc(UserType.LISTENER, roomInfo.webRtcUrl, roomInfo.webRtcAppName, roomInfo.webRtcStreamName, roomInfo.roomNo, listenerVideoConstraints);
  returnRTC.setRoomInfo(roomInfo);
  return returnRTC;
}

export class HostRtc extends RtcSocketHandler {
  private audioStream: MediaStream | null = null;
  private videoStream: MediaStream | null = null;
  private canvasStream: MediaStream | null = null;
  private deepArObj: any = null;

  private audioCtx = (() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    return audioCtx;
  })();

  private detectDevice: () => Promise<void>;
  private isPublish = false;

  constructor(
    type: UserType,
    socketUrl: string,
    appName: string,
    streamName: string,
    roomNo: string,
    isMono: boolean = false,
    videoConstraints: any = null
  ) {
    super(type, socketUrl, appName, streamName, roomNo, isMono, videoConstraints);
    this.socketConnect();

    this.detectDevice = async () => {
      let videoDeviceExist;
      let micDeivceExist: boolean = false;
      await navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach((d) => {
          if (d.kind === "audioinput") {
            micDeivceExist = true;
          }
        });
        videoDeviceExist = devices.some((d) => {
          return d.kind === "videoinput";
        });
      });
      if (
        micDeivceExist === false ||
        (this.videoConstraints !== null && this.videoConstraints.isVideo && videoDeviceExist === false)
      ) {
        postErrorSave({
          os: "pc",
          appVer: "pc",
          dataType: NODE_ENV,
          commandType: window.location.pathname,
          desc: "micDeviceNotExist " + this.appName + " |" + this.streamName + " |" + this.roomNo,
        });
        if (this.audioStream !== null) {
          this.stop();
        } else if (this.videoStream !== null) {
          this.stop();
        }
      } else if (
        micDeivceExist === true ||
        (this.videoConstraints !== null && this.videoConstraints.isVideo && videoDeviceExist === true)
      ) {
        if (this.audioStream === null) {
          if (this.getWsConnectionCheck()) {
            this.publish();
          } else {
            this.socketConnect();
            initInterval(() => {
              if (this.getWsConnectionCheck()) {
                this.publish();
                return true;
              }
              return false;
            });
          }
        }
      }
    };
  }

  public flip() {
    if (this.canvasTag !== null) {
      const ctx = this.canvasTag.getContext("2d");
      if (ctx !== null) {
        // ctx.filter = "contrast(1.4) sepia(1) drop-shadow(-9px 9px 3px #e81)";

        ctx.translate(this.canvasTag.width, 0);
        ctx.scale(-1, 1);
      }
    }
  }

  public initVideoTag() {
    if (this.deepArObj !== null) {
      this.deepArObj.shutdown();
      this.deepArObj = null;
    }
    let width = 480;
    let height = 640;

    if (this.videoStream !== null) {
      if (this.videoTag === null) {
        this.videoTag = document.createElement("video");
        this.canvasTag = <CanvasElement>document.createElement("canvas");
        this.canvasTag.id = "videoViewer";
        this.videoTag.setAttribute("autoplay", "");
        this.videoTag.controls = false;
        if (this.userType === UserType.GUEST) {
          this.videoTag.classList.add("broadcast-video-guest");
        } else {
          this.videoTag.classList.add("broadcast-video-host");
        }
      }
      this.videoTag.muted = true;
      this.videoTag.srcObject = this.videoStream;

      const emptyTag = document.createElement("canvas");

      if (this.getDisplayListWrapRef() && this.getDisplayListWrapRef().current) {
        if (this.canvasTag !== null) {
          if (window.location.pathname.startsWith("/broadcast/")) {
            width = this.getDisplayListWrapRef().current.offsetHeight * 0.75;
            height = this.getDisplayListWrapRef().current.offsetHeight;
          } else {
            width = 240;
            height = 320;
          }

          this.canvasTag.width = width;
          this.canvasTag.height = height;
        }

        this.getDisplayListWrapRef().current.prepend(this.videoTag);
        this.getDisplayListWrapRef().current.prepend(this.canvasTag);

        let licenseKey;
        if (NODE_ENV === "start") {
          // Local
          licenseKey = "c5574f1deddfddbd2beaf0691a0b6b99d05ccf69d0c18bb7f39cabf9dc0de23d59541aab4ca325c7";
        } else if (NODE_ENV === "dev") {
          // 내부서버
          licenseKey = "0074b3870c21a3f91b49621db892ef43eade7dfffc18fee2a89f72b16e739e4cb1e9a8733e7c3f66";
        } else if (NODE_ENV === "stage") {
          // 개발서버
          licenseKey = "5fa9ad91c8b2b0c46ba9c727f602163d318396c870367ea53ab6a9ab91673b3c57f957cc43646ea6";
        } else {
          // 실서버
          licenseKey = "3a6cd69ee862dd6a5a34ecbbe55f26cc7e46a30b3771e5a1c744dd0f010161f9fbe519277e4908dc";
        }
        try {
          // const deepAr = window["DeepAR"]({
          //   licenseKey: licenseKey,
          //   canvasWidth: width,
          //   canvasHeight: height,
          //   canvas: document.getElementById("deepar-canvas"),
          //   numberOfFaces: 1, // how many faces we want to track min 1, max 4
          //   onInitialize: () => {
          //     deepAr.setVideoElement(this.videoTag);
          //
          //     const videoEffect = sessionStorage.getItem("videoEffect");
          //     if (videoEffect) {
          //       this.effectChange(JSON.parse(videoEffect));
          //     }
          //
          //     const drawFrmae = () => {
          //       try {
          //         if (this.canvasTag !== null && this.videoStream !== null) {
          //           const ctx = this.canvasTag.getContext("2d");
          //           const video = this.videoStream.getVideoTracks()[0];
          //           if (ctx) {
          //             if (video.enabled) {
          //               ctx?.drawImage(document.getElementById("deepar-canvas") as CanvasElement, 0, 0);
          //             } else {
          //               ctx?.clearRect(0, 0, this.canvasTag.width, this.canvasTag.height);
          //               ctx?.drawImage(emptyTag, 0, 0);
          //             }
          //           }
          //         }
          //
          //         requestAnimationFrame(drawFrmae);
          //       } catch (err) {
          //         console.log(err);
          //       }
          //     };
          //
          //     requestAnimationFrame(drawFrmae);
          //   },
          //   onError: (errorType, message) => {
          //     postErrorSave({
          //       os: "pc",
          //       appVer: "pc",
          //       dataType: NODE_ENV,
          //       commandType: window.location.pathname,
          //       desc: "deepAR Error " + errorType + "|" + message,
          //     });
          //   },
          //   liPath: "/lib",
          // });
          //
          // this.deepArObj = deepAr;
          // this.deepArObj.downloadFaceTrackingModel("/lib/models-68-extreme.bin");

          // const captureStream = this.canvasTag?.captureStream(25);
          // if (captureStream) {
          //   this.canvasStream = captureStream;
          // }
          // this.videoTag.srcObject = this.canvasStream;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  public async publish() {
    if (this.isPublish == false) {
      this.isPublish = true;
      await this.setStream();
      if (this.audioStream !== null) {
        let gainNode = this.audioCtx.createGain();
        const audioSource: MediaStreamAudioSourceNode = this.audioCtx.createMediaStreamSource(this.audioStream);
        const audioDestination: MediaStreamAudioDestinationNode = this.audioCtx.createMediaStreamDestination();
        audioSource.connect(gainNode);
        gainNode.connect(audioDestination);
        gainNode.gain.value = 1;
        const audioTrack = audioDestination.stream.getAudioTracks()[0];
        let videoTrack: any = null;
        if (this.videoConstraints !== null && this.videoConstraints.isVideo) {
          videoTrack = await (() => {
            if (this.canvasStream !== null) {
              const video = this.canvasStream.getVideoTracks()[0];
              return video;
            } else {
              return null;
            }
          })();
        }
        if (this.peerConnection) {
          this.peerConnection.addTrack(audioTrack);
          if (videoTrack !== null) {
            this.peerConnection.addTrack(videoTrack);
          }
          this.peerConnection.createOffer().then((config) => this.gotDescription(config));

          if (this.videoConstraints !== null && this.videoConstraints.isVideo) {
            if (this.roomInfo !== null && this.roomInfo.isVideo === false) {
              this.removeTrackFromPeerStream("video");
            }
          } else {
            if (this.roomInfo !== null && this.roomInfo.isMic === false) {
              this.removeTrackFromPeerStream();
            }
          }
        }
      }

      this.isPublish = false;
    }
  }

  public stop() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = undefined;
      this.removeAudioStream();

      if (this.videoTag) {
        this.videoTag.remove();
      }
    }
  }

  socketConnect() {
    if (this.wsConnection === null) {
      this.wsConnection = new WebSocket(this.socketUrl);
      this.wsConnection.binaryType = "arraybuffer";

      this.wsConnection.onopen = () => {
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.onconnectionstatechange = this.connectionStateChange;
      };
      this.wsConnection.onmessage = async (msg) => {
        const format = JSON.parse(msg.data);
        const {status, iceCandidates} = format;

        if (status === StatusType.OK) {
          if (format && format.hasOwnProperty("sdp")) {
            const sdpData = format.sdp;
            const enhanceData = {
              audioBitrate: audioBitrate,
              videoBitrate:
                this.videoConstraints !== null && this.videoConstraints.isVideo
                  ? this.userType === UserType.GUEST
                  ? 500
                  : videoBitrate
                  : undefined,
              videoFrameRate: this.videoConstraints !== null && this.videoConstraints.videoFrameRate,
            };
            sdpData.sdp = this.enhanceSDP(sdpData.sdp, enhanceData);

            this.peerConnection && (await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdpData)));
          }

          if (iceCandidates && Array.isArray(iceCandidates)) {
            iceCandidates.forEach((value) => {
              const ice = new RTCIceCandidate(value);
              this.peerConnection && this.peerConnection.addIceCandidate(ice);
            });
          }

          this.socketDisconnect();
        } else {
          this.stop();
        }
      };
      this.wsConnection.onclose = () => {
        this.wsConnection = null;
      };
      this.wsConnection.onerror = () => {
        this.wsConnection = null;
      };
    }
  }

  private async gotDescription(description: any) {
    if (this.peerConnection) {
      await this.peerConnection.setLocalDescription(description);
      const message = {
        direction: "publish",
        command: "sendOffer",
        streamInfo: this.getStreamInfo(),
        sdp: description,
      };
      this.socketSendMsg(message);
    }
  }

  private enhanceSDP(sdpStr: string, enhanceData: any) {
    const getrtpMapID = (line: string) => {
      const findid = new RegExp("a=rtpmap:(\\d+) (\\w+)/(\\d+)");
      const found = line.match(findid);
      return found && found.length >= 3 ? found : null;
    };

    const sdpLines = sdpStr.split(/\r\n/);
    let sdpSection = "header";
    let hitMID = false;
    let sdpStrRet = "";

    for (let sdpIndex in sdpLines) {
      let sdpLine = sdpLines[sdpIndex];

      if (sdpLine.length <= 0) continue;

      if (sdpLine.includes("transport-cc") || sdpLine.includes("goog-remb") || sdpLine.includes("nack")) {
        continue;
      }

      // For stereo mix.
      if (sdpLine.includes("useinbandfec=1")) {
        sdpLine = sdpLine.replace("useinbandfec=1", "useinbandfec=1; stereo=1; sprop-stereo=1; maxaveragebitrate=510000");
      }
      sdpStrRet += sdpLine;

      if (sdpLine.indexOf("m=audio") === 0) {
        sdpSection = "audio";
        hitMID = false;
      } else if (sdpLine.indexOf("m=video") === 0) {
        sdpSection = "video";
        hitMID = false;
      } else if (sdpLine.indexOf("a=rtpmap") == 0) {
        sdpSection = "bandwidth";
        hitMID = false;
      }
      if (sdpLine.indexOf("a=mid:") === 0 || sdpLine.indexOf("a=rtpmap") == 0) {
        if (hitMID === false) {
          if ("audio".localeCompare(sdpSection) === 0) {
            if (enhanceData.audioBitrate !== undefined) {
              sdpStrRet += "\r\nb=CT:" + enhanceData.audioBitrate;
              sdpStrRet += "\r\nb=AS:" + enhanceData.audioBitrate;
            }
            hitMID = true;
          } else if ("video".localeCompare(sdpSection) === 0) {
            if (enhanceData.videoBitrate !== undefined) {
              sdpStrRet += "\r\nb=CT:" + enhanceData.videoBitrate;
              sdpStrRet += "\r\nb=AS:" + enhanceData.videoBitrate;
              if (enhanceData.videoFrameRate !== undefined) {
                sdpStrRet += "\r\na=framerate:" + enhanceData.videoFrameRate;
              }
            }
            hitMID = true;
          } else if ("bandwidth".localeCompare(sdpSection) === 0) {
            let rtpmapID: any = null;
            rtpmapID = getrtpMapID(sdpLine);

            if (rtpmapID !== null) {
              let match = rtpmapID[2].toLowerCase();
              if (
                "vp9".localeCompare(match) == 0 ||
                "vp8".localeCompare(match) == 0 ||
                "h264".localeCompare(match) == 0 ||
                "red".localeCompare(match) == 0 ||
                "ulpfec".localeCompare(match) == 0 ||
                "rtx".localeCompare(match) == 0
              ) {
                if (enhanceData.videoBitrate !== undefined) {
                  sdpStrRet +=
                    "\r\na=fmtp:" +
                    rtpmapID[1] +
                    " x-google-min-bitrate=" +
                    enhanceData.videoBitrate +
                    ";x-google-max-bitrate=" +
                    enhanceData.videoBitrate;
                }
              }

              if (
                "opus".localeCompare(match) == 0 ||
                "isac".localeCompare(match) == 0 ||
                "g722".localeCompare(match) == 0 ||
                "pcmu".localeCompare(match) == 0 ||
                "pcma".localeCompare(match) == 0 ||
                "cn".localeCompare(match) == 0
              ) {
                if (enhanceData.audioBitrate !== undefined) {
                  sdpStrRet +=
                    "\r\na=fmtp:" +
                    rtpmapID[1] +
                    " x-google-min-bitrate=" +
                    enhanceData.audioBitrate +
                    ";x-google-max-bitrate=" +
                    enhanceData.audioBitrate;
                }
              }
            }
          }
        }
      }

      sdpStrRet += "\r\n";
    }
    return sdpStrRet;
  }

  private async setStream() {
    navigator.mediaDevices.removeEventListener("devicechange", this.detectDevice);
    navigator.mediaDevices.addEventListener("devicechange", this.detectDevice);

    if (this.videoConstraints !== null) this.setVideoConstraints();
    else constraints.video = false;
    if (this.isMono) {
      constraints.audio.echoCancellation = true;
    } else {
      constraints.audio.echoCancellation = false;
    }
    await navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (this.audioStream === null) {
          this.audioStream = stream;
        }
        if (this.videoStream === null && this.videoConstraints !== null && this.videoConstraints.isVideo) {
          this.videoStream = stream;
          this.initVideoTag();
        } else if (this.videoStream !== null && this.videoConstraints !== null && this.videoConstraints.isVideo) {
          this.initVideoTag();
        }
      })
      .catch((e) => {
        // alert(e);
      });
  }

  private removeAudioStream() {
    navigator.mediaDevices.removeEventListener("devicechange", this.detectDevice);
    navigator.mediaDevices.addEventListener("devicechange", this.detectDevice);

    if (this.audioStream !== null) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }

    if (this.videoStream !== null) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
  }

  public removeVideoStream() {
    if (this.videoStream !== null) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
  }

  public addTrackToPeerStream(type?: string) {
    if (type === "video") {
      if (this.videoStream !== null && this.canvasStream !== null) {
        const video = this.videoStream.getVideoTracks()[0];
        const canvas = this.canvasStream.getVideoTracks()[0];
        if (this.deepArObj !== null) {
          this.deepArObj.resume();
        }
        if (this.canvasTag) {
          this.canvasTag.style.opacity = "1";
        }
        video.enabled = true;
        canvas.enabled = true;
      }
    }
    if (this.audioStream !== null) {
      const audio = this.audioStream.getAudioTracks()[0];
      audio.enabled = true;
    }
  }

  public removeTrackFromPeerStream(type?: string) {
    if (type === "video") {
      if (this.videoStream !== null && this.canvasStream !== null) {
        const video = this.videoStream.getVideoTracks()[0];
        const canvas = this.canvasStream.getVideoTracks()[0];
        if (this.deepArObj !== null) {
          this.deepArObj.pause();
        }
        // this.canvasTag!.style.opacity = "0";

        video.enabled = false;
        canvas.enabled = false;
      }
    }
    if (this.audioStream !== null) {
      const audio = this.audioStream.getAudioTracks()[0];
      audio.enabled = false;
    }
  }

  public getVideoIsEnabled() {
    if (this.videoStream !== null) {
      return this.videoStream?.getVideoTracks()[0].enabled;
    } else {
      return false;
    }
  }

  public getVideoTag() {
    return this.canvasTag;
  }

  public effectChange(label: any) {
    if (this.canvasTag !== null) {
      const ctx = this.canvasTag.getContext("2d");
      if (ctx) {
        ctx.filter = videoFilter[label.filter];
      }

      if (this.deepArObj !== null) {
        switch (label.makeUp) {
          case "Original":
            this.deepArObj.clearEffect("slot");
            break;
          case "Daily":
            this.deepArObj.switchEffect(0, "slot", "/effects/V01001_01");
            break;
          case "Pink":
            this.deepArObj.switchEffect(0, "slot", "/effects/V01002_01");
            break;
          case "Coral":
            this.deepArObj.switchEffect(0, "slot", "/effects/V01003_01");
            break;
          case "Orange":
            this.deepArObj.switchEffect(0, "slot", "/effects/V01004_01");
            break;
          case "Wine":
            this.deepArObj.switchEffect(0, "slot", "/effects/V01005_01");
            break;
        }
      }
    }
  }
}

export class ListenerRtc extends RtcSocketHandler {
  private retryCount: number = 0;
  public audioTag: HTMLAudioElement = document.createElement("audio");
  public videoTag: HTMLVideoElement | null = null;
  private videoStream: MediaStream | null = null;

  constructor(type: UserType, socketUrl: string, appName: string, streamName: string, roomNo: string, videoConstraints: any) {
    super(type, socketUrl, appName, streamName, roomNo, false, videoConstraints);
    // debugger
    this.socketConnect();
    this.audioTag.muted = true;
  }

  public stop() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = undefined;
    }

    if (this.videoTag) {
      this.videoTag.remove();
    }
    this.retryCount = 0;
  }

  public play() {
  }

  public playMediaTag() {
    this.audioTag.muted = false;
    this.audioTag.play();
    if (this.videoTag !== null) {
      this.videoTag.play();
    }
  }

  public mutedMediaTag() {
    this.audioTag.muted = true;
    this.audioTag.pause();
    if (this.videoTag !== null) {
      this.videoTag.pause();
    }
  }

  public getVideoTag() {
    return this.videoTag;
  }

  public initVideoTag() {
    if (this.videoStream !== null) {
      if (this.videoTag === null) {
        this.videoTag = document.createElement("video");
        this.videoTag.id = "videoViewer";
      }
      // this.videoTag.setAttribute("playsinline", "");
      if (this.userType === UserType.GUEST_LISTENER) {
        this.videoTag.classList.add("broadcast-video-guest");
      } else {
        this.videoTag.classList.add("broadcast-video");
      }

      this.videoTag.muted = true;

      if (this.videoStream !== null) {
        this.videoTag.srcObject = this.videoStream;
      }

      if (this.getDisplayListWrapRef() && this.getDisplayListWrapRef().current) {
        this.getDisplayListWrapRef().current.prepend(this.videoTag);
      }
    }
  }

  public addVideoTag() {
    if (this.getDisplayListWrapRef() && this.getDisplayListWrapRef().current) {
      this.getDisplayListWrapRef().current.prepend(this.videoTag);
    }
  }

  private sendPlayGetOffer = () => {
    const message = {
      direction: "play",
      command: "getOffer",
      streamInfo: this.getStreamInfo(),
    };
    this.socketSendMsg(message);
  };

  socketConnect() {
    if (this.wsConnection === null) {
      this.wsConnection = new WebSocket(this.socketUrl);
      this.wsConnection.binaryType = "arraybuffer";
      this.wsConnection.onopen = () => {
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.onconnectionstatechange = this.connectionStateChange;

        this.peerConnection.ontrack = (e) => {
          this.audioTag.srcObject = e.streams[0];

          if (this.videoConstraints.isVideo) {
            this.videoStream = e.streams[0];

            this.initVideoTag();
          }
        };

        this.sendPlayGetOffer();
      };

      this.wsConnection.onmessage = async (msg) => {
        const format = JSON.parse(msg.data);
        const {command, status, streamInfo, iceCandidates} = format;

        if (status === StatusType.READY || status === StatusType.NO_STREAM) {
          if (true) {
            this.retryCount++;
            if (reTryTimer) clearTimeout(reTryTimer);
            reTryTimer = setTimeout(this.sendPlayGetOffer, 3500);
          }
        } else if (status === StatusType.DENIED_STREAM) {
          if (true) {
            if (this.retryCount == 1) {
              const msgData = SystemStartMsg({
                type: "div",
                text: "미디어 서버 접속 중입니다.\n소리가 들리지 않아도 잠시만 기다려 주세요.",
                className: "system-start-msg",
              });
              if (this.getMsgListWrapRef()) {
                const msgListWrapElem = this.getMsgListWrapRef().current;
                if (msgListWrapElem && msgListWrapElem.current && msgData !== null) {
                  msgListWrapElem.current.appendChild(msgData);
                }
              }
            }
            this.retryCount++;
            if (reTryTimer) clearTimeout(reTryTimer);
            reTryTimer = setTimeout(this.sendPlayGetOffer, 1000);
          }
        } else if (status === StatusType.OK) {
          if (reTryTimer) clearTimeout(reTryTimer);
          if (streamInfo) {
            this.sessionId = streamInfo.sessionId;
          }
          if (format && format.hasOwnProperty("sdp")) {
            const sdpData = format.sdp;

            sdpData.sdp = this.enhanceSDP(sdpData.sdp);
            sdpData.sdp = sdpData.sdp.replace("OPUS/48000/1", "OPUS/48000/2");
            if (this.peerConnection) {
              await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdpData));
              const config = await this.peerConnection.createAnswer();
              this.gotDescription(config);
            }
          }
          if (iceCandidates && Array.isArray(iceCandidates)) {
            iceCandidates.forEach((value) => {
              const ice = new RTCIceCandidate(value);
              this.peerConnection && this.peerConnection.addIceCandidate(ice);
            });
          }

          if (command === "sendResponse") {
            // initInterval(() => {
            //   if (this.getPeerConnectionCheck()) {
            //     if (this.videoTag !== null) {
            //       this.videoTag.play();
            //     }
            //     return true;
            //   }

            //   return false;
            // });
            this.socketDisconnect();
          }
        } else {
          this.stop();
        }
      };

      this.wsConnection.onclose = () => {
        if (reTryTimer) clearTimeout(reTryTimer);
        this.wsConnection = null;
      };
      this.wsConnection.onerror = () => {
        if (reTryTimer) clearTimeout(reTryTimer);
        this.wsConnection = null;
      };
    }
  }

  private async gotDescription(description: any) {
    // For stereo mix
    if (this.userType !== UserType.HOST) {
      description.sdp = description.sdp.replace("useinbandfec=1", "useinbandfec=1; stereo=1; maxaveragebitrate=510000");
    }
    // this.peerConnection && (await this.peerConnection.setLocalDescription(description));

    this.peerConnection &&
    this.peerConnection.setLocalDescription(description).then(() => {
      const message = {
        direction: "play",
        command: "sendResponse",
        streamInfo: this.getStreamInfo(),
        sdp: description,
      };
      this.socketSendMsg(message);
    });
  }

  private enhanceSDP(sdpStr: string) {
    return sdpStr
      .split(/\r\n/)
      .map((sdpLine) => {
        if (sdpLine.includes("profile-level-id")) {
          if (sdpLine.includes("640029")) {
            sdpLine = sdpLine.replace("640029", "42E01F");
          }
        }
        return sdpLine;
      })
      .join("\r\n");
  }
}

export class AgoraHostRtc extends RtcSocketHandler{
  private audioStream: MediaStream | null = null;
  private videoStream: MediaStream | null = null;
  private canvasStream: MediaStream | null = null;
  private deepArObj: any = null;

  private micSettingInfo: any = null;
  private camSettingInfo: any = null;

  private audioCtx = (() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    return audioCtx;
  })();

  private detectDevice: () => Promise<void>;
  private isPublish = false;

  constructor(
    type: UserType,
    socketUrl: string,
    appName: string,
    streamName: string,
    roomNo: string,
    isMono: boolean = false,
    videoConstraints: any = null
  ) {
    super(type, socketUrl, appName, streamName, roomNo, isMono, videoConstraints);
    //this.socketConnect();
    this.detectDevice = async () => {
      let videoDeviceExist;
      let micDeivceExist: boolean = false;
      await navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach((d) => {
          if (d.kind === "audioinput") {
            micDeivceExist = true;
          }
        });
        videoDeviceExist = devices.some((d) => {
          return d.kind === "videoinput";
        });
      });
      if (
        micDeivceExist === false ||
        (this.videoConstraints !== null && this.videoConstraints.isVideo && videoDeviceExist === false)
      ) {
        postErrorSave({
          os: "pc",
          appVer: "pc",
          dataType: NODE_ENV,
          commandType: window.location.pathname,
          desc: "micDeviceNotExist " + this.appName + " |" + this.streamName + " |" + this.roomNo,
        });
        if (this.audioStream !== null) {
          this.stop();
        } else if (this.videoStream !== null) {
          this.stop();
        }
      } else if (
        micDeivceExist === true ||
        (this.videoConstraints !== null && this.videoConstraints.isVideo && videoDeviceExist === true)
      ) {
        if (this.audioStream === null) {
          if (this.getWsConnectionCheck()) {
            // console.log('@@@ not yet join 1')
            this.publish();
          } else {
            this.socketConnect();
            initInterval(() => {
              if (this.getWsConnectionCheck()) {
                // console.log('@@@ not yet join 2')
                this.publish();
                return true;
              }
              return false;
            });
          }
        }
      }
    };

  }
  async join(roomInfo) {
      try {
        if(client.connectionState === 'CONNECTED'){
          client.remoteUsers.forEach(user=>{
            if(user.hasVideo){
              user.videoTrack?.play(`local-player`,{mirror:false})
            }
          })
          await localTracks.videoTrack.setBeautyEffect(true, { lighteningContrastLevel: 1, lighteningLevel: 0.7, rednessLevel: 0.1, smoothnessLevel: 0.5 });
          localTracks.videoTrack.play("local-player",{mirror:false});
          // await client.publish(Object.values(localTracks));
        }else{
          await client.setClientRole("host");
          let micId:any = sessionStorage.getItem("mic");
          let camId:any = sessionStorage.getItem("cam");
          let uid = await client.join(roomInfo.agoraAppId, roomInfo.roomNo, roomInfo.agoraToken || null, roomInfo.agoraAccount || null);
          [localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
            //AgoraRTC.createMicrophoneAudioTrack({encoderConfig: 'high_quality_stereo'}),
            AgoraRTC.createMicrophoneAudioTrack({
              encoderConfig: {
                sampleRate: 48000,
                stereo: true,
                bitrate: 192,
              },
              microphoneId:micId?.replaceAll("\"","")
            }),
            AgoraRTC.createCameraVideoTrack({ encoderConfig: {
                width: 1280,
                // Specify a value range and an ideal value
                height: { ideal: 720, min: 720, max: 1280 },
                frameRate: 24,
                bitrateMin: 1130, bitrateMax: 2000,
              },cameraId:camId?.replaceAll("\"","")})
          ]);
          await localTracks.videoTrack.setBeautyEffect(true, { lighteningContrastLevel: 1, lighteningLevel: 0.7, rednessLevel: 0.1, smoothnessLevel: 0.5 });
          localTracks.videoTrack.play("local-player",{mirror:false});
          // publish local tracks to channel
          await client.publish(Object.values(localTracks));
          console.log("publish success");
        }
      } catch (err) {
        console.error(err)
      }
  }
  async stop() {
    Object.keys(localTracks).forEach(trackName => {
      let track = localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        localTracks[trackName] = undefined;
      }
    })
    client.remoteUsers.forEach(user=>{
      if(user.hasAudio){
        user.audioTrack?.stop();
      }
      if(user.hasVideo){
        user.videoTrack?.stop();
      }
    })
    client.leave();

    // await client.leave();
  }
  async videoMute(value) {
    if ( localTracks.videoTrack !== undefined ) {
      await localTracks.videoTrack.setMuted(value);

    }
  }

  async audioMute(value) {
    if ( localTracks.audioTrack !== undefined ) {
      await localTracks.audioTrack.setMuted(value);
    }
  }
}

export class AgoraListenerRtc extends RtcSocketHandler{
  private retryCount: number = 0;
  public audioTag: HTMLAudioElement = document.createElement("audio");
  public videoTag: HTMLVideoElement | null = null;
  private videoStream: MediaStream | null = null;

  constructor(type: UserType, socketUrl: string, appName: string, streamName: string, roomNo: string, videoConstraints: any) {
    super(type, socketUrl, appName, streamName, roomNo, false, videoConstraints);
    // this.socketConnect();
    this.audioTag.muted = true;
  }


  async join(roomInfo) {
    if (!roomInfo) {
      console.log(`rtc_socket join not found roomInfo`);
      return;
    }
    try {
      if(client.connectionState === 'CONNECTED'){
        client.remoteUsers.forEach(user=>{
          if(user.hasVideo){
            user.videoTrack?.play(`local-player`)
          }
          if(user.hasAudio){
            user.audioTrack?.play()
          }
        })

        if(client.remoteUsers.length < 1){
          // 불완전하게 종료되었을때 처리
          client.leave().then(value => {
          })

        }

        //localTracks.videoTrack.play("local-player",{fit: 'cover'});
        // await client.leave();

        /**
         * uid: UID;
         * The ID of the remote user.
         */
        /**
         * audioTrack?: IRemoteAudioTrack;
         * The subscribed audio track.
         */
        /**
         * videoTrack?: IRemoteVideoTrack;
         * The subscribed video track.
         */
        /**
         * hasAudio: boolean;
         * Whether the remote user is sending an audio track.
         * - `true`: The remote user is sending an audio track.
         * - `false`: The remote user is not sending an audio track.
         */
        /**
         * hasVideo: boolean;
         * Whether the remote user is sending a video track.
         * - `true`: The remote user is sending an audio track.
         * - `false`: The remote user is not sending an audio track.
         */
        // client.subscribe({uid:client.uid, hasAudio}，"video");
      }else{
        await client.setClientRole("audience", {level: 1});
        client.on("user-published", this.handleUserPublished);
        client.on("user-unpublished", this.handleUserUnpublished);
        let uid = await client.join(roomInfo.agoraAppId, roomInfo.roomNo, roomInfo.agoraToken || null, roomInfo.agoraAccount || null);
      }



    } catch (err) {
      console.error(err)
    }
  }

  async stop() {
    // await localTracks.videoTrack.setMuted(value)
    // await localTracks.audioTrack.setMuted(value)
    client.remoteUsers.forEach(user=>{
      if(user.hasAudio){
        user.audioTrack?.stop();
      }
      if(user.hasVideo){
        user.videoTrack?.stop();
      }
    })
    client.leave();
    // Object.keys(localTracks).forEach(trackName => {
    //   let track = localTracks[trackName];
    //   if (track) {
    //     track.stop();
    //     track.close();
    //     localTracks[trackName] = undefined;
    //   }
    // })
    // await client.leave();


  }

  async handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    await client.subscribe(user, mediaType);
    if (mediaType === 'video') {
      user.videoTrack.play(`local-player`);
    }
    if (mediaType === 'audio') {
      user.audioTrack.play();
      agoraAudio = user.audioTrack;
    }
  }

  handleUserUnpublished(user) {
    const id = user.uid;
    delete remoteUsers[id];
  }

  audioVolume(value){
    try {
      agoraAudio.setVolume(value*100);
    }catch (e){
    }

  }


  public playMediaTag() {
    this.audioTag.muted = false;
    this.audioTag.play();
    if (this.videoTag !== null) {
      this.videoTag.play();
    }
  }

  public mutedMediaTag() {
    this.audioTag.muted = true;
    this.audioTag.pause();
    if (this.videoTag !== null) {
      this.videoTag.pause();
    }
  }

  public getVideoTag() {
    return this.videoTag;
  }

  // <div id="local-player" className="player"/>
  public initVideoTag() {
    // debugger
    if (this.videoStream === null) {
      return;
    }
    // if (this.videoTag === null) {
    //   this.videoTag = document.createElement("div");
    //   this.videoTag.id = "videoViewer";
    // }
    // // this.videoTag.setAttribute("playsinline", "");
    // if (this.userType === UserType.GUEST_LISTENER) {
    //   this.videoTag.classList.add("broadcast-video-guest");
    // } else {
    //   this.videoTag.classList.add("broadcast-video");
    // }
    //
    // this.videoTag.muted = true;
    //
    // if (this.videoStream !== null) {
    //   this.videoTag.srcObject = this.videoStream;
    // }
    const divElement = document.createElement("div");
    divElement.id = "local-player";
    divElement.className = "player";
    if (this.getDisplayListWrapRef() && this.getDisplayListWrapRef().current) {
      this.getDisplayListWrapRef().current.prepend(divElement);
    }
  }

  public addVideoTag() {
    if (this.getDisplayListWrapRef() && this.getDisplayListWrapRef().current) {
      this.getDisplayListWrapRef().current.prepend(this.videoTag);
    }
  }

}
