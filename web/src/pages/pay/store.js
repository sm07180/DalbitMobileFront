/**
 * @file store.js
 * @brief 모바일전용 라이브 사용되는 context API
 * @author 손완휘
 * @code 
  import React, {useContext, useState} from 'react'
  import {Context} from './store'
  const store = useContext(Context)
 */
import React, {useState, createContext} from 'react'
//Context
const PayStore = createContext()
const {Provider} = PayStore
//
const PayProvider = props => {
  //state
  const [state, setState] = useState(0)

  //---------------------------------------------------------------------
  const action = {
    /**
     * @brief roomType타입변경
     */
    updateState: obj => {
      setState(obj)
    }
  }
  //---------------------------------------------------------------------
  const value = {state, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {PayStore, PayProvider}
