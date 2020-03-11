/**
 * @file store.js
 * @brief 방송하기에서만 사용하는 store.js
 * @author 손완휘
 * @code 
  import React, {useContext, useState} from 'react'
  import {BroadCastContext} from './store'
  const store = useContext(Context)
 */
import React, {useState, createContext} from 'react'
import Api from 'context/api'
//Context
const BroadCastStore = createContext()
const {Provider} = BroadCastStore
//
const BroadCastProvider = props => {
  //state

  const [auth, setAuth] = useState()
  const [roomNumber, setRoomNumber] = useState('')
  const [roomInfo, setRoomInfo] = useState(null)
  const [listenerList, setListenerList] = useState([])
  const [managerList, setManagerList] = useState([])
  const [guestList, setGuestList] = useState([])
  const [listenTrues, setListenTrues] = useState(false)
  const [shortCutList, setShortCutList] = useState([])
  const [boostList, setBoostList] = useState([])
  const [timer, setTimer] = useState()
  const [storyList, setStoryList] = useState([])
  const [story, setStory] = useState([])
  const [tabIdx, setTabIdx] = useState(0)
  const [like, setLike] = useState(1) // 채팅방 하단 좋아요 버튼 단계 1~4
  const [sumlike, setSumLike] = useState(0) // 채팅방 좋아요 누적수
  const [ListenerSelect, setListenerSelect] = useState({}) // 청취자 탭에서 선택한 유저 정보
  const [mikeState, setMikeState] = useState(true) // 마이크상태. 기본 값 켜있음 true

  const arr = [
    {id: 0, tab: '청취자'},
    {id: 1, tab: '게스트'},
    {id: 2, tab: '라이브'},
    // {id: 3, tab: '충전'},
    // {id: 4, tab: '선물'}
    // {id: 5, tab: '부스트'}
    // {id: 6, tab: '프로필'},
    // {id: 7, tab: '신고하기'},
    // {id: 8, tab: '공지사항'},
    // {id: 9, tab: '사연'},
    {id: 10, tab: '방송수정'}
    // {id: 11, tab: '빠른 말'},
    // {id: 12, tab: '받은 선물'}
  ]
  let defaultArr = [
    {id: 0, tab: '청취자'},
    {id: 1, tab: '게스트'},
    {id: 2, tab: '라이브'}
  ]
  // const [tabContent, setTabContent] = useState(arr)
  const [currentTab, setCurrentTab] = useState(arr)
  const [flag, setFlag] = useState(false)

  //---------------------------------------------------------

  //---------------------------------------------------------

  //---------------------------------------------------------------------
  async function selectBoostList(param) {
    const res = await Api.broadcast_room_live_ranking_select({
      params: {
        roomNo: param
      }
    })
    console.log('## store - boostInfo :', res)
    if (res.result === 'success') setBoostList(res.data)
  }

  //---------------------------------------------------------------------
  const action = {
    /**
     * @brief 방에대한정보들 ex)방제목,방장이름
     * @code store.updateCode('style-tab')
     * @param object $obj
     */
    //updateState
    updateRoomInfo: obj => {
      if (typeof obj === 'object') setRoomInfo(obj)
      if (typeof obj === 'object') {
        //    console.log('obj', obj)
      }
    },
    updateListenerSelect: obj => {
      if (typeof obj === 'object') setListenerSelect(obj)
    },
    //roomNumber
    updateRoomNumber: num => {
      setRoomNumber(num)
    },
    updateListenerList: list => {
      setListenerList(list)
    },

    updateManagerList: list => {
      setManagerList(list)
    },
    updateGuestList: list => {
      setGuestList(list)
    },

    updateShortCutList: list => {
      setShortCutList(list)
    },
    updateBoostList: list => {
      setBoostList(list)
    },
    updateTimer: props => {
      setTimer(props)
    },
    initBoost: obj => {
      selectBoostList(obj)
    },
    updateStoryList: list => {
      setStoryList(list)
    },
    updateStory: data => {
      setStory(data)
    },
    updateTab: num => {
      setFlag(!flag)
      setTabIdx(num)
      if (tabIdx === num) return
      if (num === 3) setCurrentTab(defaultArr.concat({id: num, tab: '충전'}))
      if (num === 4) setCurrentTab(defaultArr.concat({id: num, tab: '선물'}))
      if (num === 5) setCurrentTab(defaultArr.concat({id: num, tab: '부스트'}))
      if (num === 6) setCurrentTab(defaultArr.concat({id: num, tab: '프로필'}))
      if (num === 7) setCurrentTab(defaultArr.concat({id: num, tab: '신고하기'}))
      if (num === 8) setCurrentTab(defaultArr.concat({id: num, tab: '공지사항'}))
      if (num === 9) setCurrentTab(defaultArr.concat({id: num, tab: '사연'}))
      if (num === 10) setCurrentTab(defaultArr.concat({id: num, tab: '방송수정'}))
      if (num === 11) setCurrentTab(defaultArr.concat({id: num, tab: '빠른 말'}))
      if (num === 12) setCurrentTab(defaultArr.concat({id: num, tab: '받은 선물'}))
    },
    updateLike: num => {
      setLike(num)
    },
    updateListenTrues: bool => {
      setListenTrues(bool)
    },
    updateLikeSum: num => {
      num = context.roomInfo.like + num
      console.log('updateLikeSum = ' + num)
      setSumLike(num)
    },
    //TEST
    updateAuth: num => {
      setAuth(num)
    },
    updateMikeState: bool => {
      setMikeState(bool)
    }
  }
  //---------------------------------------------------------------------
  const value = {
    auth,
    roomInfo,
    roomNumber,
    listenerList,
    managerList,
    guestList,
    shortCutList,
    boostList,
    timer,
    storyList,
    story,
    tabIdx,
    action,
    like,
    currentTab,
    flag,
    ListenerSelect,
    sumlike,
    mikeState
  }

  return <Provider value={value}>{props.children}</Provider>
}
export {BroadCastStore, BroadCastProvider}
