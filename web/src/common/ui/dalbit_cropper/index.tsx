import React, { useEffect, useState, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";
import Cropper from "react-cropper";
import Header from "common/ui/header";

import CropImg from "./static/ico-crop.png";
import CropRotation from "./static/ico-rotation.png";

import "./index.scss";
import {useSelector} from "react-redux";

/** PropsType */
type PropsType = {
  /** Input onChange 로 받는 Event 객체 */
  imgInfo: any;
  /** 부모에서 이 Component를 Rendering 할지 결정하는 Boolean */
  onClose(data: void): void;
  /** 부모의 Image 와 Alert 관련 오브젝트<br />
   * status === true ? 성공 : 실패 <br />
   * fileName: Upload 할 file이름 <br />
   * content: Alert 에 들어갈 내용 or DataURL
   */
  onCrop(value: { status: boolean; fileName: string; content: string }): void;
  /** ClassName */
  className?: string;
  type?: string;
};

function DalbitCropper(props: PropsType) {
  const { imgInfo, onClose, onCrop, className, type } = props;
  const { pathname } = useLocation();
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const mailboxChattingUrl = pathname.startsWith("/mailbox");
  const [state, setState] = useState<any>({
    status: true,
    fileName: "",
    content: "",
  });
  const [cropper, setCropper] = useState<any>(null);

  const rotateImage = useCallback(() => {
    if (cropper) {
      cropper.rotate(90);
    }
  }, [state, cropper]);

  const cropImage = useCallback(() => {
    if (cropper) {
      setState({
        ...state,
        content: cropper.getCroppedCanvas()?.toDataURL(),
      });
    }
  }, [state, cropper]);

  const submit = useCallback(() => {
    onCrop({
      ...state,
      content: cropper.getCroppedCanvas()?.toDataURL(),
    });
    onClose();
  }, [state, cropper]);

  useEffect(() => {
    const uploadSingleFile = (e) => {
      const target = e.target;
      if (target.files.length === 0) {
        setState({
          ...state,
          status: false,
        });
        return;
      }
      let reader = new FileReader();
      const file = target.files[0];
      const fileName = file.name;
      const fileSplited = fileName.split(".");
      const fileExtension = fileSplited.pop();
      const extValidator = (ext) => {
        const list = ["jpg", "jpeg", "png", "PNG"];
        return list.includes(ext);
      };
      if (!extValidator(fileExtension)) {
        setState({
          ...state,
          status: false,
          content: "jpg, png 이미지만 사용 가능합니다.",
        });
        return;
      }
      reader.readAsDataURL(target.files[0]);
      reader.onload = async () => {
        if (reader.result) {
          setState({
            status: true,
            content: reader.result,
            fileName: fileName,
          });
        } else {
          setState({
            ...state,
            status: false,
            content: "예상치 못한 에러 발생",
          });
        }
      };
    };

    if (imgInfo) {
      uploadSingleFile(imgInfo);
    }
  }, [imgInfo]);

  useEffect(() => {
    if (state) {
      if (state.status === false) {
        onCrop({ ...state });
        onClose();
      }
    }
  }, [state]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className={`croperWrap ${className} ${
        (globalState.isShowPlayer || (globalState.clipPlayer !== null && globalState.clipInfo)) && mailboxChattingUrl !== true
          ? "gutter"
          : ""
      }`}
    >
      <Header type="noBack">
        <button className={`btnClose btnCloseWhite`} onClick={() => onClose()} type="button">
          뒤로가기
        </button>
      </Header>

      <Cropper
        style={{ height: "calc(100vh - 163px)", width: "100%", display: "flex", alignItems: "center" }}
        initialAspectRatio={1}
        preview=".img-preview"
        src={state && state.status !== false ? state.content : undefined}
        viewMode={1}
        guides={false}
        minCropBoxWidth={100}
        minCropBoxHeight={100}
        background={false}
        autoCropArea={1}
        responsive={true}
        checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
        zoomable={false}
      />
      <div className="btnBox">
        <button onClick={rotateImage} type="button">
          <img src={CropRotation} alt="회전" />
        </button>
        <button className="cropButton" onClick={cropImage} type="button">
          <img src={CropImg} alt="자르기" />
        </button>
        <button className="btn__save" onClick={submit} type="button">
          {type === "chatting" ? "보내기" : "저장"}
        </button>
      </div>
    </div>
  );
}

export default DalbitCropper;
