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
  const [wassupListCnt, setWassupListCnt] = useState(0);

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


  const pEvtWassupManSel = async ()=>{
    const now = await Api.pEvtWassupManNoSel();
    const last = await Api.pEvtWassupManLastNoSel();
    const seqNo = now.data.seqNo ? now.data.seqNo : last.data.seqNo;
    const listParams = {...pageInfo, pageNo:1, seqNo: seqNo};
    const selParams = {seqNo: seqNo};

    if(!seqNo){
      setTimeout(()=>{
        history.replace("/")
      },0)
    }
    const listApi = tabmenuType === tabmenu[0] ? Api.getWhatsUpDjList : Api.getWhatsUpNewMemberList;
    const selApi = tabmenuType === tabmenu[0] ? Api.getWhatsUpDjSel : Api.getWhatsUpNewMemberSel;

    listApi(listParams).then((res) => {
      setWassupList(res.data.list);
      setWassupListCnt(res.data.cnt);
      setPageInfo({...pageInfo, pageNo: 1});
    });

    selApi(selParams).then((res) => {
      setWassupSel(res.data);
    });

  }
  useEffect(()=>{
    pEvtWassupManSel()
  }, [tabmenuType])

  // ????????? ?????? ??????
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

  // ????????? ???????????? ?????????
  const backEvent = () => {
    if(isHybrid() && webview === 'new'){
      Hybrid('CloseLayerPopup');
    } else {
      history.goBack();
    }
  };

  const getNextList = ()=>{
    if(!wassupSel){
      return;
    }
    const paging = Object.assign({}, pageInfo, {pageNo:pageInfo.pageNo+1})
    const targetApi = tabmenuType === tabmenu[0] ? Api.getWhatsUpDjList : Api.getWhatsUpNewMemberList;
    targetApi({
      ...paging, seqNo: wassupSel.seqNo
    }).then((res) => {
      if(res.data.list && res.data.list.length>0){
        setWassupList(f=>f.concat(res.data.list));
        setWassupListCnt(res.data.cnt);
        setPageInfo(paging);
      }
    })
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
        <Header title="?????????" type="back" backEvent={backEvent}/>
        <section>
          <img src={`${IMG_SERVER}/event/wassup/main-2-${moment().isAfter("20220513") ? "3" : "2"}.png`} alt="????????? ?????????" />
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
            wassupSel && <DJRanking wassupSel={wassupSel} wassupList={wassupList} wassupListCnt={wassupListCnt} getNextList={getNextList} pageInfo={pageInfo}/>
            :
            wassupSel && <NewRanking wassupSel={wassupSel} wassupList={wassupList} wassupListCnt={wassupListCnt} getNextList={getNextList} pageInfo={pageInfo}/>
        }
        <section className="notice">
          <div className="title">
            <img src={`${IMG_SERVER}/event/wassup/noticeTitle.png`} alt="????????????" />
          </div>
          <ul>
            <li>?????? IP, ?????? ??????????????? ???????????? ????????? ???????????? ?????? ??????, ????????? ???????????? ?????? ??? ?????? ???????????? ?????????????????? ???????????? ?????? ????????????, IP??? ????????? ?????? ????????? ????????? ?????? ??? ????????????.</li>
            <li>1???,2??? ??? ????????? ????????? 5??? 23??? ?????? ???????????????.</li>
            <li>???????????? ????????? ???????????? ??????????????? ???????????? ?????? ?????? ??????????????????.</li>
            <li>FAN ?????? ???????????? ????????? ???????????? ????????? ???????????? DJ ?????? ???????????? ????????? ??? ????????????.</li>
          </ul>
        </section>
      </div>
    </>
  );
};


export default Wassup;
