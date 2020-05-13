import React from 'react'
import './test.scss'
import closeBtn from './static/ic_back.svg'
export default () => {
  return (
    <>
      <div className="header">
        <img className="close-btn" src={closeBtn} onClick={goBack} />
      </div>
    </>
  )
}
