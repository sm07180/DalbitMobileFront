import React, {useContext} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'
import {Context} from 'context'

import Qna from './qna'
import QnaList from './qna-list'
import QnaDetail from './qna-detail'
import NoticeTab from 'pages/common/noticeTab'

import './index.scss'
export default function Personal(props) {
  const history = useHistory()

  const context = useContext(Context)

  const {path} = props.match

  const handleHistory = (urls) => {
    history.push(`/customer/${urls}`)
  }

  return (
    <>
      {/* <NoticeTab />
      {context.token.isLogin && (
        <button onClick={() => handleHistory('qnaList')} className={`btnMyList ${path.includes('qnaList') ? 'on' : ''}`}>
          내역보기
        </button>
      )} */}
      <div className="personalWrap">
        <div className="personalWrap__headerButton">
          <button onClick={() => handleHistory('personal')} className={path.includes('qnaList') ? '' : 'on'}>
            1:1 문의 작성
          </button>
          {context.token.isLogin && (
            <button onClick={() => handleHistory('qnaList')} className={path.includes('qnaList') ? 'on' : ''}>
              나의 문의 내역
            </button>
          )}
        </div>
        <Switch>
          <Route path="/customer/personal" exact component={Qna} />
          <Route path="/customer/qnaList" exact component={QnaList} />
          <Route path="/customer/qnaList/:number" exact component={QnaDetail} />
        </Switch>
      </div>
    </>
  )
}
