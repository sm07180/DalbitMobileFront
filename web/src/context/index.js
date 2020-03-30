/*
import React, {useContext, useState} from 'react'
import {Context} from 'context'

const store = useContext(Context)

 */
import React, {useState, useContext, createContext} from 'react'
//context
import API from 'context/api'
import Utility from 'components/lib/utility'

//Context
const Context = createContext()
const {Provider} = Context

//
const GlobalProvider = props => {
  //initalize
  const DAY_COOKIE_PERIOD = 100
  //state
  //---------------------------------------------------------------------
  const [state, setState] = useState({title: '현재 이용현황', isSub: false, isOnCast: false})
  const [nativePlayer, setNativePlayer] = useState(null)
  const [message, setMessage] = useState({visible: false})
  const [roomInfo, setRoomInfo] = useState(null) //방송방정보
  const [mypage, setMypage] = useState(null) //마이페이지(회원정보)
  const [profile, setProfile] = useState(null)
  const [customHeader, setCustomHeader] = useState(null)
  const [token, setToken] = useState(null)
  const [popup_code, setPopup] = useState('')
  const [popup_visible, setVisible] = useState(false)
  const [gnb_visible, setGnbVisible] = useState(false)
  const [gnb_state, setGnbState] = useState('')
  const [login_state, setlogin] = useState(false)
  const [mediaHandler, setMediaHandler] = useState(null)
  const [mediaPlayerStatus, setMediaPlayerStatus] = useState(false)
  const [broadcastTotalInfo, setBroadcastTotalInfo] = useState(null) //create 2020.02.28 김호겸 - 방송방 reToken 정보
  const [cast_state, setCastState] = useState(false) // 방장이 방종료할때까지 가지고 있는 값. GNB 방송하기->방송중 표현시 사용 create 2020.03.04 이은비
  const [common, setCommon] = useState() //공통코드
  const [search, setSearch] = useState('')
  const [roomReady, setRoomReady] = useState(false)
  const [reloadType, setReloadType] = useState(0)
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
      Utility.setCookie('custom-header', '', -1)
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
      Utility.setCookie('authToken', '', -1)
      Utility.setCookie('authToken', authToken, DAY_COOKIE_PERIOD)
      setToken(obj)
    },
    /**
     * @brief 입장한방, 생성한방 정보업데이트
     */
    updateRoomInfo: obj => {
      setRoomInfo(obj)
    },
    /**
     * @brief 마이페이지 업데이트
     * @param object obj                        //마이페이지
     */
    updateMypage: obj => {
      setMypage(obj)
    },
    /**
     * @brief Native->Player실행
     * @param string roomNo
     * @param string bjNickNm
     * @param string title
     * @param string bjProfImg
     */
    updateNativePlayer: obj => {
      setNativePlayer(obj)
    },
    updateProfile: profile => {
      setProfile(profile)
    },
    //팝업컨텐츠
    updatePopup: (str, terms) => {
      setPopup([str, terms])
      //팝업
      setVisible(true)
    },
    //팝업 visible
    updatePopupVisible: bool => {
      setVisible(bool)
    },
    //GNB 열고 닫기
    updateGnbVisible: bool => {
      if (!bool) document.body.classList.remove('on')
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
    /**
     * 시스템팝업(레이어구성)
     * @param {msg} 메시지영역
     */
    alert: obj => {
      const {msg} = obj
      setMessage({type: 'alert', visible: true, ...obj})
    },
    /**
     * 시스템팝업(레이어구성)
     * @param {msg} 메시지영역
     */
    confirm: obj => {
      const {msg} = obj
      setMessage({type: 'confirm', visible: true, ...obj})
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

    /**
     * 오디오 글로벌 플레이어 상태
     * @param boolean status
     */
    updateMediaPlayerStatus: status => {
      setMediaPlayerStatus(status)
      //flase 일때 쿠키삭제
      if (!status) {
        Utility.setCookie('native-player-info', '', -1)
      }
    },
    /**
     * 방송방 토큰 재생성
     * @breif 방들어올때,생성할때
     */
    updateBroadcastTotalInfo: obj => {
      setBroadcastTotalInfo(broadcastTotalInfo => ({...broadcastTotalInfo, ...obj}))
    },
    //
    /**
     * 방생성 후 방정보 가지고있음, 방 종료시 사라짐
     * @param {roomNo} string
     */
    updateCastState: str => {
      setCastState(str)
    },
    //공통코드 live 진입 시 context에 저장  * /splash api 참조 *
    updateCommon: obj => {
      setCommon(obj)
    },
    updateSearch: str => {
      setSearch(str)
    },
    updateRoomReady: bool => {
      setRoomReady(bool)
    },
    updateReloadType: num => {
      setReloadType(num)
    }
  }
  //---------------------------------------------------------------------
  const value = {
    state,
    roomInfo,
    nativePlayer,
    mypage,
    profile,
    message,
    token,
    customHeader,
    login_state,
    popup_code,
    popup_visible,
    gnb_visible,
    gnb_state,
    mediaHandler,
    mediaPlayerStatus,
    broadcastTotalInfo,
    cast_state,
    common,
    search,
    action,
    roomReady,
    reloadType
  }
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GlobalProvider}
