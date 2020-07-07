/**
 * @title 청취자
 */
import React, {useState, useEffect, useContext} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
//components--------------------------------------------------
import RequestEvent from './guest-request-event'

export default props => {
  //context---------------------------------------------------------
  const context = useContext(Context)
  //----------------------------------------------------------------
  //0.매니저정보 info스테이트----------------------------------------
  const [eventCheck, setEventCheck] = useState(false)
  const [checkVisibility, SetcheckVisibility] = useState(false)
  const [listenTrues, setListenTrues] = useState(false)
  const [BTNcheck, setBTNcheck] = useState(false)

  //----------------------------------------------------------------

  //클릭 이벤트
  const ToggleEvent = () => {
    if (checkVisibility === false) {
      SetcheckVisibility(true)
    } else {
      SetcheckVisibility(false)
    }
  }
  const AllFalse = () => {
    SetcheckVisibility(false)
  }
  //render------------------------------------------------------------
  //----------------------------------------------------------------
  useEffect(() => {}, [])

  return (
    <Wrapper>
      <EVENTBTN value={checkVisibility} onClick={ToggleEvent}></EVENTBTN>
      {checkVisibility && <RequestEvent onClick={AllFalse} />}
      <BackGround onClick={AllFalse} className={checkVisibility === true ? 'on' : ''} />
    </Wrapper>
  )
}
//----------------------------------------------------------------
//style
const Wrapper = styled.div`
  margin-top: 20px;
  float: right;
  width: 36px;
  height: 36px;
  position: relative;
`
//이벤트버튼
const EVENTBTN = styled.button`
  position: absolute;
  right: 16px;
  top: 0;
  width: 36px;
  height: 36px;
  transform: translateY(-50%);
  background: url(${IMG_SERVER}/images/api/ic_more.png) no-repeat center center / cover;
  outline: none;
`
//클릭 배경 가상요소
const BackGround = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  &.on {
    display: block;
    z-index: 2;
  }
`
