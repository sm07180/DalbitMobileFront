import React, { useContext } from "react";
import styled, { css } from "styled-components";

import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

import LevelUpImg from "./static/img_level_bg.svg";
import DalIcon from "./static/ic_moon_l.svg";
import ByulIcon from "./static/ic_star_l.svg";
import "./index.scss";

function LevelUpLayerComponent() {
  const { dimLayer, dispatchDimLayer } = useContext(BroadcastLayerContext);

  const { others } = dimLayer;

  const { level, grade, dal, byul, frameName, frameImg, frameColor, image } = others;

  return (
    <>
      <div
        id="broadcast-level-up-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img src={LevelUpImg} className="level-up-bg" />

        <div className="imageWrap">
          <img src={frameImg} className="holder" />
          <img src={image} className="image" />
        </div>

        <div className="reward">
          <LevelBox frameColor={frameColor}>
            Lv{level}.{grade}
          </LevelBox>
          <h3>레벨 보상</h3>
          {(dal !== 0 || byul !== 0) && (
            <div className="reward__cnt">
              {dal !== 0 && (
                <div>
                  <img src={DalIcon} />
                  <span>달 {dal}</span>
                </div>
              )}
              {byul !== 0 && (
                <div>
                  <img src={ByulIcon} />
                  <span>별 {byul}</span>
                </div>
              )}
            </div>
          )}
          <div className="reward__frame">
            <img src={frameImg} />
            <span>{frameName}</span>
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            dispatchDimLayer({
              type: "INIT",
            });
          }}
        >
          확인
        </button>
      </div>
    </>
  );
}

export default LevelUpLayerComponent;

const LevelBox = styled.div`
  width: max-content;
  padding: 4px 20px;
  ${(props) => {
    if (props.frameColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.frameColor[0]}, ${props.frameColor[1]} 51%, ${props.frameColor[2]});
      `;
    } else {
      return css`
        background-color: ${props.frameColor[0]};
      `;
    }
  }};
  border-radius: 14px;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-align: center;
`;
