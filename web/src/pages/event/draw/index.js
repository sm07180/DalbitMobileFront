import React, {useState, useEffect, useCallback, useRef, useContext} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Hybrid, isHybrid} from 'context/hybrid'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'
import qs from 'query-string'
import {Context} from 'context'

import './draw.scss'
import DrawBoard from './contents/drawBoard'
import PopupWinning from './contents/popupWinning'
import PopupPresent from './contents/popupPresent'

export default () => {
  const history = useHistory();
  const context = useContext(Context);
  const ticketWrapRef = useRef();

  const [ticketFixed, setTicketWrapFixed] = useState(false);
  const [popupWinning, setPopupWinning] = useState(false);
  const [popupPresent, setPopupPresent] = useState({ open: false, resultInfo: [], failCnt: 0 });
  const [ticketCnt, setTicketCnt] = useState(0);
  const [listInfo, setListInfo] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [drawList, setDrawList] = useState({ select: [], aniList: [] });

  // 뒤로가기
  const goBack = useCallback(() => history.goBack(), [])

  // 응모권 개수 가져오기
  const getDrawTicketCnt = () => {
    Api.getDrawTicketCnt().then(res => {
      if (res.code === '00000') {
        setTicketCnt(res.data);
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  };

  // 뽑기 리스트 가져오기
  const getDrawListInfo = () => {
    Api.getDrawListInfo().then(res => {
      if (res.code === '00000') {
        setListInfo(res.data);
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  };

  // 뽑기 이벤트
  const putDrawSelect = () => {
    if (drawList.select.length === 0) {
      alert('뽑기를 선택해주세요.');
      return;
    }

    const param = { selectList: drawList.select.toString() };
    Api.putDrawSelect(param).then(res => {
      if (res.code === '00000' || (res.code === '30004' && res.data.resultInfo.length > 0)) {
        getDrawTicketCnt(); // 티켓 개수 갱신
        setDrawList({select: [], aniList: res.data.resultInfo });
        let temp = res.data.resultInfo;
        setPopupPresent({ open: true, failCnt: res.data.failCnt, resultInfo: temp.filter(row => row.bbopgi_gift_no !== 0) });
      } else if (res.code === '30004' && res.data.failCnt === drawList.select.length) {
        context.action.toast({msg: `일시적인 통신 장애로 ${res.data.failCnt}개의 뽑기가 추첨되지 않았습니다. 잠시 후 다시 추첨해주세요.`});
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  };
  
  // 달 충전
  const chargeDal = () => {
    if (!context.token.isLogin) {
      history.push('/login')
      return
    }

    history.push('/pay/store')
  }

  // 티켓 선택 이벤트
  const selectDraw = (e) => {
    const targetPosNo = e.currentTarget.dataset.posNo;

    if (drawList.select.length >= 30) {
      context.action.toast({msg: '뽑기 최대 개수는 30개를 넘을 수 없습니다.'});
      return;
    }

    if (targetPosNo !== undefined) {
      if (drawList.select.findIndex(row => row === targetPosNo) === -1) {
        setDrawList({ ...drawList, select: drawList.select.concat(targetPosNo)});
      } else {
        setDrawList({ ...drawList, select: drawList.select.filter(item => item != targetPosNo)});
      }
    }
  };

  // 상단 티켓 DOM 스크롤 이벤트
  const tabScrollEvent = () => {
    const ticketWrapNode = ticketWrapRef.current
    if (ticketWrapNode) {
      const ticketWrapTop = ticketWrapNode.offsetTop

      if (window.scrollY >= ticketWrapTop) {
        setTicketWrapFixed(true)
      } else {
        setTicketWrapFixed(false)
      }
    }
  }

  // 리스트 페이지 처리 이벤트
  const handlePaging = (e) => {
    const type = e.currentTarget.dataset.type;

    if (type === 'left') {
      setDrawList({ select: [], aniList: [] });
      setPageNo(pageNo - 1);
    } else if (type === 'right') {
      setDrawList({ select: [], aniList: [] });
      setPageNo(pageNo + 1);
    }
  }

  // 당첨 내역 팝업 열기 이벤트
  const openPopupWinningOpen = () => {
    setPopupWinning(true);
  };

  // 당첨 내역 팝업 닫기 이벤트
  const closePopupWinning = () => {
    setPopupWinning(false);
  };

  // 당첨 결과 팝업 닫기 이벤트
  const closePopupPresent = () => {
    if (popupPresent.failCnt > 0) {
      context.action.toast({msg: `일시적인 통신 장애로 ${popupPresent.failCnt}개의 뽑기가 추첨되지 않았습니다. 잠시 후 다시 추첨해주세요.`});
    }
    getDrawListInfo();// 리스트 갱신
    setPopupPresent({ open: false, resultInfo: [], failCnt: 0 });
  };

  useEffect(() => {

    getDrawTicketCnt(); // 응모권 개수 가져오기
    getDrawListInfo();

    window.addEventListener('scroll', tabScrollEvent);

    return () => window.removeEventListener('scroll', tabScrollEvent);
  }, []);


  return (
    <div id="drawEventPage">
      <div className="top">
        <div className="header">
          <a className="header__left">
            <i className="header__back" onClick={goBack}/>
          </a>
          <div className="header__center">
            <div className="header__title">추억의 뽑기 이벤트</div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="topImgWrap">
          <img src={`${IMG_SERVER}/event/draw/topImg.png`} className="topImg" alt="달빛표 추억의 뽑기판 달 구매 1만원당 응모권 1장 자동 지급!"/>
          <div className={`ticketWrap ${ticketFixed === true ? 'fixed' : ''}`} ref={ticketWrapRef}>
            <button className="ticketBtn" onClick={chargeDal}>{ticketCnt}</button>
          </div>
          <button className="myWinningBtn" onClick={openPopupWinningOpen}>
            <img src={`${IMG_SERVER}/event/draw/myWinng.png`} alt="내 당첨 내역"/>
          </button>
        </div>
        <div className="boardMoreWrap">
          <div className="boardMore">
            <img src={`${IMG_SERVER}/event/draw/boardMore.png`} alt="뽑기판 더보기"/>
            <span className="">({pageNo}/5)</span>
            {pageNo !== 1 && <button className="boardMoreLeft" data-type="left" onClick={handlePaging}/>}
            {pageNo !== 5 && <button className="boardMoreRight" data-type="right" onClick={handlePaging}/>}
          </div>
        </div>
        <DrawBoard listInfo={listInfo} pageNo={pageNo} onSelectItem={selectDraw} drawList={drawList}/>
        <img src={`${IMG_SERVER}/event/draw/present.png`} className="present" alt="선물소개"/>
      </div>
      <div className="footer">
        <img src={`${IMG_SERVER}/event/draw/footer__notice.png`} className="footer__notice" alt="확인해주세요"/>
      </div>
      {drawList.select.length > 0 &&
        <button className="buttonDraw" onClick={putDrawSelect}>
          <img src={`${IMG_SERVER}/event/draw/drawStart.png`} alt="뽑기 시작"/>
          <span>({drawList.select.length}/30)</span>
        </button>
      }
      {popupWinning && <PopupWinning onClose={closePopupWinning}/>}
      {popupPresent.open && <PopupPresent popupPresent={popupPresent} onClose={closePopupPresent}/>}
    </div>
  )
}