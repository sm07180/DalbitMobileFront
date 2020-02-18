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
//Context
const BroadCastStore = createContext()
const {Provider} = BroadCastStore
//
const BroadCastProvider = props => {
  //state
  const [roomNumber, setRoomNumber] = useState('')
  const [roomInfo, setRoomInfo] = useState({})
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
    }
  }
  //---------------------------------------------------------------------
  const value = {roomInfo, roomNumber, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {BroadCastStore, BroadCastProvider}
