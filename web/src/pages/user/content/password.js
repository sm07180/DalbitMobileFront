/**
 * @file /user/index.js
 * @brief 회원가입
 */
import React, {useState} from 'react'
import styled from 'styled-components'

//context
import {WIDTH_TABLET} from 'Context/config'
//layout
import Layout from 'Pages/common/layout'
//components
import PasswordAuth from './join-auth'
import PasswordForm from './password-form'

const User = props => {
  //---------------------------------------------------------------------
  //useState
  const [stepState, setStepState] = useState('step-one')

  function passwordForm() {
    switch (stepState) {
      case 'step-one':
        return <PasswordAuth joinState={stepState} update={setStepState} />
      case 'step-two':
        return <PasswordForm joinState={stepState} update={setStepState} {...props} />
      default:
        return <p>없습니다</p>
    }
  }
  //---------------------------------------------------------------------
  return (
    <Content>
      <JoinStep className={stepState}>
        <p>1. 휴대폰 인증</p>
        <p>2. 비밀번호 변경</p>
      </JoinStep>
      <div>{passwordForm()}</div>
    </Content>
  )
}
export default User

const Content = styled.div`
  width: 400px;
  margin: 30px auto 100px auto;

  @media (max-width: ${WIDTH_TABLET}) {
    width: 90%;
  }
`
const JoinStep = styled.div`
  margin-bottom: 30px;
  p {
    display: inline-block;
    position: relative;
    width: 50%;
    box-sizing: border-box;
    font-size: 18px;
    text-align: center;
  }
  p.on {
  }
  p + p:before {
    position: absolute;
    left: -10px;
    content: '>';
  }
  &.step-one p:nth-child(1),
  &.step-two p:nth-child(2) {
    color: #1a369a;
    font-weight: 700;
  }
`
