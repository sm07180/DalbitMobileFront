import React, {useCallback, useContext, useEffect, useState} from "react";
import {broadcastEdit, getBroadcastSetting, postImage} from "common/api";
import {DalbitScroll} from "common/ui/dalbit_scroll";
// constant
import {tabType} from "pages/broadcast/constant";

import LayerCopyright from "../../../../common/layerpopup/contents/copyright";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {
  setBroadcastCtxRightTabType,
  setBroadcastCtxRoomInfoSettingUpdate
} from "../../../../redux/actions/broadcastCtx";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";

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
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
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
        const { result, data } = await postImage({
          dataURL: reader.result,
          uploadType: "bg",
        });

        if (result === "success") {
          if (data instanceof Object) {
            setBroadBg(data["thumb336x336"]);
            setBgPath(data.path);
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
            content: result,
          }));
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
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "?????? ????????? 3??? ?????? ??????????????????",
      }));
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
      dispatch(setBroadcastCtxRoomInfoSettingUpdate(data));
      dispatch(setBroadcastCtxRightTabType(tabType.LIVE));

      return (
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "???????????? ?????????????????????.",
        })
      ));
    } else if (result === "fail") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
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
      <h3 className="tabTitle">?????? ??????</h3>
      <div className="settingWrap">
        <DalbitScroll width={345}>
          <div className="wrap">
            <div className="title">????????????</div>
            <div className="accessListWrap">
              {AccessList.map((v) => {
                return (
                  <button className={`${roomInfo.entryType === v.id && "on"}`} key={v.id} disabled={true}>
                    {v.name}
                  </button>
                );
              })}
            </div>
            {globalState.splash?.roomType.length > 0 && (
              <>
                <div className="title">????????????</div>
                <div className="roomTypeListWrap">
                  {globalState.splash?.roomType.map((v, idx) => {
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
              ?????? ?????? <span className="title__subText">?????? ?????? ???????????? ??????????????????.</span>
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
                <div className="title">????????? LIVE ?????? ??????</div>
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

            <div className="title">?????? ??????</div>
            <div className="inputBox">
              <input
                className="input"
                placeholder="????????? ?????????????????? (3~20??? ??????)"
                value={title}
                onChange={(e) => onChangeTitle(e)}
              />
              <p className="textNumber">{title && title.length}/20</p>
            </div>

            <div className="title">?????????</div>
            <div className="inputBox">
              <textarea
                className="textarea"
                placeholder="???????????? ???????????? ????????? ??? ?????? ???????????? ??????????????????.&#13;&#10;(10 ~ 100??? ??????)"
                value={welcomeMsg}
                onChange={(e) => onChangeWelcome(e)}
              ></textarea>
              <p className="textNumber textNumber__padding">{welcomeMsg && welcomeMsg.length}/100</p>
            </div>

            {/* <div className="title">?????? ??????</div>
            <div className="inputBox boxWrap">
              <div className="buttonBox">
                <span>?????? ????????? ??????</span>
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
                <span>?????? ????????? ??????</span>
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
              ????????? ????????????
            </div>
            <button onClick={onSubmit} className={title && title.length > 2 ? "button button--active" : "button"}>
              ????????????
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
    name: "????????????",
  },
  {
    id: 1,
    name: "??? ??? ??????",
  },
  {
    id: 2,
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
