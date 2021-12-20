import React, {useEffect} from 'react'
import Swiper from 'react-id-swiper'

import {IMG_SERVER} from 'context/config'

import './popup.scss'

export default (props) => {
  const {setPopupNotice} = props

  const swiperParams = {
    pagination: {
      el: '.swiper-letter'
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
      <div className="wrapper letter">
        <div className="head">
          <div className="photo">
            <img src="" alt="" />
          </div>
          <div className="userId">ㅁㄴㅇㄻㄴㅇㄹ님의 편지</div>
        </div>
        <Swiper {...swiperParams}>
          <div className="letterList">
            <div className="letter">
              대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하
              대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하
              대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하
              대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하
              <div className="date">2021. 12. 25</div>
            </div>
          </div>
          <div className="letterList">
            <div className="letter">
              헤헤 2022년 짱짱짱 너무 재밌었고 완전히히 대박이였지 진짜루 하하대박이였지 진짜루 하하 대박 이였지 진짜루 하하
              대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하 대박이였지 진짜루 하하
              <div className="date">2021. 12. 25</div>
            </div>
          </div>
        </Swiper>
        <button className="closeBtn2" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  )
}
