import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { broadcastEdit, postImage, getBroadcastSetting } from "common/api";
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
import { DalbitScroll } from "common/ui/dalbit_scroll";
// constant
import { tabType } from "pages/broadcast/constant";

import LayerCopyright from "../../../../common/layerpopup/contents/copyright";
import styled from "styled-components";

type State = {
  entryType: number;
  roomType: string;
  bgImg: string;
  title: string;
  welcomeMsg: string;
};

type Action = {
  type: string;
  val: any;
};

export default function Setting(props: { roomInfo: roomInfoType; roomNo: string }) {
  const { roomInfo, roomNo } = props;

  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastAction } = useContext(BroadcastContext);
  const [broadBg, setBroadBg] = useState<string | ArrayBuffer>(roomInfo.bgImg.url);
  const [bgPath, setBgPath] = useState<string>("");
  const [title, setTitle] = useState<string>(roomInfo.title);
  const [welcomeMsg, setWelcomeMsg] = useState<string>(roomInfo.welcomMsg);
  const [imageType, setImageType] = useState<number>(roomInfo.imageType || 1);
  const [djListenerIn, setDjListenerIn] = useState<boolean>(false);
  const [djListenerOut, setDjListenerOut] = useState<boolean>(false);
  const [popupState, setPopupState] = useState<boolean>(false);

  const [roomType, setRoomType] = useState("");

  const BgImageUpload = (e: any) => {
    if (e.currentTarget.files.length === 0) return;
    const reader = new FileReader();
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
        const { result, data } = await postImage({
          dataURL: reader.result,
          uploadType: "bg",
        });

        if (result === "success") {
          if (data instanceof Object) {
            setBroadBg(data["thumb336x336"]);
            setBgPath(data.path);
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
              content: result,
            });
          return;
        }
      }
    };
  };

  const NoticeAlert = () => {
    setPopupState(true);
  };

  const onSubmit = async () => {
    if (title.length < 3) {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: "방송 제목을 3자 이상 입력해주세요",
        });
      return;
    }
    const { result, data, message } = await broadcastEdit({
      roomNo: roomNo,
      roomType: "03",
      title: title,
      bgImg: bgPath,
      welcomMsg: welcomeMsg,
      bgImgRacy: 0,
      imageType: imageType,
      djListenerIn,
      djListenerOut,
    });

    if (result === "success") {
      broadcastAction.dispatchRoomInfo &&
        broadcastAction.dispatchRoomInfo({
          type: "broadcastSettingUpdate",
          data: data,
        });

      broadcastAction.setRightTabType && broadcastAction.setRightTabType(tabType.LIVE);

      return (
        globalAction.callSetToastStatus &&
        globalAction.callSetToastStatus({
          status: true,
          message: "방송방이 수정되었습니다.",
        })
      );
    } else if (result === "fail") {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: message,
        });
    }
  };

  const fetchBroadcastSetting = useCallback(async () => {
    const { result, data } = await getBroadcastSetting();
    if (result === "success") {
      const { djListenerIn, djListenerOut } = data;
      setDjListenerIn(djListenerIn);
      setDjListenerOut(djListenerOut);
    }
  }, []);
  const onChangeTitle = (e) => {
    const { value } = e.target;
    if (value.length > 20) {
      return null;
    } else {
      setTitle(value);
    }
  };
  const onChangeWelcome = (e) => {
    const { value } = e.target;
    if (value.length > 100) {
      return null;
    } else {
      setWelcomeMsg(value);
    }
  };
  //
  useEffect(() => {
    const { rtcInfo } = globalState;
    if (rtcInfo !== null) {
      rtcInfo.setRoomInfo(roomInfo);
    }
  }, [roomInfo]);

  useEffect(() => {
    fetchBroadcastSetting();
  }, []);

  return (
    <>
      <h3 className="tabTitle">방송 설정</h3>
      <div className="settingWrap">
        <DalbitScroll width={345}>
          <div className="wrap">
            <div className="title">입장제한</div>
            <div className="accessListWrap">
              {AccessList.map((v) => {
                return (
                  <button className={`${roomInfo.entryType === v.id && "on"}`} key={v.id} disabled={true}>
                    {v.name}
                  </button>
                );
              })}
            </div>
            {globalState.splashData?.roomType.length > 0 && (
              <>
                <div className="title">방송주제</div>
                <div className="roomTypeListWrap">
                  {globalState.splashData?.roomType.map((v, idx) => {
                    const { cdNm, cd } = v;
                    return (
                      <button onClick={() => setRoomType(cd)} className={`${roomType === cd && "on"}`} key={idx}>
                        {cdNm}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div className="title">
              사진 등록 <span className="title__subText">방송 배경 이미지를 등록해주세요.</span>
            </div>

            <Photo className="photo" broadBg={broadBg}>
              <label htmlFor="profileImg" className={broadBg !== "" ? "bgLabel bgLabel--active" : "bgLabel"}></label>
              <input
                type="file"
                id="profileImg"
                accept="image/jpg, image/jpeg, image/png, image/gif"
                onChange={BgImageUpload}
                className="bgUploader"
              />
              {broadBg !== "" && <div className="fakeBox" />}
            </Photo>

            {globalState.userProfile && globalState.userProfile.badgeSpecial > 0 && (
              <>
                <div className="title">실시간 LIVE 사진 노출</div>
                <div className="imageTypeWrap">
                  {ImageList.map((item: { name: string; id: number }, idx: number) => {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setImageType(item.id);
                        }}
                        className={`${imageType === item.id && "on"}`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div className="title">방송 제목</div>
            <div className="inputBox">
              <input
                className="input"
                placeholder="제목을 입력해주세요 (3~20자 이내)"
                value={title}
                onChange={(e) => onChangeTitle(e)}
              />
              <p className="textNumber">{title && title.length}/20</p>
            </div>

            <div className="title">인사말</div>
            <div className="inputBox">
              <textarea
                className="textarea"
                placeholder="청취자가 방송방에 들어올 때 자동 인사말을 입력해보세요.&#13;&#10;(10 ~ 100자 이내)"
                value={welcomeMsg}
                onChange={(e) => onChangeWelcome(e)}
              ></textarea>
              <p className="textNumber textNumber__padding">{welcomeMsg && welcomeMsg.length}/100</p>
            </div>

            {/* <div className="title">방송 옵션</div>
            <div className="inputBox boxWrap">
              <div className="buttonBox">
                <span>입장 메시지 노출</span>
                <button
                  className={`${djListenerIn === true && "on"}`}
                  onClick={() => {
                    setDjListenerIn(!djListenerIn);
                    modifyBroadcastSetting({
                      djListenerIn: !djListenerIn,
                      djListenerOut: djListenerOut,
                    });
                  }}
                />
              </div>
              <div className="buttonBox">
                <span>퇴장 메시지 노출</span>
                <button
                  className={`${djListenerOut === true && "on"}`}
                  onClick={() => {
                    setDjListenerOut(!djListenerOut);
                    modifyBroadcastSetting({
                      djListenerIn: djListenerIn,
                      djListenerOut: !djListenerOut,
                    });
                  }}
                />
              </div>
            </div> */}

            <div className="notice" onClick={NoticeAlert}>
              저작권 주의사항
            </div>
            <button onClick={onSubmit} className={title && title.length > 2 ? "button button--active" : "button"}>
              수정하기
            </button>
          </div>
        </DalbitScroll>
        {popupState && <LayerCopyright setPopupState={setPopupState} />}
      </div>
    </>
  );
}

const AccessList = [
  {
    id: 0,
    name: "모두입장",
  },
  {
    id: 1,
    name: "팬 만 입장",
  },
  {
    id: 2,
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

const Photo = styled.div`
  background: ${(props: any) => (props.broadBg ? `url(${props.broadBg})` : "#f5f5f5")} no-repeat center;
  background-size: contain;
  margin: 26px 0 30px 0;
  position: relative;
  display: flex;
  width: 100%;
  height: 264px;
  cursor: pointer;
`;
