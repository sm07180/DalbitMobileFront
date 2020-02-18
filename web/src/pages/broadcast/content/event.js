/**
 * @title
 */
import React, {useEffect, useState} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
//pages

export default props => {
  const [liveInfo, setLiveInfo] = useState(props.Info)

  return (
    // <Event value={EventValue} className={!EventValue ? 'on' : ''}>
    //   <ul>
    //     <li>강제퇴장</li>
    //     <li>매니저 등록</li>
    //     <li>게스트 초대</li>
    //     <li>프로필 보기</li>
    //     <li>신고하기</li>
    //   </ul>
    // </Event>
    <Event>
      <ul>
        <button>강제퇴장</button>
        <button>매니저 등록</button>
        <button>매니저 해임</button>
        <button>게스트 초대</button>
        <button>프로필 보기</button>
        <button>신고하기</button>
      </ul>
    </Event>
  )
}
///////////////
const Event = styled.div`
  position: absolute;
  right: 23px;
  width: 105px;
  padding: 13px 0;
  background-color: #fff;
  z-index: 9999;
  border: 1px solid #e0e0e0;
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
