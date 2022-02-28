import React, {useEffect, useRef, useState, useContext} from 'react';
import Lottie from "lottie-web";
import { Context } from 'context';

let intervalId = 0;
const DallagersTopSection = (props) => {
  const {globalState} = useContext(Context);
  const {chatInfo} = globalState;
  const lottieRef = useRef(null);
  const [stoneAniQueue, setStoneAniQueue] = useState([]);

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
    }
  }, []);


  //test
  useEffect(() => {
    console.log('aniQueue', stoneAniQueue);
  }, [stoneAniQueue])


  // chat_socket -> 소켓서버로부터 패킷을 받으면 setStoneAniQueue에 계속 push
  useEffect(() => {
    if (chatInfo) {
      //애니메이션 붙이는 곳
      chatInfo.setBroadcastStateChange('setStoneAniQueueState', (state) => {
        setStoneAniQueue((prev) => prev.concat(state));
      });
    }

    return () => {
      if (chatInfo && chatInfo.hasOwnProperty('setBroadcastStateClear')) {
        console.log("@@@@@@@@");
        chatInfo.setBroadcastStateClear();
      }
    };
  }, [chatInfo]);

  return (
    <div className="dallagurs-section">
      
      {/* 반짝거리는 로티 버튼 */}
      <div className="icon-lottie" ref={lottieRef}/>
      <img src="https://image.dalbitlive.com/event/rebranding/root_d.webp" alt="" className="webp-img"/>
    </div>);

};

export default React.memo(DallagersTopSection);