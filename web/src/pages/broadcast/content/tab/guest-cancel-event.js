/**
 * @title 클릭 event
 */
import React, {useEffect, useState, Children} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
//pages

export default props => {
  const {onClick} = props
  console.log(onClick)

  return (
    <Event>
      <ul>
        <h1>{props.value}님을 강퇴 하시겠습니까?</h1>
        <button onClick={onClick}>강퇴하기</button>
        <button onClick={onClick}>취소하기</button>
      </ul>
    </Event>
  )
}
///////////////
const Event = styled.div`
  position: absolute;
  left: 50%;
  width: 80%;
  padding: 13px 0;
  background-color: #fff;
  z-index: 3;
  border: 1px solid #e0e0e0;
  transform: translateX(-50%);
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
