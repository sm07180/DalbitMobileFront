/**
 * @title 게스트 request클릭 event
 */
import React, {useEffect, useState} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
export default props => {
  const {onClick} = props
  //-------------------------------------------------------------
  return (
    <Event>
      <ul>
        <button onClick={onClick}>초대하기</button>
        <button onClick={onClick}>거절하기</button>
      </ul>
    </Event>
  )
}
//-------------------------------------------------------------
//styled
const Event = styled.div`
  position: absolute;
  right: 23px;
  width: 105px;
  padding: 13px 0;
  background-color: #fff;
  z-index: 3;
  border: 1px solid #e0e0e0;
  .scrollbar > div:nth-last-child(3) & {
    bottom: 0;
  }
  & ul {
    & button {
      display: block;
      width: 100%;
      padding: 7px 0;
      box-sizing: border-box;
      color: #757575;
      font-size: 14px;
      text-align: center;
      letter-spacing: -0.35px;
      &:hover {
        background-color: #f8f8f8;
      }
    }
  }
  &.on {
    display: none;
  }
`
