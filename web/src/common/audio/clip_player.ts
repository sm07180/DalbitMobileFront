export class ClipPlayerHandler {
  public clipAudioTag?: HTMLAudioElement | null;
  public restart: () => void;
  public clipNo: string;
  public replay: (url: string) => void;
  public start: () => void;
  public stop: () => void;
  //
  public loopStart: () => void;
  public loopEnd: () => void;
  //
  public init: (url) => void;
  public duration: number;
  public isPaused: boolean | undefined;
  public isLoop: boolean | undefined;
  private ended: () => void;
  public globalAction: any | null;
  public globalState: any | null;
  public clipExit: () => void;
  public clipNoUpdate: (clipNo) => void;
  public isPlayingIdx?: number;
  public findPlayingClip: (clipNo) => void;
  public save60seconds: number;
  private saveTimer: any;
  public initSave60seconds: () => void;

  setGlobalAction(action: any) {
    this.globalAction = action;
  }
  setGlobalState(state: any) {
    this.globalState = state;
  }

  constructor(info: any) {
    this.clipNo = info.clipNo;
    this.clipAudioTag = document.createElement("audio");
    this.clipAudioTag.muted = false;
    this.clipAudioTag.src = info.file?.url;
    this.clipAudioTag.loop = false;
    this.save60seconds = 0;
    this.saveTimer = null;

    this.clipNoUpdate = (clipNo) => {
      this.clipNo = clipNo;
    };

    this.duration = 0;

    this.isPaused = this.clipAudioTag?.paused;

    this.loopStart = () => {
      this.clipAudioTag!.loop = true;
    };
    this.loopEnd = () => {
      this.clipAudioTag!.loop = false;
    };
    this.clipAudioTag.addEventListener("loadedmetadata", (e) => {});
    this.globalAction = null;

    this.ended = () => {
      this.globalAction.dispatchClipInfo({ type: "add", data: { isPaused: true, isSaved60seconds: false } });
      clearInterval(this.saveTimer);
    };
    this.clipAudioTag.addEventListener("ended", this.ended);

    this.start = () => {
      const playPromise = this.clipAudioTag?.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            this.globalAction.dispatchClipInfo({ type: "add", data: { isPaused: false, isSaved60seconds: false } });
            if (this.save60seconds < 59) {
              clearInterval(this.saveTimer);
              this.saveTimer = setInterval(() => {
                if (this.save60seconds >= 59) {
                  clearInterval(this.saveTimer);
                  this.globalAction.dispatchClipInfo({ type: "add", data: { isSaved60seconds: true } });
                } else {
                  this.save60seconds = this.save60seconds + 1;
                }
              }, 1000);
            }
          })
          .catch((error) => {});
      }
    };

    this.initSave60seconds = () => {
      this.save60seconds = 0;
    };

    this.restart = () => {
      this.clipAudioTag?.pause();
      this.clipAudioTag!.currentTime = 0;
      this.start();
    };

    this.init = (url) => {
      if (this.clipAudioTag?.src === url) {
        if (this.clipAudioTag?.error) {
          this.clipAudioTag!.src = url;
        } else {
          //플로팅 설정 후 수정
          //this.clipAudioTag?.play();
          // this.restart();
        }
      } else {
        this.clipAudioTag!.src = url;
        this.save60seconds = 0;
      }

      if (this.saveTimer === null && this.save60seconds === 0) {
        clearInterval(this.saveTimer);
        this.saveTimer = null;
      }
    };

    this.replay = (url) => {
      this.clipAudioTag?.pause();
      this.clipAudioTag!.src = url;
      this.start();
    };

    this.stop = () => {
      this.clipAudioTag?.pause();
      this.globalAction.dispatchClipInfo({ type: "add", data: { isPaused: true, isSaved60seconds: false } });
      clearInterval(this.saveTimer);
    };

    this.clipExit = () => {
      this.stop();
      this.globalAction.dispatchClipInfo({ type: "empty", data: {} });
      this.globalAction.dispatchClipPlayer({ type: "empty", data: {} });
      this.clipAudioTag = null;
      sessionStorage.removeItem("clip");
      clearInterval(this.saveTimer);
    };

    this.findPlayingClip = (clipNo) => {
      const { clipPlayListTab } = this.globalState;
      const playingIdx = clipPlayListTab.indexOf(clipPlayListTab.find((item) => item.clipNo === clipNo));
      this.isPlayingIdx = playingIdx;
    };
  }
}
