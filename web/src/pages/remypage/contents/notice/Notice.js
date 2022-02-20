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


const NoticePage = () => {
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

  return (
    <div id="notice">
      <section className="noticeWrap">
        {noticeType === noticeTabmenu[0] && <Allim data={context.profile} />}
        {noticeType === noticeTabmenu[1] && <Post data={context.profile} />}
      </section>
    </div>
  )
}

export default NoticePage
