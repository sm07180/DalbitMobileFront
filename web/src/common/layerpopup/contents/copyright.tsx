import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
    <Content>
      <div id="layerPopup" onClick={closePopupDim}>
        <div className="layerContainer">
          <div className="layerContent">
            <div className="copyDetail">
              <h3 className="copyDetail__title">저작권 주의 사항</h3>
              <div className="copyDetail__content">
                저작권법의 보호를 받는 음악 저작물, 영상 저작물, 사진 저작물 등 저작권과 초상권 침해에 위반되는 경우 운영자가
                방송방을 강제 종료할 수 있으며 컨텐츠가 삭제될 수 있습니다. 저작권법을 위반하는 경우 저작권 침해로서 관련법에 따라
                처벌될 수 있습니다.
              </div>
              <div className="copyDetail__sub">
                <strong>저작권 침해 예시</strong>
                <ul>
                  <li>- 한국음악저작권협회 미등록 저작물</li>
                  <li>- 노래방 반주 </li>
                  <li>- 연예인 사진</li>
                </ul>
              </div>
            </div>
          </div>
          <button className="btnClose" onClick={closePopup}>
            닫기
          </button>
        </div>
      </div>
    </Content>
  );
}

const Content = styled.div`
  .copyDetail {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 14px;
    text-align: center;
    &__title {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
      letter-spacing: -0.5px;
      color: #ff3c7b;
    }
    &__content {
      width: 286px;
      margin: 32px 0 20px;
      color: #424242;
      font-size: 14px;
      line-height: 1.71;
      letter-spacing: -0.35px;
    }
    &__sub {
      width: 288px;
      background: #f5f5f5;
      padding: 20px 48px;
      box-sizing: border-box;
      border-radius: 10px;
      strong {
        color: #616161;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.3px;
      }
      ul {
        margin-top: 14px;
        li {
          margin-top: 6px;
          color: #616161;
          letter-spacing: -0.3px;
          font-size: 12px;
          text-align: left;
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
`;
