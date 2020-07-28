/*
import React, {useContext, useState} from 'react'
import {Context} from 'context'

const store = useContext(Context)

 */
import React, {useState, useContext, createContext} from 'react'
//context
import Api from 'context/api'
import Utility from 'components/lib/utility'
import use from 'pages/setting/content/use'

//Context
const Context = createContext()
const {Provider} = Context

//
const GlobalProvider = (props) => {
  //initalize
  const DAY_COOKIE_PERIOD = 100
  //state
  //---------------------------------------------------------------------
  const [state, setState] = useState({
    title: '현재 이용현황',
    isSub: false,
    isOnCast: false
  })
  const [nativePlayer, setNativePlayer] = useState(null)
  const [message, setMessage] = useState({visible: false})
  const [roomInfo, setRoomInfo] = useState(null) //방송방정보
  const [profile, setProfile] = useState(null)
  const [customHeader, setCustomHeader] = useState(null)
  const [token, setToken] = useState(null)
  const [myInfo, setMyInfo] = useState(null)

  const [popup_code, setPopup] = useState('')
  const [popup_visible, setVisible] = useState(false)
  const [gnb_visible, setGnbVisible] = useState(false)
  const [gnb_state, setGnbState] = useState('')
  const [login_state, setlogin] = useState(false)
  const [mediaPlayerStatus, setMediaPlayerStatus] = useState(false)
  const [cast_state, setCastState] = useState(false)
  const [search, setSearch] = useState('')
  const [logoChange, setLogoChange] = useState(false)
  const [player, setPlayer] = useState(false) //Player상태
  const [mypageReport, setMypageReport] = useState(false)
  const [mypageFanCnt, setMypageFanCnt] = useState('')
  const [close, setClose] = useState(false)
  const [closeFanCnt, setCloseFanCnt] = useState(false)
  const [closeStarCnt, setCloseStarCnt] = useState(false)
  const [closePresent, setClosePresent] = useState(false)
  const [boardNumber, setBoardNumber] = useState('')
  const [noticeIndexNum, setNoticeIndexNum] = useState('')
  const [bannerCheck, setBannerCheck] = useState(false)
  //
  const [news, setNews] = useState(false)
  const [sticker, setSticker] = useState(false)
  const [stickerMsg, setStickerMsg] = useState({})
  const [fanBoardBigIdx, setFanBoardBigIdx] = useState(0)
  const [toggleState, setToggleState] = useState(false)
  const [replyIdx, setReplyIdx] = useState(false)
  const [noticeState, setNoticeState] = useState(false)
  const [reportDate, setReportDate] = useState({
    type: 0,
    prev: '',
    next: ''
  })
  const [walletIdx, setWalletIdx] = useState(0)
  const [nativeTid, setNativeTid] = useState('init')
  const [fanTab, setFanTab] = useState(0)
  const [fanEdite, setFanEdite] = useState(false)
  const [fanEditeLength, setFanEditeLength] = useState(-1)
  //---------------------------------------------------------------------
  const action = {
    updateState: (obj) => {
      setState((state) => ({...state, ...obj}))
    },
    /**
     * @brief 뉴스알림(종모양)
     */
    updateNews: (bool) => {
      setNews(bool)
    },
    /**
     * @brief 스티커팝업(종모양)
     */
    updateSticker: (bool) => {
      setSticker(bool)
    },
    /**
     * @brief 스티커팝업정보
     */
    updateStickerMsg: (obj) => {
      setStickerMsg(obj)
    },
    /**
     * @brief customHeader
     */
    updateCustomHeader: (obj) => {
      if (obj) {
        const stringified = JSON.stringify(obj)
        Api.setCustomHeader(stringified)
        Utility.setCookie('custom-header', '', -1)
        Utility.setCookie('custom-header', stringified, DAY_COOKIE_PERIOD)
        setCustomHeader({...obj})
      } else {
        Api.setCustomHeader(null)
        Utility.setCookie('custom-header', '', -1)
        Utility.setCookie('custom-header', '', DAY_COOKIE_PERIOD)
        setCustomHeader(null)
      }
    },
    /**
     * @brief authToken 및 login여부
     * @param string authToken                  // authToken
     * @param string memNo                      // 회원번호
     * @param bool isLogin                      // 로그인 여부
     */
    updateToken: (obj) => {
      if (obj) {
        const {authToken, memNo} = obj
        const firstLetterOfMemNo = String(memNo)[0]
        const isOAuth = firstLetterOfMemNo !== '1' || firstLetterOfMemNo !== '8'
        Api.setAuthToken(authToken)
        Utility.setCookie('authToken', '', -1)
        Utility.setCookie('authToken', authToken, DAY_COOKIE_PERIOD)
        setToken({...obj, isOAuth})
      } else {
        Api.setAuthToken(null)
        Utility.setCookie('authToken', '', -1)
        Utility.setCookie('authToken', '', DAY_COOKIE_PERIOD)
        setToken(null)
      }
    },

    /**
     * @brief 입장한방, 생성한방 정보업데이트
     */
    updateRoomInfo: (obj) => {
      setRoomInfo(obj)
    },
    /**
     * @brief Native->Player실행
     * @param string roomNo
     * @param string bjNickNm
     * @param string title
     * @param string bjProfImg
     */
    updateNativePlayer: (obj) => {
      setNativePlayer({...obj})
    },
    updateProfile: (profile) => {
      setProfile(profile)
    },
    //팝업컨텐츠
    updatePopup: (str, terms) => {
      setPopup([str, terms])
      //팝업
      setVisible(true)
    },
    //팝업 visible
    updatePopupVisible: (bool) => {
      setVisible(bool)
    },
    //GNB 열고 닫기
    updateGnbVisible: (bool) => {
      if (!bool) document.body.classList.remove('on')
      setGnbVisible(bool)
    },
    //GNB 열릴때 메뉴 타입 상태

    updateGnbState: (str) => {
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
    alert: (obj) => {
      setMessage({type: 'alert', visible: true, ...obj})
    },
    /**
     * 시스템팝업(레이어구성)
     * @param {msg} 메시지영역
     */
    confirm: (obj) => {
      const {msg} = obj
      setMessage({type: 'confirm', visible: true, ...obj})
    },
    //login 상태
    updateLogin: (bool) => {
      setlogin(bool)
      setGnbVisible(false)
    },
    /**
     * 오디오 글로벌 플레이어 상태
     * @param boolean status
     */
    updateMediaPlayerStatus: (status) => {
      setMediaPlayerStatus(status)
      //flase 일때 쿠키삭제
      if (!status) {
        Utility.setCookie('native-player-info', '', -1)
      }
    },
    /**
     * 오디오 글로벌 플레이어 상태
     * @param boolean status
     */
    updatePlayer: (bool) => {
      setPlayer(bool)
      //flase 일때 쿠키삭제
      if (!bool) {
        Utility.setCookie('native-player-info', '', -1)
      }
    },
    //
    /**
     * 방생성 후 방정보 가지고있음, 방 종료시 사라짐
     * @param {roomNo} string
     */
    updateCastState: (str) => {
      setCastState(str)
    },
    updateSearch: (str) => {
      setSearch(str)
    },
    updateLogoChange: (status) => {
      setLogoChange(status)
    },
    updateMypageReport: (bool) => {
      setMypageReport(bool)
    },
    updateMypageFanCnt: (str) => {
      setMypageFanCnt(str)
    },
    updateClose: (bool) => {
      setClose(bool)
    },
    updateCloseFanCnt: (bool) => {
      setCloseFanCnt(bool)
    },
    updateCloseStarCnt: (bool) => {
      setCloseStarCnt(bool)
    },
    updateClosePresent: (bool) => {
      setClosePresent(bool)
    },
    updateBoardNumber: (num) => {
      setBoardNumber(num)
    },
    updatenoticeIndexNum: (num) => {
      setNoticeIndexNum(num)
    },
    updateBannerCheck: (bool) => {
      setBannerCheck(bool)
    },
    updateMyInfo: (obj) => {
      setMyInfo(obj)
    },
    updateFanBoardBigIdxMsg: (num) => {
      setFanBoardBigIdx(num)
    },
    updateToggleAction: (bool) => {
      setToggleState(bool)
    },
    updateReplyIdx: (bool) => {
      setReplyIdx(bool)
    },
    updateNoticeState: (bool) => {
      setNoticeState(bool)
    },
    updateReportDate: (string) => {
      setReportDate(string)
    },
    updateWalletIdx: (num) => {
      setWalletIdx(num)
    },
    updateNativeTid: (string) => {
      setNativeTid(string)
    },
    updateFanTab: (num) => {
      setFanTab(num)
    },
    updateFanEdite: (boolean) => {
      setFanEdite(boolean)
    },
    updateFanEditeLength: (number) => {
      setFanEditeLength(number)
    }
  }
  //---------------------------------------------------------------------
  const value = {
    state,
    news,
    sticker,
    stickerMsg,
    roomInfo,
    nativePlayer,
    profile,
    myInfo,
    message,
    token,
    customHeader,
    login_state,
    popup_code,
    popup_visible,
    gnb_visible,
    gnb_state,
    mediaPlayerStatus,
    cast_state,
    search,
    action,
    logoChange,
    player,
    mypageReport,
    mypageFanCnt,
    close,
    closeFanCnt,
    closeStarCnt,
    closePresent,
    boardNumber,
    noticeIndexNum,
    bannerCheck,
    fanBoardBigIdx,
    toggleState,
    replyIdx,
    noticeState,
    reportDate,
    walletIdx,
    nativeTid,
    fanTab,
    fanEdite,
    fanEditeLength
  }
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GlobalProvider}
