import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from "react";
import { GlobalContext } from "context";
import { useHistory, useLocation } from "react-router-dom";
import { postImage, postAudio, postClip, getClipType, selfAuthCheck } from "common/api";
import "./upload.scss";
import closeIcon from "./static/ic_close_round.svg";
import LayerCopyright from "../../common/layerpopup/contents/copyright";
export default function Cast() {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;

  const { globalState, globalAction } = useContext(GlobalContext);

  const fileInput = useRef<HTMLInputElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);

  const [audioPath, setAudioPath] = useState("");
  const [audioName, setAudioName] = useState("");
  const [audioPlayTime, setAudioPlaytime] = useState("");
  const [audioSize, setAudioSize] = useState("");
  const [listenType, setListenType] = useState(-1);
  const [themeList, setThemeList] = useState<any[]>([]);
  const [themeType, setThemeType] = useState("000");
  const [title, setTitle] = useState("");
  const [coverTitle, setCoverTitle] = useState("");
  const [coverSinger, setCoverSinger] = useState("");
  const [publicState, setPublicState] = useState(-1);
  const [imgSrc, setImgSrc] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [validatePass, setValidatePass] = useState(false);
  const [popupState, setPopupState] = useState<boolean>(false);
  const listenTypeList = ["모두 청취", "팬만 청취", "20세 이상"];

  useEffect(() => {
    if (audioPath && listenType !== -1 && themeType !== "000" && title.length > 1 && publicState !== -1) {
      setValidatePass(true);
    } else {
      setValidatePass(false);
    }
  }, [audioPath, listenType, themeType, publicState, imgPath]);

  useEffect(() => {
    if (themeType !== "01") {
      setCoverTitle("");
      setCoverSinger("");
    }
  }, [themeType]);

  useEffect(() => {
    if (state !== undefined) {
      audioFileUpload(state);
    }
  }, [state]);

  useEffect(() => {
    const fetchDataClipType = async () => {
      const { result, data, message } = await getClipType({});
      if (result === "success") {
        setThemeList(data);
      } else {
        globalAction.setAlertStatus!({
          status: true,
          content: message,
        });
      }
    };
    fetchDataClipType();
  }, []);

  const calcTime = (time: any) => {
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
  };

  const audioFileUpload = (obj) => {
    let file;
    if (obj.hasOwnProperty("currentTarget")) {
      if (obj.currentTarget.files.length === 0) return;
      file = obj.currentTarget.files[0];
    } else {
      file = obj;
    }

    const audioContext = new AudioContext();
    const reader = new FileReader();

    if (!/\.(|mp3|m4a)$/i.test(file.name)) {
      return globalAction.setAlertStatus!({
        status: true,
        content: "mp3, m4a 형식의 파일만 등록 가능합니다.",
      });
    }

    if (file.size / 1024 > 30720) {
      return globalAction.setAlertStatus!({
        status: true,
        content: "첨부 파일 용량이 초과되었습니다. 최대 30MB까지 첨부 가능합니다.",
      });
    }

    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      let myArrayBuffer = reader.result;
      if (myArrayBuffer instanceof ArrayBuffer)
        audioContext.decodeAudioData(myArrayBuffer, async (audioBuffer) => {
          let duration = Math.floor(audioBuffer.duration);
          if (duration > 600) {
            return globalAction.setAlertStatus!({
              status: true,
              content: "파일 재생시간이 10분을 초과하였습니다. 최대 10분 재생시간의 파일까지 첨부 가능합니다.",
            });
          } else if (duration < 30) {
            return globalAction.setAlertStatus!({
              status: true,
              content: "파일 재생시간이 30초 미만입니다. 30초 이상의 파일을 첨부해주세요.",
            });
          } else {
            const { result, message, data } = await postAudio({
              file: file,
              uploadType: "clip-record",
            });
            if (result === "success") {
              setAudioName(file.name);
              setAudioPath(data.path);
              setAudioPlaytime(calcTime(duration));
              setAudioSize(String(Math.floor(file.size / 1024)));
            } else {
              globalAction.setAlertStatus!({
                status: true,
                content: message,
              });
            }
          }
        });
    };
  };

  const imageFileUpload = (e) => {
    const target = e.currentTarget;
    if (target.files.length === 0) return;
    let reader = new FileReader();
    const file = target.files[0];

    if (!/\.(|jpg|jpeg|png|PNG)$/i.test(file.name)) {
      return globalAction.setAlertStatus!({
        status: true,
        content: "jpg, png 이미지만 사용 가능합니다.",
      });
    }

    reader.readAsDataURL(target.files[0]);
    reader.onload = async () => {
      if (reader.result) {
        const { result, data } = await postImage({
          dataURL: reader.result,
          uploadType: "clip-bg",
        });
        if (result === "success") {
          setImgSrc(data.url);
          setImgPath(data.path);
        } else {
          globalAction.setAlertStatus!({
            status: true,
            content: "사진 업로드에 실패하였습니다.\n다시 시도해주세요.",
          });
        }
      }
    };
  };

  const clipUpload = async () => {
    let param = {
      subjectType: themeType,
      title: title,
      entryType: listenType,
      openType: publicState,
      bgImg: imgPath,
      fileName: audioName,
      filePath: audioPath,
      filePlayTime: audioPlayTime,
      fileSize: audioSize,
    };
    if (themeType === "01") {
      Object.assign(param, { coverTitle: coverTitle });
      Object.assign(param, { coverSinger: coverSinger });
    }
    const { result, message, data } = await postClip({ ...param });
    if (result === "success") {
      globalAction.setAlertStatus!({
        status: true,
        content: "클립 업로드 성공하였습니다.",
        callback: () => {
          history.push(`/clip/${data.clipNo}`);
        },
        cancelCallback: () => {
          history.push(`/clip/${data.clipNo}`);
        },
      });
    } else {
      globalAction.setAlertStatus!({
        status: true,
        content: message,
      });
    }
  };
  const checkUpload = () => {
    globalAction.setAlertStatus!({
      status: true,
      title: "클립 업로드 시 유의 사항",
      titleStyle: {
        paddingBottom: "10px",
        borderBottom: "1px solid #e0e0e0",
      },
      type: "confirm",
      content: "음원, MR 등 직접 제작하지 않은<br>클립은 삭제될 수 있습니다.<br><br>등록하시겠습니까?",
      callback: () => clipUpload(),
    });
  };

  const makeListenTypeBtn = () => {
    return listenTypeList.map((item, idx) => {
      return (
        <button
          key={idx}
          onClick={() => {
            if (idx === 2 && globalState.userProfile!.age < 20) {
              return globalAction.setAlertStatus!({
                status: true,
                content: "20세 이상 회원이 아닙니다.",
              });
            }
            setListenType(idx);
          }}
          className={listenType === idx ? "on" : "off"}
        >
          {item}
        </button>
      );
    });
  };

  const handleAudioUploadCancel = () => {
    if (state !== undefined) {
      return globalAction.setAlertStatus!({
        type: "confirm",
        status: true,
        content: "다시 녹음하시겠습니까? 현재 녹음된 내용은 저장되지 않습니다.",
        callback: () => {
          history.goBack();
        },
      });
    } else {
      return globalAction.setAlertStatus!({
        type: "confirm",
        status: true,
        content: "업로드 된 파일을 삭제하시겠습니까?",
        callback: () => {
          setAudioPath("");
        },
      });
    }
  };

  const makeUploadArea = () => {
    if (audioPath) {
      return (
        <div className="uploadedArea">
          <p>{audioName}</p>
          <button onClick={handleAudioUploadCancel}>
            <img src={closeIcon} alt="삭제" />
          </button>
        </div>
      );
    } else {
      return (
        <div
          className="uploadArea"
          onClick={() => {
            fileInput!.current!.value = "";
          }}
        >
          <p>
            업로드할 파일을 첨부해주세요.
            <br /> 파일은 <strong>최대 10분</strong>까지 재생됩니다.
          </p>
          <label htmlFor="audioInputFile"></label>
        </div>
      );
    }
  };

  const makeThemeTypeBtn = () => {
    if (themeList.length === 0) return null;
    return themeList.map((item, idx) => {
      const { cdNm, value, isUse } = item;
      if (!isUse) return null;
      return (
        <button
          key={idx}
          onClick={() => {
            setThemeType(value);
          }}
          className={themeType === value ? "on" : "off"}
        >
          {cdNm}
        </button>
      );
    });
  };

  const NoticeAlert = () => {
    setPopupState(true);
  };

  const makeImageUploadArea = () => {
    if (imgSrc) {
      return (
        <div
          className="imgUploadedArea"
          style={{ backgroundImage: `url(${imgSrc})`, backgroundSize: "cover" }}
          onClick={() => {
            imgInput!.current!.value = "";
          }}
        >
          <p>
            <span>사진등록</span>
          </p>
          <label htmlFor="imgInputFile"></label>
        </div>
      );
    } else {
      return (
        <div className="imgUploadArea">
          <p>사진등록</p>
          <label htmlFor="imgInputFile"></label>
        </div>
      );
    }
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

  //if (!authState) return null;

  return (
    <div className="castAudioUpload">
      <div className="headerTitle">클립 등록</div>
      <input type="file" id="audioInputFile" onChange={audioFileUpload} accept="audio/mp4, audio/mp3" ref={fileInput} />
      {makeUploadArea()}
      <p className="uploadInfoText">※ mp3, m4a 파일만 첨부 가능, 용량 제한 30MB</p>
      <div className="subTitle">청취 제한</div>
      <div className="listenTypeBtn">{makeListenTypeBtn()}</div>
      <div className="subTitle">클립 주제</div>
      <div className="themeTypeBtn">{makeThemeTypeBtn()}</div>

      {themeType === "01" && (
        <>
          <div className="subTitle">
            커버 곡명<em>(선택)</em> <span>{coverTitle.length}/20</span>
          </div>
          <input
            type="text"
            className="inputTitle"
            value={coverTitle}
            placeholder="커버 곡의 제목을 입력해주세요 (20자이내)"
            onChange={(e) => {
              let { value } = e.target;
              value = value.replace(/^\s*/, "");
              if (value.length < 21) {
                setCoverTitle(value);
              }
            }}
            onBlur={(e) => {
              let { value } = e.target;
              value = value.replace(/\s*$/, "");
              setCoverTitle(value);
            }}
          />

          <div className="subTitle">
            커버 가수<em>(선택)</em> <span>{coverSinger.length}/20</span>
          </div>
          <input
            type="text"
            className="inputTitle"
            value={coverSinger}
            placeholder="커버 곡의 가수를 입력해주세요 (20자이내)"
            onChange={(e) => {
              let { value } = e.target;
              value = value.replace(/^\s*/, "");
              if (value.length < 21) {
                setCoverSinger(value);
              }
            }}
            onBlur={(e) => {
              let { value } = e.target;
              value = value.replace(/\s*$/, "");
              setCoverSinger(value);
            }}
          />
        </>
      )}

      <div className="subTitle">
        클립 제목 <span>{title.length}/20</span>
      </div>

      <input
        type="text"
        className="inputTitle"
        value={title}
        placeholder="제목을 입력해주세요 (20자이내)"
        onChange={(e) => {
          let { value } = e.target;
          value = value.replace(/^\s*/, "");
          if (value.length < 21) {
            setTitle(value);
          }
        }}
        onBlur={(e) => {
          let { value } = e.target;
          value = value.replace(/\s*$/, "");
          setTitle(value);
        }}
      />

      <div className="subTitle">공개 설정</div>
      <div className="publicTypeBtn">
        <button className={publicState === 1 ? "on" : "off"} onClick={() => setPublicState(1)}>
          공개
        </button>
        <button className={publicState === 0 ? "on" : "off"} onClick={() => setPublicState(0)}>
          비공개
        </button>
      </div>
      <div className="subTitle">
        사진 등록 <span>클립 이미지를 등록해주세요.</span>
      </div>
      {makeImageUploadArea()}
      <input
        type="file"
        id="imgInputFile"
        accept="image/jpg, image/jpeg, image/png, image/gif"
        onChange={imageFileUpload}
        ref={imgInput}
      />

      <div className="noticeBtnbox">
        <button className="noticeBtn" onClick={NoticeAlert}>
          저작권 유의사항
        </button>
      </div>

      <button className="uploadBtn" disabled={!validatePass} onClick={checkUpload}>
        업로드 하기
      </button>
      {popupState && <LayerCopyright setPopupState={setPopupState} />}
    </div>
  );
}
