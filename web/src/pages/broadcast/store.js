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

    action
  }
  return <Provider value={value}>{props.children}</Provider>
}
export {BroadCastStore, BroadCastProvider}
