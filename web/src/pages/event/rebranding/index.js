import React, {useState, useEffect, useCallback, useContext, useRef} from 'react'
import {Context} from 'context'
import {setIsRefresh, setSlidePopupOpen, setCommonPopupOpenData} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Hybrid, isHybrid} from "context/hybrid";
import {IMG_SERVER} from 'context/config';
import Api from 'context/api';
import Lottie from 'react-lottie';
import qs from 'query-string';
// global components
import Header from 'components/ui/header/Header';
import InputItems from 'components/ui/inputItems/InputItems';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import LayerPopup from 'components/ui/layerPopup/LayerPopup';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
// components
import Confirm from './components/Confirm'
import MergePop from './components/MergePop'
// contents
import Round_1 from './contents/Round_1';
import Round_2 from './contents/Round_2';
import Round_3 from './contents/Round_3';

import './style.scss'

const tabmenu = [1,2,3]

let touchStartY = null
let touchEndY = null
const refreshDefaultHeight = 48

const Rebranding = () => {
  const history = useHistory()
  const {webview} = qs.parse(location.search)

  const mainRef = useRef()
  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()
  const inputRef = useRef()

  const tabMenuRef = useRef()

  const dispatch = useDispatch()
  const common = useSelector(state => state.common);
  const popup = useSelector(state => state.popup);
  const context = useContext(Context)
  const {token} = context

  const [reloadInit, setReloadInit] = useState(false)
  const [pullToRefreshPause, setPullToRefreshPause] = useState(true)

  const [tabFixed, setTabFixed] = useState(false);
  const [tabmenuType, setTabmenuType] = useState(tabmenu[0])
  const [stoneInfo, setStoneInfo] = useState({type: '', value: 0})
  const [stoneValue1, setStoneValue1] = useState({on: false, value: 0})
  const [stoneValue2, setStoneValue2] = useState({on: false, value: 0})
  const [stoneValue3, setStoneValue3] = useState({on: false, value: 0})
  const [drawState, setDrawState] = useState(false)
  const [oddState, setOddState] = useState(false)
  const [mergeResult, setMergeResult] = useState({})
  const [noticePop1, setNoticePop1] = useState(false)
  const [noticePop2, setNoticePop2] = useState(false)
  const [giveawayPop, setGiveawayPop] = useState(false)
  const [actionAni, setActionAni] = useState(false)
  
  const [eventInfo, setEventInfo] = useState({
    cnt: 0,
    end_date: "",
    seq_no: 0,
    start_date: "",
  })
  const [myRankInfo, setMyRankInfo] = useState({})
  const [mySpecialRankInfo, setMySpecialRankInfo] = useState({})
  const [myPieceInfo, setMyPieceInfo] = useState({})

  // API 조회
  /* 이벤트 회차 정보 */
  const fetchEventInfo = () => {
    Api.getDallagersReqNo().then((res) => {
      if (res.result === 'success') {
        setEventInfo(res.data)
        setTabmenuType(tabmenu[res.data.seq_no - 1])
      }
    })
  }
  /* 내 랭킹 정보 */
  // 조각 때문에 한번더 API 콜
  const fetchMyRankInfo = (seqNo) => {
    const param = {seqNo: seqNo}
    Api.getDallagersMyRankInfo(param).then((res) => {
      if (res.result === 'success') {
        setMyRankInfo(res.data)
      }
    })
    if (seqNo === 3) {
      Api.getDallagersSpecialMyRankInfo(param).then((res) => {
        if (res.result === 'success') {
          setMySpecialRankInfo(res.data)
        }
      })
    }
  }

  const fetchMyPieceInfo = () => {
    const param = {seqNo: eventInfo.seq_no}
    Api.getDallagersMyRankInfo(param).then((res) => {
      if (res.result === 'success') {
        setMyPieceInfo(res.data)
      }
    })
  }

  /* 이니셜 스톤 교환 */
  const fetchStoneChange = (v1, v2, v3) => {
    Api.getDallagersStoneChange({data:{
      seqNo : eventInfo.seq_no, // 회차정보
      slot1 : v1,	//첫번째 선택 스톤
      slot2 : v2, //두번째 선택 스톤
      slot3 : v3, //두번째 선택 스톤
    }}).then((res) => {
      if (res.result === 'success') {
        setMergeResult(res.data.resultStone)
        mainDataReset()
      } else {
        console.log(res.data);
      }
    })
  }

  const mainDataReset = () => {
    setStoneValue1({...stoneValue1, on: false, value: 0});
    setStoneValue2({...stoneValue2, on: false, value: 0});
    setStoneValue3({...stoneValue3, on: false, value: 0});
    setDrawState(false);
    setOddState(false);
  }

  // 당겨서 새로 고침
  const mainTouchStart = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0) return
      touchStartY = e.touches[0].clientY
    },[reloadInit]
  )

  const mainTouchMove = useCallback((e) => {
    if (reloadInit === true || window.scrollY !== 0) return

    const iconWrapNode = iconWrapRef.current
    const refreshIconNode = arrowRefreshRef.current

    touchEndY = e.touches[0].clientY
    const ratio = 3
    const heightDiff = (touchEndY - touchStartY) / ratio
    const heightDiffFixed = 50

    if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
      if (heightDiff <= heightDiffFixed) {
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        refreshIconNode.style.transform = `rotate(${heightDiff * ratio}deg)`
      }
    }
  }, [reloadInit])

  const mainTouchEnd = useCallback(async (e) => {
    if (reloadInit === true) return

    const ratio = 3
    const transitionTime = 150
    const iconWrapNode = iconWrapRef.current
    const refreshIconNode = arrowRefreshRef.current

    const heightDiff = (touchEndY - touchStartY) / ratio
    const heightDiffFixed = 48
    if (heightDiff >= heightDiffFixed) {
      let current_angle = (() => {
        const str_angle = refreshIconNode.style.transform
        let head_slice = str_angle.slice(7)
        let tail_slice = head_slice.slice(0, 3)
        return Number(tail_slice)
      })()

      if (typeof current_angle === 'number') {
        setReloadInit(true)
        iconWrapNode.style.transitionDuration = `${transitionTime}ms`
        iconWrapNode.style.height = `${refreshDefaultHeight + 50}px`

        const loadIntervalId = setInterval(() => {
          if (Math.abs(current_angle) === 360) {
            current_angle = 0
          }
          current_angle += 10
          refreshIconNode.style.transform = `rotate(${current_angle}deg)`
        }, 17)

        setPullToRefreshPause(false);
        mainDataReset();

        await new Promise((resolve, _) => setTimeout(() => {
          resolve();
          setPullToRefreshPause(true);
        }, 300))
        clearInterval(loadIntervalId)

        setReloadInit(false)
      }
    }

    const promiseSync = () =>
      new Promise((resolve, _) => {
        iconWrapNode.style.transitionDuration = `${transitionTime}ms`
        iconWrapNode.style.height = `${refreshDefaultHeight}px`
        setTimeout(() => resolve(), transitionTime)
      })

    await promiseSync()
    iconWrapNode.style.transitionDuration = '0ms'
    refreshIconNode.style.transform = 'rotate(0)'
    touchStartY = null
    touchEndY = null
  }, [reloadInit])

  // 팝업 on off
  /* 놀기만 해도 스톤이! */
  const noticePopView1 = () => {
    setNoticePop1(true)
  }
  /* FEVER TIME! */
  const noticePopView2 = () => {
    setNoticePop2(true)
  }
  /* 경품안내 */
  const giveawayPopView = () => {
    setGiveawayPop(true)
  }
  // 스톤 버튼 선택
  const clickSelect = (e) => {
    const {targetType} = e.currentTarget.dataset;

    if (!token.isLogin) {
      history.push('/login')
      return
    }

    if (targetType === 'd' && myPieceInfo.ins_d_cnt > 0) {
      setStoneInfo({...stoneInfo, type: targetType, value: myPieceInfo.ins_d_cnt})
      dispatch(setSlidePopupOpen());
    } else if (targetType === 'd' && myPieceInfo.ins_d_cnt === 0) {
      context.action.toast({
        msg: `사용할 수 있는 스톤이 없습니다.`
      })
    }
    if (targetType === 'a' && myPieceInfo.ins_a_cnt > 0) {
      setStoneInfo({...stoneInfo, type: targetType, value: myPieceInfo.ins_a_cnt})
      dispatch(setSlidePopupOpen());
    } else if (targetType === 'a' && myPieceInfo.ins_a_cnt === 0) {
      context.action.toast({
        msg: `사용할 수 있는 스톤이 없습니다.`
      })
    }
    if (targetType === 'l' && myPieceInfo.ins_l_cnt > 0) {
      setStoneInfo({...stoneInfo, type: targetType, value: myPieceInfo.ins_l_cnt})
      dispatch(setSlidePopupOpen());
    } else if (targetType === 'l' && myPieceInfo.ins_l_cnt === 0) {
      context.action.toast({
        msg: `사용할 수 있는 스톤이 없습니다.`
      })
    }
  }

  // 스톤 갯수 확인
  const choicePiece = () => {
    let inputValue = Number(inputRef.current.value)
    
    if (inputValue === 0) {
      context.action.toast({
        msg: `1 이상 값을 입력해주세요.`
      })
      return
    }
    
    if (stoneInfo.type === 'd' && inputValue <= stoneInfo.value) {
      if (inputValue > 50) {
        context.action.toast({
          msg: `한 번에 스톤당 최대 50개까지 사용할 수 있어요.`
        })
      } else {
        setStoneValue1({...stoneValue1, on: true, value: inputValue})
        setDrawState(drawCheck(Number(inputValue)))
        closePopup(dispatch);
      }
    } else if (stoneInfo.type === 'd' && inputValue > stoneInfo.value) {
      context.action.toast({
        msg: `스톤이 부족해요. 보유 스톤을 확인해주세요.`
      })
    }
    if (stoneInfo.type === 'a' && inputValue <= stoneInfo.value) {
      if (inputValue > 50) {
        context.action.toast({
          msg: `한 번에 스톤당 최대 50개까지 사용할 수 있어요.`
        })
      } else {
        setStoneValue2({...stoneValue2, on: true, value: inputValue})
        setDrawState(drawCheck(Number(inputValue)))
        closePopup(dispatch);
      }
    } else if (stoneInfo.type === 'a' && inputValue > stoneInfo.value) {
      context.action.toast({
        msg: `스톤이 부족해요. 보유 스톤을 확인해주세요.`
      })
    }
    if (stoneInfo.type === 'l' && inputValue <= stoneInfo.value) {
      if (inputValue > 50) {
        context.action.toast({
          msg: `한 번에 스톤당 최대 50개까지 사용할 수 있어요.`
        })
      } else {
        setStoneValue3({...stoneValue3, on: true, value: inputValue})
        setDrawState(drawCheck(Number(inputValue)))
        closePopup(dispatch);
      }
    } else if (stoneInfo.type === 'l' && inputValue > stoneInfo.value) {
      context.action.toast({
        msg: `스톤이 부족해요. 보유 스톤을 확인해주세요.`
      })
    }
  }
  // 스톤 초기화
  const stoneClose = (e) => {
    e.stopPropagation()
    const {targetType} = e.currentTarget.parentNode.dataset
    if (targetType === 'd') {
      setStoneValue1({...stoneValue1, on: false, value: 0})
      setStoneInfo({...stoneInfo, type: '', value: 0})
    }
    if (targetType === 'a') {
      setStoneValue2({...stoneValue2, on: false, value: 0})
      setStoneInfo({...stoneInfo, type: '', value: 0})
    }
    if (targetType === 'l') {
      setStoneValue3({...stoneValue3, on: false, value: 0})
      setStoneInfo({...stoneInfo, type: '', value: 0})
    }
    setDrawState(drawCheck(0))
    setOddState(false)
  }
  // 뽑기 가능 체크
  const drawCheck = (v) => {
    let totalValue = 0;
    if(stoneInfo.type === 'd'){
      totalValue = v + stoneValue2.value + stoneValue3.value
    } else if(stoneInfo.type === 'a'){
      totalValue = stoneValue1.value + v + stoneValue3.value
    } else if(stoneInfo.type === 'l'){
      totalValue = stoneValue1.value + stoneValue2.value + v
    }

    if (totalValue > 0 && totalValue%2 === 0) {
      console.log('1',totalValue);
      setOddState(false)
      return true
    } else {
      console.log('2',totalValue);
      setOddState(true)
      return false
    }
  }
  // 스톤 조합
  const completeAction = () => {
    if(localStorage.getItem('rebranding')){
      fetchStoneChange(stoneValue1.value,stoneValue2.value,stoneValue3.value)
      setActionAni(true)
      setTimeout(() => {
        setActionAni(false)
        dispatch(setCommonPopupOpenData({...popup, resultPopup: true}));
      }, 4500);
    } else {
      dispatch(setCommonPopupOpenData({...popup, confirmPopup: true}));
    }
  }

  const disabledAction = () => {
    context.action.toast({
      msg: `먼저 사용할 스톤을 넣어주세요.`
    })
  }
  const disabledAction1 = () => {
    context.action.toast({
      msg: `<span>사용할 스톤의 합이 짝수일 때 뽑을 수 있습니다.</span>
      사용할 스톤을 확인해주세요.`
    })
  }

  // 모바일 뒤로가기 이벤트
  const backEvent = () => {
    if(isHybrid() && webview === 'new'){
      Hybrid('CloseLayerPopup');
    } else {
      history.goBack();
    }
  };

  // 탭메뉴 액션
  const tabActive = (index) => {
    setTabmenuType(tabmenu[index])
  }

  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabMenuTop = tabMenuNode.getBoundingClientRect().top;
    if (window.scrollY >= tabMenuTop) {
      setTabFixed(true)
    } else {
      setTabFixed(false)      
    }
  }

  useEffect(() => {
    fetchEventInfo()
    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  },[])

  useEffect(() => {
    if (actionAni === false) {
      fetchMyRankInfo(tabmenuType)
      fetchMyPieceInfo()
    }
  },[actionAni])

  
  useEffect(() => {
    if(common.isRefresh) {
      mainDataReset();
      window.scrollTo(0, 0);
      dispatch(setIsRefresh(false));
    }
  }, [common.isRefresh, myRankInfo]);

  useEffect(() => {
    if (token.isLogin) {
      if (eventInfo.seq_no !== 0) {
        fetchMyRankInfo(tabmenuType)
        fetchMyPieceInfo()
      }
    }
  },[eventInfo.seq_no,tabmenuType])
  
  return (
    <>
    <div className="refresh-wrap"
         style={{height: '48px'}}
         ref={iconWrapRef}>
      <div className="icon-wrap">
        <div className="arrow-refresh-icon" ref={arrowRefreshRef}>
          <Lottie
            isPaused={pullToRefreshPause}
            options={{
              loop: true,
              autoPlay: true,
              path: `${IMG_SERVER}/common/scroll_refresh.json`,
            }}
          />
        </div>
      </div>
    </div>
    <div id="rebranding" 
      ref={mainRef}
      onTouchStart={mainTouchStart}
      onTouchMove={mainTouchMove}
      onTouchEnd={mainTouchEnd}
      >
      <Header title="이벤트" type="back" backEvent={backEvent}/>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/mainVisual-1.png`} alt="이벤트 이미지" />
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-2-fix.png`} alt="이벤트 이미지" />
        <button onClick={noticePopView1}>
          <img src={`${IMG_SERVER}/event/rebranding/btn-1.png`} alt="버튼 이미지" />
        </button>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-3.png`} alt="이벤트 이미지" />
        <button onClick={noticePopView2}>
          <img src={`${IMG_SERVER}/event/rebranding/btn-1.png`} alt="버튼 이미지" />
        </button>
      </section>
      <section>
        {drawState ? 
          <img src={`${IMG_SERVER}/event/rebranding/bg-4-on.png`} alt="이벤트 이미지" />
          :
          <img src={`${IMG_SERVER}/event/rebranding/bg-4-off.png`} alt="이벤트 이미지" />
        }
        <div className={`stoneSelect dStone ${myPieceInfo.ins_d_cnt > 0 ? 'focus' : ''} ${stoneValue1.on === true ? 'active' : ''}`}>
          <button data-target-type="d" onClick={clickSelect}>
          {stoneValue1.on !== true ?
              <>
                <span className="count">{myPieceInfo.ins_d_cnt === undefined ? 0 : myPieceInfo.ins_d_cnt}개</span>
                <span className="text">보유</span>
              </>
              :
              <>
                <span className="count">{stoneValue1.value}개</span>
                <span className="text">사용예정</span>
                <span className="cancel" onClick={stoneClose}>사용취소</span>
              </>
            }
            <div className="stoneIcon"></div>
          </button>
        </div>
        <div className={`stoneSelect aStone ${myPieceInfo.ins_a_cnt > 0 ? 'focus' : ''} ${stoneValue2.on === true ? 'active' : ''}`}>
          <button data-target-type="a" onClick={clickSelect}>
          {stoneValue2.on !== true ?
              <>
                <span className="count">{myPieceInfo.ins_a_cnt === undefined ? 0 : myPieceInfo.ins_a_cnt}개</span>
                <span className="text">보유</span>
              </>
              :
              <>
                <span className="count">{stoneValue2.value}개</span>
                <span className="text">사용예정</span>
                <span className="cancel" onClick={stoneClose}>사용취소</span>
              </>
            }
            <div className="stoneIcon"></div>
          </button>
        </div>
        <div className={`stoneSelect lStone ${myPieceInfo.ins_l_cnt > 0 ? 'focus' : ''} ${stoneValue3.on === true ? 'active' : ''}`}>
          <button data-target-type="l" onClick={clickSelect}>
            {stoneValue3.on !== true ?
              <>
                <span className="count">{myPieceInfo.ins_l_cnt === undefined ? 0 : myPieceInfo.ins_l_cnt}개</span>
                <span className="text">보유</span>
              </>
              :
              <>
                <span className="count">{stoneValue3.value}개</span>
                <span className="text">사용예정</span>
                <span className="cancel" onClick={stoneClose}>사용취소</span>
              </>
            }
            <div className="stoneIcon"></div>
          </button>
        </div>
        <div className="stoneDraw">
        {drawState ?
          <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-on.png`} onClick={completeAction} alt="뽑기" />
          : oddState ?
          <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-off.png`} onClick={disabledAction1} alt="뽑기" />
          :
          <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-off.png`} onClick={disabledAction} alt="뽑기" />
        }
        </div>
        <div className="totalDalla">
          내 <img src="https://image.dalbitlive.com/event/rebranding/dalla_logo.png" alt="dalla" />
          <span>{myPieceInfo.dalla_cnt === undefined ? 0 : myPieceInfo.dalla_cnt}개</span>
        </div>
      </section>
      <div className={`tabmenuWrap ${tabFixed ? 'fixed' : ''}`} ref={tabMenuRef}>
        <div className="tabmenu">
          {tabmenu.map((data,index) => {
            return (
              <li className={`${tabmenuType === tabmenu[index] ? 'active' : ''}`} onClick={() => tabActive(index)} key={index}>
                <img src={`${IMG_SERVER}/event/rebranding/tabmenu-${data !== '스페셜' ? data : 3}${data === tabmenuType ? '-on' : ''}.png`} alt={data} />
              </li>
            )
          })}
        </div>
      </div>
      {tabmenuType === tabmenu[0] ?
        <Round_1 myRankInfo={myRankInfo} eventInfo={eventInfo} tabmenuType={tabmenuType} />
        : tabmenuType === tabmenu[1] ?
        <Round_2 myRankInfo={myRankInfo} eventInfo={eventInfo} tabmenuType={tabmenuType} />
        : tabmenuType === tabmenu[2] &&
        <Round_3 myRankInfo={mySpecialRankInfo} eventInfo={eventInfo} actionAni={actionAni} tabmenuType={tabmenuType} />
      }
      <section className="notice">
        <div className="title"><img src={`${IMG_SERVER}/event/rebranding/noticeTitle.png`} alt="꼭 확인해주세요!" /></div>
        <ul>
          <li>회차가 종료되면 스톤이 초기화됩니다.</li>
          <li>동일 개수일 경우 방송/청취시간이 높은 순서대로 순위가 정해집니다.</li>
          <li>한 번 선물 할 때의 달 및 별 개수로 스톤을 받을 수 있습니다.</li>
          <li>높은 순위일 수록 스페셜라운드 당첨 확률이 높아집니다.</li>
          <li>경품 당첨자는 공지사항을 통해 발표됩니다.</li>
          <li>부계정으로 이벤트에 중복 당첨될 경우 더 높은 순위로 선정됩니다.</li>
          <li>경품의 재고 문제로 경품을 지급할 수 없게될 경우 현금으로 대체 지급됩니다.</li>
          <li>5만원 이상 경품 수령시 22%의 제세공과금이 발생하며 이는 당첨자가 부담합니다.</li>
          <li>경품 수령을 원치 않을 경우 1:1문의를 통해 현금으로 지급을 요청하실 수 있습니다.</li>
          <li>더욱 자세한 사항은 이벤트 공지사항을 확인해주시기 바랍니다.</li>
          <li>본 이벤트는 Apple과 무관하며 Apple은 본 이벤트의 스폰서가 아닙니다.</li>
        </ul>
        <div className='giveawayBtn' onClick={giveawayPopView}>경품안내</div>
      </section>
      {popup.confirmPopup &&
        <Confirm 
          setActionAni={setActionAni} 
          stoneValue1={stoneValue1} 
          stoneValue2={stoneValue2} 
          stoneValue3={stoneValue3} 
          fetchStoneChange={fetchStoneChange} />
      }
      {actionAni &&
        <MergePop result={mergeResult} />
      }
      {giveawayPop && 
        <LayerPopup title="경품안내" setPopup={setGiveawayPop}>
          <section className="giveawayInfo">
            <ul className='depth1'>
              <li>
                <span>1라운드</span>
                <ul className='depth2'>
                  <li>맥북 프로  16형 : 336만원</li>
                  <li>생로랑 숄더백 : 210만원</li>
                  <li>갤럭시 22 울트라 512GB : 155만원</li>
                  <li>플레이스테이션5 : 100만원</li>
                  <li>아이패드 에어 4세대 : 75만원</li>
                  <li>닌텐도스위치 OLED + 타이틀패키지 : 50만원</li>
                  <li>소니 링크버즈 : 30만원</li>
                </ul>
              </li>
              <li>
                <span>2라운드</span>
                <ul className='depth2'>
                  <li>루이비통 삭 플라 BB : 320만원</li>
                  <li>삼성 갤럭시북 프로 360(윈도우 탑재) : 210만원</li>
                  <li>아이폰 13 프로 : 150만원</li>
                  <li>고야드 세나 클러치 PM 블랙 : 110만원</li>
                  <li>스팀덱 : 70만원(미출시 제품이므로 추후 변동 가능)</li>
                  <li>마샬 엑톤2 블루투스 스피커 : 44만원</li>
                  <li>마샬 모티프 ANC 블루투스 이어폰 : 27만원</li>
                </ul>
              </li>
              <li>
                <span>스페셜 라운드</span>
                <ul className='depth2'>
                  <li>롤렉스 서브마리너 흑콤 : 2400만원</li>
                </ul>
              </li>
            </ul>
          </section>
        </LayerPopup>
      }
      {noticePop1 && 
        <LayerPopup title="놀다 보면 생기는 스톤들" setPopup={setNoticePop1}>
          <section className="dallagers">
            <div className="pointText"><img src={`${IMG_SERVER}/event/rebranding/point-1.png`} />방송 하기 & 듣기 20분당 1개</div>
            <div className="pointText"><img src={`${IMG_SERVER}/event/rebranding/point-2.png`} />방송 선물 보내기 & 받기</div>
            <ul className="textBox">
              <li>· 보낸 달 50개당 2개</li>
              <li>· 받은 별 100개당 3개</li>
              <li>· 부스터도 포함됩니다.</li>
            </ul>
            <div className="infoWrap">
              <p>받는 스톤은 랜덤으로 지급 됩니다.</p>
              <p>누적 시간이 아닌 한 번 방송에 입장 후 나갈때 까지의 시간으로 방송 및 청취시간이 집계됩니다.</p>
            </div>
          </section>
        </LayerPopup>
      }
      {noticePop2 && 
        <LayerPopup title="FEVER TIME!" setPopup={setNoticePop2}>
          <section className="dallagers">
            <div className="pointText">· 한 방에서 DJ에게</div>
            <div className="text">선물한 달이 5000개가 넘는 순간<br/>
            FEVER TIME(1분)이 시작됩니다.</div>
            <div className="pointText">· 시청자 수가 적다면?</div>
            <div className="text">시청자 10명 이하인 방에는 랜덤으로
            FEVER TIME(1분)이 주어집니다.</div>
            <ul className="feverNotice">
              <li>FEVER TIME은 해당 방에서만 적용됩니다.</li>
              <li>FEVER TIME 중에는 1.5배의 스톤을 받게 되며<br/>
              소수점이 발생할 경우 적용되지 않습니다.</li>
            </ul>
          </section>
        </LayerPopup>
      }
      {popup.commonPopup &&
        <PopSlide title="사용할 스톤 개수를 알려주세요">
          <section className="eventRebranding">
            <div className="title">
              <img src={`${IMG_SERVER}/event/rebranding/${stoneInfo.type}-on.png`} alt={stoneInfo.type} />
              <span>
                {stoneInfo.value}개
              </span>
              <small>보유중</small>
            </div>
            <InputItems type="text">
              <input type="number" pattern="\d*" ref={inputRef} placeholder="최대 50개 까지 입력 가능" autoFocus/>
            </InputItems>
            <div className="buttonGroup">
              <button onClick={() => closePopup(dispatch)}>취소</button>
              <button onClick={choicePiece}>확인</button>
            </div>
          </section>
        </PopSlide>
      }
      {popup.resultPopup &&
        <PopSlide title="받은 스톤">
          <section className="eventRebranding">
            <div className="stoneListWrap">
              <div className="stoneList">
                <img src={`${IMG_SERVER}/event/rebranding/d-on.png`} alt={stoneInfo.type} />
                <span>{mergeResult.dStone}개</span>
              </div>
              <div className="stoneList">
                <img src={`${IMG_SERVER}/event/rebranding/a-on.png`} alt={stoneInfo.type} />
                <span>{mergeResult.aStone}개</span>
              </div>
              <div className="stoneList">
                <img src={`${IMG_SERVER}/event/rebranding/l-on.png`} alt={stoneInfo.type} />
                <span>{mergeResult.lStone}개</span>
              </div>
            </div>
            <div className="stoneTotal">
              총{mergeResult.dStone + mergeResult.aStone + mergeResult.lStone}개
            </div>
            <p>받은 스톤 또한 dalla를 만들기 위해서 자동으로 사용됩니다.</p>
            <SubmitBtn text="확인" onClick={() => closePopup(dispatch)} />
          </section>
        </PopSlide>
      }
    </div>
    </>
  )
}

export default Rebranding
