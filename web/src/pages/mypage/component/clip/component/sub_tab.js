import React, {useContext} from 'react'
import Swiper from 'react-id-swiper'

import {Context} from 'context'
import {UPLOAD_SUBTAB_TYPE} from 'pages/mypage/content/constant'

const buttonList = [
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_MY, text: '마이 클립', cName: 'swiper-button-prev'},
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_LISTEN, text: '청취 회원'},
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_LIKE, text: '좋아요 회원'},
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_GIFT, text: '선물한 회원', cName: 'swiper-button-next'}
]

export default function UploadSubTab(props) {
  const {contextClipTab, contextClipTabAction} = props
  const context = useContext(Context)

  const swiperParams = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0,
    initialSlide: context.clipTab
  }

  const onClickHandler = (e) => {
    contextClipTabAction(+e.target.value)
  }

  const renderSubText = () => {
    switch (contextClipTab) {
      case UPLOAD_SUBTAB_TYPE.SUBTAB_MY:
        return <p>본인이 등록한 클립 내역</p>
      case UPLOAD_SUBTAB_TYPE.SUBTAB_LISTEN:
        return (
          <p>
            최근 3개월동안 나의 클립을 <em className="icon_play" />
            청취한 회원
          </p>
        )
      case UPLOAD_SUBTAB_TYPE.SUBTAB_LIKE:
        return (
          <p>
            최근 3개월간 본인이 등록한 클립에 <em className="icon_good-color" />
            좋아요한 회원
          </p>
        )
      case UPLOAD_SUBTAB_TYPE.SUBTAB_GIFT:
        return (
          <p>
            최근 3개월간 본인이 등록한 클립으로
            <em className="icon_byeol" />
            선물한 회원
          </p>
        )
    }
  }

  return (
    <section className="subTab_box">
      <Swiper {...swiperParams} activeSlideKey={`${context.clipTab < 1 ? 0 : context.clipTab > 2 ? 3 : ''}`}>
        {buttonList.map((btn, idx) => (
          <button
            key={idx}
            className={`subTab_button${btn.buttonValue === contextClipTab ? ' active' : ''}`}
            value={btn.buttonValue}
            onClick={onClickHandler}>
            {btn.text}
          </button>
        ))}
      </Swiper>

      <div className="tab_description">{renderSubText()}</div>
    </section>
  )
}
