// 메인팝업 - 이벤트 - 추석
import React, {useEffect, useState} from 'react'
import Api from 'context/api'
import {IMG_SERVER} from '../../../context/config'
// style
import 'styles/layerpopup.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function LayerPopupWrap({setEventPop, popupData}) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [existOtherPopup, setExistOtherPopup] = useState(false)

  const [checked, setChecked] = useState({
    idx: -1,
    check: false
  })
  const handleDimClick = () => {
    setEventPop(false)
    if (checked.check === true) {
      setPopupStorage('popup_event', 'y')
      setChecked({
        idx: -1,
        check: false
      })
    }
  }

  const fetchDalCheck = async () => {
    const res = await Api.getChooseokDalCheck()
    if (res.result === 'success') {
      if (res.data.freeDal.dal === 5) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          title: '행복한 추석되세요',
          msg: `<div style="text-align:center;padding:20px 0 6px 0;"><img src='${IMG_SERVER}/event/thxgiving/img_5moon.png'/><p style="font-size:22px;color:#FF3C7B;font-weight:bold;padding:15px 0 7px 0;">5달이 지급되었습니다</p><p>달라 많이 사랑해주세요~♥</p></div>`,
          callback: handleDimClick
        }))
      } else if (res.data.freeDal.dal === 10) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          title: '행복한 추석되세요',
          msg: `<div style="text-align:center;padding:20px 0 6px 0;"><img src='${IMG_SERVER}/event/thxgiving/img_5moon.png'/><p style="font-size:22px;color:#FF3C7B;font-weight:bold;padding:15px 0 7px 0;">5달이 지급되었습니다</p><p>달라 많이 사랑해주세요~♥</p></div>`,
          callback: handleDimClick
        }))
      }
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}))
    }
  }

  const setPopupStorage = (c_name, value) => {
    const {memNo} = globalState.token
    localStorage.setItem(`${c_name}${memNo}`, memNo)
  }

  const HandleEventClick = () => {
    fetchDalCheck()
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (popupData.length > 0) setExistOtherPopup(true)

    return () => {
      if (popupData.length === 0) document.body.style.overflow = ''
    }
  }, [popupData])

  return (
    <div id="mainLayerPopup" className={`${existOtherPopup ? 'event' : 'one-event'}`} onClick={handleDimClick}>
      <div className="popup">
        <div className="popup__wrap">
          <div className={`popbox active`}>
            <div className={`popup__box popup__img`}>
              <button className="btn-close" onClick={handleDimClick}>
                닫기
              </button>
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                <div className="contents">
                  <img src={`${IMG_SERVER}/event/thxgiving/popup.jpg`} alt="추석이벤트" style={{width: 328, borderRadius: 18}} />
                  <button className="event__btn" onClick={HandleEventClick}>
                    <img src={`${IMG_SERVER}/event/thxgiving/button.png`} alt="추석 선물 확인하기" />
                  </button>
                </div>

                <div className="checkbox-wrap">
                  <label htmlFor={`event_popup`} className="checkbox-label">
                    <input
                      type="checkbox"
                      id={`event_popup`}
                      onClick={(e) => {
                        setChecked({
                          idx: 1,
                          check: e.target.checked
                        })
                      }}
                      className={`${checked.check && `active`}`}
                    />
                    다시 보지 않음
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
