import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components

// contents

import './notice.scss'
import Allim from "pages/remypage/contents/notice/Allim";
import Post from "pages/remypage/contents/notice/Post";
import {useDispatch, useSelector} from "react-redux";
import {setNoticeTab} from "redux/actions/notice";
import API from "context/api";


const NoticePage = () => {
  const noticeTabmenu = ['알림','공지사항']
  const {tab} = useSelector((state) => state.notice);
  const dispatch = useDispatch();
  const history = useHistory()
  const context = useContext(Context)
  const [alarmCount, setAlarmCount] = useState(false);
  const [noticeCount, setNoticeCount] = useState(false);

  // 로그인 토큰값 확인
  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login")
    }
  }, []);

  const fetchNewData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      console.log(res);
      if(res.data) {
        setAlarmCount(res.data.alarm); //새로운 알림
        setNoticeCount(res.data.notice);
      }
    } else {
      console.log(res);
    }
  }

  useEffect(() => {
    fetchNewData(context.profile.memNo);
    if(alarmCount > 0) {
      dispatch(setNoticeTab("알림"));
    } else {
      dispatch(setNoticeTab("공지사항"));
    }
  }, [alarmCount]);

  return (
    <div id="notice">
      <Header title="알림/공지사항" type="back"/>
      <section className="noticeWrap">
        <ul className="tabmenu">
          {noticeTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: tab,
              setTab: (val) => dispatch(setNoticeTab(val))
            }
            return (
              <TabBtn param={param} key={index} />
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
