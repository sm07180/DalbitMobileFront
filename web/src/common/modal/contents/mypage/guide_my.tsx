import React, { useContext, useState, useEffect } from "react";
// scss
// import "./index.scss";

export default (props) => {
  const { setPopupState, type } = props;

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
        <h3>랭킹 기준</h3>
        <div className="layerContent">
          <ul className="rankGuideWrap">
            <li className="rankGuideWrap__item">
              <strong className="guideTitle">최근 팬 랭킹</strong>
              <p className="guideSub">
                최근 3개월 간 내 방송에서 선물을 많이
                <br />
                보낸 팬 순위입니다.
              </p>
            </li>
            <li className="rankGuideWrap__item">
              <strong className="guideTitle">누적 팬 랭킹</strong>
              <p className="guideSub">
                전체 기간 동안 내 방송에서 선물을 많이
                <br />
                보낸 팬 순위입니다.
              </p>
            </li>
            <li className="rankGuideWrap__item">
              <strong className="guideTitle">선물 전체 랭킹</strong>
              <p className="guideSub">
                팬 여부와 관계없이 내 방송에서 선물한 <br /> 전체 회원 순위입니다.
              </p>
            </li>
            <li className="rankGuideWrap__item">
              <strong className="guideTitle">좋아요 전체 랭킹</strong>
              <p className="guideSub">
                팬 여부와 관계없이 내 방송에서
                <br />
                좋아요(부스터 포함)를 보낸
                <br />
                전체 회원 순위입니다.
              </p>
            </li>
          </ul>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
};
