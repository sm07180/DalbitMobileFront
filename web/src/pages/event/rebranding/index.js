import React, {useState, useEffect, useMemo, useCallback, useContext, useRef} from 'react'
import {Context} from 'context'
import {setIsRefresh} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'
import Lottie from 'react-lottie'
import qs from 'query-string'
// global components
import Header from 'components/ui/header/Header'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import Tabmenu from './components/tabmenu'
import Confirm from './components/Confirm'
import MergePop from './components/MergePop'
// contents
import Round_1 from './contents/Round_1'
import Round_2 from './contents/Round_2'
import Round_3 from './contents/Round_3'

import './style.scss'

const tabmenu = [1,2,3]

let touchStartY = null
let touchEndY = null
const refreshDefaultHeight = 48

const Rebranding = () => {
  const {webview} = qs.parse(location.search)

  const MainRef = useRef()
  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()

  const dispatch = useDispatch()
  const common = useSelector(state => state.common)
  const context = useContext(Context)
  const {token} = context

  const [reloadInit, setReloadInit] = useState(false)
  const [pullToRefreshPause, setPullToRefreshPause] = useState(true)

  const [tabmenuType, setTabmenuType] = useState(tabmenu[0])
  const [stoneInfo, setStoneInfo] = useState('')
  const [stoneValue1, setStoneValue1] = useState({on: false, value: ''})
  const [stoneValue2, setStoneValue2] = useState({on: false, value: ''})
  const [mergeResult, setMergeResult] = useState('')
  const [popSlide, setPopSlide] = useState(false)
  const [popLayer, setPopLayer] = useState(false)
  const [noticePop1, setNoticePop1] = useState(false)
  const [noticePop2, setNoticePop2] = useState(false)
  const [actionAni, setActionAni] = useState(false)
  
  const [eventInfo, setEventInfo] = useState({
    cnt: 0,
    end_date: "",
    seq_no: 0,
    start_date: "",
  })
  const [myRankInfo, setMyRankInfo] = useState({})
  const [mySpecialRankInfo, setMySpecialRankInfo] = useState({})
  const stone = useMemo(() => {
    let dCnt = 0;
    let aCnt = 0;
    let lCnt = 0;
    if(stoneValue1.value === 'd') dCnt ++;
    if(stoneValue1.value === 'a') aCnt ++;
    if(stoneValue1.value === 'l') lCnt ++;
    if(stoneValue2.value === 'd') dCnt ++;
    if(stoneValue2.value === 'a') aCnt ++;
    if(stoneValue2.value === 'l') lCnt ++;

    return ([
      {data: 'd', value: myRankInfo.ins_d_cnt - dCnt},
      {data: 'a', value: myRankInfo.ins_a_cnt - aCnt},
      {data: 'l', value: myRankInfo.ins_l_cnt - lCnt},
    ]);
  },[myRankInfo, stoneValue1, stoneValue2])
  
  // API 조회
  /* 이벤트 회차 정보 */
  const fetchEventInfo = () => {
    Api.getDallagersReqNo().then((res) => {
      if (res.result === 'success') {
        setEventInfo(res.data)
      }
    })
  }
  /* 내 랭킹 정보 */
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
  /* 이니셜 스톤 교환 */
  const fetchStoneChange = (v1, v2) => {
    Api.getDallagersStoneChange({data:{
      seqNo : eventInfo.seq_no, // 회차정보
      useDallaGubunOne : v1,	//첫번째 선택 스톤
      useDallaGubunTwo : v2, //두번째 선택 스톤
    }}).then((res) => {
      if (res.result === 'success') {
        setMyRankInfo(res.data.myInfo)
        setMergeResult(res.data.resultStone)
        mainDataReset()
      } else {
        console.log(res.data);
      }
    })
  }

  const mainDataReset = () => {
    setStoneValue1({...stoneValue1, on: false, value: ''});
    setStoneValue2({...stoneValue2, on: false, value: ''});
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
  // 스톤 버튼 선택
  const clickSelect = (e) => {
    const {targetValue} = e.currentTarget.dataset
    setStoneInfo(targetValue)
    setPopSlide(true)
  }
  // 스톤 종류 선택
  const choicePiece = (e,value) => {
    const {choiceStone} = e.currentTarget.dataset
    if (value !== 0) {
      if (stoneInfo === '1' && stoneValue1.value === '') {
        setStoneValue1({...stoneValue1, on: true, value: choiceStone})
      }
      if (stoneInfo === '2' && stoneValue2.value === '') {
        setStoneValue2({...stoneValue2, on: true, value: choiceStone})
      }
      setPopSlide(false)
    }
  }
  // 스톤 초기화
  const stoneClose = (e) => {
    const {targetValue} = e.currentTarget.parentNode.dataset
    if (targetValue === '1') {
      setStoneValue1({...stoneValue1, on: false, value: ''})
    }
    if (targetValue === '2') {
      setStoneValue2({...stoneValue2, on: false, value: ''})
    }
  }
  // 스톤 조합
  const completeAction = () => {
    if(localStorage.getItem('rebranding')){
      fetchStoneChange(stoneValue1.value,stoneValue2.value)
      setActionAni(true)
      setStoneValue1({on: false, value: ''})
      setStoneValue2({on: false, value: ''})
      setTimeout(() => {
        setActionAni(false)
      }, 6000);
    } else {
    setPopLayer(true)
    }
  }
  // 모바일 뒤로가기 이벤트
  const backEvent = () => {

  };

  useEffect(() => {
    fetchEventInfo()
  },[])
  
  useEffect(() => {
    if (actionAni === true) {
      fetchMyRankInfo(tabmenuType)
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
      ref={MainRef}
      onTouchStart={mainTouchStart}
      onTouchMove={mainTouchMove}
      onTouchEnd={mainTouchEnd}
      >
      <Header title="이벤트" type="back" backEvent={}/>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-1.png`} alt="이벤트 이미지" />
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-2.png`} alt="이벤트 이미지" />
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
        <img src={`${IMG_SERVER}/event/rebranding/bg-4.png`} alt="이벤트 이미지" />
        <div className="stoneWrap">
          <button data-target-value="1" onClick={stoneValue1.on !== true ? clickSelect : ''}>
            <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-1.png`} alt="인피니티 스톤 1" />
            {stoneValue1.value !== '' ? 
              <>
                <img src={`${IMG_SERVER}/event/rebranding/ico-${stoneValue1.value}.png`} className="stoneImg" />
                <div className="close" onClick={stoneClose}>닫기</div>
              </>
              :
              <></>
            }
          </button>
          <button data-target-value="2" onClick={stoneValue2.on !== true ? clickSelect : ''}>
            <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-1.png`} alt="인피니티 스톤 2" />
            {stoneValue2.value !== '' ? 
              <>
                <img src={`${IMG_SERVER}/event/rebranding/ico-${stoneValue2.value}.png`} className="stoneImg" />
                <div className="close" onClick={stoneClose}>닫기</div>
              </>
              :
              <></>
            }
          </button>
          <img src={`${IMG_SERVER}/event/rebranding/sign.png`} className="sign" />
          {stoneValue1.on === true && stoneValue2.on === true ?
            <button onClick={completeAction}>
              <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-4.png`} alt="인피니티 스톤" />
            </button>
            :
            <button style={{cursor:"initial"}}>
              <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-2.png`} alt="인피니티 스톤" />
            </button>
          }
        </div>
      </section>
      <Tabmenu tabmenu={tabmenu} tabmenuType={tabmenuType} setTabmenuType={setTabmenuType} />
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
        </ul>
      </section>
      {popLayer &&
        <Confirm 
          setPopLayer={setPopLayer} 
          setActionAni={setActionAni} 
          stoneValue1={stoneValue1} 
          setStoneValue1={setStoneValue1} 
          stoneValue2={stoneValue2} 
          setStoneValue2={setStoneValue2} 
          fetchStoneChange={fetchStoneChange} />
      }
      {actionAni &&
        <MergePop result={mergeResult} />
      }
      {noticePop1 && 
        <LayerPopup title="놀다 보면 생기는 스톤들" setPopup={setNoticePop1}>
          <section className="dallagers">
            <div className="pointText"><img src={`${IMG_SERVER}/event/rebranding/point-1.png`} />방송 하기 & 듣기 20분당 1개</div>
            <div className="pointText"><img src={`${IMG_SERVER}/event/rebranding/point-2.png`} />방송 선물 보내기 & 받기</div>
            <ul className="textBox">
              <li>· 보낸 달 50개당 1개</li>
              <li>· 받은 별 100개당 1개</li>
              <li>· 부스터도 포함됩니다.</li>
            </ul>
            <p>받는 스톤은 랜덤으로 지급 됩니다.</p>
          </section>
        </LayerPopup>
      }
      {noticePop2 && 
        <LayerPopup title="FEVER TIME!" setPopup={setNoticePop2}>
          <section className="dallagers">
            <div className="pointText">· 한 방에 있는 시청자들이 DJ에게</div>
            <div className="text">선물한 달이 5000개가 넘는 순간<br/>
            FEVER TIME(1분)이 시작됩니다.</div>
            <div className="pointText">· 방송 선물 보내기 & 받기</div>
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
      {popSlide &&
        <PopSlide title="사용할 스톤을 선택하세요." setPopSlide={setPopSlide}>
          <section className="eventRebranding">
            <div className="title">
              내
              <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="" />
              <span>{stone[0].value + stone[1].value + stone[2].value}개</span>
            </div>
            {stone.map((v,idx) => {
              const stonCount = v.value;
              return (
                <div 
                  className={`label ${stonCount === 0 ? 'disabled' : ''}`} 
                  data-choice-stone={v.data} 
                  onClick={(e) => choicePiece(e,stonCount)}
                  key={idx}>
                  <img src={`${IMG_SERVER}/event/rebranding/ico-${v.data}.png`} alt={v.data} />
                  <span>{stonCount} 개 남음</span>
                </div>
              )
            })}
            <p>선택된 스톤 1개를 사용합니다.</p>
          </section>
        </PopSlide>
      }
    </div>
    </>
  )
}

export default Rebranding
