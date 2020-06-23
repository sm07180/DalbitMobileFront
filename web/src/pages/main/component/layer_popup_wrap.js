import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Checkbox from './Checkbox'
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {OS_TYPE} from '../../../context/config'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'

import LayerPopupNotice from './layer_popup_notice2.js'
// style
import 'styles/layerpopup.scss'

export default (props) => {
  const {setPopup} = props
  const propsData = props.data

  console.log(propsData)
  const [popupData, setPopupData] = useState([])
  const [popupNotice, setPopupNotice] = useState(false)

  // reference
  const layerWrapRef = useRef()
  const customHeader = JSON.parse(Api.customHeader)

  useEffect(() => {
    console.log(propsData.length)
    setPopupData(propsData)

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

  const filterIdx = (idx) => {
    console.log(idx)

    setPopupData(
      popupData.filter((v) => {
        return v.idx !== idx
      })
    )
  }
  const [state, setState] = useState({})
  return (
    <>
      {propsData.length > 0 && (
        <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
          <div className="popup">
            <div className="popup__wrap">
              {popupData.length > 0 &&
                popupData.map((data, index) => {
                  return (
                    Utility.getCookie('popup_notice_' + `${data.idx}`) !== 'y' && (
                      <LayerPopupNotice key={index} data={data} setPopup={setPopupNotice} selectedIdx={filterIdx} />
                    )
                  )
                })}
            </div>
          </div>
        </PopupWrap>
      )}
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
