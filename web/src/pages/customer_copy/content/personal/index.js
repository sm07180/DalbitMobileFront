import React, {useContext} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'

import Qna from './qna'
import QnaList from './qna-list'
import QnaDetail from './qna-detail'

import {Context} from 'context'

import './index.scss'
export default function Personal(props) {
  const history = useHistory()

  const context = useContext(Context)

  if (!context.token.isLogin) {
    window.location.href = '/login'
    return
  }

  const {path} = props.match

  const handleHistory = (urls) => {
    history.push(`/customer/${urls}`)
  }

  return (
    <div className="personalWrap">
      <div className="personalWrap__headerButton">
        <button onClick={() => handleHistory('personal')} className={path.includes('qnaList') ? '' : 'on'}>
          1:1 문의 작성
        </button>
        <button onClick={() => handleHistory('qnaList')} className={path.includes('qnaList') ? 'on' : ''}>
          나의 문의 내역
        </button>
      </div>
      <Switch>
        <Route path="/customer/personal" exact component={Qna} />
        <Route path="/customer/qnaList" exact component={QnaList} />
        <Route path="/customer/qnaList/:number" exact component={QnaDetail} />
      </Switch>
    </div>
  )
}
