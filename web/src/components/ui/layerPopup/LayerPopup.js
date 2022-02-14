import React, { useEffect, useState} from 'react'

import './layerPopup.scss'

const LayerPop = (props) => {
  const {setPopup, title, children, cookie } = props

  const dontShowAgain = (cookieName) => {
    setPopupCookie(cookieName, 'y')
    setPopup(false)
  }

  const popupClose = () => {
    setPopup(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPop') {
      setPopup(false)
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

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="layerPop" onClick={closePopupDim}>
      <div className="popLayer">
        <div className="popContainer">
          {title && <h2>{title}</h2>}
          {children}
        </div>
        <div className='closeWrap'>
          {cookie && 
            <label className='dontShowLabel' onClick={dontShowAgain(cookie)}>
              <input type='checkbox' className='dontShow'/>
              <span className='dontShowBtn'>다시보지않기</span>
            </label>
          }          
          <button className='close'onClick={popupClose}>닫기</button>
        </div>
      </div>
    </div>
  )
}

export default LayerPop