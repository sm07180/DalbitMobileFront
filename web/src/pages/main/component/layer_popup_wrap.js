// 메인 팝업 관리자 wrapper - test
// 김재오 수정 2020-07-24
import React, {useEffect, useRef, useState} from 'react'
import {OS_TYPE} from '../../../context/config'
import {Hybrid} from 'context/hybrid'
import {useHistory} from "react-router-dom";
import Api from 'context/api'
import Utility from 'components/lib/utility'
// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// style
import 'styles/layerpopup.scss'

export default function LayerPopupWrap({data, setData}) {
  const history = useHistory();
  const contentRef = useRef();
  const scrollRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [bottomHit, setBottomHit] = useState(false);
  const [checked, setChecked] = useState({
    idx: -1,
    check: false
  });
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

  const clickLink = (popupData) => {
    const linkUrl = popupData.linkUrl
    if(linkUrl.includes('notice')) {
      history.push({
        pathname: linkUrl,
        state: linkUrl.split('/')[2]
      })
    } else {
      history.push(linkUrl)
    }
  };

  const makeTextInner = (popupData) => {
    return (
      <>
          {
            popupData.title && popupData.is_title_view === 1 &&
            <h2 className='title'>{popupData.title}</h2>
          }
          <div className="content">
              <div className="scrollWrap" ref={scrollRef}>
                <p dangerouslySetInnerHTML={{__html: Utility.nl2br(popupData.contents)}} ref={contentRef}></p>
              </div>
              {scroll && bottomHit === false ? <span className="gradient"></span> : ''}
          </div>
          {popupData.is_button_view === 0 ? <></> : <SubmitBtn text={popupData.buttonNm} onClick={() => clickLink(popupData)} /> 
          }
      </>
    )
  }

  const makeImgInner = (popupData) => {
    const linkUrl = popupData.linkUrl;
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

  const scrollSize = (popupData) => {
    const scrollNode = scrollRef.current;
    const contentNode = contentRef.current;

    if (contentNode && contentNode.clientHeight >= 250) {
      setScroll(true);
    }

    if (scrollNode && scrollNode.scrollTop >= contentNode.clientHeight - scrollNode.clientHeight - 5) {
      setBottomHit(true);
    } else {
      setBottomHit(false);
    }
  }

  useEffect(() => {
    if (scrollRef.current !== undefined) {
      scrollRef.current.addEventListener('scroll', scrollSize);
      scrollSize();
      return () => {
        scrollRef?.current && scrollRef.current.removeEventListener('scroll', scrollSize);
      }
    }
  }, []);

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, []);

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
                      <button className='dontShowBtn' onClick={() => dontShowAction(v)}>다시 보지 않음</button>
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
