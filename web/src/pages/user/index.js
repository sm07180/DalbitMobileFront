/**
 * @file /user/index.js
 * @brief 회원가입
 */
import React, {useState} from 'react'
import styled from 'styled-components'

//layout
import Layout from 'Pages/common/layout'
//components
import JoinAuth from './content/join-auth'
import JoinForm from './content/join-form'

const User = () => {
  //---------------------------------------------------------------------
  const [joinState, setJoinState] = useState(true)
  //A

  function joinForm() {
    switch (true) {
      case joinState:
        return <JoinForm />
      default:
        return <JoinAuth update={setJoinState} />
    }
  }
  //---------------------------------------------------------------------
  return (
    <Layout>
      <h1>
        <a href="/guide">회원가입</a>
      </h1>

      <JoinWrap>
        <JoinStep>
          <p>휴대폰 인증</p>
          <p>회원정보 입력</p>
        </JoinStep>

        <div>{joinForm()}</div>
      </JoinWrap>
    </Layout>
  )
}
export default User

const JoinWrap = styled.div`
  width: 400px;
  margin: 30px auto;
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
  p + p:before {
    position: absolute;
    left: -10px;
    content: '>';
  }
`
