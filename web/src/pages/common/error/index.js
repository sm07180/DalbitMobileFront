/**
 * @title error페이지
 */
import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import 'styles/errorstyle.scss'

export default () => {
  let history = useHistory()
  const conformBtn = () => {
    history.push('/')
  }

  return (
    <section id="error">
      <Header type="back" />
      <div className="textWrap">
        <h3 className="emoji">😅</h3>
        <p className="text">
          <span>연결이 불안해요 :(</span>
          <span>잠시 후 다시 시도해 주세요.</span>
        </p>
      </div>
      <SubmitBtn text="확인" onClick={conformBtn} />
    </section>
  )
}
