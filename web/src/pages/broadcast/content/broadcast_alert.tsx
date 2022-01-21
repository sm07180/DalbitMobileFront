import React, { useEffect } from "react";
import styled from "styled-components";

export default function BroadcastAlert(props: { type: string }) {
  const { type } = props;

  function typeRender(type: string) {
    switch (type) {
      case "abcd": {
        return (
          <div className="inner-wrap">
            <div>매니저해제</div>
            <div>해제하시겠습니까?</div>
          </div>
        );
      }
    }
  }

  return <BroadcastAlertWrap>{typeRender(type)}</BroadcastAlertWrap>;
}

const BroadcastAlertWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .inner-wrap {
    padding: 12px;
    background-color: #fff;
    border-radius: 10px;
  }
`;
