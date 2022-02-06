import React, { useContext, useEffect, useState } from "react";

import { GlobalContext } from "context";
import { getClipGift } from "common/api";
import { dateFormat } from "lib/common_fn";
import NoResult from "common/ui/no_result";

import { printNumber, addComma } from "lib/common_fn";

import { ClipProvider, ClipContext } from "context/clip_ctx";

export default (props) => {
  const { globalState, globalAction } = useContext(GlobalContext);
  const [giftData, setGiftData] = useState<any>({});
  const [giftList, setGiftList] = useState<any>({});

  async function feachCilpGift() {
    const { result, data } = await getClipGift({
      clipNo: globalState.clipInfo?.clipNo,
    });
    if (result === "success") {
      setGiftData(data);
      setGiftList(data.list);
    }
  }

  useEffect(() => {
    feachCilpGift();
  }, []);

  return (
    <div className="tabGiftList">
      <h2 className="tabContent__title">받은 선물 내역</h2>

      <div className="giftListWrap">
        <div className="getTotalBox">
          <div className="getTotalBox__item">
            <label>받은 수</label>
            <span>{giftData.giftCnt > 999 ? printNumber(giftData.giftCnt) : addComma(giftData.giftCnt)}</span>
          </div>

          <div className="getTotalBox__item">
            <label>받은 별</label>
            <span>{giftData.byeolCnt > 999 ? printNumber(giftData.byeolCnt) : addComma(giftData.byeolCnt)}</span>
          </div>
        </div>

        <ul className="tabGiftList">
          {giftList.length > 0 ? (
            giftList.map((item, index) => {
              return (
                <li key={index} className="tabGiftItem">
                  <div className="tabGiftItemWrap">
                    <div className="thumbBox">
                      <img src={item.profImg.thumb62x62} width={40} className="thumbBox__thumb" alt="thumb" />
                    </div>

                    <div className="textBox">
                      <p className="textBox__nick">{item.nickName}</p>
                      <p className="textBox__time">{dateFormat(item.giftDt)}</p>
                    </div>
                  </div>

                  <div className="itemBox">
                    <p className="itemBox__itemName">{item.itemName}</p>
                    <p>별 {printNumber(item.giftByeol)}</p>
                  </div>
                </li>
              );
            })
          ) : (
            <NoResult text="받은 선물내역이 없습니다." />
          )}
        </ul>
      </div>
    </div>
  );
};
