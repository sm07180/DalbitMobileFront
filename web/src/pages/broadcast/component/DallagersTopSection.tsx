import React, {useEffect, useRef, useState, useContext} from 'react';
import Lottie from "lottie-web";
import { Context } from 'context';

let intervalId = 0;
let rafId = 0;
let rafStartTime = 0;
let aniStepStatus = {step1: false, step2: false, step3: false, step4: false};  // 애니메이션 단계 상태

const DallagersTopSection = (props) => {
  const {globalState} = useContext(Context);
  const {chatInfo} = globalState;
  const lottieRef = useRef(null);
  const stoneAniQueueRef = useRef<any>([]);
  const [stoneAniQueue, setStoneAniQueue] = useState([]);
  const [stoneAni, setStoneAni] = useState({playing:false, comboPlay: false, webpUrl: '', comboCnt: 0 });

  useEffect(() => {
    const lottie = Lottie.loadAnimation({
      container: lottieRef.current!,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: 'https://image.dalbitlive.com/event/rebranding/icon_dalla.json',
    });

    lottie.addEventListener('data_ready', () => {
        intervalId = setInterval(() => {
          lottie.goToAndPlay(1, true);
        }, 120000);
    });

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(rafId);
    }
  }, []);

  // chat_socket -> 소켓서버로부터 패킷을 받으면 setStoneAniQueue에 계속 push
  useEffect(() => {
    if (chatInfo) {
      //애니메이션 붙이는 곳
      chatInfo.setBroadcastStateChange('setStoneAniQueueState', (state) => {
        setStoneAniQueue(() => stoneAniQueueRef.current.concat(state));
      });
    }

    return () => {
      if (chatInfo && chatInfo.hasOwnProperty('setBroadcastStateClear')) {
        chatInfo.setBroadcastStateClear();
      }
    };
  }, [chatInfo]);

  const reqAniCallback = (timestamp) => {
    if(rafStartTime === 0) rafStartTime = timestamp;
    let progressTime = timestamp - rafStartTime;

    if(progressTime < 330 ){
      //!aniStepStatus.step1
      aniStepStatus.step1 = true; // 1번만 실행되게 하기
    } else if(progressTime < 830) {
      if(!aniStepStatus.step2) {
        aniStepStatus.step2 = true;
        setStoneAni((prev) => ({...prev, comboPlay: true}));
      }
    } else if(progressTime < 1490) {
      // !aniStepStatus.step3
      aniStepStatus.step3 = true;
    } else if(progressTime < 1990) {
      if(!aniStepStatus.step4) {
        aniStepStatus.step4 = true;
        setStoneAni((prev) => ({...prev, comboPlay: false}));
      }
    }

    if(progressTime < 3000){  // 2초까지만 애니메이션 실행
      rafId = requestAnimationFrame(reqAniCallback);
    } else { // animation end
      //data reset
      rafStartTime = 0;
      aniStepStatus = {step1: false, step2: false, step3: false, step4: false};
      setStoneAni({playing:false, comboPlay: false, webpUrl: '', comboCnt: 0 });
      setStoneAniQueue(stoneAniQueueRef.current); //다음 애니메이션 재생
    }
  };

  // triger 1 : 소켓패킷 -> 스택 0에서 pop -> 애니메이션 재생
  // triger 2 : 스톤 애니메이션 종료후 -> 큐 길이 체크 -> 있으면 애니메이션 재생
  useEffect(() => {
    if(stoneAniQueue.length > 0) {
      if (!stoneAni?.playing) {
        // push stack
        stoneAniQueueRef.current = stoneAniQueue.concat([]);  //d , a, l

        // pop stack : (play stone Ani)
        const popAni = stoneAniQueueRef.current.splice(0, 1);
        const {dStone, aStone, lStone} = popAni[0];

        let webpImgName = '';
        let comboCnt = 0;
        if (dStone > 0) {
          comboCnt = dStone > 1 ? dStone : 1;
          webpImgName = 'root_d';
        } else if (aStone > 0) {
          comboCnt = aStone > 1 ? aStone : 1;
          webpImgName = 'root_a';
        } else if (lStone > 0) {
          comboCnt = lStone > 1 ? lStone : 1;
          webpImgName = 'root_l';
        }

        // 스톤 갯수가 최소 1개 이상일때 실행함
        if (comboCnt > 0) {
          setStoneAni({
            playing: true,
            comboPlay: false,
            comboCnt,
            webpUrl: `https://image.dalbitlive.com/event/rebranding/${webpImgName}.webp?${Date.now()}`
          });
          //애니메이션 실행
          rafId = requestAnimationFrame(reqAniCallback);
        }
      } else if (stoneAni?.playing) {
        stoneAniQueueRef.current = stoneAniQueue.concat([]);
      }
    }
  }, [stoneAniQueue]);

  return (
    <div className="dallagurs-section">
      
      {/* 반짝거리는 로티 버튼 */}
      <div className="icon-lottie" ref={lottieRef}/>
      {stoneAni?.playing &&
        <>
          <img src={stoneAni?.webpUrl} alt="" className="webp-img"/>
          {stoneAni.comboPlay && <span className="combo">
            {stoneAni?.comboCnt > 1 ? `X ${stoneAni?.comboCnt}` : ''}
          </span>}
        </>
      }
    </div>);

};

export default React.memo(DallagersTopSection);