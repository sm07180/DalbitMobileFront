/**
 * @file auth.js
 * @brief 로그인영역
 * @todo 반응형으로 처리되어야함
 * @update contextAPI 연동
 */
import React, {useState, useEffect, useContext, useMemo} from 'react'
import styled from 'styled-components'
//hooks
import useChange from 'components/hooks/useChange'
//components
import Utility from 'components/lib/utility'
//import {GoogleLogin} from 'react-google-login'
//import KakaoLogin from 'react-kakao-login'
//import NaverLogin from 'react-naver-login'
//import FacebookLogin from 'react-facebook-login'
//context
import {Context} from 'context'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import {COLOR_MAIN, COLOR_POINT_Y} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_TABLET, WIDTH_MOBILE} from 'context/config'

const sc = require('context/socketCluster')
//import FacebookLogin from 'pages/common/auth/fbAuth'
//context

//import {switchCase} from '@babel/types'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const saveLogin = useMemo(() => {
    let cookie = Utility.getCookie('saveLogin')
    if (cookie !== undefined && cookie !== '') return true

    return false
  })

  //const [saveLogin, setSaveLogin] = useState(false)
  //const [Fbstate, setFbState] = userState({isLoggedIn: false, userID: '', name: '', email: '', picture: ''})
  const [fetch, setFetch] = useState(null)
  const {changes, setChanges, onChange} = useChange(update, {onChange: -1, phone: '', pwd: ''})

  //const [changes, setChanges] = useState({})
  let loginId = '',
    loginName = '',
    loginImg = '',
    loginPwd = '',
    loginEmail = '',
    loginNicknm = '',
    gender = ''
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj, ostype) {
    switch (ostype) {
      case 'g':
        loginId = typeof obj.additionalUserInfo.profile !== 'undefined' ? obj.additionalUserInfo.profile.id : ''
        loginName = typeof obj.additionalUserInfo.profile !== 'undefined' ? obj.additionalUserInfo.profile.name : ''
        loginImg = typeof obj.additionalUserInfo.profile !== 'undefined' ? obj.additionalUserInfo.profile.picture : ''
        break
      case 'f':
        loginId = typeof obj !== 'undefined' ? obj.userID : ''
        loginName = typeof obj !== 'undefined' ? obj.name : ''
        loginImg = typeof obj.picture !== 'undefined' ? obj.picture.data.url : ''

        break
      case 'k':
        loginId = typeof obj.profile !== 'undefined' ? obj.profile.id : ''
        loginNicknm = typeof obj.profile.properties !== 'undefined' ? obj.profile.properties.nickname : ''
        loginImg = typeof obj.profile.properties !== 'undefined' ? obj.profile.properties.profile_image : ''
        loginEmail = typeof obj.profile.properties !== 'undefined' ? obj.profile.properties.email : ''
        if (gender && typeof gender !== 'undefined') {
          gender = obj.profile.kakao_account.gender === 'male' ? 'm' : 'f'
        }
        break
      case 'n':
        loginId = typeof obj !== 'undefiend' ? obj.id : ''
        loginName = typeof obj !== 'undefiend' ? obj.name : ''
        loginNicknm = typeof obj !== 'undefiend' ? obj.nickname : '' //네이버는 닉네임이 ex) gurenn***
        loginImg = typeof obj !== 'undefiend' ? obj.profile_image : ''
        loginEmail = typeof obj !== 'undefiend' ? obj.email : ''
        if (gender && typeof gender !== 'undefined') {
          gender = obj.gender.toLowerCase()
        }
        break
      default:
        loginId = typeof obj !== 'undefiend' ? obj.phone : ''
        loginPwd = typeof obj !== 'undefiend' ? obj.pwd : ''

        if (typeof loginId === 'undefined' || !loginId) {
          context.action.alert({
            msg: '휴대폰번호를 입력해 주세요'
          })
          return
        } else if (typeof loginPwd === 'undefined' || !loginPwd) {
          context.action.alert({
            msg: '비밀번호를 입력해 주세요'
          })
          return
        }
        break
    }

    loginId = loginId.replace(/-/g, '')

    const res = await Api.member_login({
      data: {
        memType: ostype,
        memId: loginId,
        memPwd: loginPwd
      }
    })

    setFetch(res)

    const loginInfo = {
      loginID: loginId,
      loginName: loginName,
      loginNickNm: loginNicknm,
      gender: gender ? gender : 'm',
      birth: '',
      image: loginImg,
      memType: ostype,
      email: loginEmail
    }
    console.log('loginInfo = ' + JSON.stringify(loginInfo))
    if (res && res.code) {
      if (res.code == 0) {
        //Webview 에서 native 와 데이터 주고 받을때 아래와 같이 사용
        props.update({loginSuccess: res.data, changes: changes})
        // 20200220 - 김호겸 이부분에서 roomNo 값 ,즉 비회원이고 방에 들어갔다가 login 할 경우 방번호를 넣어주어야 한다.추후 처리 예정
        let pathUrl = ''
        let UserRoomNo = ''

        pathUrl = window.location.search
        UserRoomNo = pathUrl ? pathUrl.split('=')[1] : ''
        const scLoginInfo = {
          authToken: res.data.authToken,
          memNo: res.data.memNo,
          locale: Utility.locale(),
          roomNo: UserRoomNo
        }
        if (UserRoomNo != '') {
          sc.sendMessage.login(scLoginInfo)
        }

        Api.profile({params: {memNo: res.data.memNo}}).then(profileInfo => {
          if (profileInfo.result === 'success') {
            context.action.updateProfile(profileInfo.data)
          }
        })
      } else {
        context.action.alert({
          title: res.messageKey !== undefined && res.messageKey,
          msg: res.message !== undefined && res.message
        })
      }
      //alert(res.message)
    } else {
      context.action.alert({
        title: res.messageKey !== undefined && res.messageKey,
        msg: res.message !== undefined && res.message
      })
      //  console.error('서버에서 결과 코드가 안내려옴')
      context.action.updateLogin(false)
    }
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
    }
  }

  const pwdEnterkeyHandle = e => {
    if (e.keyCode == 13) {
      fetchData({...changes}, 'p')
    }
  }
  //자동로그인
  useEffect(() => {
    let cookie = Utility.getCookie('saveLogin')
    if (cookie !== undefined && cookie !== '') {
      cookie = JSON.parse(decodeURIComponent(cookie))
      setChanges({...changes, ...cookie})

      console.log(cookie)
    }
  }, [])
  useEffect(() => {}, [])

  const pwdValidateHandle = e => {
    let value = e.target.value.toLowerCase()
    let blank_pattern = value.search(/[\s]/g)
    if (blank_pattern != -1) {
      value = value.substring(0, value.length - 1)
    }
    value = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '')
    setChanges({...changes, pwd: value})
  }

  //---------------------------------------------------------------------
  return (
    <LoginWrap>
      {window.location.pathname.indexOf('/login') !== -1 ? (
        ''
      ) : (
        <Logo className="logo">
          <img src={`${IMG_SERVER}/images/api/logo_p_l.png`} />
        </Logo>
      )}
      <LoginInput>
        <input
          type="text"
          name="phone"
          placeholder="전화번호"
          onChange={e => {
            //const value = Utility.phoneAddHypen(event.target.value)
            setChanges({...changes, phone: event.target.value})
          }}
          value={changes.phone}
          autoFocus
          maxLength={11}
        />
        <input
          type="password"
          name="pwd"
          placeholder="비밀번호"
          onChange={pwdValidateHandle}
          value={changes.pwd}
          onKeyPress={() => pwdEnterkeyHandle(event)}
        />
      </LoginInput>
      <LoginSubmit
        onClick={() => {
          fetchData({...changes}, 'p')
        }}>
        로그인
      </LoginSubmit>
      <ButtonArea>
        <div>
          <button
            onClick={() => {
              props.history.push('/user/password')
              context.action.updatePopupVisible(false)
            }}>
            비밀번호 변경
          </button>
          <button
            onClick={() => {
              props.history.push('/user/join')
              context.action.updatePopupVisible(false)
            }}>
            회원가입
          </button>
        </div>
      </ButtonArea>
    </LoginWrap>
  )
}

