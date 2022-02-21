// React
import React, { useContext } from "react";

// Context
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// Remove
import styled from "styled-components";

export default () => {
  const { dimLayer, dispatchDimLayer } = useContext(BroadcastLayerContext);

  const { others } = dimLayer;

  const { dlgTitle, dlgText } = others;

  return (
    <div
      id="modal"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <FullMoon>
        <div className="full_moon">
          <p>{dlgTitle}</p>
          <span>{dlgText}</span>

          <button
            onClick={() => {
              dispatchDimLayer({
                type: "INIT",
              });
            }}
          >
            확인
          </button>
        </div>
      </FullMoon>
    </div>
  );
};

const FullMoon = styled.div`
  width: 300px;
  padding: 0 12px;
  background-color: #fff;
  border-radius: 20px;
  color: #000;
  z-index: 9;

  .full_moon {
    margin-top: 32px;
    white-space: pre-wrap;
    text-align: center;

    p {
      font-weight: $bold;
    }

    span {
      font-weight: 300;
    }

    button {
      width: 100%;
      margin: 24px 0 12px 0;
      padding: 12px 0;
      background-color: #FF3C7B;
      border-radius: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
  }
`;
