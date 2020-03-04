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
  const [roomNumber, setRoomNumber] = useState('')
  const [roomInfo, setRoomInfo] = useState({})
  const [listenerList, setListenerList] = useState([])
  const [managerList, setManagerList] = useState([])
  const [guestList, setGuestList] = useState([])

  const [shortCutList, setShortCutList] = useState([])
  const [boostList, setBoostList] = useState([])
  const [timer, setTimer] = useState()
  const [storyList, setStoryList] = useState([])
  const [story, setStory] = useState([])
  const [tabIdx, setTabIdx] = useState(0)
  const arr = [
    {id: 0, tab: '청취자'},
    {id: 1, tab: '게스트'},
    {id: 2, tab: '라이브'}
    // {id: 3, tab: '충전'},
    // {id: 4, tab: '선물'}
    // {id: 5, tab: '부스트'},
    // {id: 6, tab: '프로필'},
    // {id: 7, tab: '신고하기'},
    // {id: 8, tab: '공지사항'},
    // {id: 9, tab: '사연'},
    // {id: 10, tab: '방송수정'},
    // {id: 11, tab: '빠른 말'},
    // {id: 12, tab: '받은 선물'},
  ]
  const [tabContent, setTabContent] = useState(arr)

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
      setTabIdx(num)
      if (tabIdx === num) return
      if (num === 0) setTabContent([...tabContent, {id: num, tab: '청취자'}])
      if (num === 1) setTabContent([...tabContent, {id: num, tab: '게스트'}])
      if (num === 2) setTabContent([...tabContent, {id: num, tab: '라이브'}])
      if (num === 3) setTabContent([...tabContent, {id: num, tab: '충전'}])
      if (num === 4) setTabContent([...tabContent, {id: num, tab: '선물'}])
      if (num === 5) setTabContent([...tabContent, {id: num, tab: '부스트'}])
      if (num === 6) setTabContent([...tabContent, {id: num, tab: '프로필'}])
      if (num === 7) setTabContent([...tabContent, {id: num, tab: '신고하기'}])
      if (num === 8) setTabContent([...tabContent, {id: num, tab: '공지사항'}])
      if (num === 9) setTabContent([...tabContent, {id: num, tab: '사연'}])
      if (num === 10) setTabContent([...tabContent, {id: num, tab: '방송수정'}])
      if (num === 11) setTabContent([...tabContent, {id: num, tab: '빠른 말'}])
      if (num === 12) setTabContent([...tabContent, {id: num, tab: '받은 선물'}])
    }
  }
  //---------------------------------------------------------------------
  const value = {
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
    tabContent
  }
  return <Provider value={value}>{props.children}</Provider>
}
export {BroadCastStore, BroadCastProvider}
