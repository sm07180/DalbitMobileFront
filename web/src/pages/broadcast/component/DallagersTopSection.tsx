import React, {useContext, useEffect, useRef, useState} from 'react';
import Lottie from "lottie-web";
import {Context} from 'context';
import moment from "moment";
import {useHistory} from "react-router-dom";

let intervalId = 0;

//RAF
let rafId = 0;  //requestAnimationFrame id 값
let rafId2 = 0;  //requestAnimationFrame id 값
let rafStoneAniTime = 0;  // 조각 애니메이션 시간 계산용

let rafFeverTime = 0; // 피버타임 시간 계산용
let rafPrevFeverTime = 0; // 1초 계산용

let feverStartedTime: any = null; // 피버타임 씽크용 (브라우저 백그라운드 상태일때 타이머가 멈춤 => 누락된 시간 계산용)

let aniStatus = {
  step1: false, step2: false, // 애니메이션 단계 상태 (state 여러번 변경 방지)
  stoneAniPlaying: false, // 조각 애니메이션 진행중 여부
  feverTimePlaying: false,  // 피버여부 진행중 여부
};

const DallagersTopSection = (props) => {
  const {roomNo} = props;

  const history = useHistory();
  const {globalState} = useContext(Context);
  const {chatInfo} = globalState;
  const lottieRef = useRef(null);
  const feverLottieRef = useRef(null);
  const feverLottieController = useRef<any>(null);

  //조각 애니메이션
  const stoneAniQueueRef = useRef<any>([]);
  const [stoneAniQueue, setStoneAniQueue] = useState([]);
  const [stoneAni, setStoneAni] = useState({playing: false, comboPlay: false, webpUrl: '', comboCnt: 0 });

  //피버타임 (playing :로티 렌더링, lottieContinuePlaySec: 로티 이어서 재생)
  const [feverPlaying, setFeverPlaying] = useState({playing: false, lottieContinuePlaySec: 0});

  const stopFeverTime = () => {
    rafFeverTime = 0;
    rafPrevFeverTime = 0;
    aniStatus.feverTimePlaying = false; // 상태 체크용
    setFeverPlaying({playing: false, lottieContinuePlaySec: 0});
    cancelAnimationFrame(rafId);
    window.sessionStorage.removeItem("feverInfo");
  };

  const remainTimeChecker = () => {
    const startedTime  = window.sessionStorage.getItem("feverInfo");
    if(startedTime) {
      const feverInfo = JSON.parse(startedTime);

      if(feverInfo?.roomNo === roomNo && feverInfo?.startTime) {
        const nowTime = moment();
        const prevDateTime = moment(feverInfo?.startTime, 'YYYY-MM-DD HH:mm:ss');

        const diffSeconds = moment.duration(nowTime.diff(prevDateTime)).asSeconds();

        if(diffSeconds < 60){
          // 피버타임 이어서 시작하기
          feverStartedTime = prevDateTime;
          setFeverPlaying({playing: true, lottieContinuePlaySec: diffSeconds});
        } else {
          window.sessionStorage.removeItem("feverInfo");
        }

      }
    }
  };

  useEffect(() => {
    //icon_fever.json
    const stoneLottie = Lottie.loadAnimation({
      container: lottieRef.current!,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: 'https://image.dalbitlive.com/event/rebranding/icon_dalla.json',
    });

    const feverTimeLottie = Lottie.loadAnimation({
      container: feverLottieRef.current!,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: 'https://image.dalbitlive.com/event/rebranding/icon_fever.json',
    });

    stoneLottie.addEventListener('data_ready', () => {
        intervalId = setInterval(() => {
          stoneLottie.goToAndPlay(1, true);
        }, 120000);
    });

    feverTimeLottie.addEventListener('data_ready', () => {
      console.log("load done");
      feverLottieController.current = feverTimeLottie;

      // 피버타임 진행중에 방송방 종료시 세션스토리지에서 시간이 남았는지 체크
      remainTimeChecker();
    });

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(rafId2);
    }
  }, []);

  // chat_socket -> 소켓서버로부터 패킷을 받으면 setStoneAniQueue에 계속 push
  useEffect(() => {
    if (chatInfo) {
      //애니메이션 붙이는 곳
      chatInfo.setBroadcastStateChange('setStoneAniQueueState', (state) => {
        setStoneAniQueue(() => stoneAniQueueRef.current.concat(state));
      });

      //피버타임 시작해주세요
      chatInfo.setBroadcastStateChange('setFeverTimeState', (state) => {
        feverStartedTime = moment();
        if(state === true) {  // 피버타임 시작
          setFeverPlaying({playing: true, lottieContinuePlaySec: 0});
          window.sessionStorage.setItem("feverInfo", JSON.stringify({startTime: feverStartedTime.format("YYYY-MM-DD HH:mm:ss"), roomNo}));
        } else {  // 피버타임 종료
          stopFeverTime();
        }
      });
    }

    return () => {
      if (chatInfo && chatInfo.hasOwnProperty('setBroadcastStateClear')) {
        chatInfo.setBroadcastStateClear('setStoneAniQueueState');
        chatInfo.setBroadcastStateClear('setFeverTimeState');
      }
    };
  }, [chatInfo]);

  const reqCallback = (timestamp) => {
    /* 피버 타임 남은시간 */
    if(aniStatus.feverTimePlaying) {
      if(rafFeverTime === 0) rafFeverTime = timestamp;  // rafFeverTime : 0으로 초기화 하면 60초부터 재시작
      let _feverTime = timestamp - rafFeverTime;  // 진행된 누적 시간
      let remainFeverTime;
      if(_feverTime - rafPrevFeverTime > 500){
        rafPrevFeverTime = _feverTime;  //1초 계산용

        //백그라운드에 뒀을때 타이머가 늦게 시작한 경우 시간차를 계산, 남은시간 60초를 감산해서 계산하기
        const nowTime = moment();
        const prevDateTime = moment(feverStartedTime, 'YYYY-MM-DD HH:mm:ss');
        const diffSeconds = moment.duration(nowTime.diff(prevDateTime)).asSeconds();
        const addRemainTime = Math.round(diffSeconds) - Math.round(_feverTime/1000);

         //남은 시간 계산용 (ms)
        if(addRemainTime > 0){
          remainFeverTime = Math.floor((60000 - (_feverTime + addRemainTime * 1000 )));

          if(feverLottieController.current) {
            feverLottieController.current.goToAndStop(Math.round((_feverTime + addRemainTime * 1000 )/1000)*30, true);
          }
        } else {
          remainFeverTime = Math.floor((60000 - _feverTime ));

          if(feverLottieController.current) { //로티 30프레임 단위로 옮기기
            feverLottieController.current.goToAndStop(Math.round(_feverTime/1000)*30, true);
          }
        }
      }

      // 피버타임 끝
      if(remainFeverTime <= 0){
        stopFeverTime();
      }

      rafId = requestAnimationFrame(reqCallback);
    }
  };

  const reqCallback2 = (timestamp) => {
    /* 조각 애니메이션 타이밍 */
    if(aniStatus.stoneAniPlaying) {
      if(rafStoneAniTime === 0) rafStoneAniTime = timestamp;
      let progressTime = timestamp - rafStoneAniTime;

      if (progressTime > 330) {
        if (!aniStatus.step1) { // 조각 콤보 출력
          aniStatus.step1 = true;
          setStoneAni((prev) => ({...prev, comboPlay: true}));
        }
      }

      if (progressTime >= 3000) {
        if (!aniStatus.step2) { // 조각 콤보 종료
          aniStatus.step2 = true;
          setStoneAni((prev) => ({...prev, comboPlay: false}));
        }
        //data reset
        rafStoneAniTime = 0;
        aniStatus = {...aniStatus, stoneAniPlaying: false, step1: false, step2: false}; // 조각 애니메이션 끝

        setStoneAni({playing: false, comboPlay: false, webpUrl: '', comboCnt: 0});
        setStoneAniQueue(stoneAniQueueRef.current); //다음 애니메이션 재생
      }

      rafId2 = requestAnimationFrame(reqCallback2);
    }
  };

  /** 피버타임 시작 / 종료
   * trigger 1 : 소켓패킷 ( 피버타임 시작 )
   * trigger 2 : 피버타임 종료 ( 60초 후 종료시 )
   */
  useEffect(() => {
    if(feverPlaying.playing){
      aniStatus.feverTimePlaying = true;

      // 피버타임 로티 재생
      if(feverLottieController.current) {
        if (feverPlaying.lottieContinuePlaySec === 0) {  // 60초 부터 카운트 ( 1 프레임 부터 재생 )
          feverLottieController.current.goToAndPlay(1, true);
        } else {  // sessionStorage 에 저장해둔 시간 (60 - t) 을 비교하여 이어서 카운트 시작하기 ( n 초 이후 부터 재생 )
          feverLottieController.current.goToAndStop(Math.floor( feverPlaying.lottieContinuePlaySec ) * 30, true);
        }
      }

      //피버타임 진행중에 피버타임 재시작
      if(rafFeverTime > 0){
        rafFeverTime = 0;
        rafPrevFeverTime = 0;
      }

      //중복 카운팅 방지
      if(rafFeverTime === 0){
        rafId = requestAnimationFrame(reqCallback);
      }
    }
  },[feverPlaying]);

  /**
   *  조각 애니메이션 재생 (큐에 쌓고 조각 애니메이션 재생)
   * trigger 1 : 소켓패킷 -> 스택 0에서 pop -> 애니메이션 재생
   * trigger 2 : 스톤 애니메이션 종료후 -> 큐 길이 체크 -> 있으면 애니메이션 재생
   */
  useEffect(() => {
    if(stoneAniQueue.length > 0) {
      if (!aniStatus?.stoneAniPlaying) {
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
          aniStatus.stoneAniPlaying = true;
          if(rafStoneAniTime === 0) { //이미 실행중이면 중복 실행막기
            rafId2 = requestAnimationFrame(reqCallback2);
          }
        }
      } else {  // 조각 애니메이션이 실행중이면, 애니메이션 queue에 넣어둠
        stoneAniQueueRef.current = stoneAniQueue.concat([]);
        //console.log("애니메이션 실행중 => 조각 push", testCode1, '=>', testCode2 );
      }
    }
  }, [stoneAniQueue]);

  return (
    <div className="dallagurs-section">
      {/* 피버타임 60초 카운팅 */}
      <div className={`icon-lottie ${feverPlaying.playing? '': 'none'}`} ref={feverLottieRef}
           onClick={()=>{history.push("/event/rebranding")}}/>
      {/* 스톤 dalla 버튼 로티 */}
      <div className={`icon-lottie ${feverPlaying.playing? 'none': ''}`} ref={lottieRef}
           onClick={()=>{history.push("/event/rebranding")}}/>

      {/* webp 조각 애니메이션 */}
      {stoneAni?.playing &&
        <>
          <img src={stoneAni?.webpUrl} alt="" className="webp-img"/>
          {stoneAni.comboPlay && <span className="combo">
            {stoneAni?.comboCnt > 0 ? `x ${stoneAni?.comboCnt}` : ''}
          </span>}
        </>
      }
    </div>);

};

export default React.memo(DallagersTopSection);