import React, { useContext, useEffect, useState } from "react";

import { GuestContext } from "context/guest_ctx";

import { secToDateConvertor } from "lib/common_fn";

import FanIcon from "../../../static/ic_fan.svg";
import GuestIcon from "../../../static/ic_guest.svg";

let initInterval;

function GuestItem({ item, exitGuest, inviteGuest, cancleGuest }) {
  const { memNo, isFan, gstState, gstProposeState, nickNm, profImg } = item;
  let { gstTime } = item;

  const { guestState } = useContext(GuestContext);

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (guestState.guestConnectStatus) {
      setTime(gstTime);
      initInterval = setInterval(() => {
        gstTime += 1;
        setTime(gstTime);
      }, 1000);
    }
    return () => {
      if (initInterval) {
        clearInterval(initInterval);
        initInterval = undefined;
      }
    };
  }, [guestState.guestConnectStatus]);

  useEffect(() => {
    return () => {
      if (initInterval) {
        clearInterval(initInterval);
        initInterval = undefined;
      }
    };
  }, []);

  return (
    <div className="guestItem">
      <span className="thumb">
        <img src={profImg.url} className="thumbImg" />
        {isFan === 1 && <img src={FanIcon} className="fanIcon" />}
      </span>
      <div className="nicknameWrap">
        {/* {gstState === 1 && <img src={GuestIcon} />} */}
        <span>{nickNm}</span>
        {gstState === 1 && guestState.guestConnectStatus && <p>연결 시간 {secToDateConvertor(time)}</p>}
      </div>
      {gstState === 1 ? (
        <button
          className={`btn btn--guest`}
          onClick={() => {
            exitGuest(item);
          }}
        >
          종료
        </button>
      ) : gstProposeState === 1 ? (
        <button
          className={`btn btn--apply`}
          onClick={() => {
            inviteGuest(item.memNo);
          }}
        >
          수락
        </button>
      ) : gstProposeState === 2 ? (
        <button
          className={`btn btn--invite`}
          onClick={() => {
            cancleGuest(item);
          }}
        >
          초대 취소
        </button>
      ) : (
        <button
          className={`btn btn--listener`}
          onClick={() => {
            inviteGuest(item.memNo);
          }}
        >
          초대
        </button>
      )}
    </div>
  );
}

export default React.memo(GuestItem);
