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


const NoticePage = () => {
  const noticeTabmenu = ['알림','공지사항']
  const {tab} = useSelector((state) => state.notice);
  const dispatch = useDispatch();
  const history = useHistory()
  const context = useContext(Context)

  // 로그인 토큰값 확인
  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login")
    }
  }, []);

  return (
    <div id="notice">
      <Header type="back"/>
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
