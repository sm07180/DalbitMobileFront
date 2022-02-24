/**
 * @title 청취자탭 ...버튼 (클릭 이벤트 드롭다운 팝업)
 */
import React, {useContext, useState} from 'react'
import {IMG_SERVER} from 'context/config'
import styled from 'styled-components'
import {BroadCastStore} from 'pages/broadcast/store'
import Events from './listener-event'

export default props => {
  const store = useContext(BroadCastStore)
  //state
  const [eventCheck, setEventCheck] = useState(false)
  //미니드롭다운 show hide 스테이트-----------------------------------
  const [listenTrues, setListenTrues] = useState(false)
  //function 버튼 쇼하이드 토글
  const ToggleEvent = () => {
    if (eventCheck === false) {
      setListenTrues(true)
    } else {
      store.action.updateListenTrues(false) || setListenTrues(false)
    }
  }
  //function 백그라운드 클릭시 드롭다운 하이드
  const AllFalse = () => {
    store.action.updateListenTrues(false) || setListenTrues(false)
  }
  //render------------------------------------------------------------
  return (
    <Wrapper>
      <EVENTBTN value={store.listenTrues || listenTrues} onClick={() => ToggleEvent()}></EVENTBTN>
      {store.listenTrues || (listenTrues && <Events onClick={AllFalse} selectidx={props.selectidx} />)}
      <BackGround onClick={AllFalse} className={store.listenTrues || listenTrues === true ? 'on' : ''} />
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
  top: -1px;
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
