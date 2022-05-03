import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import {clipReg} from 'pages/common/clipPlayer/clip_func'
import {OS_TYPE} from 'context/config.js'

import '../scss/clip.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default function ClipRegPop(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {setRegPopupState} = props
  const history = useHistory()
  // reference
  const customHeader = JSON.parse(Api.customHeader)
  const [check, setCheck] = useState(false)

  const closePopup = () => {
    if (check) {
      setPopupCookie('reg_popup', 'y')
    }
    setRegPopupState(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'mainLayerPopup') {
      closePopup()
    }
  }

  const handleCookie = () => {
    setCheck(!check)
  }

  const setPopupCookie = (c_name, value) => {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + 1)
    exdate.setHours(0)
    exdate.setMinutes(0)
    exdate.setSeconds(0)

    const encodedValue = encodeURIComponent(value)
    const c_value = encodedValue + '; expires=' + exdate.toUTCString()
    document.cookie = c_name + '=' + c_value + '; path=/; secure; domain=.dallalive.com'
  }

  const goClipReg = (type) => {
    if (customHeader['os'] === OS_TYPE['Desktop']) {
      dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
    } else {
      if (globalState.token.isLogin === false) {
        return dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
          callback: () => {
            history.push('/login')
          }
        }))
      } else {
        if (type === 'recording') {
          clipReg('record', dispatch, globalState)
        } else if (type === 'upload') {
          clipReg('upload', dispatch, globalState)
        }
      }
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="mainLayerPopup" onClick={closePopupDim}>
      <div id="clipRegPopup">
        <button className="btn-close" onClick={closePopup}>
          닫기
        </button>
        <div className="layerContent">
          <div className="content_wrap">
            <img src="https://image.dallalive.com/banner/2103/0304/img_gift.jpg" alt="클립 유도 팝업 이미지" />
            <ul className="desc_wrap">
              <li>청취는 1분 이상만 인정합니다.</li>
              <li>
                등록한 클립을 비공개로 전환하거나 저작권에 <br />
                위배되는 음원은 지급되지 않습니다.
              </li>
            </ul>
            <div className="btn_wrap">
              <button className="btn rec" onClick={() => goClipReg('recording')}>
                클립 녹음
              </button>
              <button className="btn reg" onClick={() => goClipReg('upload')}>
                클립 등록
              </button>
            </div>
          </div>
          <div className="checkbox_wrap">
            <label className="checkbox_label">
              <DalbitCheckbox
                size={20}
                status={check}
                callback={() => {
                  handleCookie()
                }}
              />
              <span>다시 보지 않음</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
