import React, { useEffect } from "react";

import { DalbitScroll } from "common/ui/dalbit_scroll";

export default (props) => {
  const { setPopupState } = props;

  const closePopup = () => {
    setPopupState(false);
  };
  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer">
        <h3>타이틀 있을경우</h3>
        <div className="layerContent">
          레이어 컨텐츠 커스텀 영역 <br />
          bgColor : default(white) / isGray 클래스 추가시 (gray)
          <div className="btnWrap">
            <button className="btn">확인</button>
          </div>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>

      <div className="layerContainer isGray">
        <h3>타이틀 있을경우</h3>
        <div className="layerContent">
          레이어 컨텐츠 커스텀 영역 <br />
          bgColor : default(white) / isGray 클래스 추가시 (gray)
          <div className="btnWrap">
            <button className="btn btn_cancel">취소</button>
            <button className="btn btn_ok">확인</button>
          </div>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>

      <div className="layerContainer isPropsType">
        <div className="layerContent">{props.children}</div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>

      <div className="layerContainer">
        <div className="layerContent">
          타이틀 없을경우
          <br /> 레이어 컨텐츠 커스텀 영역 <br />
          bgColor : default(white) / isGray 클래스 추가시 (gray)
          <div className="btnWrap">
            <button className="btn">확인</button>
          </div>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>

      <div className="layerContainer isCenter">
        <div className="layerContent">
          타이틀 없을경우
          <br /> 가운데정렬가운데정렬가운데정렬가운데정렬
          <div className="btnWrap">
            <button className="btn btn_cancel">취소</button>
            <button className="btn btn_ok isDisable">확인</button>
          </div>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
};
