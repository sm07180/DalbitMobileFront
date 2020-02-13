/*
import React, {useContext, useState} from 'react'
import {Context} from 'context'

const store = useContext(Context)

 */
import React, {useEffect, useState, createContext, useMemo} from 'react'
import API from 'context/api'
//Context
const Context = createContext()
const {Provider} = Context
import Utility from 'components/lib/utility'
//
const GlobalProvider = props => {
  //initalize
  const DAY_COOKIE_PERIOD = '365'
  //state
  //---------------------------------------------------------------------
  const [state, setState] = useState({title: '현재 이용현황', isSub: false, footer: true})
  const [customHeader, setCustomHeader] = useState(null)
  const [token, setToken] = useState(null)
  const [popup_code, setPopup] = useState('')
  const [popup_visible, setVisible] = useState(false)
  const [gnb_visible, setGnbVisible] = useState(false)
  const [gnb_state, setGnbState] = useState('')
  const [login_state, setlogin] = useState(false)
  const [mediaHandler, setMediaHandler] = useState(null)
  const [mediaPlayerStatus, setMediaPlayerStatus] = useState(false)

  //---------------------------------------------------------------------
  const action = {
    //updateState
    updateState: obj => {
      setState(state => ({...state, ...obj}))
    },
    //updateCustomHeader
    /**
     * @brief customHeader, Server->React
     * @param string locale                  // 국가코드
     * @param string deviceId                // 디바이스 ID
     * @param string os                      // OS
     * @param string language                // 언어
     * @param string deviceToken             // 디바이스토큰
     */
    updateCustomHeader: obj => {
      API.setCustomHeader(JSON.stringify(obj))
      Utility.setCookie('custom-header', JSON.stringify(obj), DAY_COOKIE_PERIOD)
      setCustomHeader(obj)
    },
    /**
     * @brief 토큰업데이트, authToken 및 login여부
     * @param string authToken                  // authToken
     * @param string memNo                      // 회원번호
     * @param bool isLogin                      // 로그인 여부
     */
    updateToken: obj => {
      const {authToken} = obj
      API.setAuthToken(authToken)
      Utility.setCookie('authToken', authToken, DAY_COOKIE_PERIOD)
      setToken(obj)
    },
    //팝업컨텐츠
    updatePopup: str => {
      setPopup(str)
      //팝업
      setVisible(true)
    },
    //팝업 visible
    updatePopupVisible: bool => {
      setVisible(bool)
    },
    //GNB 열고 닫기
    updateGnbVisible: bool => {
      setGnbVisible(bool)
    },
    //GNB 열릴때 메뉴 타입 상태
    /**
     * search, mypage, notice, menu
     */
    updateGnbState: str => {
      setGnbState(str)
      //render 후 애니메이션 처리
      setTimeout(() => {
        setGnbVisible(!gnb_visible)
      }, 10)
    },
    //login 상태
    updateLogin: bool => {
      setlogin(bool)
      setGnbVisible(false)
    },
    // 오디오 정보
    updateMediaHandler: instance => {
      setMediaHandler(instance)
    },
    // 오디오 글로벌 플레이어 상태
    updateMediaPlayerStatus: status => {
      setMediaPlayerStatus(status)
    }
  }
  //---------------------------------------------------------------------
  const value = {
    state,
    token,
    customHeader,
    login_state,
    popup_code,
    popup_visible,
    gnb_visible,
    gnb_state,
    mediaHandler,
    mediaPlayerStatus,

    action
  }
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GlobalProvider}
