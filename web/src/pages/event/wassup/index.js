import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useHistory} from "react-router-dom";
import {Hybrid, isHybrid} from "context/hybrid";

import {IMG_SERVER} from 'context/config';
import Lottie from 'react-lottie';
import qs from 'query-string';

// global components
import Header from 'components/ui/header/Header';
// components
import DJRanking from './components/DJRanking'
import NewRanking from './components/NewRanking'

import './style.scss'
import Api from "context/api";
import moment from "moment";

const tabmenu = [1,2]

let touchStartY = null
let touchEndY = null
const refreshDefaultHeight = 48

const Wassup = () => {
  const mainRef = useRef()
  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()
  const tabMenuRef = useRef()

  const history =useHistory()
  const {webview} = qs.parse(location.search)

  const [reloadInit, setReloadInit] = useState(false)
  const [pullToRefreshPause, setPullToRefreshPause] = useState(true)

  const [tabFixed, setTabFixed] = useState(false);
  const [tabmenuType, setTabmenuType] = useState(tabmenu[0]);

  const [pageInfo, setPageInfo] = useState({
    pageNo: 1, pagePerCnt: 10
  });
  const [wassupSel, setWassupSel] = useState(null);
  const [wassupList, setWassupList] = useState([]);

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
    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  },[])


  useEffect(()=>{
    Api.pEvtWassupManNoSel().then((res)=>{
      if(tabmenuType === tabmenu[0]){
        Api.getWhatsUpDjList({
          ...pageInfo, seqNo: res.data.seqNo
        }).then((res) => {
          setWassupList(res.data.list)
        })
        Api.getWhatsUpDjSel({
          seqNo: res.data.seqNo
        }).then((res) => {
          setWassupSel(res.data);
        })
      }else if(tabmenuType === tabmenu[1]){
        Api.getWhatsUpNewMemberList({
          ...pageInfo, seqNo: res.data.seqNo
        }).then((res) => {
          setWassupList(res.data.list)
        })
        Api.getWhatsUpNewMemberSel({
          seqNo: res.data.seqNo
        }).then((res) => {
          setWassupSel(res.data);
        })
      }
    })
  }, [tabmenuType])

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

  // 모바일 뒤로가기 이벤트
  const backEvent = () => {
    if(isHybrid() && webview === 'new'){
      Hybrid('CloseLayerPopup');
    } else {
      history.goBack();
    }
  };

  const getSeqNo = ()=>{
    const now = moment.now();
    // const now = moment("2022.04.08 00:00:00:001",'YYYY.MM.DD HH:mm:ss:SSS');
    const seq1 = moment("2022.04.01 00:00:00:000",'YYYY.MM.DD HH:mm:ss:SSS');
    const seq2 = moment("2022.04.08 00:00:00:000",'YYYY.MM.DD HH:mm:ss:SSS');
    const end = moment("2022.04.15 00:00:00:000",'YYYY.MM.DD HH:mm:ss:SSS');
    // const seq1 = moment("2022.03.01 00:00:00:000",'YYYY.MM.DD HH:mm:ss:SSS');
    // const seq2 = moment("2022.03.26 00:00:00:000",'YYYY.MM.DD HH:mm:ss:SSS');
    // const end = moment("2022.04.15 00:00:00:000",'YYYY.MM.DD HH:mm:ss:SSS');
    if(moment(now).isBetween(seq1, seq2)){
      return 1
    }else if(moment(now).isBetween(seq2, end)){
      return 2
    }else{
      return -1
    }
  }

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
      <div id="wassup"
        ref={mainRef}
        onTouchStart={mainTouchStart}
        onTouchMove={mainTouchMove}
        onTouchEnd={mainTouchEnd}
      >
        <Header title="이벤트" type="back" backEvent={backEvent}/>
        <section>
          <img src={`${IMG_SERVER}/event/wassup/main.png`} alt="이벤트 이미지" />
        </section>
        <div className={`tabmenuWrap ${tabFixed ? 'fixed' : ''}`} ref={tabMenuRef}>
          <ul className="tabmenu">
            {tabmenu.map((data,index) => {
              return (
                <li className={`${tabmenuType === tabmenu[index] ? 'active' : ''}`} onClick={() => tabActive(index)} key={index}>
                  <img src={`${IMG_SERVER}/event/wassup/tabmenu-${data}.png`} alt={data} />
                </li>
              )
            })}
          </ul>
        </div>

        {
          tabmenuType === tabmenu[0] ?
            wassupSel && <DJRanking wassupSel={wassupSel} wassupList={wassupList}/>
          :
            wassupSel && <NewRanking wassupSel={wassupSel} wassupList={wassupList}/>
        }
        <section className="notice">
          <div className="title">
            <img src={`${IMG_SERVER}/event/wassup/noticeTitle.png`} alt="유의사항" />
          </div>
          <ul>
            <li>동일 IP, 동일 디바이스로 부계정을 만들어 어뷰징을 하는 경우, 이벤트 대상에서 제외 및 관련 커뮤니티 가이드라인에 의거하여 관련 디바이스, IP로 등록된 모든 계정이 처벌을 받을 수 있습니다.</li>
            <li>최종 순위는 이벤트 종료 시점을 기준으로 적용됩니다.</li>
            <li>보상은 4월 18일 월요일에 일괄 지급됩니다.</li>
          </ul>
        </section>
      </div>
    </>
  );
};


export default Wassup;
