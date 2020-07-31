import React, {useState} from 'react'
import {IMG_SERVER} from 'context/config'

import Lottie from 'react-lottie'
import styled from 'styled-components'
import CloseBtn from '../static/ic_close.svg'

export default (props) => {
  const {setRandomPopup, setPopup, rewardPop} = props

  const closePopup = () => {
    setRandomPopup(false)
    setPopup(false)
  }

  setTimeout(closePopup, 4000)

  return (
    <RandomPopupWrap>
      <div className="lottie-box" onClick={() => closePopup()}>
        <Lottie
          options={{
            loop: false,
            autoPlay: true,
            path: `${IMG_SERVER}/event/attend/200617/fansupport1.json`
          }}
        />
      </div>
    </RandomPopupWrap>
  )
}

const RandomPopupWrap = styled.div`
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

  .lottie-box {
    background: none;
  }
`
