import React, { useEffect, useState, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";

import { broadcastSummary, postAddFan, deleteFan } from "common/api";

import { secToDateConvertor } from "lib/common_fn";

import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

import { OS_TYPE, TAB_TYPE } from "./constant";
import {useDispatch} from "react-redux";
import {setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";

function BroadcastEndByListener() {
  const history = useHistory();
  const dispatch = useDispatch();

  const { dimLayer, dispatchDimLayer } = useContext(BroadcastLayerContext);

  const [summary, setSummary] = useState<{ [key: string]: any } | null>(null);
  const [tab, setTab] = useState<number>(TAB_TYPE.RECOMMEND);

  const fanHandler = useCallback(async () => {
    if (summary !== null) {
      if (summary.isFan) {
        const { result, message } = await deleteFan({ memNo: summary.djMemNo });

        if (result === "success") {
          setSummary({
            ...summary,
            isFan: false,
          });
          dispatch(setGlobalCtxSetToastStatus({
            status: true,
            message: "팬 해제에 성공 했습니다.",
          }));
        } else {
          dispatch(setGlobalCtxSetToastStatus({
            status: true,
            message: message,
          }));
        }
      } else {
        const { result, message } = await postAddFan({ memNo: summary.djMemNo });

        if (result === "success") {
          setSummary({
            ...summary,
            isFan: true,
          });

          dispatch(setGlobalCtxSetToastStatus({
            status: true,
            message: "팬 등록에 성공 했습니다.",
          }));
        } else {
          dispatch(setGlobalCtxSetToastStatus({
            status: true,
            message: message,
          }));
        }
      }
    }
  }, [summary]);

  const linkFanboard = useCallback(() => {
    if (summary !== null) {
        history.replace(`/mypage/${summary.djMemNo}`);
    }
  }, [summary]);

  useEffect(() => {
    const fetchData = async () => {
      const { result, data } = await broadcastSummary({ roomNo: dimLayer.others.roomNo }, "listener");

      if (result === "success") {
        setSummary(data);
      }
    };

    fetchData();

  }, []);

  return (
    <div id="boradcast-end-modal" className="listener" onClick={(e) => {e.stopPropagation()}}
    >
      <button
        onClick={() => {
          // dispatchDimLayer({
          //   type: "INIT",
          // });
          history.push("/");
        }}
        className="cancel"
      />
      {summary !== null && (
        <div className="listener">
          {summary.bannerImgUrl && (
            <div className="banner">
              <img src={summary.bannerImgUrl} alt="배너" />
            </div>
          )}
          <div className="listener__top">
            <h2>방송이 종료되었습니다.</h2>
            <div className="listener__top--img">
              <img className="profile" src={summary.djProfImg.url} />
              <img className="holder" src={summary.djHolder} />
            </div>
            <p className="listener__top--nickNm">{summary.djNickNm}</p>
            <p className="listener__top--time">{secToDateConvertor(summary.listenTime)}</p>
          </div>
          <div className="listener__buttonWrap">
            {summary.isFan ? (
              <button className="isFan" onClick={fanHandler}>
                팬
              </button>
            ) : (
              <button onClick={fanHandler}>+ 팬등록</button>
            )}
            <button className="on" onClick={linkFanboard}>
              팬 보드
            </button>
          </div>

          <div className="listener__tabWrap">
            <button
              className={`${tab === TAB_TYPE.RECOMMEND && "on"}`}
              onClick={() => {
                setTab(TAB_TYPE.RECOMMEND);
              }}
            >
              당신을 위한 추천방송
            </button>
            <button
              className={`${tab === TAB_TYPE.MYSTAR && "on"}`}
              onClick={() => {
                setTab(TAB_TYPE.MYSTAR);
              }}
            >
              나의 스타 라이브
            </button>
          </div>
          <div className="listener__listWrap">
            {tab === TAB_TYPE.RECOMMEND ? (
              <>
                {summary.recommends.length > 0 ? (
                  <ul>
                    {summary.recommends.map((v, idx) => {
                      return (
                        <li
                          key={idx}
                          className="listener__listItem"
                          onClick={() => {
                            location.href = `/broadcast/${v.roomNo}`;
                            // history.replace(`/broadcast/${v.roomNo}`);
                          }}
                        >
                          <img src={v.djProfImg.url} />
                          <span>
                            <p className={`${v.os === OS_TYPE.PC && "pc"} `}>{v.title}</p>
                            <p className="sub">{v.djNickNm}</p>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="listener__noResult">
                    <p>아쉽게도 추천방이 없습니다.</p>
                    <button
                      onClick={() => {
                        dispatchDimLayer({
                          type: "INIT",
                        });
                        history.push("/");
                      }}
                    >
                      닫기
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {summary.myStars.length > 0 ? (
                  <ul>
                    {summary.myStars.map((v, idx) => {
                      return (
                        <li
                          key={idx}
                          className="listener__listItem"
                          onClick={() => {
                            location.href = `/broadcast/${v.roomNo}`;
                          }}
                        >
                          <img src={v.djProfImg.url} />
                          <span>
                            <p className={`${v.os === OS_TYPE.PC && "pc"} `}>{v.title}</p>
                            <p className="sub">{v.djNickNm}</p>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="listener__noResult">
                    <p>아쉽게도 방송중인 스타가 없습니다.</p>
                    <button
                      onClick={() => {
                        dispatchDimLayer({
                          type: "INIT",
                        });
                        history.push("/");
                      }}
                    >
                      메인으로 이동
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BroadcastEndByListener;
