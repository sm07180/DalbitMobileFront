import React, {useEffect, useRef, useState, useContext} from 'react';
import Lottie from "lottie-web";
import { Context } from 'context';
import moment from "moment";
import {useHistory} from "react-router-dom";

let intervalId = 0;

//RAF
let rafId = 0;  //requestAnimationFrame id 값
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

  //피버타임
  const [feverPlaying, setFeverPlaying] = useState({playing: false, nothingVal:0});
  //const [feverTimeText, setFeverTimeText] = useState(0);

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
        //feverLottieController.current.goToAndPlay(1, true);
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
        console.log("스톤 애니메이션 실행, 받은 돌: \n", state[0] || '','\n', state[1] || '','\n', state[2] || '');
        setStoneAniQueue(() => stoneAniQueueRef.current.concat(state));
      });

      //피버타임 시작해주세요
      chatInfo.setBroadcastStateChange('setFeverTimeState', (state) => {
        console.log("socket -> fever start")
        feverStartedTime = moment();
        setFeverPlaying({playing: state, nothingVal: Date.now()});
      });
    }

    return () => {
      if (chatInfo && chatInfo.hasOwnProperty('setBroadcastStateClear')) {
        chatInfo.setBroadcastStateClear();
      }
    };
  }, [chatInfo]);

  const reqCallback = (timestamp) => {

    /* 피버 타임 남은시간 */
    if(aniStatus.feverTimePlaying) {
      if(rafFeverTime === 0) rafFeverTime = timestamp;  // rafFeverTime : 0으로 초기화 하면 60초부터 재시작
      let _feverTime = timestamp - rafFeverTime;  // 진행된 누적 시간

      if(_feverTime - rafPrevFeverTime > 900){  // 1초 차이마다 60초 카운트 state 변화
        rafPrevFeverTime = _feverTime;  //1초 계산용

        //백그라운드에 뒀을때 타이머가 늦게 시작한 경우 시간차를 계산, 남은시간 60초를 감산해서 계산하기
        const nowTime = moment();
        const prevDateTime = moment(feverStartedTime, 'YYYY-MM-DD HH:mm:ss');
        const diffSeconds = moment.duration(nowTime.diff(prevDateTime)).asSeconds();
        const addRemainTime = Math.round(diffSeconds) - Math.round(_feverTime/1000);

        let remainFeverTime;  //남은 시간 계산용 (ms)
        if(addRemainTime > 0){
          remainFeverTime = Math.floor((60000 - (_feverTime + addRemainTime * 1000 )));

          if(feverLottieController.current) {
            feverLottieController.current.goToAndStop(Math.round((_feverTime + addRemainTime * 1000 )/1000)*30, true);
          }
        } else {
          remainFeverTime = Math.floor((60000 - _feverTime ));

          if(feverLottieController.current) {
            feverLottieController.current.goToAndStop(Math.round(_feverTime/1000)*30, true);
          }
        }

        //setFeverTimeText((prev)=> --prev);
      }
      // 피버타임 끝
      if(_feverTime > 60000){
        console.log("fever end");
        rafFeverTime = 0;
        rafPrevFeverTime = 0;
        aniStatus.feverTimePlaying = false; // 상태 체크용
        setFeverPlaying({playing: false, nothingVal: 0}); // dom 렌더링 용도
      }
    }

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
    }

    //  피버타임, 조각애니메이션 false 일때 까지 재귀호출
    if(aniStatus.feverTimePlaying || aniStatus.stoneAniPlaying) {
      rafId = requestAnimationFrame(reqCallback);
    }
  };

  /** 피버타임 시작 / 종료
   * trigger 1 : 소켓패킷 ( 피버타임 시작 )
   * trigger 2 : 피버타임 종료 ( 60초 후 종료시 )
   */
  useEffect(() => {
    if(feverPlaying.playing){
      aniStatus.feverTimePlaying = true;
      
      if(feverLottieController.current) // 피버타임 로티 재생
        feverLottieController.current.goToAndPlay(1, true);

      if(rafFeverTime > 0){ //피버타임 진행중에 피버타임 재시작
        rafFeverTime = 0;
        rafPrevFeverTime = 0;
        console.log("feverTime restart@@@");
      } else{ //test
        console.log("feverTime start");
      }
      //setFeverTimeText(60);
      if(rafFeverTime === 0 && !aniStatus.stoneAniPlaying){ //중복 카운팅 방지
        rafId = requestAnimationFrame(reqCallback);
      }
    } else {
      aniStatus.feverTimePlaying = false;
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
          if(rafStoneAniTime === 0 && !aniStatus.feverTimePlaying) { //이미 실행중이면 중복 실행막기
            rafId = requestAnimationFrame(reqCallback);
          }
        }
      } else {  // 조각 애니메이션이 실행중이면, 애니메이션 queue에 넣어둠

        const testCode1 = stoneAniQueueRef.current;
        const testCode2 = stoneAniQueue;
        stoneAniQueueRef.current = stoneAniQueue.concat([]);
        console.log("애니메이션 실행중 => 조각 push", testCode1, '=>', testCode2 );
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