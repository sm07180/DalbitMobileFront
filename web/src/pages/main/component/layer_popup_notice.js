import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Checkbox from './Checkbox'
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {OS_TYPE} from '../../../context/config'
import {Hybrid} from 'context/hybrid'

// style
import 'styles/layerpopup.scss'

export default (props) => {
  const {setPopup} = props
  const popupData = props.data
  console.log(popupData)

  // reference
  const layerWrapRef = useRef()
  const customHeader = JSON.parse(Api.customHeader)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopup(false)
  }

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
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
    setPopup(false)
  }

  const goEvent = (bannerIdx, linkType, linkUrl) => {
    if (state.click1) {
      setPopupCookie('popup_notice_' + `${bannerIdx}`, 'y') //배너번호
    }

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
        setPopup(false)
        window.open(linkUrl, '_blank')
      }
    } else {
      window.location.href = linkUrl
    }
  }

  const [state, setState] = useState({})
  return (
    <>
      <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
        <div className="popup">
          {popupData.popup_type == '1' && (
            <div className="popup__wrap popup__text">
              {popupData.title && popupData.is_title_view == '1' && <div className="popup__title">{popupData.title}</div>}
              <div className="popup__inner">
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
                {
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
                }
              </div>
              <button
                className="btn-close"
                onClick={() => {
                  applyClick(popupData.idx)
                }}>
                닫기
              </button>
            </div>
          )}
          {popupData.popup_type == '0' && (
            <div className="popup__wrap popup__img">
              <div className="popup__inner">
                <div className="contents">
                  <a href={popupData.linkUrl}>
                    <img src={popupData.bannerUrl} alt="" />
                  </a>
                </div>
                {popupData.is_cookie == '1' && (
                  <div className="chk-label">
                    <label htmlFor="chkimg">
                      <input
                        type="checkbox"
                        id="chkimg"
                        onClick={() => {
                          applyClick(popupData.idx, 'imgType')
                        }}
                      />
                      오늘 하루 보지 않기
                    </label>
                  </div>
                )}
              </div>
              <button className="btn-close" onClick={closePopup}>
                닫기
              </button>
            </div>
          )}
        </div>
      </PopupWrap>
    </>
  )
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;
`
