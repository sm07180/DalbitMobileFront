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

const tabmenu = ["DJ","viewers"]

let touchStartY = null
let touchEndY = null
const refreshDefaultHeight = 48

const Billboard = () => {
  let seqNo = 1;
  const nowDay = moment().format('YYYYMMDD HHmmss');

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

  const [pageInfo, setPageInfo] = useState({pageNo: 1, pagePerCnt: 10});
  const [billboardSel, setBillboardSel] = useState(null);
  const [billboardList, setBillboardList] = useState([]);
  const [billboardListCnt, setBillboardListCnt] = useState(0);
  const [seqDate, setSeqDate] = useState({firstStart: "20220530 000900", firstEnd: "20220605 235959", secondStart: "20220606 000000", secondEnd: "20220612 235959"});

  const tabActive = (index) => {
    setTabmenuType(tabmenu[index])
  }

  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabMenuTop = tabMenuNode?.getBoundingClientRect().top;
    if (window.scrollY >= tabMenuTop) {
      setTabFixed(true)
    } else {
      setTabFixed(false)
    }
  }

  const pEvtBillBoardListSel = async () => {
    const listParams = {seqNo: seqNo, pageNo: pageInfo.pageNo, pagePerCnt: pageInfo.pagePerCnt};
    const selParams = {seqNo: seqNo}
    const listApi = tabmenuType === tabmenu[0] ? Api.getElectricSignDJList : Api.getElectricSignFanList;
    const selApi = tabmenuType === tabmenu[0] ? Api.getElectricSignDJSel : Api.getElectricSignFanSel;

    listApi(listParams).then((res) => {
      setBillboardList(res.data.list);
      setBillboardListCnt(res.data.cnt);
      setPageInfo({...pageInfo, pageNo: 1});
    });

    selApi(selParams).then((res) => {
      setBillboardSel(res.data);
    });
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

  const getNextList = () => {
    if(!billboardSel) { return; }
    const paging = Object.assign({}, pageInfo, {pageNo: pageInfo.pageNo + 1})
    const targetApi = tabmenuType === tabmenu[0] ? Api.getElectricSignDJList : Api.getElectricSignFanList;
    targetApi({...paging}).then((res) => {
      if(res.data.list && res.data.list.length > 0){
        setBillboardList(f => f.concat(res.data.list));
        setBillboardListCnt(res.data.cnt);
        setPageInfo(paging);
      }
    }).catch(e => console.log(e));
  }

  useEffect(() => {
    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  },[])

  // useEffect(()=>{
  //   pEvtBillBoardListSel()
  // }, [tabmenuType])

  useEffect(() => {
    if(moment(nowDay).isAfter(moment(seqDate.firstEnd))) {
      seqNo = 2;
      pEvtBillBoardListSel(seqNo);
    } else {
      seqNo = 1;
      pEvtBillBoardListSel(seqNo);
    }
    console.log(seqNo);
  }, [nowDay, tabmenuType]);

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
      <div id="billboard"
        ref={mainRef}
        onTouchStart={mainTouchStart}
        onTouchMove={mainTouchMove}
        onTouchEnd={mainTouchEnd}
      >
        <Header title="이벤트" type="back" backEvent={backEvent}/>
        <section>
          <img src={`${IMG_SERVER}/event/billboard/event_billboard-TopImg.png`} alt="이벤트 이미지" />
        </section>
        <div className={`tabmenuWrap ${tabFixed ? 'fixed' : ''}`} ref={tabMenuRef}>
          <ul className="tabmenu">
            {tabmenu.map((data,index) => {
              return (
                <li className={`${tabmenuType === tabmenu[index] ? 'active' : ''}`} onClick={() => tabActive(index)} key={index}>
                  <img src={`${IMG_SERVER}/event/billboard/tabmenu-${data}.png`} alt={data} />
                </li>
              )
            })}
          </ul>
        </div>

        {
          tabmenuType === tabmenu[0] ?
            billboardSel && <DJRanking billboardSel={billboardSel} billboardList={billboardList} billboardListCnt={billboardListCnt} getNextList={getNextList} pageInfo={pageInfo}/>
            :
            billboardSel && <NewRanking billboardSel={billboardSel} billboardList={billboardList} billboardListCnt={billboardListCnt} getNextList={getNextList} pageInfo={pageInfo}/>
        }
        <section className="notice">
          <div className="title">
            <img src={`${IMG_SERVER}/event/billboard/noticeTitle.png`} alt="유의사항" />
          </div>
          <ul>
            <li>동일 IP, 동일 디바이스로 부계정을 만들어 어뷰징을 하는 경우,이벤트 대상에서 제외 및 관련 커뮤니티 가이드라인에 의거하여 관련 디바이스, IP로 등록된 모든 계정이 처벌을 받을 수 있습니다.</li>
            <li>DJ 랭킹과 FAN 랭킹 보상을 동시에 수령할 수 없으며, 이 경우 가장 높은 순위의 보상 하나만 수령할 수 있습니다.</li>
            <li>1라운드에서 1위를 한 DJ/시청자는 2라운드에 랭크되지 않습니다.</li>
            <li>전광판 광고 특성 상 운영진 자체적으로 모델의 역량을 판단할 수 있습니다.</li>
            <li>프로필 사진 촬영 비용은 전광판 광고 게재에 동의할 시에만 지원해드립니다.</li>
            <li>당첨자는 개별 연락 드리겠습니다.</li>
            <li>본 이벤트는 사전 고지 없이 변경 및 종료될 수 있습니다.</li>
            <li>본 이벤트는 Apple과 무관합니다.</li>
          </ul>
        </section>
      </div>
    </>
  );
};


export default Billboard;
