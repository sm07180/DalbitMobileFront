import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { broadcastSummary } from "common/api";

import { secToDateConvertor } from "lib/common_fn";
import { DalbitScroll } from "common/ui/dalbit_scroll";

import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

import heartIcon from "./static/ic_heart_r.svg";
import giftIcon from "./static/ic_gift.svg";
import expIcon from "./static/ic_exp.svg";
import NoResultImg from "./static/no_result_img.svg";

import "./index.scss";
import {useDispatch, useSelector} from "react-redux";

function BroadcastEndByDj() {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { exitMarbleInfo } = globalState;
  const history = useHistory();
  const { dimLayer, dispatchDimLayer } = useContext(BroadcastLayerContext);

  const [summary, setSummary] = useState<{ [key: string]: any } | null>(null);
  const [giftListenerToggle, setGiftListenerToggle] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const { result, data } = await broadcastSummary(
        { roomNo: dimLayer.others.roomNo },
        "dj"
      );

      if (result === "success") {
        setSummary(data);
      }
    };

    fetchData();

    return () => {
      history.push("/");
    };
  }, []);

  return (
    <div id="boradcast-end-modal" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => {
          // dispatchDimLayer({
          //   type: "INIT",
          // });
          history.push("/");
        }}
        className="cancel"
      ></button>
      {summary !== null && (
        <div className="dj">
          {summary.bannerImgUrl && (
            <div className="banner">
              <img src={summary.bannerImgUrl} alt="배너" />
            </div>
          )}

          <div className="dj__top">
            <h2>방송이 종료되었습니다.</h2>
            <div className="dj__top--img">
              <img className="profile" src={summary.profImg.url} />
              <img className="holder" src={summary.holder} />
            </div>
            <p className="dj__top--nickNm">{summary.nickNm}</p>
            <p className="dj__top--time">
              {secToDateConvertor(summary.airTime)}
            </p>
          </div>
          {giftListenerToggle === false ? (
            <>
              <div className="dj__info">
                <div className="dj__info--max">
                  <span>최다 청취자</span>
                  <b>{summary.listenerMax.toLocaleString()}</b>
                </div>
                <div className="dj__info--total">
                  <span>누적 청취자</span>
                  <b>{summary.listenerCnt.toLocaleString()}</b>
                </div>
                <div className="dj__info--fan">
                  <span>신규 팬</span>
                  <b>{summary.fanCnt.toLocaleString()}</b>
                </div>
              </div>
              <div className="dj__infoBox">
                <div className="dj__infoBox--item">
                  <img src={heartIcon} />
                  <b>{summary.good.toLocaleString()}</b>
                  <span>받은 좋아요</span>
                </div>
                <div className="dj__infoBox--item">
                  <img src={giftIcon} />
                  <b>{summary.gift.toLocaleString()}</b>
                  <span>받은 선물</span>
                </div>
                <div className="dj__infoBox--item">
                  <img src={expIcon} />
                  <b>{summary.exp.toLocaleString()}</b>
                  <span>받은 경험치</span>
                </div>
              </div>
              <button
                className="toggle"
                onClick={() => {
                  setGiftListenerToggle(true);
                }}
              >
                선물 보낸 청취자 보기
              </button>
            </>
          ) : (
            <div>
              <button
                className="toggle on"
                onClick={() => {
                  setGiftListenerToggle(false);
                }}
              >
                선물 보낸 청취자 보기
              </button>

              {summary.list.length > 0 ? (
                <DalbitScroll height={190} width={300}>
                  <ul className="dj__list">
                    {summary.list.map((v, idx) => {
                      return (
                        <li key={idx}>
                          <img src={v.profImg.url} />
                          <span>
                            <p>{v.nickNm}</p>
                            <p className="dj__list--gift">{v.gift}</p>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </DalbitScroll>
              ) : (
                <div className="no-result">
                  <img src={NoResultImg} />
                  <p>선물 받은 내역이 없습니다</p>
                </div>
              )}
            </div>
          )}

          <button
            className="confirm_btn"
            onClick={() => {
              dispatchDimLayer({
                type: "INIT",
              });
            }}
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}

export default BroadcastEndByDj;
