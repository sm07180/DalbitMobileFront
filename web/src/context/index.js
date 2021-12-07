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
import {convertDateFormat} from 'components/lib/dalbit_moment'
import {convertMonday} from 'pages/common/rank/rank_fn'

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
  const [userReport, setUserReport] = useState({state: false, targetMemNo: "", targetNickName: ""})
  const [mypageFanCnt, setMypageFanCnt] = useState('')
  const [close, setClose] = useState(false)
  const [closeFanCnt, setCloseFanCnt] = useState(false)
  const [closeStarCnt, setCloseStarCnt] = useState(false)
  const [closeGoodCnt, setCloseGoodCnt] = useState(false)
  const [closePresent, setClosePresent] = useState(false)
  const [closeSpeical, setCloseSpecial] = useState(false)
  const [closeRank, setCloseRank] = useState(false)
  const [closeFanRank, setCloseFanRank] = useState(false)
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
  const [editImage, setEditImage] = useState(null)
  const [tempImage, setTempImage] = useState(null)
  const [walletIdx, setWalletIdx] = useState(0)
  const [nativeTid, setNativeTid] = useState('init')
  const [fanTab, setFanTab] = useState(0)
  const [fanEdite, setFanEdite] = useState(false)
  const [fanEditeLength, setFanEditeLength] = useState(-1)
  const [selectFanTab, setSelectFanTab] = useState(0)
  const [editeToggle, setEditeToggle] = useState(false)
  const [ctxDeleteList, stCtxDeleteList] = useState('')
  const [attendStamp, setAttendStamp] = useState(true)
  //adminCheck
  const [adminChecker, setAdminChecker] = useState(false)
  //mypageInfo
  const [mypageInfo, setMypageInfo] = useState('')
  const [fanboardReply, setFanboardReply] = useState(false)
  const [fanboardReplyNum, setFanboardReplyNum] = useState(false)
  //clip
  const [clipMainSort, setClipMainSort] = useState(6)
  const [clipMainDate, setClipMainDate] = useState(0)
  const [clipRefresh, setClipRefresh] = useState(false)
  const [clipTab, setClipTab] = useState(0)
  const [clipType, setClipType] = useState([])
  const [urlStr, setUrlStr] = useState('')
  const [boardIdx, setBoardIdx] = useState(-1)
  const [boardModifyInfo, setBoardModifyInfo] = useState(null)
  //clipPlayer
  const [clipState, setClipState] = useState(false)
  const [clipPlayerState, setClipPlayerState] = useState(null)
  const [clipPlayerInfo, setClipPlayerInfo] = useState(null)
  //
  // const [isDevIp, setIsDevIp] = useState(false)
  const [roomType, setRoomType] = useState('')
  //back
  const [backState, setBackState] = useState(null)
  const [backFunction, setBackFunction] = useState({name: ''})
  //selfauth
  const [selfAuth, setSelfAuth] = useState(false)
  //splash
  const [splash, setSplash] = useState(null)
  //isMailboxNew
  const [isMailboxNew, setIsMailboxNew] = useState(false)
  const [useMailbox, setUseMailbox] = useState(false)
  const [isMailboxOn, setIsMailboxOn] = useState(true)
  // 주간 클립 테이블
  const [dateState, setDateState] = useState(convertDateFormat(convertMonday(), 'YYYY-MM-DD'))
  //---------------------------------------------------------------------
  const [multiViewer, setMultiviewer] = useState({show: false}) // {show:bool, list?:array, initSlide?:number}

  // bestDJ 데이터
  const [bestDjData, setBestDjData] = useState([]);

  // 본인인증 ref
  const [authRef, setAuthRef] = useState(null);
  // 14세 미만 페이지
  const [noServiceInfo, setNoServiceInfo] = useState({
    showPageYn: "",
    americanAge: 0,
    limitAge: 14,
    passed: false,
  });

  // 앱 버전 체크 (회원가입 생년월일)
  const [appInfo, setAppInfo] = useState({
    os: "",
    version: "",
    showBirthForm: true,
  });

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
    updatePopup: (str, terms, pageName) => {
      setPopup([str, terms, pageName])
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

    alert_no_close: (obj) => {
      const {msg} = obj
      setMessage({type: 'alert_no_close', visible: true, ...obj})
    },

    /**
     * 시스템팝업(토스트)
     * @param {msg} 메시지영역
     */
    toast: (obj) => {
      setMessage({type: 'toast', visible: true, ...obj})
    },
    /**
     * 시스템팝업(레이어구성)
     * @param {msg} 메시지영역
     */
    confirm: (obj) => {
      const {msg} = obj
      setMessage({type: 'confirm', visible: true, ...obj})
    },

    confirm_admin: (obj) => {
      const {msg} = obj
      setMessage({type: 'confirm_admin', visible: true, ...obj})
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
    updateUserReport: (bool) => {
      setUserReport(bool)
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
    updateCloseGoodCnt: (bool) => {
      setCloseGoodCnt(bool)
    },
    updateClosePresent: (bool) => {
      setClosePresent(bool)
    },
    updateCloseSpecial: (bool) => {
      setCloseSpecial(bool)
    },
    updateCloseRank: (bool) => {
      setCloseRank(bool)
    },
    updateCloseFanRank: (bool) => {
      setCloseFanRank(bool)
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
    updateTempImage: (obj) => {
      setTempImage(obj)
    },
    updateEditImage: (obj) => {
      setEditImage(obj)
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
    },
    updateSelectFanTab: (number) => {
      setSelectFanTab(number)
    },
    updateEditeToggle: (boolean) => {
      setEditeToggle(boolean)
    },
    updateCtxDeleteList: (string) => {
      stCtxDeleteList(string)
    },
    updateAttendStamp: (boolean) => {
      setAttendStamp(boolean)
    },
    updateAdminChecker: (boolean) => {
      setAdminChecker(boolean)
    },
    updateMypageInfo: (boolean) => {
      setMypageInfo(boolean)
    },
    updateFanboardReply: (boolean) => {
      setFanboardReply(boolean)
    },
    updateFanboardReplyNum: (boolean) => {
      setFanboardReplyNum(boolean)
    },
    updateClipSort: (boolean) => {
      setClipMainSort(boolean)
    },
    updateClipDate: (string) => {
      setClipMainDate(string)
    },
    updatClipRefresh: (boolean) => {
      setClipRefresh(boolean)
    },
    updateClipTab: (number) => {
      setClipTab(number)
    },
    updateClipType: (array) => {
      setClipType(array)
    },
    updateUrlStr: (str) => {
      setUrlStr(str)
    },
    updateBoardIdx: (num) => {
      setBoardIdx(num)
    },
    updateBoardModifyInfo: (obj) => {
      setBoardModifyInfo(obj)
    },
    /**
     * 클립 상태
     * @string  entered, floating
     */
    updateClipState: (boolean) => {
      setClipState(boolean)
    },
    /**
     * 클립플레이어 상태 (클립 상태가 floating 일 경우)
     * @string playing, paused, ended
     */
    updateClipPlayerState: (string) => {
      setClipPlayerState(string)
    },
    /**
     * 클립플레이어 정보 (플레이어에 들어갈 data)
     * @obj bgImg, nickName, title
     */
    updateClipPlayerInfo: (obj) => {
      setClipPlayerInfo(obj)
    },
    updateIsDevIp: (boolean) => {
      setIsDevIp(boolean)
    },
    updateSetBack: (boolean) => {
      setBackState(boolean)
    },
    updateBackFunction: (obj) => {
      setBackFunction(obj)
    },
    updateRoomType: (string) => {
      setRoomType(string)
    },
    updateSelfAuth: (boolean) => {
      setSelfAuth(boolean)
    },
    updateSplash: (obj) => {
      setSplash(obj)
    },
    //malibox
    updateIsMailboxNew: (boolean) => {
      setIsMailboxNew(boolean)
    },
    updateUseMailbox: (boolean) => {
      setUseMailbox(boolean)
    },
    updateIsMailboxOn: (boolean) => {
      setIsMailboxOn(boolean)
    },
    updateDateState: (string) => {
      setDateState(string)
    },
    updateMultiViewer: (obj) => {
      if (obj.show) {
        setBackState(true)
        setBackFunction({name: 'multiViewer'})
      } else {
        setBackState(null)
      }

      setMultiviewer(obj)
    },
    updateBestDjState: (obj) => {
      setBestDjData(obj);
    },
    updateAuthRef: (obj) => {
      setAuthRef(obj);
    },
    updateNoServiceInfo: (obj) => {
      setNoServiceInfo(obj);
    },
    updateAppInfo: (obj) => {
      setAppInfo(obj);
    },
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
    userReport,
    mypageFanCnt,
    close,
    closeFanCnt,
    closeStarCnt,
    closeGoodCnt,
    closePresent,
    closeRank,
    closeFanRank,
    boardNumber,
    noticeIndexNum,
    bannerCheck,
    fanBoardBigIdx,
    toggleState,
    replyIdx,
    noticeState,
    reportDate,
    tempImage,
    editImage,
    walletIdx,
    nativeTid,
    fanTab,
    fanEdite,
    fanEditeLength,
    selectFanTab,
    editeToggle,
    ctxDeleteList,
    attendStamp,
    adminChecker,
    mypageInfo,
    fanboardReply,
    fanboardReplyNum,
    clipMainSort,
    clipMainDate,
    clipRefresh,
    clipTab,
    clipType,
    urlStr,
    clipState,
    clipPlayerState,
    clipPlayerInfo,
    // isDevIp,
    boardIdx,
    boardModifyInfo,
    backState,
    backFunction,
    roomType,
    selfAuth,
    closeSpeical,
    splash,
    isMailboxNew,
    useMailbox,
    dateState,
    multiViewer,
    isMailboxOn,
    bestDjData,
    authRef,
    noServiceInfo,
    appInfo,
  }
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GlobalProvider}
