import React, { useEffect, useContext } from "react";
import styled from "styled-components";

export default ({ setEffectPop, webpImg }) => {
  const closePopup = () => {
    setEffectPop(false);
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layer-popup") {
      closePopup();
    }
  };

  //--------------------------
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <PopupWrap id="layer-popup" onClick={closePopupDim}>
      <div className="content-wrap">
        <button className="close-btn" onClick={() => closePopup()}>
          <img src="https://image.dallalive.com/svg/close_w_l.svg" alt="닫기" />
        </button>
        <div className="webpBox">
          <img src={webpImg} width={300} alt="입장효과" />
        </div>
      </div>
    </PopupWrap>
  );
};

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 16px;
    padding-top: 12px;
    border-radius: 12px;

    .close-btn {
      position: absolute;
      top: -40px;
      right: 0;
    }

    .webpBox {
      text-align: center;
    }
  }
`;
