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
const LiveStore = createContext()
const {Provider} = LiveStore
//
const LiveProvider = props => {
  //state
  const [broadList, setBroadList] = useState(null) // 방송방리스트
  const [type, setType] = useState('') // roomType
  const [searchType, setSearchType] = useState('0') // searchType
  const [currentPage, setCurrentPage] = useState(1) //현재페이지
  const [totalPageNumber, setTotalPageNumber] = useState(null)

  const [menuCode, setMenuCode] = useState('')
  const [list, setList] = useState([])
  //---------------------------------------------------------------------
  const action = {
    /**
     * @brief roomType타입변경
     */
    updateBroadList: obj => {
      setBroadList(obj)
    },
    /**
     * @brief roomType타입변경
     */
    updateSetType: (str = '') => {
      setType(str)
    },
    /**
     * @brief searchType
     */
    updateSearchType: (str = '0') => {
      setSearchType(str)
    },
    /**
     * @brief 현재페이지
     */
    updateCurrentPage: (num = 1) => {
      setCurrentPage(num)
    }
  }
  //---------------------------------------------------------------------
  const value = {broadList, type, searchType, currentPage, totalPageNumber, menuCode, action, list}
  return <Provider value={value}>{props.children}</Provider>
}
export {LiveStore, LiveProvider}
