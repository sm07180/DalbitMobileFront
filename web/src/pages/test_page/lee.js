import React from 'react'

import './lee.scss'
import BackBtn from './static/ic_back.svg'

export default () => {
  return (
    <>
      <div className="header">
        <img className="header__button--back" src={BackBtn} />
        <h1 className="header__title">달 충전하기</h1>
      </div>
    </>
  )
}
