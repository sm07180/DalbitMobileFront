import React, {useState, useContext} from 'react'
import {WIDTH_MOBILE} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'

export default props => {
  const context = useContext(Context)
  return (
    <>
      <Event>
        <ul>
          <li>강제퇴장</li>
          <li>매니저 등록</li>
          <li>게스트 초대</li>
          <li>프로필 보기</li>
          <li>신고하기</li>
        </ul>
      </Event>
    </>
  )
}

const MicCheckWrap = styled.div`
  position: relative;
  width: 300px;
  padding: 41px 43px 91px 43px;
  box-sizing: border-box;
`
const CheckDetail = styled.p`
  color: #616161;
  font-size: 14px;
  line-height: 1.71;
  letter-spacing: -0.35px;
  text-align: center;
  transform: skew(-0.03deg);
`
const CheckWarnning = styled.h4`
  margin-top: 36px;
  color: #ec455f;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.71;
  letter-spacing: -0.35px;
  text-align: center;
  transform: skew(-0.03deg);
`
const BackBTN = styled.button`
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #8555f6;
  color: #fff;
  font-size: 16px;
  line-height: 1.14;
  letter-spacing: -0.35px;
  text-align: center;
  transform: skew(-0.03deg);
  cursor: pointer;
`
const NavLinks = styled.div`
  display: block;
  width: 100%;
  height: 100%;
`
////
const Event = styled.div`
  position: absolute;
  right: 23px;
  width: 105px;
  padding: 13px 0;
  background-color: #fff;
  z-index: 9999;
  & ul {
    & li {
      padding: 7px 0;
      box-sizing: border-box;
      color: #757575;
      font-size: 14px;
      text-align: center;
      letter-spacing: -0.35px;
    }
  }
  &.on {
    display: none;
  }
`
