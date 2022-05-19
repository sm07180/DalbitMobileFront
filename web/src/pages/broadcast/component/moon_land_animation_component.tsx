import React, {useContext, useEffect, useLayoutEffect, useState, useRef, useMemo, useCallback} from 'react';
import {IMG_SERVER} from "../../../constant/define";
import {MediaType} from "../constant";
import MoonLandAnimateChildren from "./moon_land_animate_children";


type aniQueueReturnType = {
  uid: string,
  webpPrevClass: string,
  webpUrl: string,
  left: number,
  type: number,
  score: number,
  roomNo: number
  autoTouch: boolean
};

const MoonLandAnimationComponent = (props: any) => {
  const {roomInfo, chatInfo, roomOwner} = props;

  //receiveSocket -> component
  const [pointAnimate, setPointAnimate] = useState<any>(null);

  //애니메이션 실행 큐 테스트용
  const [aniQueue, setAniQueue] = useState<Array<Object>>([]);
  const aniQueueValueRef = useRef<Array<Object>>([]);

  const mediaType = useMemo(() => {
    if(roomInfo.mediaType === MediaType.VIDEO){
      return MediaType.VIDEO;
    } else if(roomInfo.mediaType === MediaType.AUDIO){
      return MediaType.AUDIO;
    } else {
      return null;
    }
  }, [roomInfo.mediaType]);

  //동전 애니메이션 삭제
  //aniQueueValueRef.current : 전역 aniQueue, (setTimeout 콜백 내에서 씽크 맞출라면 이렇게 해야함)
  const handleRemoveAniChildren = useCallback((uid: string) => {
    if(aniQueueValueRef.current) {
      const arr = aniQueueValueRef.current.filter((data) => data['uid'] !== uid);
      setAniQueue(arr);
    }
  },[aniQueue]);

  //소켓서버에서 주는 type으로 코인 모양 결정하기
  //return: 동전 모양 클래스명
  const getCoinFormat = useCallback((type: number): string => {
    switch(type){
      case 1:
        return 'basicCoin';
      case 2:
      case 3:
      case 4:
      case 5:
        return 'goldenCoin';
      case 6:
      case 7:
        return 'characterCoin';
      default:  //지정되지 않은 타입
        return '';
    }
  },[]);

  // chat_socket -> "reqPlayCoin" 패킷을 받으면 실행할 콜백함수 전달
  useEffect(() => {
    if (chatInfo) {
      chatInfo.setBroadcastStateChange('moonLandStateFn', (state) => {
        setPointAnimate(state);
      });
    }

    return () => {
      if (chatInfo && chatInfo.hasOwnProperty('setBroadcastStateClear')) {
        chatInfo.setBroadcastStateClear('moonLandStateFn');
      }
    };
  }, [chatInfo]);

  const makeCoinDataToObject = (data): aniQueueReturnType | {} => {
    if(data && data.hasOwnProperty('type') && data.hasOwnProperty('score') && data.hasOwnProperty('aniCode') ) {
      const uid = Date.now();
      const randId = Math.floor(Math.random() * 1000);
      const right = Math.floor(Math.random() * 120);
      const rotateClass = Math.floor(Math.random() * 10) % 2 === 0 ? 'rotateLeft' : 'rotateRight';
      const webpPrevClass = getCoinFormat(data.type);

      return {
        uid: `coin${uid}${randId}`,
        webpPrevClass: `${webpPrevClass} ${rotateClass}`,
        webpUrl : `${data.aniCode}?${uid}`,
        right,
        type: data.type,                                      //score insert Param
        score: data.score,                                    //score insert Param
        roomNo: chatInfo ? chatInfo.chatUserInfo.roomNo : 0,  //score insert Param
        autoTouch: roomOwner,  //방장인 경우 자동으로 점수 획득되는 애니메이션 (실제로는 이미 점수 획득한 상태)
        //mediaType,
        coinKey: data?.coinKey
      };
    } else {
      return {};
    }
  }

  useLayoutEffect(() => {
    aniQueueValueRef.current = aniQueue;
  },[aniQueue]);

  useEffect(() => {
    if (pointAnimate) {
      const {normal, gold, character} = pointAnimate;
      if (normal && gold && normal.hasOwnProperty('type') && normal.hasOwnProperty('score') && normal.hasOwnProperty('aniCode') &&
        gold.hasOwnProperty('type') && gold.hasOwnProperty('score') && gold.hasOwnProperty('aniCode') &&
        character.hasOwnProperty('type') && character.hasOwnProperty('score') && character.hasOwnProperty('aniCode')) {

        let resultAniArr = new Array();
        if(normal.score > 0) { // 일반 코인
          resultAniArr.push(makeCoinDataToObject(normal));
        }
        if (gold.score > 0) { // 보너스 코인
          resultAniArr.push(makeCoinDataToObject(gold));
        }
        if (character.score > 0) { // 보너스 코인
          resultAniArr.push(makeCoinDataToObject(character));
        }
        // aniQueueValueRef.current : aniQueue State 담은 값임
        setAniQueue([...aniQueueValueRef.current, ...resultAniArr]);
      }
    }

  }, [pointAnimate]);

  return (<>
    {aniQueue.length > 0 && aniQueue.map((data: any, index) => {
      return <MoonLandAnimateChildren key={`${data.uid}`} data={data} handleRemoveAniChildren={handleRemoveAniChildren}/>;
    })}
  </>);
};

export default React.memo(MoonLandAnimationComponent);
