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


const NoticePage = ({location}) => {
  const noticeTabmenu = ['알림','공지사항']
  const history = useHistory()
  const context = useContext(Context)
  const [noticeType, setNoticeType] = useState(noticeTabmenu[0])

  // 로그인 토큰값 확인
  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login")
    }
  }, []);

  //공지사항 통해 들어올시
  useEffect(() => {
    if(location.value) {
      setNoticeType(noticeTabmenu[1]);
    }
  }, [])

  return (
    <div id="notice">
      <Header type="back"/>
        <section className="noticeWrap">
          <ul className="tabmenu">
            {noticeTabmenu.map((data,index) => {
              const param = {
                item: data,
                tab: noticeType,
                setTab: setNoticeType,
              }
              return (
                <TabBtn param={param} key={index} />
              )
            })}
            <div className="underline"/>
          </ul>
          {noticeType === noticeTabmenu[0] && <Allim data={context.profile} />}
          {noticeType === noticeTabmenu[1] && <Post data={context.profile} />}
        </section>
    </div>
  )
}

export default NoticePage;
