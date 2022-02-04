import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

import { useHistory } from "react-router-dom";
// import Api from 'context/api'

import { postRandomboxReward } from "common/api";

import LottiePlayer from "lottie-web";

export default ({ formState, setRandomPopup, setRewardPop }) => {
  const history = useHistory();

  const lottieDisplayRef = useRef<any>(null);

  const [randomPoint, setRandomPoint] = useState({
    rewardImg: "",
  });

  useEffect(() => {
    async function feachRandomReward() {
      const res = await postRandomboxReward({
        rankSlct: formState[formState.pageType].rankType,
        rankType: formState[formState.pageType].dateType,
      });

      if (res.result === "success") {
        setRandomPoint(res.data);
      } else {
        console.log("랜덤실패");
      }
    }
    feachRandomReward();

    setTimeout(() => {
      setRandomPopup(false);
      setRewardPop(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (randomPoint.rewardImg !== "") {
      const lottieDisplayElem = lottieDisplayRef.current;

      LottiePlayer.loadAnimation({
        container: lottieDisplayElem as Element,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: randomPoint.rewardImg,
      });
    }
  }, [randomPoint]);

  return (
    <RandomPopupWrap>
      <div className="lottie-box" ref={lottieDisplayRef}></div>
    </RandomPopupWrap>
  );
};

const RandomPopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .lottie-box {
    background: none;
  }
`;
