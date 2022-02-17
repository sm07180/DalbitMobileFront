import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components
// contents
import './notice.scss'
import Allim from "pages/remypage/contents/notice/Allim";
import Post from "pages/remypage/contents/notice/Post";
import {useDispatch, useSelector} from "react-redux";


const NoticePage = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const noticeTabmenu = ['알림', '공지사항']
  const history = useHistory()
  const [noticeType, setNoticeType] = useState(noticeTabmenu[0])

  // 로그인 토큰값 확인
  useEffect(() => {
    if (!(globalState.token.isLogin)) {
      history.push("/login")
    }
  }, []);

  return (
    <div id="notice">
      <Header type={'back'} />
      <section className="noticeWrap">
        <ul className="tabmenu">
          {noticeTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: noticeType,
              setTab: setNoticeType,
            }
            return (
              <TabBtn param={param} key={index}/>
            )
          })}
          <div className="underline"/>
        </ul>
        {noticeType === noticeTabmenu[0] && <Allim data={globalState.profile}/>}
        {noticeType === noticeTabmenu[1] && <Post data={globalState.profile}/>}
      </section>
    </div>
  )
}

export default NoticePage
