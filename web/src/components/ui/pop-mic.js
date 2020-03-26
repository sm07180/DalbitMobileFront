import React, {useState, useContext} from 'react'
import {WIDTH_MOBILE} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'

export default props => {
  const context = useContext(Context)
  return (
    <>
      <MicCheckWrap>
        <CheckDetail>
          달빛 라이브는 별도의 프로그램 설치 없이 방송이 가능한 실시간 오디오 스트리밍 플랫폼 입니다. 따라서 방송을 시작하시기 전
          마이크 권한 설정을 확인해주시길 바랍니다.
        </CheckDetail>
        <CheckWarnning>마이크 연결이 되어있지 않은 사용자는 방송을 시작 할 수 없습니다.</CheckWarnning>
      </MicCheckWrap>

      <BackBTN
        onClick={() => {
          context.action.updatePopupVisible(false)
          props.history.push('/')
        }}>
        돌아가기
      </BackBTN>
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
