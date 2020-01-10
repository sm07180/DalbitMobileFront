/**
 * @file /user/index.js
 * @brief 회원가입
 */
import React, {useState} from 'react'
import styled from 'styled-components'

//context
import {DEVICE_MOBILE} from 'Context/config'
//layout
import Layout from 'Pages/common/layout'
//components
import JoinAuth from './content/join-auth'
import JoinForm from './content/join-form'

const User = () => {
  //---------------------------------------------------------------------
  const [joinState, setJoinState] = useState('step-one')
  //

  function joinForm() {
    switch (joinState) {
      case 'step-one':
        return <JoinAuth joinState={joinState} update={setJoinState} />
      case 'step-two':
        return <JoinForm joinState={joinState} update={setJoinState} />
      default:
        return <p>없습니다</p>
    }
  }
  //---------------------------------------------------------------------
  return (
    <Layout>
      <h1>
        <a href="/guide">회원가입</a>
      </h1>
      <Content>
        <JoinStep className={joinState}>
          <p>휴대폰 인증</p>
          <p>회원정보 입력</p>
        </JoinStep>
        <div>{joinForm()}</div>
      </Content>
    </Layout>
  )
}
export default User

const Content = styled.div`
  width: 400px;
  margin: 30px auto 100px auto;

  @media (max-width: ${DEVICE_MOBILE}) {
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
