/**
 * @title 청취자
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
//components--------------------------------------------------
import Events from './listener-event'
export default props => {
  //context---------------------------------------------------------
  const context = useContext(Context)
  //----------------------------------------------------------------
  //0.매니저정보 info스테이트----------------------------------------
  const [eventCheck, setEventCheck] = useState(false)

  const [listenTrues, setListenTrues] = useState(false)
  //클릭visibility function
  // const ToggleEvent = () => {
  //   if (trues === false) {
  //     setTrues(true)
  //   } else {
  //     setTrues(false)
  //   }
  // }

  // //클릭 bg visibility function
  // const AllFalse = () => {
  //   setTrues(false)
  // }

  //----------------------------------------------------------------

  //클릭 이벤트
  const ToggleEvent = () => {
    if (eventCheck === false) {
      setListenTrues(true)
    } else {
      setListenTrues(false)
    }
  }
  const AllFalse = () => {
    setListenTrues(false)
  }

  //render------------------------------------------------------------
  //----------------------------------------------------------------
  useEffect(() => {}, [])

  return (
    <Wrapper>
      <EVENTBTN value={listenTrues} onClick={ToggleEvent}></EVENTBTN>
      {listenTrues && <Events onClick={AllFalse} />}
      <BackGround onClick={AllFalse} className={listenTrues === true ? 'on' : ''} />
    </Wrapper>
  )
}
//----------------------------------------------------------------
//style
const Wrapper = styled.div`
  margin-top: 20px;
  float: right;
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
  background: url('https://devimage.dalbitcast.com/images/api/ic_more.png') no-repeat center center / cover;
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
