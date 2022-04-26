import React, { useEffect, useState, useContext, useCallback } from "react";
import styled from "styled-components";

import { broadMoon } from "common/api";
import HelpLayer from "./help";

import HintIcon from "../../static/ic_hint.svg";

import "./index.scss";
import {useDispatch} from "react-redux";
import {setGlobalCtxAlertStatus} from "../../../../redux/actions/globalCtx";
type PropsType = {
  roomNo: string;
  toggle(bool: boolean): void;
  helpToggle(bool: boolean): void;
  setMoonInfo(data: any): void;
  moonInfo: {
    [key: string]: any;
  } | null;
};

function ProgressLayer(props: PropsType) {
  const { roomNo, toggle, helpToggle, moonInfo, setMoonInfo } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const { result, data, message } = await broadMoon({ roomNo });

      if (result === "success") {
        setMoonInfo(data);
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: message,
        }));
      }
    };

    fetchData();
  }, []);

  return (
    <div
      id="dim-layer"
      onClick={() => {
        toggle(false);
      }}
    >
      {moonInfo !== null && (
        <div id="broadcast_progress_modal">
          <div className="header">
            {moonInfo.dlgText}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(false);
                helpToggle(true);
              }}
            >
              <img src={HintIcon} />
            </button>
          </div>

          <div className="contents">
            {moonInfo.results instanceof Array &&
              moonInfo.results.length > 0 &&
              moonInfo.results.map((v, i) => {
                return (
                  <div className="contents__row" key={i}>
                    <span className="contents__row--title">{v.labelStr}</span>
                    <Progress division={v.currentCount / v.maxCount}>
                      <span>{v.countStr}</span>
                      <div></div>
                    </Progress>
                  </div>
                );
              })}

            {/* <div className="contents__row">
              <span className="contents__row--title">방송시간</span>
              <Progress division={moonInfo.broadcastTime / moonInfo.targetTime}>
                <span>
                  {moonInfo.textTime}
                </span>
                <div></div>
              </Progress>
            </div>
            <div className="contents__row">
              <span className="contents__row--title">누적 청취자</span>
              <Progress division={moonInfo.totalCount / moonInfo.targetCount}>
                <span>
                  {moonInfo.textCount}
                </span>
                <div></div>
              </Progress>
            </div>
            <div className="contents__row">
              <span className="contents__row--title">선물</span>
              <Progress division={moonInfo.giftedByeol / moonInfo.targetByeol}>
                <span>
                  {moonInfo.textByeol}
                </span>
                <div></div>
              </Progress>
            </div>
            <div className="contents__row">
              <span className="contents__row--title">좋아요</span>
              <Progress division={moonInfo.goodPoint / moonInfo.targetGood}>
                <span>
                  {moonInfo.textGood}
                </span>
                <div></div>
              </Progress>
            </div> */}
          </div>
          <button
            className="btnClose"
            onClick={() => {
              toggle(false);
            }}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}

export default ProgressLayer;

const Progress = styled.div`
  overflow: hidden;
  position: relative;
  flex: 1;
  align-self: center;
  font-size: 10px;
  text-align: center;
  color: ${(props) => {
    if (props.division === 1) {
      return "white";
    } else {
      return "black";
    }
  }};
  background-color: ${(props) => {
    if (props.division === 1) {
      return "#ff4600";
    } else {
      return "white";
    }
  }};
  border-radius: 8px;
  span {
    position: inherit;
    z-index: 1;
  }

  div {
    position: absolute;
    left: 0;
    top: 0;
    width: ${(props) => {
      if (props.division !== 1) {
        return `${160 * props.division}px`;
      }
    }};
    height: 15px;
    border-radius: 8px;
    background-color: #ffe359;
  }
`;
