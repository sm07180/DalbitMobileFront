import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components
// contents
import Allim from './allim'
import Post from './post'

import './notice.scss'
import {useDispatch, useSelector} from "react-redux";

const noticeTabmenu = ['알림','공지사항']

const NoticePage = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  //context
  const {token, profile} = globalState

  const [noticeType, setNoticeType] = useState(noticeTabmenu[0])

  // 페이지 시작
  return (
    <div id="notice">
      <Header type={'back'}/>
      <section className="noticeWrap">
        <ul className="tabmenu">
          {noticeTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: noticeType,
              setTab: setNoticeType,
              // setPage: setPage
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
          <div className="underline"></div>
        </ul>
        {noticeType === noticeTabmenu[0] && <Allim data={profile} />}
        {noticeType === noticeTabmenu[1] && <Post data={profile} />}
      </section>
    </div>
  )
}

export default NoticePage
