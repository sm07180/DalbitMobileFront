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
const BroadCastContext = createContext()
const {Provider} = BroadCastContext
//
const BroadCastProvider = props => {
  //state
  const [state, setState] = useState({code: 'test1111'})
  const [menuCode, setMenuCode] = useState('')
  //---------------------------------------------------------------------
  const action = {
    /**
     * @brief 메뉴변경이 사용될 코드상태값을 업데이트
     * @code store.updateCode('style-tab')
     * @param string $str
     * @return void
     */
    updateCode: (str = 'default') => {
      setMenuCode(str)
    },
    /**
     * @brief Constructor
     * @param object $obj
     * @return void
     */
    //updateState
    updateState: obj => {
      setState(state => ({...state, ...obj}))
    }
  }
  //---------------------------------------------------------------------
  const value = {state, menuCode, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {BroadCastContext, BroadCastProvider}
