import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

// context
import {Context} from 'context'

// static
import {IMG_SERVER} from 'context/config'

export default props => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  console.log(token)

  if (token.isLogin) {
    props.history.push('/')
    return null
  }

  return (
    <Login>
      <div>
        <Link to="/new">
          <img className="logo" src={`${IMG_SERVER}/images/api/ic_logo_normal.png`} />
        </Link>
      </div>

      <div className="input-wrap">
        <input type="text" autoComplete="off" placeholder="전화번호" />
        <input type="password" autoComplete="new-password" placeholder="비밀번호" />
        <button className="login-btn">로그인</button>
      </div>

      <div className="link-wrap">
        <div className="link-text">비밀번호 변경</div>
        <div className="bar" />
        <div className="link-text">회원가입</div>
      </div>
    </Login>
  )
}

const Login = styled.div`
  margin: 0 10px;
  .logo {
    display: block;
    margin: 0 auto;
    padding: 30px 0 50px;
    width: 60%;
    max-width: 220px;
  }

  .input-wrap {
    input {
      display: block;
      border: 1px solid #e5e5e5;
      padding: 16px;
      width: 100%;
      height: 56px;
    }
    input[type='password'] {
      margin-top: 12px;
    }
    .login-btn {
      display: block;
      margin-top: 12px;
      width: 100%;
      background-color: #8556f6;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      padding: 21px 0;
    }
  }

  .link-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 26px 0;

    .link-text {
      color: #8556f6;
      font-size: 16px;
      letter-spacing: -0.4px;
    }

    .bar {
      width: 1px;
      height: 16px;
      background-color: #e5e5e5;
      margin: 0 15px;
    }
  }
`
