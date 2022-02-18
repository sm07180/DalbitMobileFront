// React
import React, { useMemo, useContext } from "react";

// Context
import { BroadcastContext } from "context/broadcast_ctx";

// Static
import settingIcon from "./static/systemsetting.png";
import guideIcon from "./static/brsetting.png";
import flipLeftIcon from "./static/ic_flip_left.svg";
import flipRightIcon from "./static/ic_flip_right.svg";
import wideIcon from "./static/ic_br_wide.svg";
import narrowIcon from "./static/ic_br_narrow.svg";
import { MediaType } from "pages/broadcast/constant";

export default function Guide() {
  const isBroadcastPath = useMemo(() => {
    return window.location.pathname.startsWith("/broadcast/");
  }, [window.location.pathname]);

  const { broadcastState, broadcastAction } = useContext(BroadcastContext);

  const { flipIsLeft, isWide, roomInfo } = broadcastState;

  return (
    <>
      <div id="guide">
        <div className="guideItem">
          <a href="https://www.youtube.com/watch?v=EegzDQ_dZAc" target="_blank">
            <div className="guideItem__icon">
              <img src={settingIcon} alt="시스템 설정방법" />
            </div>
            <p className="guideItem__text">
              시스템
              <br />
              설정방법
            </p>
          </a>
        </div>

        <div className="guideItem">
          <a href="https://www.youtube.com/watch?v=-wAeaNZLEws" target="_blank">
            <div className="guideItem__icon">
              <img src={guideIcon} alt="방송 가이드" />
            </div>
            <p className="guideItem__text">
              방송
              <br />
              가이드
            </p>
          </a>
        </div>
        {isBroadcastPath === true && (
          <>
            <div className="guideItem">
              <button
                onClick={() => {
                  broadcastAction.setFlipIsLeft && broadcastAction.setFlipIsLeft(!flipIsLeft);
                }}
              >
                <div className="guideItem__icon">
                  <img src={flipIsLeft ? 
                    "https://image.dalbitlive.com/common/icon/ico_flipLeft.png" 
                    : 
                    "https://image.dalbitlive.com/common/icon/ico_flipRight.png" 
                    }  alt="화면 좌우 전환" />
                </div>
                <p className="guideItem__text">
                  화면
                  <br />
                  좌우 전환
                </p>
              </button>
            </div>
            {roomInfo?.mediaType === MediaType.VIDEO && (
              <div className="guideItem">
                <button
                  onClick={() => {
                    broadcastAction.setIsWide && broadcastAction.setIsWide(!isWide);
                  }}
                >
                  <div className="guideItem__icon">
                    <img src={isWide ? 
                      wideIcon
                      : 
                      narrowIcon
                      } alt="화면 좌우 전환" />
                  </div>
                  <p className="guideItem__text">
                    방송 화면
                    <br />
                    크기 조절
                  </p>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
