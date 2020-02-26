/**
 * @file style-WebRtcTest.js
 * @brief 방송하기/청취하기
 */
import React, {useState} from 'react'
import styled from 'styled-components'

export default () => {
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  //---------------------------------------------------------------------
  const operation = () => {
    if (show === false) {
      setShow(true)
      setShow2(false)
    } else {
      setShow(false)
    }
  }
  const operation2 = () => {
    if (show2 === false) {
      setShow2(true)
      setShow(false)
    } else {
      setShow2(false)
    }
  }
  //---------------------------------------------------------------------
  return (
    <>
      <Content>
        <Btn onClick={() => operation()}>방송듣기</Btn>
        <Btn onClick={() => operation2()}>방송하기</Btn>
      </Content>
    </>
  )
}
//---------------------------------------------------------------------
const Btn = styled.button`
  width: 100px;
  height: 40px;
  color: white;
  background-color: skyblue;
  margin-right: 10px;
`
const Content = styled.section``
