import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import ListRow from 'components/ui/listRow/ListRow'
// components

// contents
import Allim from './allim'
import Post from './post'

import './notice.scss'

const noticeTabmenu = ['알림','공지사항']

const NoticePage = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  
  const [noticeType, setNoticeType] = useState(noticeTabmenu[0])

  // 페이지 시작
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
              // setPage: setPage
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
        </ul>
        {noticeType === noticeTabmenu[0] && <Allim data={profile} />}
        {noticeType === noticeTabmenu[1] && <Post data={profile} />}
      </section>
    </div>
  )
}

export default NoticePage
