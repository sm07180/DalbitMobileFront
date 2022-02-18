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

  const closePopup = () => {
    const res = data.filter((v, idx) => {
      if (idx === 0) {
        return false
      } else {
        return v
      }
    })
    setData(res)
  }

  const dontShowAction = (v) => {
    setPopupCookie('popup_notice_' + `${v.idx}`, 'y')
    setChecked({
      idx: -1,
      check: false
    })
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
      </>
    )
  }

  const makeImgInner = (popupData) => {
    const linkUrl = popupData.linkUrl
    return (
      <>
        <a>
          <img src={popupData.bannerUrl} alt="" onClick={() => {
            if(linkUrl.includes('notice')) {
              history.push({
                pathname: linkUrl,
                state: linkUrl.split('/')[2]
              })
            }else {
              history.push(linkUrl)
            }
          }}/>
        </a>
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
    <>
      {
        data.map((v, idx) => {
          const {popup_type} = v
          return (
            <div id="eventPop"
                 onClick={closePopup}
                 key={idx}
                 style={{zIndex: 99 - idx}}
            >
              <div className="popLayer">
                <div className="popContainer">
                  <div className="popContent" onClick={(e) => e.stopPropagation()}>
                    {popup_type === 0 ? makeImgInner(v) : makeTextInner(v)}
                  </div>
                </div>
                <div className='closeWrap'>
                  {v.is_cookie === 1 && (
                    <label htmlFor={`chk${v.idx}`} className='dontShowLabel'>
                      <input
                        type="checkbox"
                        id={`chk${v.idx}`}
                        className={`dontShow`}
                      />
                      <button className='dontShowBtn' onClick={() => dontShowAction(v)}>오늘 하루 보지 않기</button>
                    </label>
                  )}
                  <button className='close' onClick={closePopup}>닫기</button>
                </div>
              </div>
            </div>
          )
        })
      }
    </>
  )
}
