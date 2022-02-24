import React, { useContext, useEffect, useState } from "react";

import { getClipGiftRank, postAddFan, deleteFan } from "common/api";
import { useHistory } from "react-router-dom";

import { printNumber, addComma } from "lib/common_fn";

import NoResult from "common/ui/no_result";

import fanIcon from "../static/ic_fan.svg";
import moonIcon from "../static/ic_moon_s.svg";
import {useDispatch, useSelector} from "react-redux";

export default (props) => {
  const history = useHistory();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [giftRank, setGiftRank] = useState<any>({});
  const [giftRankList, setGiftRankList] = useState<any>({});

  const AddFan = (memNo) => {
    async function AddFanFunc() {
      const { result, data } = await postAddFan({
        memNo: memNo,
      });
      if (result === "success") {
        feachCilpGiftRank();
      }
    }
    AddFanFunc();
  };
  const DeleteFan = (memNo) => {
    async function DeleteFanFunc() {
      const { result, data } = await deleteFan({
        memNo: memNo,
      });
      if (result === "success") {
        feachCilpGiftRank();
      }
    }
    DeleteFanFunc();
  };

  async function feachCilpGiftRank() {
    const { result, data } = await getClipGiftRank({
      clipNo: globalState.clipInfo?.clipNo,
    });
    if (result === "success") {
      setGiftRank(data);
      setGiftRankList(data.list);
    }
  }

  useEffect(() => {
    feachCilpGiftRank();
  }, []);

  return (
    <div className="tabGiftRank">
      <h2 className="tabContent__title">클립 선물 순위</h2>

      <ul className="giftRankBox">
        {giftRankList.length > 0 ? (
          giftRankList.map((item, index) => {
            return (
              <li key={index} className="giftRankItem">
                <div className="giftRankBox">
                  <div className="thumbBox" onClick={() => history.push(`/profile/${item.memNo}`)}>
                    <img src={item.profImg.thumb62x62} width={40} className="thumbBox__thumb" alt="thumb" />
                    {item.isFan ? <img src={fanIcon} className="thumbBox__fan" width={12} /> : ""}
                  </div>
                  <div className="textBox">
                    <p className="textBox__nick">{item.nickName}</p>
                    <p className="textBox__dal">
                      <img src={moonIcon} width={20} alt="dal" />
                      <span>{item.giftDal > 999 ? printNumber(item.giftDal) : addComma(item.giftDal)}</span>
                    </p>
                  </div>
                </div>
                {item.memNo !== globalState.baseData.memNo && (
                  <div className="fanBox">
                    {item.isFan ? (
                      <span className="fanBox__fan" onClick={() => DeleteFan(item.memNo)}>
                        팬
                      </span>
                    ) : (
                      <span className="fanBox__fan fanBox__plus" onClick={() => AddFan(item.memNo)}>
                        +팬등록
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <NoResult text="팬 랭킹 정보가 없습니다." />
        )}
      </ul>
    </div>
  );
};
