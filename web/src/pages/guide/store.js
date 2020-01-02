/**
 * @file store.js
 * @brief 가이드에서만 사용되는 context API
 * @author 손완휘
 * @code 
  import React, {useContext, useState} from 'react'
  import {Context} from './store'
  const store = useContext(Context)
 */
import React, {useState, createContext} from 'react'
//Context
const Context = createContext()
const {Provider} = Context
//
const GuideProvider = props => {
  //state
  const [state, setState] = useState({title: 'GUIDE'})
  const [menuCode, setMenuCode] = useState('')
  //---------------------------------------------------------------------
  const action = {
    /**
     * @brief 메뉴변경이 사용될 코드상태값을 업데이트
     * @code store.updateCode('style-tab')
     * @param string $str 코드값
     * @return void
     */
    updateCode: (str = 'default') => {
      setMenuCode(str)
    },
    //updateState
    updateState: obj => {
      setState(state => ({...state, ...obj}))
    }
  }
  //---------------------------------------------------------------------
  const value = {state, menuCode, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GuideProvider}
