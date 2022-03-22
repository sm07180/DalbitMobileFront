import React, {useState, useEffect, useRef} from 'react';
import {setMoonLandScore} from "../../../common/api";
import {MediaType} from "../constant";

const MoonLandAnimateChildren = (props: any) => {
  const {handleRemoveAniChildren} = props;
  const {uid, webpPrevClass, right, webpUrl,
          type, score, roomNo, autoTouch, coinKey} = props.data;

  const thisElRef = useRef<any>(null);
  const timerRef = useRef(0);
  const animateRef = useRef<any>(); //동전 애니메이션
  const scoreAnimateRef = useRef<any>();  //점수 애니메이션

  const clickLock = useRef(false); // 여러번 클릭 방지
  const [webpPlaying, setWebpPlaying] = useState({playBool: false, scoreText: ''});

  const coinClick = async (e) => {
    e.stopPropagation();
    if(!clickLock.current) {

      if (timerRef.current) clearTimeout(timerRef.current);
      if (animateRef.current) animateRef.current.pause();
      timerRef.current = setTimeout(() => {
        handleRemoveAniChildren(uid); //현재 컴포넌트 제거
      }, 3000);

      clickLock.current = true; //클릭 막기
      setWebpPlaying({playBool: true, scoreText: score}); //wepb 실행
      //setScoreAni(score);
      if(scoreAnimateRef.current)
        scoreAnimateRef.current.animate([{top: "0px", zIndex: "2"}], {duration: 330, fill: "forwards"});

      if(!autoTouch) {
        const {data, message} = await setMoonLandScore({type, score, roomNo, coinKey});
      }

    }
  };

  useEffect(() => {
    if(thisElRef.current) {
      try {
        thisElRef.current.style.right = `${right}px`;

        if (!autoTouch) {
          const endPositionTop = Math.floor(Math.random() * 40 + 20);
          const keyFrameEffect = new KeyframeEffect(
            thisElRef.current,
            [{top: `${Math.floor(Math.random() * 20 + 640)}px`}, {top: `${endPositionTop}px`}],
            {duration: 4000, fill: "forwards", easing: "cubic-bezier(.61,.31,.44,.99)"});
          animateRef.current = new Animation(keyFrameEffect, document.timeline);
          animateRef.current.play();

          thisElRef.current.addEventListener('click', coinClick);

          //animation end - 5s timer start
          animateRef.current.finished.then((res) => {
            if (thisElRef.current && timerRef.current === 0) {
              /* 둥실거리는 효과 */
              const keyFrameEffect = new KeyframeEffect(
                thisElRef.current,
                [
                  {top: `${Math.floor(endPositionTop)}px`, easing: "cubic-bezier(.61,.31,.44,.99)", offset: 0},
                  {top: `${Math.floor(endPositionTop + Math.random()*11 + 1)}px`, easing: "cubic-bezier(.61,.31,.44,.99)", offset: 0.5},
                  {top: `${Math.floor(endPositionTop)}px`, easing: "cubic-bezier(.61,.31,.44,.99)", offset: 1}],
                {duration: 2000, fill: "forwards", iterations: Infinity});
              animateRef.current = new Animation(keyFrameEffect, document.timeline);
              animateRef.current.play();
              
              timerRef.current = setTimeout(() => {
                handleRemoveAniChildren(uid);
              }, 5000);
            }
          });
        } else { //자동 터치
          const keyFrameEffect = new KeyframeEffect(
            thisElRef.current,
            [{top: `${Math.floor(Math.random() * 20 + 640)}px`}, {top: `${Math.floor(Math.random() * 40 + 20)}px`}],
            {duration: 4000, fill: "forwards", easing: "cubic-bezier(.61,.31,.44,.99)"});
          animateRef.current = new Animation(keyFrameEffect, document.timeline);
          animateRef.current.play();

          thisElRef.current.addEventListener('click', coinClick);

          if (thisElRef.current && timerRef.current === 0) {
            timerRef.current = setTimeout(() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              if (animateRef.current) animateRef.current.pause();
              timerRef.current = setTimeout(() => {
                handleRemoveAniChildren(uid); //현재 컴포넌트 제거
              }, 3000);
              setWebpPlaying({playBool: true, scoreText: score}); //wepb 실행
              if (scoreAnimateRef.current)
                scoreAnimateRef.current.animate([{top: "-5px", zIndex: "2"}], {duration: 330, fill: "forwards"});
            }, Math.floor(Math.random() * 2001 + 2000));
          }
        }
      }catch(e){
        console.log('달나라 애니메이션 에러', e);
      }
    }

    return () => {
      if(timerRef.current && animateRef.current && thisElRef.current){
        animateRef.current.pause();
        thisElRef.current.removeEventListener('click', coinClick);
        clearTimeout(timerRef.current);
      }
    };

  },[]);
  
  //class 이미지 -> webp 이미지로 변경
  return (
    <div ref={thisElRef} className={`itemCoin ${webpPlaying.playBool? '' : webpPrevClass}`}>
      <div className="itemCoinWrap">
        {/* 클릭시 점수 */}
        <div ref={scoreAnimateRef} className={`itemCoinNum ${webpPlaying.playBool ? '' : 'hidden'}`}>
          {webpPlaying.playBool ? `${webpPlaying.scoreText}`: ''}
        </div>
        {/* 클릭시 webp */}
        <div className="itemCoinWebp"
             style={webpPlaying.playBool && webpUrl ? {backgroundImage: `url(${webpUrl})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}
               : {}}/>
      </div>
    </div>);
};

export default React.memo(MoonLandAnimateChildren);