/**
 * @file store.js
 * @brief 고객센터 context API
 * @author 손완휘
 * @code 
  import React, {useContext, useState} from 'react'
  import {Context} from './store'
  const store = useContext(Context)
 */
import React, {useState, createContext} from 'react'
//Context
const CustomerStore = createContext()
const {Provider} = CustomerStore
//
const CustomerProvider = props => {
  //state
  const [menuCode, setMenuCode] = useState('notice')
  const [list, setList] = useState([])
  const [noticePage, setNoticePage] = useState('')
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
    updateList: list => {
      setList({...list})
    },

    updatenoticePage: str => {
      setNoticePage(str)
    }
  }
  //---------------------------------------------------------------------
  const value = {menuCode, action, list, noticePage}
  return <Provider value={value}>{props.children}</Provider>
}
export {CustomerStore, CustomerProvider}