//---------------------------------------------------------------------
const Logo = styled.div`
  padding: 0 0 50px 0;
  text-align: center;
`
const LoginWrap = styled.div`
  @media (max-width: ${WIDTH_MOBILE}) {
  }
`

const LoginInput = styled.div`
  input {
    width: 100%;
    border: 1px solid #e5e5e5;
    font-size: 16px;
    line-height: 54px;
    text-indent: 18px;
  }
  input + input {
    margin-top: 14px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    input + input {
      margin-top: 12px;
    }
  }
`
const LoginSubmit = styled.button`
  width: 100%;
  margin-top: 14px;
  background: ${COLOR_MAIN};
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  line-height: 64px;
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-top: 12px;
    line-height: 56px;
  }
`

const ButtonArea = styled.div`
  margin-top: 20px;
  padding-bottom: 10px;
  label {
    padding-left: 5px;
    color: #757575;
    line-height: 24px;
    vertical-align: top;
  }
  div {
    float: right;
    line-height: 24px;
    button {
      color: ${COLOR_MAIN};
      letter-spacing: -0.4px;
    }
    button + button::before {
      display: inline-block;
      width: 1px;
      height: 12px;
      margin: 0 10px -1px 10px;
      background: ${COLOR_MAIN};
      content: '';
    }
  }
  input[type='checkbox'] {
    position: relative;
    width: 24px;
    height: 24px;
    margin: 0 8px 0 0;
    appearance: none;
    border: none;
    outline: none;
    /* cursor: pointer; */
    background: #fff url(${IMG_SERVER}/images/api/ico-checkbox-off.png) no-repeat center center / cover;
    &:checked {
      background: #8556f6 url(${IMG_SERVER}/images/api/ico-checkbox-on.png) no-repeat center center / cover;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    label {
      padding-left: 0;
      letter-spacing: -0.5px;
    }
  }
`

const SocialLogin = styled.div`
  display: none;
  margin: 30px 0 0 0;
  div {
    float: left;
    width: 48.5%;
    height: 48px;
    margin-left: 3%;
    margin-bottom: 12px;
    background: #f5f5f5;
  }
  div:nth-child(2n + 1) {
    margin-left: 0;
  }
  &:after {
    display: block;
    clear: both;
    content: '';
  }
`
const SnsGoogleLogion = styled.button`
  padding: 10px 34px 10px 50px;
  border: 1px solid #e5e5e5;
  background: #fff url(${IMG_SERVER}/svg/ico-google.svg) no-repeat -1px -3px;
  color: #757575;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
`
