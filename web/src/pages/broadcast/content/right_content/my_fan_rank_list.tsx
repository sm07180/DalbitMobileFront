// api
import { deleteFan, getFanList, postAddFan } from "common/api";
import { DalbitScroll } from "common/ui/dalbit_scroll";
// ctx
import { BroadcastContext } from "context/broadcast_ctx";
import React, { useContext, useEffect, useState } from "react";
// constant
import { tabType } from "../../constant";

export default function FanList(props: { profile: any }) {
  const { profile } = props;
  // ctx
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { setRightTabType, setUserMemNo } = broadcastAction;
  const { userMemNo } = broadcastState;
  const [fanList, setFanList] = useState<any>([]);

  // fan 등록/제거
  const registerFan = (memNo) => {
    async function AddFanFunc() {
      const { result, data } = await postAddFan({
        memNo: memNo,
      });
      if (result === "success") {
        fetchData();
      }
    }
    AddFanFunc();
  };
  const cancelFan = (memNo) => {
    async function DeleteFanFunc() {
      const { result, data } = await deleteFan({
        memNo: memNo,
      });
      if (result === "success") {
        fetchData();
      }
    }
    DeleteFanFunc();
  };
  const viewProfile = (memNo?: any) => {
    setRightTabType && setRightTabType(tabType.PROFILE);
    if (memNo) {
      setUserMemNo && setUserMemNo(memNo);
    }
  };
  async function fetchData() {
    let memNoData;
    if (profile && userMemNo === "") {
      memNoData = profile.memNo;
    } else {
      memNoData = userMemNo;
    }
    const { result, data } = await getFanList({
      memNo: memNoData,
    });
    if (result === "success") {
      setFanList(data.list);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h3
        className="tabTitle tabTitle__back"
        onClick={() => {
          viewProfile();
        }}
      >
        나의 팬 랭킹
      </h3>
      <div className="userListWrap">
        <div className="userBox user--fan">
          <DalbitScroll width={360} height={670}>
            <>
              {fanList &&
                fanList.map((v, i) => {
                  return (
                    <div className="user" key={`fanlist-${i}`}>
                      <span
                        className="user__box"
                        onClick={() => {
                          viewProfile(v.memNo);
                        }}
                      >
                        <span className="user__thumb" style={{ backgroundImage: `url(${v.profImg.url})` }}></span>
                        <em className="user__nickNm">{v.nickNm}</em>
                      </span>
                      {profile.memNo !== v.memNo &&
                        (v.isFan ? (
                          <button className="btn__fan btn__fan--active" onClick={() => cancelFan(v.memNo)}>
                            팬
                          </button>
                        ) : (
                          <button className="btn__fan" onClick={() => registerFan(v.memNo)}>
                            +팬등록
                          </button>
                        ))}
                    </div>
                  );
                })}
            </>
          </DalbitScroll>
        </div>
      </div>
    </>
  );
}
