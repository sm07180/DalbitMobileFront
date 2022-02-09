import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";

type rankingCountDownInfoType = {
  roundIndex: number;
  showTimeYn: string;
  timerForm: string;
};
export default (props) => {
  const { round, setRankTitle } = props;
  const [rankingInterval, setRankingInterval] = useState<number | null | any>(null);
  const [rankingCountDownInfo, setRankingCountDownInfo] = useState<
    rankingCountDownInfoType
  >({
    roundIndex: -1,
    showTimeYn: "n",
    timerForm: "",
  });

  const toTime = useCallback((num) => {
    try {
      let myNum = parseInt(num, 10);
      let hours: string | number = Math.floor(myNum / 3600);
      let minutes: string | number = Math.floor((myNum - hours * 3600) / 60);
      let seconds: string | number = myNum - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return `${hours} : ${minutes} : ${seconds}`;
    } catch (e) {
      return "00:00:00";
    }
  }, []);

  const timerInfo = useCallback(() => {
    const nowTime = moment().format("HHmmss");
    const nowTimeToNumber = parseInt(nowTime);
    let roundIndex = 0;
    let showTimeYn = "n";

    for (let i = 0; i < round.length; i++) {
      if (round[i].start <= nowTimeToNumber) {
        roundIndex = i;
        if (
          round[i].timer <= nowTimeToNumber &&
          nowTimeToNumber <= round[i].end
        ) {
          showTimeYn = "y";
        }
      }
    }

    return { nowTime, roundIndex, showTimeYn };
  }, []);

  const timerInit = useCallback(() => {
    const { nowTime, roundIndex, showTimeYn } = timerInfo();
    const remainTime = timeDiff(round[roundIndex].end, nowTime);
    const timerForm = toTime(remainTime);
    const roundTitle = `(${round[roundIndex].title})`;

    setRankTitle(roundTitle);
    setRankingCountDownInfo({
      ...rankingCountDownInfo,
      roundIndex,
      showTimeYn,
      timerForm,
    });
  }, []);

  const timeDiff = useCallback((obj1, obj2) => {
    const obj1Hour = obj1.substring(0, 2);
    const obj1Min = obj1.substring(2, 4);
    const obj1Sec = obj1.substring(4, 6);
    const obj2Hour = obj2.substring(0, 2);
    const obj2Min = obj2.substring(2, 4);
    const obj2Sec = obj2.substring(4, 6);

    const hour = obj1Hour * 3600 - obj2Hour * 3600;
    const min = obj1Min * 60 - obj2Min * 60;
    const sec = obj1Sec - obj2Sec;

    return hour + min + sec;
  }, []);

  useEffect(() => {
    timerInit();
  }, []);

  useEffect(() => {
    if (rankingCountDownInfo.showTimeYn === "y") {
      const { roundIndex } = timerInfo();
      const end = round[roundIndex].end;

      const interval = setInterval(() => {
        const nowTime = moment().format("HHmmss");
        const remainTime = timeDiff(end, nowTime);
        const timerForm = toTime(remainTime);
        const { roundIndex, showTimeYn } = timerInfo();

        if (showTimeYn === "n" && rankingInterval) {
          clearInterval(rankingInterval);
        }

        setRankingCountDownInfo({
          ...rankingCountDownInfo,
          /*roundIndex,*/ showTimeYn,
          timerForm,
        }); // 타이틀을 바꾸지 않는다
      }, 1000);
      setRankingInterval(interval);
      return () => {
        if (rankingInterval) {
          clearInterval(rankingInterval);
        }
      };
    }
  }, [rankingCountDownInfo.roundIndex]);
  return (
    <>
      {rankingCountDownInfo.showTimeYn === "y" && (
        <div className="realTimer-wrap">
          <span className="realTime">
            마감까지{" "}
            <span className="strong">{rankingCountDownInfo.timerForm}</span>{" "}
            남았습니다.
          </span>
          <span className="sub">
            실시간 랭킹 1~3위 달성 시 스페셜DJ 가산점 획득!
          </span>
        </div>
      )}
    </>
  );
};
