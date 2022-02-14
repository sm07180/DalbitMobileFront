import React, {useState, useMemo, useContext} from 'react';

// Context
// import {GlobalContext} from "context";
// import {BroadcastContext} from "context/broadcast_ctx";
import {BroadcastLayerContext} from "context/broadcast_layer_ctx";
import "./index.scss";
import {addComma} from "../../../../lib/common_fn";

const MoonLandPop = (props: any) => {
  const {dispatchLayer, dispatchDimLayer} = useContext(BroadcastLayerContext);
  const {roomOwner, data} = props;

  //달나라 애니메이션 출력 여부 토글 초깃값
  const aniSwitchInitValue: boolean = useMemo<boolean>((): boolean => {
    if(typeof window !== 'undefined'){
      const moonLandAniBool = localStorage.getItem("toTheMoonOnOff");
      if(!moonLandAniBool){
        localStorage.setItem("toTheMoonOnOff", "true");
        return true;
      } else {
        return moonLandAniBool === 'true'; // true : false
      }
    } else {
      return false;
    }
  },[]);

  const [aniSwitch, setAniSwitch] = useState<boolean>(aniSwitchInitValue);

  const itemActive = (itemNo = "") => {
    dispatchLayer({
      type: "GIFT",
      others: {
        guestClicked: false,
        itemNo: itemNo,
        cnt: 1,
      }
    });

    //현재 컴포넌트 닫기
    dispatchDimLayer({type:"INIT"});
  };

  const switchToggle = () => {
    setAniSwitch(!aniSwitch);
    if(typeof window !== 'undefined'){
      localStorage.setItem("toTheMoonOnOff", `${!aniSwitch}`);
    }
  }

  return (
  <div id={"goToMoonLayer"}>
    <div className={"layerWrap"} onClick={(e) => e.stopPropagation()}>
      <div className='topimg'/>
      <div className='title'>
        <img src='https://image.dalbitlive.com/broadcast/event/gotomoon/pop_gotomoon-title.png' alt="달나라 갈끄니까!"/>
      </div>
      <div className='itemSection'>
        <div className='itemWrap'>
          {
            data && data.items.map((data: {itemNo: string, img: string, dalCnt: number, completed: string}, index) => {
              const {itemNo, img, dalCnt, completed} = data;
              return (
                <div key={index} className={`itemList ${completed === 'y'? 'complete' : ''}`}
                     onClick={(e) => {
                       e.stopPropagation();
                       !roomOwner && itemActive(itemNo); // completed === 'n'
                     }}>
                  <div className='itemImg'><img className={"item"} src={img} alt="아이템"/></div>
                  <div className='itemPrice'>
                    <span className='iconDal'/>
                    <span className='dalPrice'>{dalCnt}</span>
                  </div>
                </div>
              )
            })
          }          
        </div>
        <div className='itemInfo'>
          <p>모든 아이템을 선물하면 <strong>보너스 코인</strong> 등장!</p>
        </div>
      </div>
      <div className='myRank'>
        <div className='myRankData'>
          <span className='myRankText'>내순위</span>
          <span className='myRankBadge'>{addComma(data? data.ranking.rank: 0)}</span>
        </div>
        <div className={`myRankAni level${data ? (data.ranking.rankStep === 0 ?6 : data.ranking.rankStep) : 1}`}>
          <div className="scoreWrap">
            <span className="iconCoin"/>
            <span className="scoreNow">{addComma(data? data.ranking.coin.balance: 0)}</span>
            <span className="scoreGoal">/ {addComma(data? data.ranking.coin.total: 0)}</span>
          </div>
          {data && data.ranking && data.ranking.rankStep > 0 &&
            <div className="rewardWrap">
              <span className="rewardText">다음보상</span>
              <div className="rewardBox">
                <span className="iconDal"/>
                <span className="rewardVal">
                  {data? data.ranking.nextGift? data.ranking.nextGift.split('달')[0] : '0' : '0'}
                </span>
                <span className="rewardUnit">달</span>
              </div>
            </div>
          }
        </div>
      </div>
      <div className='aniSwitch'>
          <div className='switchWrap'>
            <span className='switchTitle'>코인 애니메이션 표시</span>
            <span className={`switchBtn ${aniSwitch? 'on' : ''}`} onClick={switchToggle}/>
          </div>
          <div className='switchInfo'>
            <p>※방송방 내 코인 출현 효과를 끄고 켤 수 있습니다.</p>
          </div>
      </div>
      <div className='closeBtn' onClick={() => dispatchDimLayer({type:"INIT"}) }/>
    </div>
  </div>
  );
};

export default MoonLandPop;