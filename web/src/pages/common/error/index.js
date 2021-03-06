/**
 * @title errorνμ΄μ§
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
        <h3 className="emoji">π</h3>
        <p className="text">
          <span>μ°κ²°μ΄ λΆμν΄μ :(</span>
          <span>μ μ ν λ€μ μλν΄ μ£ΌμΈμ.</span>
        </p>
      </div>
      <SubmitBtn text="νμΈ" onClick={conformBtn} />
    </section>
  )
}
