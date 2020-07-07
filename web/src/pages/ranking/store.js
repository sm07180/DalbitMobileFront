/**
 * @file store.js
 * @brief 랭킹 사용되는 context API
 * @author 손완휘
 * @code 
  import React, {useContext, useState} from 'react'
  import {Context} from './store'
  const store = useContext(Context)
 */
import React, {useState, createContext} from 'react'
//Context
const RankingStore = createContext()
const {Provider} = RankingStore
//
const RankingProvider = props => {
  //state
  const [menuCode, setMenuCode] = useState('')
  const [list, setList] = useState([])
  //store
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
      setList(list)
    }
  }
  //---------------------------------------------------------------------
  const value = {menuCode, action, list}
  return <Provider value={value}>{props.children}</Provider>
}
export {RankingStore, RankingProvider}
