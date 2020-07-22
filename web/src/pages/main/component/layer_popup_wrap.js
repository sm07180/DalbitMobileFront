// 메인 팝업 관리자 wrapper - test
// 임보람
import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Api from 'context/api'
import Utility from 'components/lib/utility'
// component
import LayerPopupNotice from './layer_popup_notice2.js'
// style
import 'styles/layerpopup.scss'

export default (props) => {
  const {setPopup} = props
  const propsData = props.data

  // console.log(propsData)
  const [popupData, setPopupData] = useState([])
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupLength, setPopupLength] = useState('')

  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    let filterData = []
    propsData.map((data, index) => {
      let popupState = Utility.getCookie('popup_notice_' + `${data.idx}`)
      if (popupState === undefined) {
        filterData.push(data)
      } else {
        return false
      }
    })
    // console.log(filterData)
    setPopupData(filterData)
    setPopupNotice(true)
    setPopupLength(filterData.length)

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
      if (popupData.length <= 1) closePopup()
      else return
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const filterIdx = (idx) => {
    console.log('filter', idx)

    setPopupData(
      popupData.filter((v) => {
        return v.idx !== idx
      })
    )
    setPopupLength(
      popupData.filter((v) => {
        return v.idx !== idx
      }).length
    )

    if (popupData.length == '1') {
      closePopup()
    }
    setTimeout(() => {
      console.log(popupData)
    }, 0.1)
  }
  return (
    <>
      {popupData.length > 0 && popupNotice && (
        <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
          <div className="popup">
            <div className="popup__wrap">
              {popupData.length > 0 &&
                popupData.map((data, index) => {
                  return (
                    Utility.getCookie('popup_notice_' + `${data.idx}`) !== 'y' && (
                      <PopBox className={index === 0 ? 'active' : ''} key={index}>
                        <LayerPopupNotice data={data} setPopup={setPopupNotice} selectedIdx={filterIdx} />
                      </PopBox>
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
const PopBox = styled.div`
  display: none;
  max-width: 360px;
  margin: 0 auto;
  &.active {
    display: block;
  }
`
