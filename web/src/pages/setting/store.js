/**
 * @file store.js
 * @brief 설정 context API
 * @code 
  import React, {useContext, useState} from 'react'
  import {Context} from './store'
  const store = useContext(Context)
 */
import React, {useState, createContext} from 'react'
//Context
const SettingStore = createContext()
const {Provider} = SettingStore
//
const SettingProvider = props => {
  const [list, setList] = useState([])
  const action = {
    updateList: list => {
      setList({...list})
    }
  }
  //---------------------------------------------------------------------
  const value = {action, list}
  return <Provider value={value}>{props.children}</Provider>
}
export {SettingStore, SettingProvider}
