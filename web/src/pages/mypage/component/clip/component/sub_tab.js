import React, {useContext} from 'react'
import Swiper from 'react-id-swiper'

import Util from 'components/lib/utility.js'
import {UPLOAD_SUBTAB_TYPE} from 'pages/mypage/content/constant'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxClipTab} from "redux/actions/globalCtx";

const buttonList = [
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_MY, text: '마이 클립', cName: 'swiper-button-prev'},
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_LISTEN, text: '청취 회원'},
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_LIKE, text: '좋아요 회원'},
  {buttonValue: UPLOAD_SUBTAB_TYPE.SUBTAB_GIFT, text: '선물한 회원', cName: 'swiper-button-next'}
]

export default function UploadSubTab(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {totalData, contextClipTab} = props

  const swiperParams = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0,
    initialSlide: globalState.clipTab
  }

  const onClickHandler = (e) => {
    dispatch(setGlobalCtxClipTab(+e.target.value));
  }

  const renderSubText = () => {
    switch (contextClipTab) {
      case UPLOAD_SUBTAB_TYPE.SUBTAB_MY:
        return (
          <p>
            내가 등록한 클립 : <span>{Util.printNumber(totalData)}건</span>
          </p>
        )
      case UPLOAD_SUBTAB_TYPE.SUBTAB_LISTEN:
        return (
          <p>
            최근 3개월 내 클립 <em className="icon_play" />
            청취한 회원 : <span>{Util.printNumber(totalData)}명</span>
          </p>
        )
      case UPLOAD_SUBTAB_TYPE.SUBTAB_LIKE:
        return (
          <p>
            최근 3개월 내 클립 <em className="icon_good-color" />
            좋아요한 회원 : <span>{Util.printNumber(totalData)}명</span>
          </p>
        )
      case UPLOAD_SUBTAB_TYPE.SUBTAB_GIFT:
        return (
          <p>
            최근 3개월 내 클립 <em className="icon_byeol" />
            선물한 회원 : <span>{Util.printNumber(totalData)}명</span>
          </p>
        )
    }
  }

  return (
    <section className="subTab_box">
      <Swiper {...swiperParams} activeSlideKey={`${globalState.clipTab < 1 ? 0 : globalState.clipTab > 2 ? 3 : ''}`}>
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
