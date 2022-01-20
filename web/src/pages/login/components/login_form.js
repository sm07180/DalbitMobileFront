import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'

import Header from './header'
import {Hybrid, isHybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'
import logoW from '../static/logo_w_no_symbol.svg'
import backW from '../static/back_w.svg'

export default function login_form({props, setLoginPop}) {
  const globalCtx = useContext(Context)
  const history = useHistory()

  const {webview, redirect} = qs.parse(location.search)

  const inputPhoneRef = useRef()
  const inputPasswordRef = useRef()

  const [fetching, setFetching] = useState(false)
  const [phoneNum, setPhoneNum] = useState('')
  const [password, setPassword] = useState('')

  const closePopup = () => {
    setLoginPop(false)
  }
  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const changePhoneNum = (e) => {
    const target = e.currentTarget
    setPhoneNum(target.value.toLowerCase())
  }

  const changePassword = (e) => {
    const target = e.currentTarget
    setPassword(target.value.toLowerCase())
  }

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      history.goBack()
      // window.location.href = '/'
    }
  }

  const clickLoginBtn = () => {
    if (fetching) {
      return
    }
    let sessionRoomNo = sessionStorage.getItem('room_no')
    if (sessionRoomNo === undefined || sessionRoomNo === null) {
      sessionRoomNo = Utility.getCookie('listen_room_no')
      if (sessionRoomNo === undefined || sessionRoomNo === null) {
        sessionRoomNo = ''
      }
    }

    const fetchPhoneLogin = async (phone, pw) => {
      setFetching(true)
      const loginInfo = await Api.member_login({
        data: {
          memType: 'p',
          memId: phone,
          memPwd: pw,
          room_no: sessionRoomNo
        }
      })

      if (loginInfo.result === 'success') {
        const {memNo} = loginInfo.data

        console.log('login success')
        //--##
        /**
         * @마이페이지 redirect
         */
        let mypageURL = ''
        const _parse = qs.parse(location.search)
        if (_parse !== undefined && _parse.mypage_redirect === 'yes') {
          mypageURL = `/mypage/${memNo}`
          if (_parse.mypage !== '/') mypageURL = `/mypage/${memNo}${_parse.mypage}`
        }

        globalCtx.action.updateToken(loginInfo.data)
        const profileInfo = await Api.profile({params: {memNo}})
        const myInfo = await Api.mypage()
        setTimeout(() => {
          fetchAdmin()
        }, 10)

        if (profileInfo.result === 'success') {
          if (isHybrid()) {
            if (webview && webview === 'new') {
              Hybrid('GetLoginTokenNewWin', loginInfo.data)
            } else {
              Hybrid('GetLoginToken', loginInfo.data)
            }
          }

          if (redirect) {
            const decodedUrl = decodeURIComponent(redirect)
            return (window.location.href = decodedUrl)
          }

          globalCtx.action.updateProfile(profileInfo.data) // 타인/내정보 update
          globalCtx.action.updateMyInfo(myInfo.data) // 내정보 update
          globalCtx.action.updateIsMailboxOn(profileInfo.data.isMailboxOn)

          //--##마이페이지 Redirect
          if (mypageURL !== '') {
            return (window.location.href = mypageURL)
          }

          if (props.location.state) {
            return (window.location.href = `/${props.location.state.state}`)
          }
          return props.history.push('/')
        }
      } else if (loginInfo.result === 'fail') {
        if (loginInfo.code === '-1') {
          globalCtx.action.alert({
            msg: `아이디(전화번호)와 비밀번호를 확인하고 다시 로그인해주세요.`
          })
        } else if (loginInfo.code === '-3' || loginInfo.code === '-5') {
          let msg = loginInfo.data.opMsg
          if (msg === undefined || msg === null || msg === '') {
            msg = loginInfo.message
          }
          globalCtx.action.alert({
            title: '달빛라이브 사용 제한',
            msg: `${msg}`,
            callback: () => {
              if (webview && webview === 'new') {
                Hybrid('CloseLayerPopUp')
              }
            }
          })
        } else if (loginInfo.code === '-6') {
          globalCtx.action.confirm({
            msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
            callback: () => {
              const callResetListen = async (mem_no) => {
                const fetchResetListen = await Api.postResetListen({
                  memNo: mem_no
                })
                if (fetchResetListen.result === 'success') {
                  setTimeout(() => {
                    setFetching(false)
                    clickLoginBtn()
                  }, 700)
                } else {
                  globalCtx.action.alert({
                    msg: `${fetchResetListen.message}`
                  })
                  setFetching(false)
                }
              }
              callResetListen(loginInfo.data.memNo)
            }
          })
        } else {
          globalCtx.action.alert({
            title: '로그인 실패',
            msg: `${loginInfo.message}`
          })
        }
      }

      setFetching(false)
    }

    const inputPhoneNode = inputPhoneRef.current
    const inputPasswordNode = inputPasswordRef.current

    if (phoneNum === '' && password === '') {
      globalCtx.action.alert({
        msg: `아이디(전화번호)와 비밀번호를 입력하고 다시 로그인해주세요.`,
        callback: () => {
          inputPhoneNode.focus()
        }
      })
    } else if (phoneNum === '' && password !== '') {
      globalCtx.action.alert({
        msg: `아이디(전화번호)를 입력하고 다시 로그인해주세요.`,
        callback: () => {
          inputPhoneNode.focus()
        }
      })
    } else if (password === '' && phoneNum !== '') {
      globalCtx.action.alert({
        msg: `비밀번호를 입력하고 다시 로그인해주세요.`,
        callback: () => {
          inputPasswordNode.focus()
        }
      })
    } else {
      fetchPhoneLogin(phoneNum, password)
    }
  }

  useEffect(() => {
    if (window.sessionStorage) {
      const exceptionList = ['room_no', 'room_info', 'push_type']
      Object.keys(window.sessionStorage).forEach((key) => {
        if (!exceptionList.includes(key)) {
          sessionStorage.removeItem(key)
        }
      })
    }

    if (globalCtx.nativeTid == 'init') {
      if (isHybrid()) {
        Hybrid('getNativeTid')
      } else if (!isHybrid()) {
        globalCtx.action.updateNativeTid('')
      }
    }
  }, [globalCtx.nativeTid])

  //admincheck
  const fetchAdmin = async () => {
    const adminFunc = await Api.getAdmin()
    if (adminFunc.result === 'success') {
      globalCtx.action.updateAdminChecker(true)
    } else if (adminFunc.result === 'fail') {
      globalCtx.action.updateAdminChecker(false)
    }
  }

  return (
    <div id="appLogin" onClick={closePopupDim}>
      <div className="loginContainer">
        <Header title="로그인" leftCtn="backBtn"/>
        <div className="content" onClick={(e) => e.stopPropagation()}>
          <div className="inputWrap">
            <input
              ref={inputPhoneRef}
              type="number"
              className='loginInput'
              // autoComplete="off"
              placeholder="휴대폰 번호"
              value={phoneNum}
              onChange={changePhoneNum}
              onKeyDown={(e) => {
                const {keyCode} = e
                // Number 96 - 105 , 48 - 57
                // Delete 8, 46
                // Tab 9
                if (
                  keyCode === 9 ||
                  keyCode === 8 ||
                  keyCode === 46 ||
                  (keyCode >= 48 && keyCode <= 57) ||
                  (keyCode >= 96 && keyCode <= 105)
                ) {
                  return
                }
                e.preventDefault()
              }}
            />
            <input
              ref={inputPasswordRef}
              type="password"
              className='loginInput'
              // autoComplete="new-password"
              placeholder="비밀번호"
              value={password}
              onChange={changePassword}
            />
            <button className={`loginBtn ${phoneNum && password ? "active" : "" }`} onClick={clickLoginBtn}>
              로그인
            </button>
          </div>

          <div className="linkWrap">  
            <div className="linkText" onClick={}>회원가입</div>          
            <div className="linkText" onClick={() => history.push('/password')}>비밀번호 재설정</div>
          </div>
        </div>
      </div>
    </div>
  )
}
