import React, {useEffect} from 'react'
import Swiper from 'react-id-swiper'

import {IMG_SERVER} from 'context/config'

import './popup.scss'

export default (props) => {
  const {setPopupNotice} = props

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination'
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupNotice()
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popup') {
      closePopup()
    }
  }

  return (
    <div id="popup" onClick={wrapClick}>
      <div className="wrapper">
        <Swiper {...swiperParams}>
          <div>
            <img src={`${IMG_SERVER}/event/tree/slideImg-1.png`} />
          </div>
          <div>
            <img src={`${IMG_SERVER}/event/tree/slideImg-2.png`} />
          </div>
        </Swiper>
        <button className="closeBtn" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  )
}
