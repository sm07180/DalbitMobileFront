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
      setRoomInfo(obj)
    }
  }
  //---------------------------------------------------------------------
  const value = {roomInfo, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {BroadCastStore, BroadCastProvider}
