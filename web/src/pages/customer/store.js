/**
 * @file 모바일/고객센터/store.js
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
  const [search, setSearch] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [searching, setSearching] = useState(false);
  //---------------------------------------------------------------------
  const action = {
    updateSearch: (str) => {
      setSearch(str);
    },

    updateCurrentSearch: (str) => {
      setCurrentSearch(str);
    },

    updateSearching: (bool) => {
      setSearching(bool);
    }
  }
  //---------------------------------------------------------------------
  const value = {search, searching, currentSearch, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {CustomerStore, CustomerProvider}
