import React, { useContext, useEffect, useCallback, useState } from "react";

import ProgressLayer from "../content/broadcast_moon_layer/progress";
import HelpLayer from "../content/broadcast_moon_layer/help";

type PropsType = {
  roomNo: string;
  roomInfo: roomInfoType;
};

enum MOON_STEP {
  NEW_MOON,
  CRESCENT,
  FIRST_QUARTER,
  WAXING_GIBBOUS,
  FULL_MOON,
}

function MoonComponent(props: PropsType) {
  const { roomNo, roomInfo } = props;
  const { moonCheck } = roomInfo;

  const { dlgTitle, dlgText } = moonCheck;

  const [progressLayerToggle, setProgressLayerToggle] = useState<boolean>(false);
  const [helpLayerToggle, setHelpLayerToggle] = useState<boolean>(false);

  const [moonInfo, setMoonInfo] = useState<{ [key: string]: any } | null>(null);

  const toggle = useCallback((bool: boolean) => {
    setProgressLayerToggle(bool);
  }, []);

  const helpToggle = useCallback((bool: boolean) => {
    setHelpLayerToggle(bool);
  }, []);

  const renderingMoonByStep = useCallback(() => {
    return (
      <button onClick={() => toggle(true)}>
        <img src={`${moonCheck.moonStepFileNm}`} width={62} height={62} />
      </button>
    );
  }, [moonCheck]);

  return (
    <>
      {moonCheck !== null && moonCheck.moonStep !== 4 && renderingMoonByStep()}

      {progressLayerToggle === true && moonCheck !== null && (
        <ProgressLayer roomNo={roomNo} toggle={toggle} helpToggle={helpToggle} moonInfo={moonInfo} setMoonInfo={setMoonInfo} />
      )}
      {helpLayerToggle === true && moonInfo !== null && <HelpLayer helpToggle={helpToggle} moonInfo={moonInfo} roomNo={roomNo} />}
    </>
  );
}

export default MoonComponent;
