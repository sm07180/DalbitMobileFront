import React, { useEffect, useContext } from "react";
import styled from "styled-components";

// image
import btnClose from "common/static/image/mic_alarm_close_g.png";
import TipIcon from "../static/ic_tip.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxTooltipStatus} from "../../redux/actions/globalCtx";

export const TooltipUI = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { message, status } = globalState.tooltipStatus;

  const closeTooltip = () => {
    dispatch(setGlobalCtxTooltipStatus({ status: false }));
  };

  return (
    <>
      {globalState.tooltipStatus.type === "system" ? (
        <TipStyled>
          <img src={TipIcon} />
          <div className="content">{message}</div>
        </TipStyled>
      ) : (
        <TooltipStyled style={{ ...globalState.tooltipStatus.style }}>
          <div className="content">
            {message}
            <button className="close-img" onClick={closeTooltip}>
              <img src={btnClose} alt="닫기" />
            </button>
          </div>
        </TooltipStyled>
      )}
    </>
  );
};

export default React.memo(TooltipUI);

const TooltipStyled = styled.div`
  position: absolute;
  top: 135px;
  left: 13px;
  width: calc(100% - 26px);
  height: 34px;
  line-height: 34px;
  align-items: center;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: ${(props: any) => {
    return props.backgroundColor ? props.backgroundColor : "#757575";
  }};
  border-radius: 10px;
  box-sizing: border-box;
  z-index: 4;
  .close-img {
    position: absolute;
    top: 8px;
    right: 14px;
  }
`;

const TipStyled = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  top: 135px;
  left: 13px;
  width: calc(100% - 26px);
  padding: 6px 0;
  background-color: #632beb;
  border-radius: 10px;
  z-index: 4;
  img {
    margin: 0 10px 0 15px;
  }
  .content {
    font-size: 11px;
    font-weight: 300;
    color: white;
    white-space: pre-wrap;
    line-height: 16px;
  }
`;
