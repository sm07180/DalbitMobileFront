import React, {useEffect} from 'react'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'

export default (props) => {
  const {setPopupDetails, gganbuNumber} = props

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination'
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupDetails()
  }

  return (
    <PopupWrap id="popupDetails">
      <Swiper {...swiperParams}>
        <div className="list">
          {gganbuNumber && gganbuNumber === '1' ? (
            <img src="https://image.dalbitlive.com/event/gganbu/popupDetails-1.png" />
          ) : gganbuNumber && gganbuNumber !== '1' ? (
            <img src="https://image.dalbitlive.com/event/gganbu/popupDetails-1-1.png" />
          ) : (
            <></>
          )}
        </div>
        <div className="list">
          <img src="https://image.dalbitlive.com/event/gganbu/popupDetails-2.png" />
        </div>
        <div className="list">
          <img src="https://image.dalbitlive.com/event/gganbu/popupDetails-3.png" />
        </div>
      </Swiper>
      <div className="close" onClick={closePopup}>
        <img src="https://image.dalbitlive.com/event/gganbu/popDetailClose.png" />
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  box-sizing: border-box;
  z-index: 60;
  .list {
    position: relative;
    width: 100%;
    img {
      width: 100%;
      vertical-align: bottom;
    }
  }
  .swiper-container {
    padding-bottom: 50px;
  }
  .swiper-pagination {
    &.swiper-pagination-bullets {
      bottom: 0px;
      z-index: 100;
    }
    .swiper-pagination-bullet {
      background: white;
      opacity: 1;
      &-active {
        background: #632beb;
      }
    }
  }
  .close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      width: 32px;
      height: 32px;
    }
  }
`
