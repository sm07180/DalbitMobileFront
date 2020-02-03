/*
import React, {useContext, useState} from 'react'
import {Context} from 'context'

const store = useContext(Context)

 */
import React, {useEffect, useState, createContext} from 'react'

//Context
const Context = createContext()
const {Provider} = Context

//
const GlobalProvider = props => {
  //initalize

  //state
  //---------------------------------------------------------------------
  const [state, setState] = useState({title: '현재 이용현황', isSub: false})
  const [popup_code, setPopup] = useState('')
  const [popup_visible, setVisible] = useState(false)
  const [gnb_visible, setGnbVisible] = useState(false)
  const [gnb_state, setGnbState] = useState('')
  const [login_state, setlogin] = useState(false)
  const [micStream, setMicStream] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [audioSocket, setAudioSocket] = useState(null)
  const [rtcPeerConn, setRtcPeerConn] = useState(null)
  const [rtcIceCandidate] = useState([])

  //---------------------------------------------------------------------
  const action = {
    //updateState
    updateState: obj => {
      setState(state => ({...state, ...obj}))
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
    updateGnbState: str => {
      setGnbState(str)
      setGnbVisible(!gnb_visible)
    },
    //login 상태
    updateLogin: bool => {
      setlogin(bool)
      setGnbVisible(false)
    },
    // 마이크 오디오 스트림
    updateMicStream: stream => {
      setMicStream(stream)
    },
    updateAudioStream: stream => {
      setAudioStream(stream)
    },
    // 오디오 웹소캣
    updateAudioSocket: ws => {
      setAudioSocket(ws)
    },
    // webRtc 커넥션
    updateRtcPeerConn: conn => {
      setRtcPeerConn(conn)
    }
  }
  //---------------------------------------------------------------------
  const value = {
    state,
    login_state,
    popup_code,
    popup_visible,
    gnb_visible,
    gnb_state,
    micStream,
    audioStream,
    audioSocket,
    rtcPeerConn,
    rtcIceCandidate,

    action
  }
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GlobalProvider}
