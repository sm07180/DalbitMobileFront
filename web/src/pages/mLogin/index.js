import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Link, Switch, Redirect} from 'react-router-dom'

// context
import {Context} from 'context'

// static
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'

export default props => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  const inputPhoneRef = useRef()
  const inputPasswordRef = useRef()
  // const [phoneNum, setPhoneNum] = useState('')
  // const [password, setPassword] = useState('')
  const [fetching, setFetching] = useState(false)
  const [phoneNum, setPhoneNum] = useState('01071825603')
  const [password, setPassword] = useState('1234qwer')

  const changePhoneNum = e => {
    const target = e.currentTarget
    setPhoneNum(target.value.toLowerCase())
  }

  const changePassword = e => {
    const target = e.currentTarget
    setPassword(target.value.toLowerCase())
  }

  const clickLoginBtn = () => {
    if (fetching) {
      return
    }

    const fetchPhoneLogin = async (phone, pw) => {
      setFetching(true)
      const loginInfo = await Api.member_login({
        data: {
          memType: 'p',
          memId: phone,
          memPwd: pw
        }
      })

      if (loginInfo.result === 'success') {
        const {data} = loginInfo
        globalCtx.action.updateToken(data)

        const {memNo} = data
        const profileInfo = await Api.profile({params: {memNo}})
        if (profileInfo.result === 'success') {
          const {data} = profileInfo
          globalCtx.action.updateProfile(data)
          props.history.push('/new')
        }
      }
      setFetching(false)
    }

    const inputPhoneNode = inputPhoneRef.current
    const inputPasswordNode = inputPasswordRef.current

    if (phoneNum === '') {
      inputPhoneNode.focus()
    } else if (password === '') {
      inputPasswordNode.focus()
    } else {
      fetchPhoneLogin(phoneNum, password)
    }
  }

  useEffect(() => {}, [])

  return (
    <Switch>
      {token.isLogin ? (
        <Redirect to={`/new`} />
      ) : (
        <Login>
          <div>
            <Link to="/new">
              <img className="logo" src={`${IMG_SERVER}/images/api/logo_p_l.png`} />
            </Link>
          </div>

          <div className="input-wrap">
            <input
              ref={inputPhoneRef}
              type="text"
              autoComplete="off"
              placeholder="전화번호"
              value={phoneNum}
              onChange={changePhoneNum}
            />
            <input
              ref={inputPasswordRef}
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호"
              value={password}
              onChange={changePassword}
            />
            <button className="login-btn" onClick={clickLoginBtn}>
              로그인
            </button>
          </div>

          <div className="link-wrap">
            <Link to="/user/password">
              <div className="link-text">비밀번호 변경</div>
            </Link>
            <div className="bar" />
            <Link to="/user/join">
              <div className="link-text">회원가입</div>
            </Link>
          </div>
        </Login>
      )}
    </Switch>
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
