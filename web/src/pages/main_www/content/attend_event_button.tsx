import React, { useContext, useState, useEffect } from "react";
import { getEventAttendCheck } from "common/api";
import { GlobalContext } from "context";
import { useHistory } from "react-router-dom";
import { IMG_SERVER } from "constant/define";

export default (props: any) => {
  const { globalState, globalAction } = useContext(GlobalContext);
  const { baseData, splashData } = globalState;
  const [attendCheck, setAttendCheck] = useState(-1);
  const history = useHistory();
  async function fetchEventAttendCheck() {
    const { result, data } = await getEventAttendCheck({});
    if (result === "success") {
      const { userEventCheck } = data;
      setAttendCheck(userEventCheck);
    } else {
      console.log("출석 체크 실패");
    }
  }

  useEffect(() => {
    fetchEventAttendCheck();
  }, []);

  const attendStampState = () => {
    if (baseData.isLogin && attendCheck === 0) {
      return (
        <div
          className="attendStampActive basic"
          onClick={() => {
            history.push("/event/attend_event");
          }}
        />
      );
    } else if (baseData.isLogin && attendCheck === 1) {
      return (
        <div
          className="attendStampActive"
          onClick={() => {
            history.push("/event/attend_event");
          }}
        >
          <img src={`${IMG_SERVER}/webp/attend_stamp.webp`} alt="attend stamp active" width={48} height={48} />
        </div>
      );
    } else if (baseData.isLogin && attendCheck === 2) {
      return (
        <div
          className="attendStampActive motion"
          onClick={() => {
            history.push("/event/attend_event/roulette");
          }}
        />
      );
    }
  };

  return (
    <div className={`fixedButton ${globalState.isShowPlayer || globalState.clipPlayer !== null ? "usePlayer" : ""}`}>
      {props.scrollOn && attendStampState()}
    </div>
  );
};
