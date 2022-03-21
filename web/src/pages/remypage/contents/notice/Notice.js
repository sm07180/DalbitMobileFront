import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import TabBtn from '../../components/TabBtn'
// components
// contents
import './notice.scss'
import Allim from "pages/remypage/contents/notice/Allim";
import Post from "pages/remypage/contents/notice/Post";
import {useDispatch, useSelector} from "react-redux";
import {setNoticeData, setNoticeTab, setNoticeTabList} from "redux/actions/notice";
import API from "context/api";
import noticeTabList from "redux/reducers/notice/tabList";


const NoticePage = () => {
  const noticeTabmenu = ['알림','공지사항'];
  const {tab} = useSelector((state) => state.notice);
  const dispatch = useDispatch();
  const history = useHistory()
  const context = useContext(Context)
  const alarmData = useSelector(state => state.newAlarm);
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const [scrollPagingCall, setScrollPagingCall] = useState(1);
  const noticeTabList = useSelector((state) => state.noticeTabList);

  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        dispatch(setNoticeData(res.data));
      }}
  }

  const scrollEvent = useCallback((scrollTarget, callback) => {
    console.log("scroll");
    const popHeight = scrollTarget.scrollHeight;
    const targetHeight = scrollTarget.clientHeight;
    const scrollTop = scrollTarget.scrollTop;
    if(popHeight - 1 < targetHeight + scrollTop) {
      callback();
    }
  }, []);

  const noticeScrollEvent = useCallback(() => {
    const callback = () => {
      setScrollPagingCall(scrollPagingCall => scrollPagingCall + 1);
    }
    scrollEvent(document.documentElement, callback);
  }, [])

  const removeScrollEvent = useCallback(() => {
    console.log("1");
    document.removeEventListener("scroll", noticeScrollEvent);
  }, []);

  const noticeTabChangeAction = (item) => {
    const scrollEventHandler = () => {
      removeScrollEvent();
      document.addEventListener("scroll", noticeScrollEvent);
    }
    if(item === noticeTabList.tabList[1]) {
      scrollEventHandler();
    }
  }

  useEffect(() => {
    if(tab === noticeTabList.tabList[0]) {
      document.addEventListener("scroll", noticeScrollEvent);
    } else if(tab === noticeTabList.tabList[1]) {
      document.addEventListener("scroll", noticeScrollEvent);
    }
    dispatch(setNoticeTabList({...noticeTabList, tabName: tab, isRefresh: true, isReset: true}));
    return () => {
      removeScrollEvent();
    }
  }, [])

  useEffect(() => {
    if(isDesktop) {
      fetchMypageNewCntData(context.profile.memNo);
    }
  }, [alarmData.newCnt]);

  // 로그인 토큰값 확인
  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login")
    }
  }, []);

  useEffect(() => {
    if(alarmData.alarm > 0) {
      dispatch(setNoticeTab("알림"))
    } else if(alarmData.notice > 0) {
      dispatch(setNoticeTab("공지사항"))
    }
  }, [])

  return (
    <div id="notice">
      <Header title="알림/공지사항" type="back"/>
      <section className="noticeWrap">
        <ul className="tabmenu">
          {noticeTabmenu.map((data,index) => {
            const param = {item: data, tab: tab, setTab: (val) => dispatch(setNoticeTab(val))}
            let newTage = false;
            if(data === "알림") {alarmData.alarm > 0 ? newTage = true : false}
            else {alarmData.notice > 0 ? newTage = true : false}
            return (
              <TabBtn param={param} key={index} newTage={newTage} tabChangeAction={noticeTabChangeAction}/>
            )
          })}
          <div className="underline"/>
        </ul>
        {tab === noticeTabmenu[0] ?
          <Allim />
          :
          <Post />
        }
      </section>
    </div>
  )
}

export default NoticePage;
