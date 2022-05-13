import React, { useState, useEffect } from "react";

// Api
import { getBroadcastGiftList } from "common/api";

// lib
import { convertDateFormat } from "lib/dalbit_moment";

// component
import NoResult from "common/ui/no_result";
import { DalbitScroll } from "common/ui/dalbit_scroll";

let page = 1;
let records = 100;

export default function Profile(props: { roomNo: string }) {
  const { roomNo } = props;
  // state
  const [giftObj, setGiftObj] = useState<{ [key: string]: any } | null>(null);

  // fetch data

  useEffect(() => {
    const fetchData = async function() {
      const res = await getBroadcastGiftList({ roomNo: roomNo, page: page, records: records });

      if (res.result === "success") {
        setGiftObj(res.data);
      } else {
        console.log("gift list fetch error", res.code);
      }
    };

    fetchData();

    return () => {
      page = 1;
      records = 100;
    };
  }, []);

  return (
    <div className="giftPopupWrap">
      {giftObj !== null && (
        <>
          <h3 className="tabTitle">받은 선물 내역</h3>

          <div className="giftWrap infoWrap gifView">
            <p className="desc">현 방송방 내에서 받은 선물 내역 입니다.</p>
            <div className="subInfo">
              <div className="subItem__box">
                <div className="subItem__text">
                  받은 수 <span className="subItem__number">{giftObj.totalCnt || 0}</span>
                </div>
                <i className="subItem__line"></i>
                <div className="subItem__text">
                  받은 별 <span className="subItem__number">{giftObj.totalGold || 0}</span>
                </div>
              </div>
            </div>
            {giftObj !== null && (
              <>
                {giftObj.list.length > 0 ? (
                  <DalbitScroll>
                    <ul className="receivedGiftList">
                      {giftObj.list.map((data, idx) => {
                        return (
                          <li className="receivedGiftItem" key={idx}>
                            <span className="thumb" style={{ backgroundImage: `url(${data.profImg.url})` }}></span>
                            <span className="user">
                              <span className="nickNm">{data.nickNm}</span>
                              <span className="itemNm">{data.itemNm}</span>
                            </span>
                            {data.isSecret && <span className="ico ico--secret">몰래</span>}
                            <div className="item">
                              <em>{convertDateFormat(data.giftDt, "HH:mm:ss")}</em>
                              <em>별 {data.gold}</em>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </DalbitScroll>
                ) : (
                  <NoResult text="데이터가 없습니다." />
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
