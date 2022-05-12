import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom'
import Swiper from 'react-id-swiper'
import {IMG_SERVER} from 'context/config'
import ListRow from 'components/ui/listRow/ListRow'
import Api from "context/api";
import './style.scss'
import Utility from "common/utility/utility";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
import {useDispatch, useSelector} from "react-redux";
import {Hybrid, isHybrid} from "context/hybrid";
import qs from 'query-string';

const keyboardHero = () => {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const history = useHistory()
  const mainTopRef = useRef()
  const tabRef = useRef()

  const [tabFixed, setTabFixed] = useState(false)
  const [tabType, setTabType] = useState('keyboardhero');
  const {webview} = qs.parse(location.search);

  const swiperParams = {
    loop: true,
    direction: 'vertical',
    slidesPerColumnFill: 'row',
    slidesPerView: 2,
    autoplay: {
      delay: 2500
    }
  }
  const windowScrollEvent = () => {
    let scroll = window.scrollY || window.pageYOffset

    if (scroll >= mainTopRef.current.clientHeight) {
      setTabFixed(true)
    } else {
      setTabFixed(false)
    }
  }
  //오늘의 당첨자 List State
  const [list, setList] = useState([]);
  const [myInfo, setMyInfo] = useState({
    play_time : 0,
    one_time_yn : "n",
    two_time_yn : "n",
    one_step_rcv_yn : "n",
    two_step_rcv_yn : "n",
  });

  // get data
  useEffect(() => {
    if (tabType === "keyboardhero") { //오늘의 당첨자
      Api.keyboardHero({
        reqBody: false,
        params: {memNo: globalState.profile.memNo ? globalState.profile.memNo : "0", pageNo: 1, pagePerCnt: 1000},
        method: 'GET'
      }).then((res) => {
        setList(res.data);
      })
    } else {
      Api.keyboardHeroBonus({ // 보너스 선물탭
        reqBody: false,
        params: {memNo: globalState.profile.memNo ? globalState.profile.memNo : "0" },
        method: 'GET'
      }).then((res) => {
        setMyInfo({
          ...res.data
        });
      })
    }

  }, [tabType]);


  useEffect(() => {
    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [])
  const imageNum = (preCode) => {
    switch (preCode){
      case "r01":
        return "1"    //10달
      case "r02":
        return "2"    //50달
      case "r03":
        return "3"    //100달
      case "k01":
        return "4"    //스타벅스 아메리카노
      case "k02":
        return "5"    //GS25 교환권 5000원
      case "k04":
        return "6"    //네이버페이 1만원 포인트
      case "k03":
        return "7"    //맘스터치 싸이버거 세트
      case "k05":
        return "8"    //배스킨라빈스31 2만원 교환권
    }
  }

  //본인인증
  const selfAuthCheck = async () =>{
    const {result, data} = await Api.self_auth_check();
    if(result === 'success'){
      return {result : result, phoneNo : data.phoneNo};
    }else{
      history.push(`/selfauth?event=/event`)
    }
  }

  const giftItem = (bonusSlct) => {
    selfAuthCheck().then((response) => {
      if (response.result === 'success') {
        Api.keyboardHeroBonus({
          reqBody: true,
          data: {
            memNo: globalState.profile.memNo ? globalState.profile.memNo : "0",
            bonusSlct: bonusSlct,
          },
          method: 'POST'
        }).then((res) => {
          const result = res.data
          if(result === 0 || result === -2 || result === -3){
            dispatch(setGlobalCtxMessage({type: "alert",msg: '이미 선물을 받은 계정이 있습니다.'}));
          }else if(result === -1){
            dispatch(setGlobalCtxMessage({type: "alert",msg: '조건이 충족하지 않습니다.'}));
          }else if(result === 1){
            dispatch(setGlobalCtxMessage({type: "alert",msg: '선물받기 완료'}));
          }else{
            dispatch(setGlobalCtxMessage({type: "alert",msg: '잠시 후에 다시 시도해주세요.'}));
          }
        });
      }
    });
  }

  const clickBack = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
  }

  return (
    <div id="keyboardHero">
      <header className="back sticky">
        <button className="back" onClick={()=>clickBack()}/>
        <h1 className="title">키보드 히어로 31</h1>
      </header>

      <img src={`${IMG_SERVER}/event/keyboardHero/mainTop.png`} alt="키보드 히어로 31" ref={mainTopRef}/>
      <section className={`tabWrap ${tabFixed ? 'fixed' : ''}`} ref={tabRef}>
        <div className="tabBox">
          <button className={tabType === "keyboardhero" ? 'active' : ''} onClick={() => {
            setTabType("keyboardhero");
          }}>
            <img src={`${IMG_SERVER}/event/keyboardHero/tabKeyboardhero.png`} alt="키보드히어로 31" />
          </button>
          <button className={tabType === "bonus" ? 'active' : ''} onClick={() => {
            setTabType("bonus");
          }}>
            <img src={`${IMG_SERVER}/event/keyboardHero/tabBonus.png`} alt="보너스" />
          </button>
          <div className="buttonBack"/>
        </div>
      </section>
      {tabType === "keyboardhero" ?
      <>
        <section className="winningWrap">
          <div className="winningBox">
            <div className="title">
              <img src={`${IMG_SERVER}/event/keyboardHero/todayWinningTitle.png`} alt="오늘의 당첨자" />
            </div>
            <div className="content">
              {(list && list.length > 0) ?
                <>
                  <div className="welcome">축하드립니다!</div>
                  <Swiper {...swiperParams}>
                    {list.map((data, index)=>{
                      let giftImg = `https://image.dalbitlive.com/event/keyboardHero/present-${imageNum(data.pre_code)}.png`;
                      return(
                        <div key={index}>
                          <ListRow photo={giftImg} key={index}>
                            <div className="listContent">
                              <div className="present">{data.code_name}</div>
                              <div className="nick">{data.mem_nick}</div>
                            </div>
                          </ListRow>
                        </div>
                      )
                    })}
                  </Swiper>
                  <button onClick={() => {history.push('/event/keyboardhero_todaywinning')}}>
                    <img src={`${IMG_SERVER}/event/keyboardHero/todayWinningButton.png`} alt="당첨자보기 및 선물받기" className="listMore"/>
                  </button>
                </>
                :
                <img src={`${IMG_SERVER}/event/keyboardHero/listNone.png`} alt="아직 당첨자가 없어요!" />
              }
            </div>
          </div>
        </section>
        <section className="contentWrap">
          <img src={`${IMG_SERVER}/event/keyboardHero/mainContent.png`}  alt="메인콘텐츠"/>
        </section>
        <section className="noticeWrap">
          <img src={`${IMG_SERVER}/event/keyboardHero/notice-1.png`} alt="주의사항"/>
        </section>
      </>
       :
      <>
        <section className="contentWrap">
          <img src={`${IMG_SERVER}/event/keyboardHero/bonus.png`}  alt="보너스"/>
          <div className="bonusWrap">
            <div className="bonusBox">
              <ListRow photo={`${IMG_SERVER}/event/keyboardHero/bonus-1.png`}>
                <div className="listContent">
                  <div className="title">방송 시청 150시간 달성</div>
                  <div className="time">{Utility.secondToHM(myInfo.play_time)}</div>
                </div>
                <button className={`listBack ${(myInfo.one_time_yn === "y" && myInfo.one_step_rcv_yn === "n" ) ? '' : 'disabled'}`}
                        onClick={()=>giftItem("o")}>100달 받기</button>
              </ListRow>
              <ListRow photo={`${IMG_SERVER}/event/keyboardHero/bonus-2.png`}>
                <div className="listContent">
                  <div className="title">방송 시청 300시간 달성</div>
                  <div className="time">{Utility.secondToHM(myInfo.play_time)}</div>
                </div>
                <button className={`listBack ${(myInfo.two_time_yn === "y" && myInfo.two_step_rcv_yn === "n") ?'' : 'disabled'}`}
                        onClick={()=>giftItem("t")}>300달 받기</button>
              </ListRow>
            </div>
          </div>
        </section>
        <section className="noticeWrap">
          <img src={`${IMG_SERVER}/event/keyboardHero/notice-2.png`} alt="주의사항"/>
        </section>
      </>
      }
    </div>
  );
};

export default keyboardHero;