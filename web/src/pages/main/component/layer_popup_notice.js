// 메인 팝업 관리자 wrapper - test
// 임보람
import React, {useEffect, useRef, useState} from 'react'
import Checkbox from './Checkbox'
import Api from 'context/api'
import {OS_TYPE} from '../../../context/config'
import {Hybrid} from 'context/hybrid'

// style
import 'styles/layerpopup.scss'

export default (props) => {
  const {selectedIdx, setPopup} = props
  const popupData = props.data
  // reference
  const customHeader = JSON.parse(Api.customHeader)

  const closePopup = () => {
    selectedIdx(popupData.idx)
  }

  const setPopupCookie = (c_name, value) => {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + 1)
    exdate.setHours(0)
    exdate.setMinutes(0)
    exdate.setSeconds(0)

    const encodedValue = encodeURIComponent(value)
    const c_value = encodedValue + '; expires=' + exdate.toUTCString()
    document.cookie = c_name + '=' + c_value + '; path=/; secure; domain=.dalbitlive.com'
  }

  const applyClick = (bannerIdx, type) => {
    if (state.click1 || type == 'imgType') {
      setPopupCookie('popup_notice_' + `${bannerIdx}`, 'y') //배너번호
    }
    selectedIdx(popupData.idx)
  }

  const goEvent = (bannerIdx, linkType, linkUrl) => {
    if (state.click1) {
      setPopupCookie('popup_notice_' + `${bannerIdx}`, 'y') //배너번호
    }
    setPopup(false)

    if (linkType === 'popup') {
      if (customHeader['os'] === OS_TYPE['Android']) {
        try {
          window.android.openUrl(JSON.stringify({url: linkUrl}))
        } catch (e) {
          window.location.href = linkUrl
        }
      } else if (customHeader['os'] === OS_TYPE['IOS'] && (customHeader['appBulid'] > 68 || customHeader['appBuild'] > 68)) {
        Hybrid('openUrl', linkUrl)
      } else {
        selectedIdx(popupData.idx)
        window.open(linkUrl, '_blank')
      }
    } else {
      window.location.href = linkUrl
    }
  }

  const [state, setState] = useState({})
  return (
    <>
      {popupData.popup_type == '0' && (
        <div className="popup__box popup__img">
          <button className="btn-close" onClick={closePopup}>
            닫기
          </button>
          <div className="popup__inner">
            <div className="contents">
              <a href={popupData.linkUrl}>
                <img src={popupData.bannerUrl} alt="" />
              </a>
            </div>
            {popupData.is_cookie == '1' && (
              <div className="chk-label">
                <label htmlFor={`chkimg${popupData.idx}`}>
                  <input
                    type="checkbox"
                    id={`chkimg${popupData.idx}`}
                    onClick={() => {
                      applyClick(popupData.idx, 'imgType')
                    }}
                  />
                  오늘 하루 보지 않기
                </label>
              </div>
            )}
          </div>
        </div>
      )}
      {popupData.popup_type == '1' && (
        <div className="popup__box popup__text">
          <button
            className="btn-close"
            onClick={() => {
              applyClick(popupData.idx)
            }}>
            닫기
          </button>
          <div className="popup__inner">
            {popupData.title && popupData.is_title_view == '1' && <div className="popup__title">{popupData.title}</div>}
            <div className="inner">
              <p className="contents">
                {popupData.contents &&
                  popupData.contents.split('\n').map((line, index) => {
                    if (popupData.contents.match('\n')) {
                      return (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      )
                    } else {
                      return <React.Fragment key={index}>{popupData.contents}</React.Fragment>
                    }
                  })}
              </p>
              {popupData.is_cookie == '1' && (
                <Checkbox
                  className="checkbox"
                  title="오늘하루 열지 않음"
                  fnChange={(v) => setState({click1: v})}
                  checked={state.click1}
                />
              )}
              <button
                className="btn-ok"
                onClick={() => {
                  {
                    popupData.is_button_view == '0' && applyClick(popupData.idx)
                  }
                  {
                    popupData.is_button_view == '1' && goEvent(popupData.idx, popupData.linkType, popupData.linkUrl)
                  }
                }}>
                {popupData.buttonNm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
