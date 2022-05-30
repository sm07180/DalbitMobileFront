import React from 'react'
import './index.scss'
import CloseBtn from './static/ic_close.svg'

const PcOpen = () => {
  return (
    <div className="pcOpen">
      <div className="titleBox">
        <div className="title">PC 버전 기능 개선</div>
        <img
          src={CloseBtn}
          className="closeButton"
          onClick={() => {
            window.location.href = `/`
          }}
        />
      </div>

      <img src="https://image.dallalive.com/images/api/newpcimg.png" className="pcOpen__img" />
    </div>
  )
}

export default PcOpen
