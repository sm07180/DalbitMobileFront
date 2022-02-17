// 메인 팝업 관리자 wrapper - test
// 김재오 수정 2020-07-24
import React, {useEffect, useState} from 'react'
import Api from 'context/api'
import {OS_TYPE} from '../../../context/config'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'
// style
import 'styles/layerpopup.scss'
import {useHistory} from "react-router-dom";

export default function LayerPopupWrap({data, setData}) {
  const history = useHistory();
  const [checked, setChecked] = useState({
    idx: -1,
    check: false
  })
  const customHeader = JSON.parse(Api.customHeader)

  const handleDimClick = () => {
    const res = data.filter((v, idx) => {
      if (idx === 0) {
        return false
      } else {
        return v
      }
    })
    setData(res)

    if (checked.check === true) {
      setPopupCookie('popup_notice_' + `${checked.idx}`, 'y')
      setChecked({
        idx: -1,
        check: false
      })
    }
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

  const handleCookie = (idx, type) => {
    if (type === 'image') {
      setPopupCookie('popup_notice_' + `${idx}`, 'y')
      handleDimClick()
    }
  }

  const handleRoute = (data) => {
    if (data.linkType === 'popup') {
      if (customHeader['os'] === OS_TYPE['Android']) {
        try {
          window.android.openUrl(JSON.stringify({url: data.linkUrl}))
        } catch (e) {
          window.location.href = data.linkUrl
        }
      } else if (customHeader['os'] === OS_TYPE['IOS'] && (customHeader['appBulid'] > 68 || customHeader['appBuild'] > 68)) {
        Hybrid('openUrl', data.linkUrl)
      } else {
        window.open(data.linkUrl, '_blank')
      }
      handleDimClick()
    } else {
      window.location.href = data.linkUrl
    }
  }

  const makeTextInner = (popupData) => {
    return (
      <>
        <div className="popupBg">
          {popupData.title && popupData.is_title_view === 1 && <h3 className="popup__title">{popupData.title}</h3>}
          <div className="inner">
            <div className="innerScroll">
              <p className="contents" dangerouslySetInnerHTML={{__html: Utility.nl2br(popupData.contents)}}></p>
            </div>
            <div className="btnWrap">
              <button
                className="btn-ok"
                onClick={() => {
                  {
                    popupData.is_button_view === 0 && handleDimClick()
                  }
                  {
                    popupData.is_button_view === 1 && handleRoute(popupData)
                  }
                }}>
                {popupData.buttonNm}
              </button>
            </div>
          </div>
        </div>

        {popupData.is_cookie === 1 && (
          <div className="checkbox-wrap">
            <label htmlFor={`chk${popupData.idx}`} className="checkbox-label">
              <input
                type="checkbox"
                id={`chk${popupData.idx}`}
                onClick={(e) => {
                  setChecked({
                    idx: popupData.idx,
                    check: e.target.checked
                  })
                }}
                className={`${checked.check && `active`}`}
              />
              오늘 하루 보지 않기
            </label>
          </div>
        )}
      </>
    )
  }

  const makeImgInner = (popupData) => {
    return (
      <>
        <div className="contents">
          <a>
            <img src={popupData.bannerUrl} alt="" onClick={() => history.push(popupData.linkUrl)}/>
          </a>
        </div>
        {popupData.is_cookie === 1 && (
          <div className="checkbox-wrap">
            <label htmlFor={`chk${popupData.idx}`} className="checkbox-label">
              <input
                type="checkbox"
                id={`chk${popupData.idx}`}
                onClick={(e) => {
                  setChecked({
                    idx: popupData.idx,
                    check: e.target.checked
                  })
                }}
                className={`${checked.check && `active`}`}
              />
              오늘 하루 보지 않기
            </label>
          </div>
        )}
      </>
    )
  }

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="mainLayerPopup" onClick={handleDimClick}>
      <div className="popup">
        <div className="popup__wrap">
          {
            // data.length > 0 &&
            data.map((v, idx) => {
              const {popup_type} = v
              return (
                <div key={idx} className={`popbox ${idx === 0 && 'active'}`}>
                  <div className={`popup__box ${popup_type === 0 ? 'popup__img' : 'popup__text'}`}>
                    <button className="btn-close" onClick={handleDimClick}>
                      닫기
                    </button>
                    <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                      {popup_type === 0 ? makeImgInner(v) : makeTextInner(v)}
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
