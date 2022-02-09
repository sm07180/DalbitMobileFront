import React, { useEffect, useState } from "react";

export default function LayerComponent(props: any) {
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
        <h3>개인정보 수집 및 이용에 동의</h3>
        <div className="layerContent">
          - 수집 및 이용 항목 : 닉네임, 이메일, 휴대전화번호
          <br />
          - 수집 및 이용 목적 : 문의에 대한 답변 관련 업무
          <br />
          - 보유및 이용 기간 :<br />
          6개월 - 회사는 문의에 대한 답변을 위한 목적으로 관계법령에 따라 개인정보 수집 및 이용에 동의를 얻어 수집합니다.
          <br />
          <div className="btnWrap">
            <button className="btn">확인</button>
          </div>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
}
